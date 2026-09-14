const fs = require('fs');
const file = '../src/pages/staff/StaffDirectory.tsx';
let code = fs.readFileSync(file, 'utf8');

// we need to bring in getSystemImage hook
if (!code.includes('useImages')) {
  code = code.replace("import { useStaff }", "import { useImages }\nimport { useStaff }");
}

code = code.replace("  const { staffList } = useStaff()", "  const { staffList } = useStaff()\n  const { getSystemImage } = useImages()\n  const hmImage = getSystemImage('headmaster_photo')");

code = code.replace("const portrait = member.imageUrl || member.photo_url", "const roleStr = (member.role_en || member.designation?.en || '').toLowerCase()\n              const isHM = roleStr.includes('headmaster') || roleStr.includes('principal')\n              const portrait = member.imageUrl || member.photo_url || (isHM ? hmImage : null)");

fs.writeFileSync(file, code);
