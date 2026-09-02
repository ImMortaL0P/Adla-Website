import fs from 'fs';
import path from 'path';

let file = path.join(process.cwd(), 'src', 'components', 'layout', 'Header.tsx');
let content = fs.readFileSync(file, 'utf8');

// Change scrolled background
content = content.replace(
  /'border-b border-\[hsl\(var\(--border\)\)\] bg-\[hsl\(var\(--background\)\)\/0\.85\] backdrop-blur-md'/,
  "'border-b border-[hsl(var(--border))] bg-[hsl(var(--primary-strong))] dark:bg-[hsl(var(--background))/0.85] backdrop-blur-md text-white dark:text-foreground'"
);

// We need to change text-[hsl(var(--foreground))] to text-white dark:text-[hsl(var(--foreground))] in the Header file.
// We also need to change text-[hsl(var(--muted-foreground))] to text-white/80 dark:text-[hsl(var(--muted-foreground))]
content = content.replace(/text-\[hsl\(var\(--foreground\)\)\]/g, 'text-white dark:text-[hsl(var(--foreground))]');
content = content.replace(/text-\[hsl\(var\(--muted-foreground\)\)\]/g, 'text-white/80 dark:text-[hsl(var(--muted-foreground))]');
content = content.replace(/hover:bg-\[hsl\(var\(--muted\)\)\]/g, 'hover:bg-black/10 dark:hover:bg-[hsl(var(--muted))]');
content = content.replace(/bg-\[hsl\(var\(--muted\)\)\]/g, 'bg-black/10 dark:bg-[hsl(var(--muted))]');
// Fix the mobile nav menu button text color
// The ThemeToggle and LanguageToggle text colors are also handled by the global replacement above.

fs.writeFileSync(file, content, 'utf8');
console.log("Updated Header.tsx");
