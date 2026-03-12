
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
  description: string; // Tool's English description
  apiName?: string;    // API's Chinese name from JSON
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
  'create_repository_issue': 'https://docs.gitcode.com/docs/apis/post-api-v-5-repos-owner-issues',
  'audio_transcription': 'https://docs.gitcode.com/docs/apis/post-api-v-1-audio-transcriptions',
  'get_repository_commit_diff': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-commits-sha-diff',
  'get_repository_commit_patch': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-commits-sha-diff',
  'get_repository_commit_statistics': 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-repository-commit-statistics',
  'create_organization_kanban': 'https://docs.gitcode.com/docs/apis/post-api-v-5-org-owner-kanban-create',
  'delete_organization_kanban': 'https://docs.gitcode.com/docs/apis/delete-api-v-5-org-owner-kanban-id',
  'update_organization_kanban': 'https://docs.gitcode.com/docs/apis/put-api-v-5-org-owner-kanban-id',
  'update_organization_kanban_content': 'https://docs.gitcode.com/docs/apis/put-api-v-5-org-owner-kanban-id-content'
};

const MANUAL_ENDPOINT_OVERRIDES: Record<string, string> = {
    'getRepositoryCommitStatistics': 'GET /api/v5/repos/${owner}/${repo}/repository/commit_statistics',
    'getRepositoryTree': 'GET /api/v5/repos/${owner}/${repo}/git/trees/${sha}'
};

interface ApiUrlMapValue {
  url: string;
  name: string;
}

