
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_DIR = path.join(__dirname, '../src/tools');
const SERVICES_DIR = path.join(__dirname, '../src/services');
const DOCS_URL_FILE = path.join(__dirname, '../docs/apis_url.json');

// Types (Mirrored from generate_map.ts)
interface ToolInfo {
  name: string;
  description: string;
  serviceMethod: string;
  apiEndpoint?: string;
  httpMethod?: string;
  documentationUrl?: string;
}

interface ApiUrlInfo {
  name: string;
  httpMethod: string;
  endpointPath: string;
  documentationUrl: string;
}

interface ApiUrlData {
  totalEndpoints: number;
  categories: {
    name: string;
    endpointCount: number;
    endpoints: ApiUrlInfo[];
  }[];
}

const KNOWN_VARS = new Set([
  'owner', 'repo', 'number', 'sha', 'path', 'name', 'id', 'username', 'org', 'enterprise', 
  'tag', 'keyId', 'milestoneId', 'discussionId', 'ref', 'base', 'head', 'file', 'label', 
  'wildcard', 'uuid', 'access_token', 'your_token', 'file_name', 'comment_id', 
  'pull_number', 'issue_number', 'branch', 'enterpriseId', 'milestone_id', 'usernames', 
  'originalName', 'fileName', 'check_run_id', 'target_id', 'commit_id', 'blob_id', 
  'client_id', 'client_secret', 'code', 'refresh_token', 'fingerprint', 'repo_type', 'iid',
  'pullNumber', 'issueNumber', 'commentId', 'checkRunId', 'targetId', 'commitId', 'blobId'
]);

// Copy of MANUAL_OVERRIDES from generate_map.ts
const MANUAL_OVERRIDES: Record<string, string> = {
  'get_repository_pull_approval_reviewer_options': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-pulls-number-option-approval-reviewers',
  'get_repository_pull_tester_options': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-pulls-number-option-approval-testers',
  'assign_repository_pull_approval_reviewers': 'https://docs.gitcode.com/docs/apis/post-api-v-5-repos-owner-repo-pulls-number-approval-reviewers',
  'assign_repository_pull_assignees': 'https://docs.gitcode.com/docs/apis/post-api-v-5-repos-owner-repo-pulls-number-assignees',
  'assign_repository_pull_testers': 'https://docs.gitcode.com/docs/apis/post-api-v-5-repos-owner-repo-pulls-number-testers',
  'remove_repository_pull_approval_reviewers': 'https://docs.gitcode.com/docs/apis/delete-api-v-5-repos-owner-repo-pulls-number-approval-reviewers',
  'remove_repository_pull_assignees': 'https://docs.gitcode.com/docs/apis/delete-api-v-5-repos-owner-repo-pulls-number-assignees',
  'remove_repository_pull_testers': 'https://docs.gitcode.com/docs/apis/delete-api-v-5-repos-owner-repo-pulls-number-testers',
  'link_repository_pull_issues': 'https://docs.gitcode.com/docs/apis/post-api-v-5-repos-owner-repo-pulls-number-linked-issues',
  'reply_pull_request_discussion': 'https://docs.gitcode.com/docs/apis/post-api-v-5-repos-owner-repo-pulls-number-discussions-discussions-id-comments',
  'reset_repository_pull_assignees': 'https://docs.gitcode.com/docs/apis/patch-api-v-5-repos-owner-repo-pulls-number-assignees',
  'reset_repository_pull_testers': 'https://docs.gitcode.com/docs/apis/patch-api-v-5-repos-owner-repo-pulls-number-testers',
  'get_repository_pull_file_content': 'https://docs.gitcode.com/docs/apis/get-owner-repo-raw-head-sha-name',
  'get_repository_tree': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-git-trees-sha',
  'get_organization_pull_requests': 'https://docs.gitcode.com/docs/apis/get-api-v-5-org-org-pull-requests',
  'get_repository_issue_operate_logs': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-issues-number-operate-logs',
  'get_repository_issue_comment_modify_history': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-issues-comment-comment-id-modify-history',
  'get_repository_issue_comment_reactions': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-issues-comment-comment-id-user-reactions',
  'get_enterprise_issue_labels': 'https://docs.gitcode.com/docs/apis/get-api-v-5-enterprises-enterprise-issues-issue-id-labels',
  'get_pull_request_comment_modify_history': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-pulls-comment-comment-id-modify-history',
  'get_pull_request_comment_reactions': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-pulls-comment-comment-id-user-reactions',
  'compare_repository_commits': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-compare-base-head',
  'create_repository_issue': 'https://docs.gitcode.com/docs/apis/post-api-v-5-repos-owner-issues'
};

