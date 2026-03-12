import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT, 'src/tools');
const SERVICES_DIR = path.join(ROOT, 'src/services');
const MAP_FILE = path.join(ROOT, 'docs/api_tool_map.md');
const REPORT_FILE = path.join(ROOT, 'docs/live-doc-audit-2026-03-12.md');
const JSON_FILE = path.join(ROOT, 'docs/live-doc-audit-2026-03-12.json');

const KNOWN_DOC_ISSUES = {
  live_doc_parse_failed: new Set([
    'get_repository_commit_statistics',
    'create_organization_kanban',
    'delete_organization_kanban',
    'update_organization_kanban',
    'update_organization_kanban_content',
  ]),
  slug_version_differs_from_live_endpoint: new Set([
    'audio_transcription',
  ]),
};

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function getText(node, sourceFile) {
  return sourceFile.text.slice(node.getStart(sourceFile), node.getEnd());
}

function getStringValue(node, sourceFile) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isTemplateExpression(node)) {
    return `\`${node.head.text}${node.templateSpans
      .map((span) => `\${${getText(span.expression, sourceFile)}}${span.literal.text}`)
      .join('')}\``.slice(1, -1);
  }
  return getText(node, sourceFile);
}

function extractToolData(filePath) {
  const sourceText = read(filePath);
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const tools = new Map();
  const callMap = new Map();

  function visit(node) {
    if (ts.isMethodDeclaration(node) && node.name && node.name.getText(sourceFile) === 'getTools') {
      const arrayLiteral = findFirstDescendant(node, ts.isArrayLiteralExpression);
      if (arrayLiteral) {
        for (const el of arrayLiteral.elements) {
          if (!ts.isObjectLiteralExpression(el)) continue;
          const name = getObjectStringProp(el, 'name', sourceFile);
          if (!name) continue;
          const description = getObjectStringProp(el, 'description', sourceFile) || '';
          const inputSchema = getObjectProp(el, 'inputSchema');
          const propertiesNode = inputSchema && getObjectProp(inputSchema, 'properties');
          const requiredNode = inputSchema && getObjectProp(inputSchema, 'required');
          const properties = propertiesNode && ts.isObjectLiteralExpression(propertiesNode)
            ? propertiesNode.properties
                .filter(ts.isPropertyAssignment)
                .map((p) => getPropName(p.name))
                .filter(Boolean)
            : [];
          const required = requiredNode && ts.isArrayLiteralExpression(requiredNode.initializer || requiredNode)
            ? (requiredNode.initializer || requiredNode).elements
                .filter(ts.isStringLiteral)
                .map((e) => e.text)
            : [];
          tools.set(name, { description, properties, required });
        }
      }
    }

    if (ts.isMethodDeclaration(node) && node.name && node.name.getText(sourceFile) === 'callTool') {
      walkSwitchCases(node, (toolName, caseNode) => {
        const methodMatch = getText(caseNode, sourceFile).match(/this\.[a-zA-Z0-9_]+\.([a-zA-Z0-9_]+)\(/);
        if (methodMatch) {
          callMap.set(toolName, methodMatch[1]);
        }
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { tools, callMap };
}

function walkSwitchCases(methodNode, onCase) {
  function visit(node) {
    if (ts.isCaseClause(node) && ts.isStringLiteral(node.expression)) {
      onCase(node.expression.text, node);
    }
    ts.forEachChild(node, visit);
  }
  visit(methodNode);
}

function findFirstDescendant(node, predicate) {
  let result = null;
  function visit(child) {
    if (result) return;
    if (predicate(child)) {
      result = child;
      return;
    }
    ts.forEachChild(child, visit);
  }
  ts.forEachChild(node, visit);
  return result;
}

function getPropName(nameNode) {
  if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)) return nameNode.text;
  return null;
}

function getObjectProp(objectNode, propName) {
  if (!objectNode || !ts.isObjectLiteralExpression(objectNode)) return null;
  for (const prop of objectNode.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    if (getPropName(prop.name) === propName) {
      return prop.initializer;
    }
  }
  return null;
}

function getObjectStringProp(objectNode, propName, sourceFile) {
  const value = getObjectProp(objectNode, propName);
  return getStringValue(value, sourceFile);
}

function extractServiceData(filePath) {
  const sourceText = read(filePath);
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const methods = new Map();

  function visit(node) {
    if (ts.isMethodDeclaration(node) && node.name && ts.isIdentifier(node.name)) {
      const methodName = node.name.text;
      const endpoint = extractAxiosCall(node, sourceFile);
      if (endpoint) methods.set(methodName, endpoint);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return methods;
}

function extractAxiosCall(methodNode, sourceFile) {
  let result = null;
  const stringVars = new Map();

  for (const statement of methodNode.body?.statements || []) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      const value = getStringValue(declaration.initializer, sourceFile);
      if (value) {
        stringVars.set(declaration.name.text, value);
      }
    }
  }

  function visit(node) {
    if (result) return;
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      ts.isPropertyAccessExpression(node.expression.expression) &&
      node.expression.expression.expression.getText(sourceFile) === 'this' &&
      node.expression.expression.name.getText(sourceFile) === 'client'
    ) {
      const httpMethod = node.expression.name.getText(sourceFile).toUpperCase();
      const arg = node.arguments[0];
      const endpoint = ts.isIdentifier(arg)
        ? stringVars.get(arg.text) || null
        : getStringValue(arg, sourceFile);
      if (endpoint && (endpoint.startsWith('/api/') || endpoint.startsWith('/oauth/') || endpoint.startsWith('/'))) {
        result = { httpMethod, endpoint };
        return;
      }
    }
    ts.forEachChild(node, visit);
  }
  ts.forEachChild(methodNode, visit);
  return result;
}

function parseApiToolMap(filePath) {
  const rows = [];
  const text = read(filePath);
  const clean = (value) => value.replace(/^`|`$/g, '');
  for (const line of text.split('\n')) {
    if (!line.startsWith('| [`')) continue;
    const matches = [...line.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
    if (matches.length < 3) continue;
    const endpointCellMatch = line.match(/\|\s*\[`([^`]+)`\]\((https:\/\/docs\.gitcode\.com\/docs\/apis\/[^)]+)\)\s*\|$/);
    if (!endpointCellMatch) continue;
    rows.push({
      toolName: clean(matches[0][1]),
      toolPath: matches[0][2],
      serviceMethod: clean(matches[1][1]),
      servicePath: matches[1][2],
      displayedEndpoint: endpointCellMatch[1],
      documentationUrl: endpointCellMatch[2],
    });
  }
  return rows;
}

function parseDisplayedEndpoint(value) {
  const match = value.match(/^([A-Z]+)\s+(.+)$/);
  if (!match) return { httpMethod: 'UNKNOWN', endpoint: value };
  return { httpMethod: match[1], endpoint: match[2] };
}

function normalizeEndpoint(value) {
  return value
    .replace(/\$\{[^}]+\}/g, ':var')
    .replace(/:[a-zA-Z0-9_]+/g, ':var')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '') || '/';
}

function extractPathParams(endpoint) {
  return [...endpoint.matchAll(/:([a-zA-Z0-9_]+)/g)].map((m) => m[1]);
}

function slugInfo(url) {
  const slug = url.split('/').pop() || '';
  const versionMatch = slug.match(/-v-(\d+)-/);
  return {
    slug,
    version: versionMatch ? `v${versionMatch[1]}` : null,
  };
}

function extractLiveDoc(html) {
  const heading = html.match(/<h1 class="openapi__heading">([^<]+)<\/h1>/)?.[1] || null;
  const method = html.match(/<pre class="openapi__method-endpoint"><span class="badge [^"]+">([A-Z]+)<\/span>/)?.[1] || null;
  const endpoint = html.match(/<h2 class="openapi__method-endpoint-path">([^<]+)<\/h2>/)?.[1] || null;
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || null;
  return { heading, title, httpMethod: method, endpoint };
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'AtomGit-MCP-Server-Audit/1.0',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.text();
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function buildCodeIndex() {
  const toolIndex = new Map();
  const serviceIndex = new Map();

  for (const file of fs.readdirSync(TOOLS_DIR).filter((f) => f.endsWith('Tools.ts'))) {
    const full = path.join(TOOLS_DIR, file);
    const { tools, callMap } = extractToolData(full);
    for (const [toolName, meta] of tools.entries()) {
      toolIndex.set(toolName, {
        ...meta,
        file: full,
        serviceMethod: callMap.get(toolName) || null,
      });
    }
  }

  for (const file of fs.readdirSync(SERVICES_DIR).filter((f) => f.endsWith('.ts'))) {
    const full = path.join(SERVICES_DIR, file);
    const methods = extractServiceData(full);
    for (const [methodName, meta] of methods.entries()) {
      serviceIndex.set(methodName, {
        ...meta,
        file: full,
      });
    }
  }

  return { toolIndex, serviceIndex };
}

function classifyResult(row, toolMeta, serviceMeta, liveDoc) {
  const issues = [];
  const displayed = parseDisplayedEndpoint(row.displayedEndpoint);
  const displayedNorm = normalizeEndpoint(displayed.endpoint);
  const serviceNorm = serviceMeta ? normalizeEndpoint(serviceMeta.endpoint) : null;
  const liveNorm = liveDoc.endpoint ? normalizeEndpoint(liveDoc.endpoint) : null;
  const pathParams = liveDoc.endpoint ? extractPathParams(liveDoc.endpoint) : [];
  const slug = slugInfo(row.documentationUrl);
  const liveVersionMatch = liveDoc.endpoint && liveDoc.endpoint.match(/\/api\/(v\d+)\//);
  const liveVersion = liveVersionMatch ? liveVersionMatch[1] : null;

  if (!serviceMeta) issues.push('missing_service_method');
  if (!liveDoc.httpMethod || !liveDoc.endpoint) issues.push('live_doc_parse_failed');
  if (liveDoc.httpMethod && displayed.httpMethod !== liveDoc.httpMethod) issues.push('map_method_mismatch');
  if (liveNorm && displayedNorm !== liveNorm) issues.push('map_endpoint_mismatch');
  if (liveDoc.httpMethod && serviceMeta && serviceMeta.httpMethod !== liveDoc.httpMethod) issues.push('service_method_mismatch');
  if (liveNorm && serviceNorm && serviceNorm !== liveNorm) issues.push('service_endpoint_mismatch');

  if (toolMeta) {
    for (const param of pathParams) {
      if (!toolMeta.properties.includes(param)) issues.push(`missing_schema_property:${param}`);
      if (!toolMeta.required.includes(param)) issues.push(`missing_required_param:${param}`);
    }
  } else {
    issues.push('missing_tool_metadata');
  }

  if (slug.version && liveVersion && slug.version !== liveVersion) {
    issues.push('slug_version_differs_from_live_endpoint');
  }

  return {
    ...row,
    displayedMethod: displayed.httpMethod,
    displayedPath: displayed.endpoint,
    toolMeta,
    serviceMeta,
    liveDoc,
    slug,
    pathParams,
    issues,
  };
}

function splitKnownDocIssues(results) {
  const productFindings = [];
  const knownDocFindings = [];

  for (const result of results) {
    if (result.issues.length === 0) continue;

    const knownIssues = [];
    const productIssues = [];
    for (const issue of result.issues) {
      const knownTools = KNOWN_DOC_ISSUES[issue];
      if (knownTools && knownTools.has(result.toolName)) {
        knownIssues.push(issue);
      } else {
        productIssues.push(issue);
      }
    }

    if (knownIssues.length > 0) {
      knownDocFindings.push({
        ...result,
        issues: knownIssues,
      });
    }
    if (productIssues.length > 0) {
      productFindings.push({
        ...result,
        issues: productIssues,
      });
    }
  }

  return { productFindings, knownDocFindings };
}

function renderReport(results) {
  const total = results.length;
  const { productFindings, knownDocFindings } = splitKnownDocIssues(results);
  const clean = total - productFindings.length;
  const issueCounts = new Map();
  for (const result of productFindings) {
    for (const issue of result.issues) {
      issueCounts.set(issue, (issueCounts.get(issue) || 0) + 1);
    }
  }

  const lines = [];
  lines.push('# Live Docs Audit');
  lines.push('');
  lines.push(`- Date: \`2026-03-12\``);
  lines.push(`- Audited rows: \`${total}\``);
  lines.push(`- Clean rows: \`${clean}\``);
  lines.push(`- Rows with product issues: \`${productFindings.length}\``);
  lines.push(`- Rows with known doc-site anomalies: \`${knownDocFindings.length}\``);
  lines.push('');
  lines.push('## Issue Summary');
  lines.push('');
  if (issueCounts.size === 0) {
    lines.push('No product-side issues detected.');
  } else {
    lines.push('| Issue | Count |');
    lines.push('| --- | ---: |');
    for (const [issue, count] of [...issueCounts.entries()].sort((a, b) => b[1] - a[1])) {
      lines.push(`| \`${issue}\` | ${count} |`);
    }
  }
  lines.push('');
  lines.push('## Product Findings');
  lines.push('');
  if (productFindings.length === 0) {
    lines.push('No product-side issues detected.');
  } else {
    lines.push('| Tool | Service Method | Displayed Endpoint | Live Doc Endpoint | Issues | Doc URL |');
    lines.push('| --- | --- | --- | --- | --- | --- |');
    for (const result of productFindings) {
      const live = result.liveDoc.httpMethod && result.liveDoc.endpoint
        ? `\`${result.liveDoc.httpMethod} ${result.liveDoc.endpoint}\``
        : '`PARSE_FAILED`';
      const issues = result.issues.map((x) => `\`${x}\``).join(', ');
      lines.push(`| \`${result.toolName}\` | \`${result.serviceMethod}\` | \`${result.displayedEndpoint}\` | ${live} | ${issues} | ${result.documentationUrl} |`);
    }
  }
  lines.push('');
  lines.push('## Known Doc-Site Anomalies');
  lines.push('');
  if (knownDocFindings.length === 0) {
    lines.push('No known doc-site anomalies recorded.');
  } else {
    lines.push('| Tool | Service Method | Displayed Endpoint | Live Doc Endpoint | Issues | Doc URL |');
    lines.push('| --- | --- | --- | --- | --- | --- |');
    for (const result of knownDocFindings) {
      const live = result.liveDoc.httpMethod && result.liveDoc.endpoint
      ? `\`${result.liveDoc.httpMethod} ${result.liveDoc.endpoint}\``
      : '`PARSE_FAILED`';
      const issues = result.issues.map((x) => `\`${x}\``).join(', ');
      lines.push(`| \`${result.toolName}\` | \`${result.serviceMethod}\` | \`${result.displayedEndpoint}\` | ${live} | ${issues} | ${result.documentationUrl} |`);
    }
  }
  return lines.join('\n') + '\n';
}

async function main() {
  const rows = parseApiToolMap(MAP_FILE);
  const { toolIndex, serviceIndex } = buildCodeIndex();

  const results = await mapWithConcurrency(rows, 8, async (row) => {
    let liveDoc = { heading: null, title: null, httpMethod: null, endpoint: null };
    try {
      const html = await fetchHtml(row.documentationUrl);
      liveDoc = extractLiveDoc(html);
    } catch (error) {
      return classifyResult(
        row,
        toolIndex.get(row.toolName) || null,
        serviceIndex.get(row.serviceMethod) || null,
        { ...liveDoc, fetchError: String(error) },
      );
    }
    return classifyResult(
      row,
      toolIndex.get(row.toolName) || null,
      serviceIndex.get(row.serviceMethod) || null,
      liveDoc,
    );
  });

  fs.writeFileSync(JSON_FILE, JSON.stringify(results, null, 2) + '\n');
  fs.writeFileSync(REPORT_FILE, renderReport(results));
  console.log(`Wrote ${REPORT_FILE}`);
  console.log(`Wrote ${JSON_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