function generateUnifiedPattern(pathStr: string): string {
    // 1. Remove leading slash
    let clean = pathStr.startsWith('/') ? pathStr.substring(1) : pathStr;
    
    // 2. Handle known prefixes to ensure consistency
    // JSON often has /api/v5/..., code has /api/v5/...
    clean = clean.replace(/^api\/v5\//, 'api-v5-');
    clean = clean.replace(/^api\/v1\//, 'api-v1-');
    clean = clean.replace(/^api\/v8\//, 'api-v8-');
    
    // 3. Split by separator (could be / or -)
    // If it comes from code: /api/v5/repos/${owner}
    // If it comes from JSON endpointPath: /api/v5/repos/:owner
    // If it comes from JSON docUrl: api-v5-repos-owner
    
    // Normalize / to -
    clean = clean.replace(/\//g, '-');
    
    const parts = clean.split('-');
    
    const patternParts = parts.map(p => {
        // Variable detection
        if (p.startsWith(':')) return '*'; // JSON style :id
        if (p.startsWith('${') && p.endsWith('}')) return '*'; // Code style ${id}
        if (KNOWN_VARS.has(p)) return '*'; // Known variable names in slug
        
        // Normalize underscores in segment names (e.g. pull_requests -> pull-requests)
        // But NOT if it's a variable (handled above)
        return p.replace(/_/g, '-');
    });
    
    return patternParts.join('-');
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
        const urlParts = endpoint.documentationUrl.split('/');
        let urlSlug = urlParts[urlParts.length - 1]; 
        
        const methodPrefix = endpoint.httpMethod.toLowerCase() + '-';
        if (urlSlug.startsWith(methodPrefix)) {
            urlSlug = urlSlug.substring(methodPrefix.length);
        }
        
        let normalizedSlug = '/' + urlSlug;
        normalizedSlug = normalizedSlug.replace('/api-v5-', '/api/v5-');
        normalizedSlug = normalizedSlug.replace('/api-v1-', '/api/v1-');
        normalizedSlug = normalizedSlug.replace('/api-v8-', '/api/v8-');
        normalizedSlug = normalizedSlug.replace('/api-v5-', '/api/v5-');

        const slugKey = `SLUG:${endpoint.httpMethod.toUpperCase()}:${normalizedSlug}`;
        urlMap.set(slugKey, val);
        
        // Key 3: Unified Pattern Match from Endpoint Path
        const pattern = generateUnifiedPattern(endpoint.endpointPath);
        const patternKey = `PATTERN:${endpoint.httpMethod.toUpperCase()}:${pattern}`;
        // console.log(`JSON Pattern: ${patternKey}`); // Debug
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
      let apiName = '';
      
      // Check Manual Endpoint Overrides first
      if (MANUAL_ENDPOINT_OVERRIDES[info.serviceMethod]) {
          const parts = MANUAL_ENDPOINT_OVERRIDES[info.serviceMethod].split(' ');
          if (parts.length >= 2) {
              method = parts[0];
              endpoint = parts[1];
          }
      }

      // Check overrides first (independent of endpoint extraction)
      if (MANUAL_OVERRIDES[name]) {
          docUrl = MANUAL_OVERRIDES[name];
          // Try to find description for overridden URL if possible
          for (const val of urlMap.values()) {
              if (val.url === docUrl) {
                  apiName = val.name;
                  break;
              }
          }
      }

      if (endpoint === 'Unknown' && endpointInfo) {
        endpoint = endpointInfo.endpoint;
        method = endpointInfo.method;

        // Strategy 1: Path Slug Match
        if (!docUrl) {
            const slug = normalizeCodePathToSlug(endpoint);
            const slugKey = `SLUG:${method}:${slug}`;
            
            if (urlMap.has(slugKey)) {
                const val = urlMap.get(slugKey)!;
                docUrl = val.url;
                apiName = val.name;
            } else {
                 // Strategy 3: Pattern Match
                 const codePattern = generateUnifiedPattern(endpoint);
                 const patternKey = `PATTERN:${method}:${codePattern}`;
                 // console.log(`Code Pattern: ${patternKey}`); // Debug

                 if (urlMap.has(patternKey)) {
                     const val = urlMap.get(patternKey)!;
                     docUrl = val.url;
                     apiName = val.name;
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
          apiName = val.name;
        } else {
           // Partial name match search
           // Iterate all NAME keys
           for (const [key, val] of urlMap.entries()) {
             if (key.startsWith('NAME:')) {
               const mapApiName = key.substring(5);
               // Strict check: if description contains API Name (or vice versa) AND length difference isn't massive
               if (info.description.includes(mapApiName) || mapApiName.includes(info.description)) {
                 docUrl = val.url;
                 apiName = val.name;
                 break;
               }
             }
           }
        }
      }

      // Strategy 5: Fallback - try matching tool name to api url parts
      if (!docUrl) {
          // e.g. get_repository_tree -> repositories/get-tree ? No, usually url is different
          // But maybe we can match "get_repository_tree" to "Get Repository Tree" in NAME?
          // Convert tool name to possible sentence
          const sentence = name.replace(/_/g, ' ');
          // Try matching this sentence against names
          for (const [key, val] of urlMap.entries()) {
             if (key.startsWith('NAME:')) {
               const mapApiName = key.substring(5);
               if (mapApiName.toLowerCase() === sentence.toLowerCase()) {
                   docUrl = val.url;
                   apiName = val.name;
                   break;
               }
             }
          }
      }

      if (!docUrl) {
          console.warn(`[WARNING] No URL found for tool: ${name} (Endpoint: ${endpoint})`);
          // Mark as Missing URL in the output so it's visible
          docUrl = 'MISSING_URL';
      }

      toolInfos.push({
        name,
        description: info.description,
        apiName: apiName,
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
- **工具名称前缀:** 所有工具在运行时都会自动加上 \`atomgit_\` 前缀。
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
      
      if (tool.documentationUrl && tool.documentationUrl !== 'MISSING_URL') {
        endpointDisplay = `[\`${endpointDisplay}\`](${tool.documentationUrl})`;
      } else {
        endpointDisplay = `**[MISSING URL]** \`${endpointDisplay}\``;
      }

      // Bilingual Description Logic
      // apiName is Chinese (from JSON), description is English (from Tool)
      let descriptionDisplay = tool.description;
      
      if (tool.apiName) {
         // Clean up potential duplicates or similar text
         const apiNameClean = tool.apiName.trim();
         const descClean = tool.description.trim();
         
         // If they are different enough, show both
         if (apiNameClean && descClean && apiNameClean !== descClean) {
             descriptionDisplay = `**${apiNameClean}**<br>${descClean}`;
         } else if (apiNameClean) {
             descriptionDisplay = apiNameClean;
         }
      }

      md += `| ${toolLink} | ${descriptionDisplay} | ${serviceLink} | ${endpointDisplay} |\n`;
    }
    md += `\n`;
  }

  fs.writeFileSync(OUTPUT_FILE, md, 'utf-8');
  console.log(`Successfully wrote to ${OUTPUT_FILE}`);
}

main();
