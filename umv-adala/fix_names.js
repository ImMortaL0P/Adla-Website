import fs from 'fs';
import path from 'path';

let appFile = path.join(process.cwd(), 'src', 'App.tsx');
let appContent = fs.readFileSync(appFile, 'utf8');
appContent = appContent.replace(/AboutHead Master/g, 'AboutHeadMaster');
appContent = appContent.replace(/\.\/pages\/AboutHeadMaster/, './pages/AboutPrincipal'); // keep file name
fs.writeFileSync(appFile, appContent, 'utf8');

let homeFile = path.join(process.cwd(), 'src', 'pages', 'Home.tsx');
let homeContent = fs.readFileSync(homeFile, 'utf8');
homeContent = homeContent.replace(/Head MasterMessage/g, 'HeadMasterMessage');
homeContent = homeContent.replace(/\.\/components\/home\/HeadMasterMessage/, '@/components/home/PrincipalMessage');
fs.writeFileSync(homeFile, homeContent, 'utf8');

let msgFile = path.join(process.cwd(), 'src', 'components', 'home', 'PrincipalMessage.tsx');
let msgContent = fs.readFileSync(msgFile, 'utf8');
msgContent = msgContent.replace(/Head MasterMessage/g, 'HeadMasterMessage');
fs.writeFileSync(msgFile, msgContent, 'utf8');

console.log("Fixed spaces in component names.");
