import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx') || dirPath.endsWith('.html')) {
      callback(dirPath);
    }
  });
}

function updateFiles() {
  const srcDir = path.join(process.cwd(), 'src');
  const filesToUpdate = [];
  walkDir(srcDir, (f) => filesToUpdate.push(f));
  
  // also add index.html if needed
  const indexHtml = path.join(process.cwd(), 'index.html');
  if (fs.existsSync(indexHtml)) {
    filesToUpdate.push(indexHtml);
  }

  filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // 1. Name changes
    content = content.replace(/Adala/g, 'Adla');
    content = content.replace(/adala/gi, match => match === 'adala' ? 'adla' : (match === 'ADALA' ? 'ADLA' : 'Adla'));
    // fix contact email just in case
    content = content.replace(/contact@umvadla\.example/g, 'contact@umvadla.in');

    // 2. Mid day meal
    content = content.replace(/['"]?home\.facilities\.midDayMeal['"]?\s*:\s*['"]?[^'"]*['"]?,?\n?/g, '');
    // remove from facilities strip if it's there
    content = content.replace(/<FacilitiesStrip \/>/g, '<FacilitiesStrip />'); // wait, facilitiesList is in content.ts
    
    // 3. Principal -> Head Master
    content = content.replace(/Principal's/g, "Head Master's");
    content = content.replace(/Principal/g, 'Head Master');
    content = content.replace(/principal/g, 'headMaster');
    content = content.replace(/प्रधानाचार्य/g, 'प्रधानाध्यापक'); // Hindi translation

    // 4. Classes 1 to 12 -> 9 to 12
    content = content.replace(/1 to 12/g, '9 to 12');
    content = content.replace(/1 से 12/g, '9 से 12');
    content = content.replace(/Class 1 to Class 12/g, 'Class 9 to Class 12');
    content = content.replace(/कक्षा 1 से कक्षा 12/g, 'कक्षा 9 से कक्षा 12');

    // 5. Pincode
    content = content.replace(/809011/g, '801109');

    // 6. Established
    content = content.replace(/2008/g, '2020');

    // write back
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
    }
  });

  console.log("Done phase 1");
}

updateFiles();
