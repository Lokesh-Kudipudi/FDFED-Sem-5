const fs = require('fs');
const path = require('path');

const dir = './backend/Controller';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const results = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  // Match `const functionName = async (req, res)` or `exports.functionName = `
  const matches = [...content.matchAll(/(?:const|let|var|async function)\s+([a-zA-Z0-9_]+)\s*=?\s*(?:async)?\s*(?:\([^)]*\))?\s*(?:=>|\{)/g)];
  results[file] = matches.map(m => m[1]).filter(name => !["require", "const", "let", "var"].includes(name));
}
console.log(JSON.stringify(results, null, 2));
