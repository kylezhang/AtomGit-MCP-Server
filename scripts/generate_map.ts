
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_DIR = path.join(__dirname, '../src/tools');
const SERVICES_DIR = path.join(__dirname, '../src/services');
const DOCS_URL_FILE = path.join(__dirname, '../docs/apis_url.json');
const OUTPUT_FILE = path.join(__dirname, '../docs/api_tool_map.md');

interface ToolInfo {
  name: string;
  description: string;
  serviceMethod: string;
  apiEndpoint?: string;
  httpMethod?: string;
  documentationUrl?: string;
}

interface CategoryInfo {
  name: string;
  tools: ToolInfo[];
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
  'get_repository_commit_statistics': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-repository-commit-statistics',
  'delete_repository_protected_tag': 'https://docs.gitcode.com/docs/apis/delete-api-v-5-repos-owner-repo-protected-tags-tag-name',
  'delete_repository_tag': 'https://docs.gitcode.com/docs/apis/delete-api-v-5-repos-owner-repo-tags-tag-name',
  'get_repository_protected_tag': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-protected-tags-tag-name',
  'update_repository_protected_tag': 'https://docs.gitcode.com/docs/apis/put-api-v-5-repos-owner-repo-protected-tags-tag-name',
  'create_repository_issue': 'https://docs.gitcode.com/docs/apis/post-api-v-5-repos-owner-issues'
};

interface ApiUrlMapValue {
  url: string;
  name: string;
}

