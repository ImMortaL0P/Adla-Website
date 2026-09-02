import fs from 'fs';
import path from 'path';

let file = path.join(process.cwd(), 'src', 'data', 'content.ts');
let content = fs.readFileSync(file, 'utf8');

// drop milestones
content = content.replace(/\/\/ Placeholder milestones[\s\S]*?\}\)\),\n/g, '');

// drop midDayMeal from facilitiesList
content = content.replace(/  \{\n    icon: 'Utensils',\n    key: 'midDayMeal',\n    desc: \{\n      en: 'Hot cooked meals served under the Government Mid-Day Meal Scheme.',\n      hi: 'सरकारी मध्याह्न भोजन योजना के अंतर्गत गर्म पका हुआ भोजन।',\n    \},\n  \},\n/, '');

// Admission Content - process:
// Not changing process

// Admission Content - Documents:
let documentsReplacement = `documents: [
    { en: 'Aadhaar card (student, father, and mother)', hi: 'आधार कार्ड (विद्यार्थी, पिता और माता)' },
    { en: 'Transfer Certificate (TC) (Mandatory)', hi: 'स्थानांतरण प्रमाण पत्र (TC) (अनिवार्य)' },
    { en: 'Previous class mark sheet / report card (Mandatory)', hi: 'पिछली कक्षा की अंकसूची (अनिवार्य)' },
    { en: 'Income certificate (Mandatory)', hi: 'आय प्रमाण पत्र (अनिवार्य)' },
    { en: 'Residence proof (Mandatory)', hi: 'निवास प्रमाण (अनिवार्य)' },
    { en: 'Caste certificate (Mandatory)', hi: 'जाति प्रमाण पत्र (अनिवार्य)' },
    { en: 'PEN Number', hi: 'पेन नंबर (PEN Number)' },
    { en: 'UDISE of previous School', hi: 'पिछले विद्यालय का UDISE' },
    { en: 'APAAR ID', hi: 'अपार आईडी (APAAR ID)' },
    { en: 'Student ID (E-Siksha Kosh)', hi: 'विद्यार्थी आईडी (ई-शिक्षा कोष)' },
  ],`;
content = content.replace(/documents: \[[^\]]*\],/m, documentsReplacement);

// Fee rows:
let feeRowsReplacement = `feeRows: [
    { head_en: 'All Fees', head_hi: 'सभी शुल्क', value_en: 'As per current government norms.', value_hi: 'वर्तमान सरकारी मानदंडों के अनुसार।' },
  ],`;
content = content.replace(/feeRows: \[[^\]]*\],/m, feeRowsReplacement);

// importantDates (session starts)
content = content.replace(/\{ label_en: 'Session begins', label_hi: 'सत्र प्रारंभ', date: 'To be announced' \},/, "{ label_en: 'Session begins', label_hi: 'सत्र प्रारंभ', date: 'April, Every Calendar Year' },");

// disclosureSections
content = content.replace(/'XXXXXXXXXXX — to be updated'/, "'10280606804'");
content = content.replace(/\{ label_en: 'Head of Institution', label_hi: 'संस्था प्रमुख', value: 'To be updated' \},/, "{ label_en: 'Head of Institution', label_hi: 'संस्था प्रमुख', value: 'Chandan Kumar' },");
content = content.replace(/\{ label_en: 'No. of Teaching Staff', label_hi: 'शिक्षण स्टाफ की संख्या', value: 'To be updated' \},/, "{ label_en: 'No. of Teaching Staff', label_hi: 'शिक्षण स्टाफ की संख्या', value: '15' },");
content = content.replace(/\{ label_en: 'No. of Non-Teaching Staff', label_hi: 'गैर-शिक्षण स्टाफ की संख्या', value: 'To be updated' \},/, "{ label_en: 'No. of Non-Teaching Staff', label_hi: 'गैर-शिक्षण स्टाफ की संख्या', value: '2' },");
// drop mid-day meal from disclosure facilities
content = content.replace(/\s*\{ label_en: 'Mid-Day Meal', label_hi: 'मध्याह्न भोजन', value: 'To be updated' \},/, "");

fs.writeFileSync(file, content, 'utf8');
console.log("Updated content.ts");
