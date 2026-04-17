import axios from 'axios';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_DIR = path.join(__dirname, '../src/tools');
const MAP_FILE = path.join(__dirname, '../docs/api_tool_map.md');
const DOCS_HOST = 'https://docs.atomgit.com';
const MAIN_JS_URL = `${DOCS_HOST}/assets/js/main.36a09be1.js`;
const RUNTIME_JS_URL = `${DOCS_HOST}/assets/js/runtime~main.4ffd5245.js`;

type JsonSchema = Record<string, any>;

interface ToolInfo {
  name: string;
  file: string;
  inputSchema: JsonSchema;
}

interface ToolMapping {
  toolName: string;
  serviceMethod: string;
  serviceFile: string;
  docUrl: string;
}

interface DocsContract {
  parameters: Array<{
    name: string;
    in?: string;
    required?: boolean;
    schema?: { type?: string };
  }>;
  bodyProperties: Record<string, { type?: string; required: boolean }>;
}

interface AuditIssue {
  kind:
    | 'missing_param'
    | 'type_mismatch'
    | 'required_mismatch'
    | 'extra_required'
    | 'invalid_required'
    | 'generic_service_type';
  field: string;
  detail: string;
}

interface AuditResult {
  toolName: string;
  file: string;
  docUrl: string;
  issues: AuditIssue[];
}

const IGNORED_PARAM_NAMES = new Set([
  'access_token',
  'authorization',
  'private_token',
  'private-token',
  'content-type'
]);

const FIELD_ALIASES: Record<string, string[]> = {
  per_page: ['perPage'],
  tag_name: ['tagName'],
  branch_name: ['branchName'],
  milestone_id: ['milestoneId'],
  discussion_id: ['discussionId'],
  comment_id: ['commentId'],
  issue_id: ['issueId'],
  enterprise_id: ['enterpriseId'],
  head_sha: ['headSha'],
  file_name: ['fileName'],
  max_tokens: ['maxTokens'],
  issue_iids: ['issueIids'],
  pr_iids: ['prIids'],
  assignees_number: ['assigneesNumber'],
  testers_number: ['testersNumber'],
  create_access_level: ['createAccessLevel'],
  role_id: ['roleId'],
  transfer_to: ['transferTo'],
  html_url: ['htmlUrl'],
  start_date: ['startDate'],
  due_date: ['dueDate'],
  state_event: ['stateEvent'],
  top_k: ['topK'],
  top_p: ['topP'],
  frequency_penalty: ['frequencyPenalty']
};

function toCamelCase(value: string): string {
  return value.replace(/[_-]([a-zA-Z0-9])/g, (_, char: string) => char.toUpperCase());
}

function toSnakeCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/-/g, '_')
    .toLowerCase();
}

function normalizeType(type?: string): string | undefined {
  if (!type) {
    return undefined;
  }
  if (type === 'integer') {
    return 'number';
  }
  return type;
}

function collectSchemaTypes(schema: JsonSchema | undefined): Set<string> {
  const types = new Set<string>();
  if (!schema) {
    return types;
  }

  if (typeof schema.type === 'string') {
    types.add(normalizeType(schema.type)!);
    if (schema.type === 'string' && schema.format === 'binary') {
      types.add('file');
    }
  }

  for (const key of ['oneOf', 'anyOf', 'allOf']) {
    const variants = schema[key];
    if (Array.isArray(variants)) {
      for (const variant of variants) {
        for (const variantType of collectSchemaTypes(variant)) {
          types.add(variantType);
        }
      }
    }
  }

  return types;
}

function extractBalancedSnippet(source: string, marker: string): string | null {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    return null;
  }

  let start = markerIndex + marker.length;
  while (start < source.length && /\s/.test(source[start])) {
    start += 1;
  }

  return extractBalancedFromIndex(source, start);
}

function extractBalancedFromIndex(source: string, start: number): string | null {
  if (start < 0 || start >= source.length) {
    return null;
  }

  const open = source[start];
  const close = open === '[' ? ']' : open === '{' ? '}' : null;
  if (!close) {
    return null;
  }

  let depth = 0;
  let quote: '"' | "'" | null = null;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }
      if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === open) {
      depth += 1;
    } else if (char === close) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  return null;
}

function evaluateJsLiteral<T>(snippet: string | null): T | null {
  if (!snippet) {
    return null;
  }
  return vm.runInNewContext(`(${snippet})`) as T;
}

