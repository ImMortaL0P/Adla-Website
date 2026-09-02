import fs from 'fs';
import path from 'path';

let appFile = path.join(process.cwd(), 'src', 'App.tsx');
let appContent = fs.readFileSync(appFile, 'utf8');
appContent = appContent.replace(/\.\/pages\/AboutPrincipal/, './pages/AboutHeadMaster');
fs.writeFileSync(appFile, appContent, 'utf8');

let homeFile = path.join(process.cwd(), 'src', 'pages', 'Home.tsx');
let homeContent = fs.readFileSync(homeFile, 'utf8');
homeContent = homeContent.replace(/@\/components\/home\/PrincipalMessage/, '@/components/home/HeadMasterMessage');
fs.writeFileSync(homeFile, homeContent, 'utf8');

console.log("Updated imports.");
