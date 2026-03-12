
const fs = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, '../src/tools');
const MD_FILE = path.join(__dirname, '../docs/api_tool_map.md');

function getDefinedTools() {
  const tools = new Set();
  const files = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('Tools.ts'));
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(TOOLS_DIR, file), 'utf-8');
    const regex = /name:\s*'([^']+)'/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      tools.add(match[1]);
    }
  }
  return tools;
}

function getDocumentedTools() {
  const tools = new Set();
  if (!fs.existsSync(MD_FILE)) return tools;
  
  const content = fs.readFileSync(MD_FILE, 'utf-8');
  // Markdown links like [`tool_name`](...)
  const regex = /\[`([^`]+)`\]\(\.\.\/src\/tools\//g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    tools.add(match[1]);
  }
  return tools;
}

const defined = getDefinedTools();
const documented = getDocumentedTools();

console.log(`Defined tools: ${defined.size}`);
console.log(`Documented tools: ${documented.size}`);

const missing = [...defined].filter(x => !documented.has(x));
if (missing.length > 0) {
  console.log('Missing tools in documentation:', missing);
} else {
  console.log('No missing tools found.');
}