function parseToolMappings(): ToolMapping[] {
  const content = fs.readFileSync(MAP_FILE, 'utf8');
  const rows = content.split('\n');
  const mappings: ToolMapping[] = [];

  const rowPattern =
    /^\| \[`([^`]+)`\]\(\.\.\/src\/tools\/([^)]+)\) \| .* \| \[`([^`]+)`\]\(\.\.\/src\/services\/([^)]+)\) \| \[`[^`]+`\]\((https:\/\/docs\.atomgit\.com[^)]+)\) \|$/;

  for (const row of rows) {
    const match = row.match(rowPattern);
    if (!match) {
      continue;
    }

    mappings.push({
      toolName: match[1],
      serviceMethod: match[3],
      serviceFile: match[4],
      docUrl: match[5]
    });
  }

  return mappings;
}

async function loadTools(): Promise<Map<string, ToolInfo>> {
  const toolFiles = fs.readdirSync(TOOLS_DIR).filter((file) => file.endsWith('Tools.ts'));
  const tools = new Map<string, ToolInfo>();

  for (const file of toolFiles) {
    const modulePath = pathToFileURL(path.join(TOOLS_DIR, file)).href;
    const module = await import(modulePath);
    const className = path.basename(file, '.ts');
    const ToolClass = module[className];

    if (!ToolClass) {
      continue;
    }

    const instance = new ToolClass({});
    for (const tool of instance.getTools()) {
      tools.set(tool.name, {
        name: tool.name,
        file,
        inputSchema: tool.inputSchema ?? {}
      });
    }
  }

  return tools;
}

function parseRuntimeObject(source: string, marker: RegExp): Record<string, string> {
  const match = source.match(marker);
  if (!match) {
    throw new Error(`Unable to parse runtime marker: ${marker}`);
  }
  return evaluateJsLiteral<Record<string, string>>(`{${match[1]}}`) ?? {};
}

function parseChunkMaps(runtimeJs: string): { contentToNumeric: Record<string, string>; numericToHash: Record<string, string> } {
  const runtimeMarker = 't.u=e=>"assets/js/"+';
  const markerIndex = runtimeJs.indexOf(runtimeMarker);
  if (markerIndex === -1) {
    throw new Error('Unable to locate runtime chunk map');
  }

  const afterMarker = runtimeJs.slice(markerIndex + runtimeMarker.length);
  const firstObject = extractBalancedFromIndex(afterMarker, afterMarker.indexOf('{'));
  if (!firstObject) {
    throw new Error('Unable to parse runtime chunk basename map');
  }

  const hashSection = afterMarker.slice(afterMarker.indexOf(firstObject) + firstObject.length);
  const secondObject = extractBalancedFromIndex(hashSection, hashSection.indexOf('{'));
  if (!secondObject) {
    throw new Error('Unable to parse runtime chunk hash map');
  }

  return {
    contentToNumeric: parseRuntimeObject(
      runtimeJs,
      /t\.gca=function\(e\)\{return e=\{([\s\S]*?)\}\[e\]\|\|e,t\.p\+t\.u\(e\)\}/
    ),
    numericToHash: evaluateJsLiteral<Record<string, string>>(secondObject) ?? {}
  };
}

async function createChunkResolver() {
  const [mainJs, runtimeJs] = await Promise.all([
    axios.get(MAIN_JS_URL).then((response) => response.data as string),
    axios.get(RUNTIME_JS_URL).then((response) => response.data as string)
  ]);

  const routeMap = new Map<string, string>();
  const routePattern = /"([^"]*\/docs\/apis\/[^"]+)":\{"__comp":"[^"]+","content":"([^"]+)"\}/g;
  let routeMatch: RegExpExecArray | null;
  while ((routeMatch = routePattern.exec(mainJs)) !== null) {
    routeMap.set(routeMatch[1], routeMatch[2]);
  }

  const { contentToNumeric, numericToHash } = parseChunkMaps(runtimeJs);

  return (docUrl: string) => {
    const docPath = new URL(docUrl).pathname;
    const routeKey =
      routeMap.get(docPath) ??
      Array.from(routeMap.entries()).find(([key]) => key.startsWith(`${docPath}-`))?.[1];

    if (!routeKey) {
      throw new Error(`No route chunk found for ${docUrl}`);
    }

    const numericId = contentToNumeric[routeKey] ?? routeKey;
    const hash = numericToHash[numericId];
    if (!hash) {
      throw new Error(`No runtime hash found for chunk ${routeKey}`);
    }

    return `${DOCS_HOST}/assets/js/${routeKey}.${hash}.js`;
  };
}

async function fetchDocsContract(chunkUrl: string): Promise<DocsContract> {
  const content = await axios.get(chunkUrl).then((response) => response.data as string);
  const parameters = evaluateJsLiteral<any[]>(extractBalancedSnippet(content, 'parameters:')) ?? [];
  const body = evaluateJsLiteral<any>(extractBalancedSnippet(content, 'title:"Body",body:'));
  const bodySchema =
    body?.content?.['application/json']?.schema ??
    body?.content?.['multipart/form-data']?.schema ??
    body?.content?.['application/x-www-form-urlencoded']?.schema;

  const bodyProperties: Record<string, { type?: string; required: boolean }> = {};
  if (bodySchema?.properties) {
    const required = new Set<string>(Array.isArray(bodySchema.required) ? bodySchema.required : []);
    for (const [fieldName, fieldSchema] of Object.entries<any>(bodySchema.properties)) {
      bodyProperties[fieldName] = {
        type: normalizeType(fieldSchema?.type),
        required: required.has(fieldName)
      };
    }
  }

  return {
    parameters,
    bodyProperties
  };
}

function buildNameCandidates(fieldName: string): string[] {
  return Array.from(
    new Set([
      fieldName,
      toCamelCase(fieldName),
      toSnakeCase(fieldName),
      ...(FIELD_ALIASES[fieldName] ?? [])
    ])
  );
}

function findMatchingToolField(fieldName: string, toolSchema: JsonSchema): { name: string; schema: JsonSchema } | null {
  const properties = toolSchema.properties ?? {};

  for (const candidate of buildNameCandidates(fieldName)) {
    if (properties[candidate]) {
      return { name: candidate, schema: properties[candidate] };
    }
  }

  return null;
}

function hasRequiredField(toolSchema: JsonSchema, fieldName: string): boolean {
  const required = new Set<string>(Array.isArray(toolSchema.required) ? toolSchema.required : []);
  return buildNameCandidates(fieldName).some((candidate) => required.has(candidate));
}

function fieldNamesEquivalent(left: string, right: string): boolean {
  const leftCandidates = new Set(buildNameCandidates(left));
  return buildNameCandidates(right).some((candidate) => leftCandidates.has(candidate));
}

function getRequiredDocFields(docsContract: DocsContract): string[] {
  const requiredFields = docsContract.parameters
    .filter((parameter) => parameter.required && !IGNORED_PARAM_NAMES.has(parameter.name.toLowerCase()))
    .map((parameter) => parameter.name);

  for (const [fieldName, fieldContract] of Object.entries(docsContract.bodyProperties)) {
    if (fieldContract.required) {
      requiredFields.push(fieldName);
    }
  }

  return requiredFields;
}

function extractServiceSignature(serviceFile: string, serviceMethod: string): string | null {
  const servicePath = path.join(__dirname, `../src/services/${serviceFile}`);
  if (!fs.existsSync(servicePath)) {
    return null;
  }

  const content = fs.readFileSync(servicePath, 'utf8');
  const signaturePattern = new RegExp(`async\\s+${serviceMethod}\\s*\\(([^)]*)\\)`, 's');
  const match = content.match(signaturePattern);
  return match?.[1] ?? null;
}

function auditTool(
  tool: ToolInfo,
  mapping: ToolMapping,
  docsContract: DocsContract
): AuditResult | null {
  const issues: AuditIssue[] = [];
  const toolProperties = tool.inputSchema.properties ?? {};

  for (const parameter of docsContract.parameters) {
    const fieldName = parameter.name;
    if (IGNORED_PARAM_NAMES.has(fieldName.toLowerCase())) {
      continue;
    }

    const match = findMatchingToolField(fieldName, tool.inputSchema);
    if (!match) {
      issues.push({
        kind: 'missing_param',
        field: fieldName,
        detail: `文档中的 ${parameter.in ?? 'parameter'} 参数未在工具 schema 中暴露`
      });
      continue;
    }

    const docsType = normalizeType(parameter.schema?.type);
    if (docsType) {
      const toolTypes = collectSchemaTypes(match.schema);
      if (toolTypes.size > 0 && !toolTypes.has(docsType)) {
        issues.push({
          kind: 'type_mismatch',
          field: fieldName,
          detail: `文档类型为 ${docsType}，工具 schema 为 ${Array.from(toolTypes).join('/')}`
        });
      }
    }

    if (parameter.required && !hasRequiredField(tool.inputSchema, fieldName)) {
      issues.push({
        kind: 'required_mismatch',
        field: fieldName,
        detail: '文档要求必填，但工具 schema 未标记为必填'
      });
    }
  }

  for (const [fieldName, bodyField] of Object.entries(docsContract.bodyProperties)) {
    const match = findMatchingToolField(fieldName, tool.inputSchema);
    if (!match) {
      issues.push({
        kind: 'missing_param',
        field: fieldName,
        detail: '文档请求体字段未在工具 schema 中暴露'
      });
      continue;
    }

    if (bodyField.type) {
      const toolTypes = collectSchemaTypes(match.schema);
      if (toolTypes.size > 0 && !toolTypes.has(bodyField.type)) {
        issues.push({
          kind: 'type_mismatch',
          field: fieldName,
          detail: `文档请求体类型为 ${bodyField.type}，工具 schema 为 ${Array.from(toolTypes).join('/')}`
        });
      }
    }

    if (bodyField.required && !hasRequiredField(tool.inputSchema, fieldName)) {
      issues.push({
        kind: 'required_mismatch',
        field: fieldName,
        detail: '文档请求体字段要求必填，但工具 schema 未标记为必填'
      });
    }
  }

  const requiredDocFields = getRequiredDocFields(docsContract);
  const requiredToolFields = Array.isArray(tool.inputSchema.required) ? tool.inputSchema.required : [];
  for (const requiredField of requiredToolFields) {
    if (!toolProperties[requiredField]) {
      issues.push({
        kind: 'invalid_required',
        field: requiredField,
        detail: '工具 schema 将该字段标记为必填，但 properties 中并不存在该字段'
      });
      continue;
    }

    if (!requiredDocFields.some((docField) => fieldNamesEquivalent(requiredField, docField))) {
      issues.push({
        kind: 'extra_required',
        field: requiredField,
        detail: '工具 schema 将该字段标记为必填，但当前 AtomGit 文档未要求必填'
      });
    }
  }

  if (Object.keys(docsContract.bodyProperties).length > 0) {
    const signature = extractServiceSignature(mapping.serviceFile, mapping.serviceMethod);
    if (signature && /:\s*any\b/.test(signature)) {
      issues.push({
        kind: 'generic_service_type',
        field: mapping.serviceMethod,
        detail: '服务层方法签名仍使用 any，请改为与文档对齐的显式类型'
      });
    }
  }

  if (issues.length === 0) {
    return null;
  }

  return {
    toolName: tool.name,
    file: tool.file,
    docUrl: mapping.docUrl,
    issues
  };
}

async function main() {
  if (!fs.existsSync(MAP_FILE)) {
    throw new Error(`Missing mapping file: ${MAP_FILE}. Run npm run api:map first.`);
  }

  const [toolMap, mappings, resolveChunkUrl] = await Promise.all([
    loadTools(),
    Promise.resolve(parseToolMappings()),
    createChunkResolver()
  ]);

  const contractCache = new Map<string, DocsContract>();
  const results: AuditResult[] = [];

  for (const mapping of mappings) {
    const tool = toolMap.get(mapping.toolName);
    if (!tool) {
      continue;
    }

    let docsContract = contractCache.get(mapping.docUrl);
    if (!docsContract) {
      const chunkUrl = resolveChunkUrl(mapping.docUrl);
      docsContract = await fetchDocsContract(chunkUrl);
      contractCache.set(mapping.docUrl, docsContract);
    }

    const result = auditTool(tool, mapping, docsContract);
    if (result) {
      results.push(result);
    }
  }

  console.log('\nAPI Contract Audit Report');
  console.log('=========================');
  console.log(`Tools checked: ${mappings.length}`);
  console.log(`Tools with issues: ${results.length}`);

  const issueCount = results.reduce((sum, result) => sum + result.issues.length, 0);
  console.log(`Issue count: ${issueCount}`);
  console.log('=========================\n');

  for (const result of results) {
    console.log(`${result.toolName} (${result.file})`);
    console.log(`Docs: ${result.docUrl}`);
    for (const issue of result.issues) {
      console.log(`- [${issue.kind}] ${issue.field}: ${issue.detail}`);
    }
    console.log('');
  }

  if (results.length === 0) {
    console.log('All tool schemas and service request types match the current AtomGit docs.');
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