interface ApiUrlMapValue {
  url: string;
  name: string;
  originalEndpoint: ApiUrlInfo; // Added to track which endpoint this maps to
}

// Map: normalized path key -> documentation URL info
function loadApiUrls(): { map: Map<string, ApiUrlMapValue>, allEndpoints: ApiUrlInfo[] } {
  const urlMap = new Map<string, ApiUrlMapValue>();
  const allEndpoints: ApiUrlInfo[] = [];

  if (!fs.existsSync(DOCS_URL_FILE)) {
    console.warn(`Warning: ${DOCS_URL_FILE} not found.`);
    return { map: urlMap, allEndpoints };
  }

  try {
    const data: ApiUrlData = JSON.parse(fs.readFileSync(DOCS_URL_FILE, 'utf-8'));
    for (const category of data.categories) {
      for (const endpoint of category.endpoints) {
        allEndpoints.push(endpoint);
        const val = { url: endpoint.documentationUrl, name: endpoint.name, originalEndpoint: endpoint };
        
        urlMap.set(`NAME:${endpoint.name}`, val);

        const urlParts = endpoint.documentationUrl.split('/');
        let urlSlug = urlParts[urlParts.length - 1];
        
        const methodPrefix = endpoint.httpMethod.toLowerCase() + '-';
        if (urlSlug.startsWith(methodPrefix)) {
            urlSlug = urlSlug.substring(methodPrefix.length);
        }
        
        let normalizedSlug = '/' + urlSlug;
        normalizedSlug = normalizedSlug.replace('/api-v-5-', '/api/v5-');
        normalizedSlug = normalizedSlug.replace('/api-v-1-', '/api/v1-');
        normalizedSlug = normalizedSlug.replace('/api-v-8-', '/api/v8-');
        normalizedSlug = normalizedSlug.replace('/api-v5-', '/api/v5-');
        normalizedSlug = normalizedSlug.replace('/api-v1-', '/api/v1-');
        normalizedSlug = normalizedSlug.replace('/api-v8-', '/api/v8-');

        const slugKey = `SLUG:${endpoint.httpMethod.toUpperCase()}:${normalizedSlug}`;
        urlMap.set(slugKey, val);
        
        const pattern = generatePatternFromSlug(endpoint.endpointPath);
        const patternKey = `PATTERN:${endpoint.httpMethod.toUpperCase()}:${pattern}`;
        if (!urlMap.has(patternKey)) {
             urlMap.set(patternKey, val);
        }
      }
    }
  } catch (e) {
    console.error('Error parsing apis_url.json:', e);
  }
  return { map: urlMap, allEndpoints };
}

function generatePatternFromPath(pathStr: string): string {
    // 1. Remove leading slash
    let clean = pathStr.startsWith('/') ? pathStr.substring(1) : pathStr;
    
    // 2. Split by slash
    const parts = clean.split('/').filter(p => p);
    
    const patternParts = parts.map(p => {
        // Variable handling
        // Code style: ${var}
        // API style: :var or {var}
        if ((p.startsWith('${') && p.endsWith('}')) || 
            p.startsWith(':') || 
            p.startsWith('{') ||
            KNOWN_VARS.has(p)) {
            return '*';
        }
        
        // Normalization
        let seg = p.replace(/_/g, '-');
        
        // Singularization / Mapping
        if (seg === 'orgs') seg = 'org';
        if (seg === 'repos') seg = 'repo'; // API docs often use repos, code uses repos too but let's standardize
        if (seg === 'users') seg = 'user';
        if (seg === 'enterprises') seg = 'enterprise';
        
        // Handle API versions to match slug style if needed
        // But for pattern matching, we just need consistency between Code and API.
        // Let's keep them as is, just standardized.
        
        return seg;
    });
    
    return patternParts.join('-');
}