// Map: normalized path key -> documentation URL info
function loadApiUrls(): Map<string, ApiUrlMapValue> {
  const urlMap = new Map<string, ApiUrlMapValue>();
  if (!fs.existsSync(DOCS_URL_FILE)) {
    console.warn(`Warning: ${DOCS_URL_FILE} not found.`);
    return urlMap;
  }

  try {
    const data: ApiUrlData = JSON.parse(fs.readFileSync(DOCS_URL_FILE, 'utf-8'));
    for (const category of data.categories) {
      for (const endpoint of category.endpoints) {
        // Create multiple keys to maximize match chances
        const val = { url: endpoint.documentationUrl, name: endpoint.name };
        
        // Key 1: Exact Name (for tool description match)
        urlMap.set(`NAME:${endpoint.name}`, val);

        // Key 2: Method + Slug Path (e.g., "GET /api/v5-repos-owner-repo-git-trees-sha")
        // Extract slug from documentationUrl
        // https://docs.gitcode.com/docs/apis/METHOD-SLUG
        const urlParts = endpoint.documentationUrl.split('/');
        let urlSlug = urlParts[urlParts.length - 1]; // put-api-v-5-repos-...
        
        // Remove method prefix if present (put-, post-, get-, delete-, patch-)
        const methodPrefix = endpoint.httpMethod.toLowerCase() + '-';
        if (urlSlug.startsWith(methodPrefix)) {
            urlSlug = urlSlug.substring(methodPrefix.length);
        }
        
        let normalizedSlug = '/' + urlSlug;
        // Handle gitcode docs format (api-v-5)
        normalizedSlug = normalizedSlug.replace('/api-v-5-', '/api/v5-');
        normalizedSlug = normalizedSlug.replace('/api-v-1-', '/api/v1-');
        normalizedSlug = normalizedSlug.replace('/api-v-8-', '/api/v8-');
        
        // Handle potentially standard format (api-v5) if any
        normalizedSlug = normalizedSlug.replace('/api-v5-', '/api/v5-');
        normalizedSlug = normalizedSlug.replace('/api-v1-', '/api/v1-');
        normalizedSlug = normalizedSlug.replace('/api-v8-', '/api/v8-');

        const slugKey = `SLUG:${endpoint.httpMethod.toUpperCase()}:${normalizedSlug}`;
        urlMap.set(slugKey, val);
        
        // Key 3: Pattern Match
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
  return urlMap;
}

function generatePatternFromSlug(slug: string): string {
    // Slug example: /api/v5-repos-owner-repo-branches-name
    // Split by '-'
    // Note: the slug usually starts with /api/v5-...
    
    // Remove leading /
    let cleanSlug = slug.startsWith('/') ? slug.substring(1) : slug;
    
    // Normalize api/vX to api-vX to match code path splitting
    cleanSlug = cleanSlug.replace('api/v5', 'api-v5');
    cleanSlug = cleanSlug.replace('api/v8', 'api-v8');
    cleanSlug = cleanSlug.replace('api/v1', 'api-v1');
    
    // Normalize discussions-discussions -> discussions
    cleanSlug = cleanSlug.replace('discussions-discussions', 'discussions');
    
    const parts = cleanSlug.split('-');
    const patternParts = parts.map(p => {
        // If it's a known variable, replace with *
        if (KNOWN_VARS.has(p)) return '*';
        // Also if it looks like an ID? 
        return p;
    });
    
    return patternParts.join('-');
}

function generatePatternFromCodePath(pathStr: string): string {
    // Code Path: /api/v5/repos/${owner}/${repo}/branches/${branch}
    
    // 1. Remove leading /
    const cleanPath = pathStr.startsWith('/') ? pathStr.substring(1) : pathStr;
    
    // 2. Split by '/'
     const parts = cleanPath.split('/');
     
     const patternParts = parts.map(p => {
         // If it is a variable ${...}, replace with *
         if (p.startsWith('${') && p.endsWith('}')) {
             return '*';
         }
         // Handle "protect_branches" -> "protect-branches"
         // Replace _ with - in non-variable segments
         let seg = p.replace(/_/g, '-');
         
         // Normalize orgs -> org
         if (seg === 'orgs') seg = 'org';
         
         return seg;
     });
    
    return patternParts.join('-');
}

// Convert code path to slug format found in apis_url.json
function normalizeCodePathToSlug(pathStr: string): string {
  // 1. Remove all dynamic segments ${...}
  // e.g. /api/v5/repos/${owner}/${repo}/git/trees/${sha} -> /api/v5/repos///git/trees/
  // Wait, the previous logic tried to keep var names.
  // Let's try to match the exact slug format from json.
  // Json: /api/v5-repos-owner-repo-git-trees-sha
  // It replaces '/' with '-' and keeps the variable names (without brackets).
  
  // Step 1: Replace ${var} with var
  let normalized = pathStr.replace(/\$\{([^}]+)\}/g, '$1');
  
  // Step 2: Handle object properties like fileData.path -> path
  // Heuristic: take the last part of dot notation
  normalized = normalized.replace(/([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/g, '$2');
  
  // Step 3: Replace '/' with '-'
  // But we need to be careful about the start.
  // Json starts with /api/v5-...
  // So /api/v5/ becomes /api/v5-
  
  const parts = normalized.split('/').filter(p => p);
  // [api, v5, repos, owner, repo, git, trees, sha]
  
  if (parts.length > 1 && parts[0] === 'api') {
     const normalizedParts = parts.map(p => {
         if (p === 'users') return 'user';
         // if (p === 'orgs') return 'org'; // Removed: JSON uses plural orgs
         // if (p === 'enterprises') return 'enterprise'; // Removed: JSON uses plural enterprises
         return p;
     });

     // Join all with -
     const dashed = normalizedParts.join('-');
     // api-v5-repos-owner-repo-git-trees-sha
     
     // Prepend /
     let slug = '/' + dashed;
     // /api-v5-repos-owner-repo-git-trees-sha
     
     // Fix the start to match json: /api/v5-...
     // The json has /api/v5-... but our slug is /api-v5-...
     // So replace /api-v5- with /api/v5-
     slug = slug.replace('/api-v5-', '/api/v5-');
     
     // Also handle v1
     slug = slug.replace('/api-v1-', '/api/v1-');
     
     // Also handle v8
     slug = slug.replace('/api-v8-', '/api/v8-');

     return slug;
  }
  
  return normalized;
}

function extractTools(toolContent: string): Map<string, { description: string, serviceMethod: string }> {
  const tools = new Map<string, { description: string, serviceMethod: string }>();
  
  // 1. Extract all tool definitions
  const toolDefRegex = /name:\s*'([^']+)',\s*[\r\n\s]*description:\s*'([^']+)'/g;
  let match;
  const toolDefs = new Map<string, string>();
  while ((match = toolDefRegex.exec(toolContent)) !== null) {
    toolDefs.set(match[1], match[2]);
  }

  // 2. For each tool, find the service method call
  for (const [toolName, description] of toolDefs) {
    // Search for the specific case block
    const caseIndex = toolContent.indexOf(`case '${toolName}':`);
    if (caseIndex !== -1) {
      const restOfContent = toolContent.substring(caseIndex);
      // Find the first occurrence of this.service.method(
      // We assume the service call is within reasonable distance and before next case/default
      const methodMatch = /this\.[a-zA-Z0-9_]+\.([a-zA-Z0-9_]+)\(/.exec(restOfContent);
      
      const nextCaseIndex = restOfContent.indexOf('case ', 5); // Skip current 'case '
      const defaultIndex = restOfContent.indexOf('default:');
      
      let boundary = restOfContent.length;
      if (nextCaseIndex !== -1) boundary = Math.min(boundary, nextCaseIndex);
      if (defaultIndex !== -1) boundary = Math.min(boundary, defaultIndex);
      
      if (methodMatch && methodMatch.index < boundary) {
        tools.set(toolName, {
          description: description,
          serviceMethod: methodMatch[1]
        });
      } else {
        console.warn(`[Warning] Service method not found for tool: ${toolName}`);
        // Fallback: use 'Unknown' if not found, so it still appears in the list
        tools.set(toolName, {
            description: description,
            serviceMethod: 'Unknown'
        });
      }
    } else {
         console.warn(`[Warning] Case handler not found for tool: ${toolName}`);
         // Still add it
         tools.set(toolName, {
            description: description,
            serviceMethod: 'Unknown'
        });
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
    const clientRegex = /this\.client\.([a-z]+)\(\s*[`'"]([^`'"]+)[`'"]/s;
    const clientMatch = clientRegex.exec(methodBody);
    
    if (clientMatch) {
      endpoints.set(methodName, {
        method: clientMatch[1].toUpperCase(),
        endpoint: clientMatch[2]
      });
    }
  }
  return endpoints;
}

function loadCategoryOrder(): string[] {
  const order: string[] = [];
  if (!fs.existsSync(DOCS_URL_FILE)) {
    return order;
  }
  try {
    const data: ApiUrlData = JSON.parse(fs.readFileSync(DOCS_URL_FILE, 'utf-8'));
    for (const category of data.categories) {
      order.push(category.name);
    }
  } catch (e) {
    console.error(e);
  }
  return order;
}

async function main() {
  const categories: CategoryInfo[] = [];
  const urlMap = loadApiUrls();
  const categoryOrder = loadCategoryOrder();
  
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
    const toolInfos: ToolInfo[] = [];
    const sortedToolNames = Array.from(extractedTools.keys()).sort();

    for (const name of sortedToolNames) {
      const info = extractedTools.get(name)!;
      const endpointInfo = serviceEndpoints.get(info.serviceMethod);
      
      let endpoint = 'Unknown';
      let method = 'Unknown';
      let docUrl = '';
      
      // Check overrides first (independent of endpoint extraction)
      if (MANUAL_OVERRIDES[name]) {
          docUrl = MANUAL_OVERRIDES[name];
          // Try to find description for overridden URL if possible
          for (const val of urlMap.values()) {
              if (val.url === docUrl) {
                  info.description = val.name;
                  break;
              }
          }
      }

      if (endpointInfo) {
        endpoint = endpointInfo.endpoint;
        method = endpointInfo.method;

        // Strategy 1: Path Slug Match
        if (!docUrl) {
            const slug = normalizeCodePathToSlug(endpoint);
            const slugKey = `SLUG:${method}:${slug}`;
            
            if (urlMap.has(slugKey)) {
                const val = urlMap.get(slugKey)!;
                docUrl = val.url;
                info.description = val.name;
            } else {
                 // Strategy 3: Pattern Match
                 const codePattern = generatePatternFromCodePath(endpoint);
                 const patternKey = `PATTERN:${method}:${codePattern}`;

                 if (urlMap.has(patternKey)) {
                     const val = urlMap.get(patternKey)!;
                     docUrl = val.url;
                     info.description = val.name;
                 }
            }
        }
      }

      // Strategy 4: Name Match (Description)
      if (!docUrl) {
        // Exact name match
        const nameKey = `NAME:${info.description}`;
        if (urlMap.has(nameKey)) {
          const val = urlMap.get(nameKey)!;
          docUrl = val.url;
          info.description = val.name;
        } else {
           // Partial name match search
           // Iterate all NAME keys
           for (const [key, val] of urlMap.entries()) {
             if (key.startsWith('NAME:')) {
               const apiName = key.substring(5);
               // Strict check: if description contains API Name (or vice versa) AND length difference isn't massive
               if (info.description.includes(apiName) || apiName.includes(info.description)) {
                 docUrl = val.url;
                 info.description = val.name;
                 break;
               }
             }
           }
        }
      }

      toolInfos.push({
        name,
        description: info.description,
        serviceMethod: info.serviceMethod,
        apiEndpoint: endpoint,
        httpMethod: method,
        documentationUrl: docUrl
      });
    }

    if (toolInfos.length > 0) {
      categories.push({
        name: categoryName,
        tools: toolInfos
      });
    }
  }

  // Sort categories based on apis_url.json order
  categories.sort((a, b) => {
    const getIndex = (name: string) => {
       let idx = categoryOrder.indexOf(name);
       if (idx !== -1) return idx;
       if (name.endsWith('s')) {
         idx = categoryOrder.indexOf(name.slice(0, -1)); 
       } else {
         idx = categoryOrder.indexOf(name + 's');
       }
       if (idx !== -1) return idx;
       idx = categoryOrder.findIndex(c => c.toLowerCase() === name.toLowerCase());
       if (idx !== -1) return idx;
       return 999;
    };
    return getIndex(a.name) - getIndex(b.name);
  });

  // Generate Markdown
  let md = `# AtomGit MCP Server - API 与工具映射表

**生成时间:** ${new Date().toISOString().split('T')[0]}
**分类总数:** ${categories.length}
**工具总数:** ${categories.reduce((acc, cat) => acc + cat.tools.length, 0)}

## 概览
本文档列出了所有注册的工具、描述以及它们调用的底层 AtomGit API 端点。

## 约定
- **工具名称前缀:** 所有工具在运行时都会自动加上 \`atomgit:\` 前缀。
- **Service 层:** 位于 \`src/services/\`。
- **Tool 层:** 位于 \`src/tools/\`。

## 映射表

`;

  for (const category of categories) {
    md += `### ${category.name} (${category.tools.length})\n`;
    md += `| Tool Name | Description | Service Method | API Endpoint |\n`;
    md += `|-----------|-------------|----------------|--------------|\n`;
    for (const tool of category.tools) {
      const toolLink = `[\`${tool.name}\`](../src/tools/${category.name}Tools.ts)`;
      const serviceLink = `[\`${tool.serviceMethod}\`](../src/services/${category.name}Service.ts)`;
      
      let endpointDisplay = tool.httpMethod !== 'Unknown' 
        ? `${tool.httpMethod} ${tool.apiEndpoint}` 
        : tool.apiEndpoint === 'Unknown' ? '复杂/动态' : tool.apiEndpoint;
      
      if (tool.documentationUrl) {
        endpointDisplay = `[\`${endpointDisplay}\`](${tool.documentationUrl})`;
      } else {
        endpointDisplay = `\`${endpointDisplay}\``;
      }

      md += `| ${toolLink} | ${tool.description} | ${serviceLink} | ${endpointDisplay} |\n`;
    }
    md += `\n`;
  }

  fs.writeFileSync(OUTPUT_FILE, md, 'utf-8');
  console.log(`Successfully wrote to ${OUTPUT_FILE}`);
}

main();
