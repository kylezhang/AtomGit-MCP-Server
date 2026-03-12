
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_URL_FILE = path.join(__dirname, '../docs/apis_url.json');

interface ApiUrlInfo {
  name: string;
  httpMethod: string;
  endpointPath: string;
  documentationUrl: string;
}

interface ApiUrlData {
  categories: {
    name: string;
    endpoints: ApiUrlInfo[];
  }[];
}

function loadApiData(): ApiUrlData | null {
  if (!fs.existsSync(DOCS_URL_FILE)) return null;
  return JSON.parse(fs.readFileSync(DOCS_URL_FILE, 'utf-8'));
}

function findApi(query: string, data: ApiUrlData): { api: ApiUrlInfo, category: string } | null {
  const q = query.toLowerCase();
  for (const cat of data.categories) {
    for (const endpoint of cat.endpoints) {
      if (endpoint.documentationUrl.includes(q) || 
          endpoint.endpointPath.toLowerCase().includes(q) ||
          endpoint.name.toLowerCase().includes(q)) {
        return { api: endpoint, category: cat.name };
      }
    }
  }
  return null;
}

function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

function generateToolName(method: string, pathStr: string): string {
    // e.g. GET /repos/{owner}/{repo} -> get_repository
    // e.g. POST /repos/{owner}/{repo}/issues -> create_repository_issue
    
    let action = 'get';
    if (method === 'POST') action = 'create';
    if (method === 'PUT') action = 'update';
    if (method === 'DELETE') action = 'delete';
    if (method === 'PATCH') action = 'update';
    
    // Remove /api/v5
    let clean = pathStr.replace('/api/v5/', '').replace('/api/v1/', '');
    
    // Replace vars {owner} with nothing or specific words?
    // Usually we want the resource names.
    // repos/{owner}/{repo}/issues -> repository_issues
    
    clean = clean.replace(/\{[^}]+\}/g, ''); // Remove vars
    clean = clean.replace(/:[a-zA-Z0-9_]+/g, ''); // Remove :vars
    clean = clean.replace(/\/+/g, '/'); // Fix multiple slashes
    clean = clean.replace(/^\//, '').replace(/\/$/, '');
    
    const parts = clean.split('/').filter(p => p); // Filter empty parts
    // Map common resources to singular/plural
    const mapped = parts.map(p => {
        if (p === 'repos') return 'repository';
        if (p === 'orgs') return 'organization';
        if (p === 'users') return 'user';
        if (p === 'enterprises') return 'enterprise';
        return p;
    });
    
    return `${action}_${mapped.join('_')}`;
}

function generateCode(api: ApiUrlInfo, category: string) {
  const toolName = generateToolName(api.httpMethod, api.endpointPath);
  // Ensure camelCase doesn't have double underscores or weird chars
  const serviceMethodName = toolName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  
  // Extract params from path
  // Supports :param and {param}
  const pathParams = (api.endpointPath.match(/(:[a-zA-Z0-9_]+|\{[^}]+\})/g) || [])
      .map(p => p.replace(/^:/, '').replace(/[{}]/g, ''));
  
  const properties: Record<string, any> = {};
  pathParams.forEach(p => {
      properties[p] = { type: 'string', description: `Path parameter: ${p}` };
  });
  
  const required = [...pathParams];
  
  if (api.httpMethod !== 'GET') {
      // Add a generic body param suggestion
      // properties['body'] = { type: 'object' };
  }

  console.log(`\n✅ Match Found: [${api.httpMethod}] ${api.endpointPath}`);
  console.log(`📂 Category: ${category}`);
  console.log(`🛠️  Suggested Tool Name: ${toolName}`);
  console.log(`---------------------------------------------------`);

  const serviceFile = path.join(__dirname, `../src/services/${category}Service.ts`);
  const toolFile = path.join(__dirname, `../src/tools/${category}Tools.ts`);

  if (!fs.existsSync(serviceFile) || !fs.existsSync(toolFile)) {
      console.error('Error: Service or Tool file not found. Cannot auto-inject.');
      return;
  }

  // Inject into Service
  let serviceContent = fs.readFileSync(serviceFile, 'utf-8');
  if (!serviceContent.includes(serviceMethodName)) {
      const serviceCode = `
  async ${serviceMethodName}(${pathParams.map(p => `${p}: string`).join(', ')}${api.httpMethod !== 'GET' ? ', data?: any' : ''}): Promise<any> {
    const url = \`${api.endpointPath.replace(/:([a-zA-Z0-9_]+)/g, '${$1}').replace(/\{([^}]+)\}/g, '${$1}')}\`;
    const response = await this.client.${api.httpMethod.toLowerCase()}(url${api.httpMethod !== 'GET' ? ', data' : ''});
    return response.data;
  }`;
      const lastBraceIndex = serviceContent.lastIndexOf('}');
      serviceContent = serviceContent.substring(0, lastBraceIndex) + serviceCode + '\n}';
      fs.writeFileSync(serviceFile, serviceContent, 'utf-8');
      console.log(`Updated ${category}Service.ts`);
  } else {
      console.log(`Service method ${serviceMethodName} already exists.`);
  }

  // Inject into Tool (getTools)
  let toolContent = fs.readFileSync(toolFile, 'utf-8');
  const toolDef = {
      name: toolName,
      description: api.name,
      inputSchema: {
          type: "object",
          properties: properties,
          required: required
      }
  };
  
  if (!toolContent.includes(`name: '${toolName}'`)) {
      // Insert into getTools array
      // Look for "return [" and insert after
      const returnIndex = toolContent.indexOf('return [');
      if (returnIndex !== -1) {
          const insertPos = returnIndex + 8;
          const toolStr = JSON.stringify(toolDef, null, 2) + ',';
          toolContent = toolContent.slice(0, insertPos) + '\n' + toolStr + toolContent.slice(insertPos);
      }
      
      // Insert into callTool switch
      // Look for "default:"
      const defaultIndex = toolContent.indexOf('default:');
      if (defaultIndex !== -1) {
          let callArgs = pathParams.map(p => `args.${p}`).join(', ');
          if (api.httpMethod !== 'GET') {
              if (callArgs) callArgs += ', args'; // Assuming args contains body params spread? Or passed as object?
              // The service method expects (params..., data). 
              // Usually args contains everything. We might need to separate body params.
              // For simplicity, let's pass args as data if it's POST/PUT
              else callArgs = 'args'; 
          }
          
          const caseCode = `
      case '${toolName}':
        return await this.${toCamelCase(category)}Service.${serviceMethodName}(${callArgs});
`;
          toolContent = toolContent.slice(0, defaultIndex) + caseCode + toolContent.slice(defaultIndex);
      }
      
      fs.writeFileSync(toolFile, toolContent, 'utf-8');
      console.log(`Updated ${category}Tools.ts`);
  } else {
      console.log(`Tool ${toolName} already exists.`);
  }
}

const query = process.argv[2];
if (!query) {
  console.error('Please provide a search query (URL or keyword).');
  console.error('Example: npm run api:scaffold -- issues');
  process.exit(1);
}

const data = loadApiData();
if (!data) {
  console.error('Could not load apis_url.json');
  process.exit(1);
}

const result = findApi(query, data);
if (result) {
  generateCode(result.api, result.category);
} else {
  console.error('No matching API found.');
}