// Replaces both generatePatternFromSlug and generatePatternFromCodePath
// to ensure consistency
const generatePatternFromSlug = generatePatternFromPath;
const generatePatternFromCodePath = generatePatternFromPath;

function normalizeCodePathToSlug(pathStr: string): string {
  let normalized = pathStr.replace(/\$\{([^}]+)\}/g, '$1');
  normalized = normalized.replace(/([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/g, '$2');
  
  const parts = normalized.split('/').filter(p => p);
  
  if (parts.length > 1 && parts[0] === 'api') {
     const normalizedParts = parts.map(p => {
         if (p === 'users') return 'user';
         return p;
     });

     const dashed = normalizedParts.join('-');
     let slug = '/' + dashed;
     slug = slug.replace('/api-v5-', '/api/v5-');
     slug = slug.replace('/api-v1-', '/api/v1-');
     slug = slug.replace('/api-v8-', '/api/v8-');
     return slug;
  }
  return normalized;
}

function extractTools(toolContent: string): Map<string, { description: string, serviceMethod: string }> {
  const tools = new Map<string, { description: string, serviceMethod: string }>();
  const toolDefRegex = /name:\s*'([^']+)',\s*[\r\n\s]*description:\s*'([^']+)'/g;
  let match;
  const toolDefs = new Map<string, string>();
  while ((match = toolDefRegex.exec(toolContent)) !== null) {
    toolDefs.set(match[1], match[2]);
  }

  for (const [toolName, description] of toolDefs) {
    const caseIndex = toolContent.indexOf(`case '${toolName}':`);
    if (caseIndex !== -1) {
      const restOfContent = toolContent.substring(caseIndex);
      const methodMatch = /this\.[a-zA-Z0-9_]+\.([a-zA-Z0-9_]+)\(/.exec(restOfContent);
      
      const nextCaseIndex = restOfContent.indexOf('case ', 5);
      const defaultIndex = restOfContent.indexOf('default:');
      
      let boundary = restOfContent.length;
      if (nextCaseIndex !== -1) boundary = Math.min(boundary, nextCaseIndex);
      if (defaultIndex !== -1) boundary = Math.min(boundary, defaultIndex);
      
      if (methodMatch && methodMatch.index < boundary) {
        tools.set(toolName, { description, serviceMethod: methodMatch[1] });
      } else {
        tools.set(toolName, { description, serviceMethod: 'Unknown' });
      }
    } else {
         tools.set(toolName, { description, serviceMethod: 'Unknown' });
    }
  }
  return tools;
}

function extractServiceEndpoints(serviceContent: string): Map<string, { endpoint: string, method: string }> {
  const endpoints = new Map<string, { endpoint: string, method: string }>();
  const methods = serviceContent.split(/async\s+([a-zA-Z0-9_]+)\s*\(/);
  
  for (let i = 1; i < methods.length; i += 2) {
    const methodName = methods[i];
    const methodBody = methods[i+1];
    
    // Strategy 1: Direct client call match
    const clientRegex = /this\.client\.([a-z]+)\(\s*[`'"]([^`'"]+)[`'"]/s;
    const clientMatch = clientRegex.exec(methodBody);
    
    if (clientMatch) {
      endpoints.set(methodName, { method: clientMatch[1].toUpperCase(), endpoint: clientMatch[2] });
      continue;
    }

    // Strategy 2: Look for URL template string definition
    // const url = `/api/v5/...`
    // or just any string looking like an API path
    const urlRegex = /[`"'](\/api\/v5\/[^`"']+)["`']/s;
    const urlMatch = urlRegex.exec(methodBody);
    
    // Try to guess method
    let method = 'GET';
    if (methodBody.includes('this.client.post')) method = 'POST';
    else if (methodBody.includes('this.client.put')) method = 'PUT';
    else if (methodBody.includes('this.client.delete')) method = 'DELETE';
    else if (methodBody.includes('this.client.patch')) method = 'PATCH';

    if (urlMatch) {
        endpoints.set(methodName, { method, endpoint: urlMatch[1] });
    }
  }
  return endpoints;
}

async function main() {
  const { map: urlMap, allEndpoints } = loadApiUrls();
  const coveredUrls = new Set<string>();

  if (!fs.existsSync(TOOLS_DIR)) {
    console.error(`Directory not found: ${TOOLS_DIR}`);
    return;
  }

  const toolFiles = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('Tools.ts') && !f.includes('AGENTS.md'));

  for (const file of toolFiles) {
    const categoryName = file.replace('Tools.ts', '');
    const toolContent = fs.readFileSync(path.join(TOOLS_DIR, file), 'utf-8');
    const serviceFile = path.join(SERVICES_DIR, `${categoryName}Service.ts`);
    
    let serviceEndpoints = new Map<string, { endpoint: string, method: string }>();
    if (fs.existsSync(serviceFile)) {
      const serviceContent = fs.readFileSync(serviceFile, 'utf-8');
      serviceEndpoints = extractServiceEndpoints(serviceContent);
    }

    const extractedTools = extractTools(toolContent);
    
    for (const name of extractedTools.keys()) {
      const info = extractedTools.get(name)!;
      const endpointInfo = serviceEndpoints.get(info.serviceMethod);
      
      let docUrl = '';
      
      if (MANUAL_OVERRIDES[name]) {
          docUrl = MANUAL_OVERRIDES[name];
      }

      if (endpointInfo && !docUrl) {
        const endpoint = endpointInfo.endpoint;
        const method = endpointInfo.method;

        const slug = normalizeCodePathToSlug(endpoint);
        const slugKey = `SLUG:${method}:${slug}`;
        
        if (urlMap.has(slugKey)) {
            docUrl = urlMap.get(slugKey)!.url;
        } else {
             const codePattern = generatePatternFromCodePath(endpoint);
             const patternKey = `PATTERN:${method}:${codePattern}`;

             if (urlMap.has(patternKey)) {
                 docUrl = urlMap.get(patternKey)!.url;
             }
        }
      }

      if (!docUrl) {
        const nameKey = `NAME:${info.description}`;
        if (urlMap.has(nameKey)) {
          docUrl = urlMap.get(nameKey)!.url;
        } else {
           for (const [key, val] of urlMap.entries()) {
             if (key.startsWith('NAME:')) {
               const apiName = key.substring(5);
               if (info.description.includes(apiName) || apiName.includes(info.description)) {
                 docUrl = val.url;
                 break;
               }
             }
           }
        }
      }

      if (docUrl) {
        coveredUrls.add(docUrl);
      }
    }
  }

  // Analysis
  const total = allEndpoints.length;
  const covered = coveredUrls.size;
  const missing = allEndpoints.filter(e => !coveredUrls.has(e.documentationUrl));

  console.log(`\nCoverage Analysis Report`);
  console.log(`========================`);
  console.log(`Total APIs: ${total}`);
  console.log(`Covered:    ${covered} (${((covered/total)*100).toFixed(1)}%)`);
  console.log(`Missing:    ${total - covered}`);
  console.log(`========================\n`);

  if (missing.length > 0) {
    console.log(`Missing APIs (Top 20):`);
    missing.slice(0, 20).forEach(m => {
        console.log(`[${m.httpMethod}] ${m.endpointPath} - ${m.name}`);
        console.log(`  Docs: ${m.documentationUrl}`);
    });
    if (missing.length > 20) {
        console.log(`... and ${missing.length - 20} more.`);
    }
  } else {
    console.log('🎉 All APIs are covered!');
  }
}

main();
