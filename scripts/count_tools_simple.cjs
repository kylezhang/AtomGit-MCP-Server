const fs = require('fs');
const path = require('path');

const toolsDir = path.join(process.cwd(), 'src', 'tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('Tools.ts'));

let totalTools = 0;
const categories = {};

console.log('Counting tools...');

files.forEach(file => {
  const content = fs.readFileSync(path.join(toolsDir, file), 'utf-8');
  // Match name: 'foo' or name: "foo"
  const matches = content.match(/name:\s*['"][^'"]+['"]/g);
  if (matches) {
    const count = matches.length;
    totalTools += count;
    const category = file.replace('Tools.ts', '');
    categories[category] = count;
    console.log(`${category}: ${count}`);
  } else {
    console.log(`${file}: 0`);
  }
});

console.log('----------------');
console.log('Total Tools:', totalTools);
