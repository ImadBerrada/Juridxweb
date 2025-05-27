const fs = require('fs');
const path = require('path');

const files = [
  'src/app/api/testimonials/[id]/route.ts',
  'src/app/api/users/[id]/route.ts',
  'src/app/api/contact/[id]/route.ts',
  'src/app/api/newsletter/[id]/route.ts'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the params type
    content = content.replace(
      /params: \{ id: string \}/g,
      'params: Promise<{ id: string }>'
    );
    
    // Add await params destructuring after the function signature
    content = content.replace(
      /(export async function \w+\([^)]+\) \{\s*try \{)/g,
      '$1\n    const { id } = await params;'
    );
    
    // Replace params.id with id
    content = content.replace(/params\.id/g, 'id');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
});

console.log('All API routes fixed!'); 