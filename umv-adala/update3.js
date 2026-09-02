import fs from 'fs';
import path from 'path';

let headerFile = path.join(process.cwd(), 'src', 'components', 'layout', 'Header.tsx');
let headerContent = fs.readFileSync(headerFile, 'utf8');
headerContent = headerContent.replace(/<SchoolLogo className="h-12" \/>/, '<SchoolLogo className="h-16" />');
fs.writeFileSync(headerFile, headerContent, 'utf8');

let footerFile = path.join(process.cwd(), 'src', 'components', 'layout', 'Footer.tsx');
let footerContent = fs.readFileSync(footerFile, 'utf8');
footerContent = footerContent.replace(/<SchoolLogo className="h-12" \/>/, '<SchoolLogo className="h-16" />');
// Fix email display
let emailReplacement = `{school.email.split(',').map((email, i) => (
                  <span key={email.trim()} className="block">
                    <a href={\`mailto:\${email.trim()}\`} className="hover:text-[hsl(var(--primary-strong))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:rounded">
                      {email.trim()}
                    </a>
                  </span>
                ))}`;
footerContent = footerContent.replace(/<a href=\{`mailto:\$\{school.email\}`\}[\s\S]*?<\/a>/, emailReplacement);
fs.writeFileSync(footerFile, footerContent, 'utf8');

console.log("Updated logos and email links");
