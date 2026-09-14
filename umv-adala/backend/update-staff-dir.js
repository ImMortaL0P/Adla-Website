const fs = require('fs');
const file = '../src/pages/staff/StaffDirectory.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `const filters: Array<{ value: Department | 'all'; labelKey: string }> = [
  { value: 'all', labelKey: 'staff.filter.all' },
  { value: 'maths_science', labelKey: 'staff.filter.mathsScience' },
  { value: 'languages', labelKey: 'staff.filter.languages' },
  { value: 'social_science', labelKey: 'staff.filter.socialScience' },
  { value: 'administration', labelKey: 'staff.filter.administration' },
  { value: 'support', labelKey: 'staff.filter.support' },
]`,
  `const filters: Array<{ value: string; labelKey: string }> = [
  { value: 'all', labelKey: 'staff.filter.all' },
  { value: 'maths_science', labelKey: 'staff.filter.mathsScience' },
  { value: 'languages', labelKey: 'staff.filter.languages' },
  { value: 'social_science', labelKey: 'staff.filter.socialScience' },
  { value: 'commerce', labelKey: 'staff.filter.commerce' },
  { value: 'arts', labelKey: 'staff.filter.arts' },
  { value: 'administration', labelKey: 'staff.filter.administration' },
  { value: 'support', labelKey: 'staff.filter.support' },
]`
);

code = code.replace(
  `const [activeFilter, setActiveFilter] = useState<Department | 'all'>('all')`,
  `const [activeFilter, setActiveFilter] = useState<string>('all')`
);

const oldFiltered = `  const filtered = useMemo(() => {
    // If backend staff array is empty but we're not loading, it'll return empty.
    // If it's loaded, use the API objects. Note the field differences.
    const active = staffList;
    const byDept = activeFilter === 'all'
      ? active
      : activeFilter === 'support'
        ? active.filter((s: any) => s.type === 'support' || s.department === 'support')
        : active.filter((s: any) => s.type !== 'support'); // Simplification since DB schema has teaching/support

    const q = query.trim().toLowerCase()
    if (!q) return byDept
    return byDept.filter((s: any) => {
      const name = (lang === 'en' ? (s.name_en || s.name?.en) : (s.name_hi || s.name?.hi) || '').toLowerCase()
      const role = (lang === 'en' ? (s.role_en || s.designation?.en) : (s.role_hi || s.designation?.hi) || '').toLowerCase()
      return name.includes(q) || role.includes(q)
    })
  }, [activeFilter, query, lang, staffList])`;

const newFiltered = `  const filtered = useMemo(() => {
    const active = staffList || [];
    const getCat = (s: any) => {
      const isSupport = s.type === 'support' || s.department === 'support';
      const role = (s.role_en || s.designation_en || s.designation?.en || '').toLowerCase();
      
      if (isSupport) {
         if (role.includes('clerk') || role.includes('accountant') || role.includes('headmaster')) return 'administration';
         return 'support';
      }
      
      if (role.includes('headmaster') || role.includes('principal') || role.includes('clerk')) return 'administration';
      
      if (role.includes('math') || role.includes('physics') || role.includes('chemistry') || role.includes('biology') || role.includes('zoology') || role.includes('science') || role.includes('computer')) return 'maths_science';
      if (role.includes('english') || role.includes('hindi') || role.includes('sanskrit') || role.includes('urdu')) return 'languages';
      if (role.includes('business') || role.includes('entrepreneurship') || role.includes('commerce') || role.includes('accountancy')) return 'commerce';
      if (role.includes('music') || role.includes('art') || role.includes('sport') || role.includes('physical')) return 'arts';
      
      // social_science covers S.ST, History, Geography, etc.
      if (role.includes('s. st') || role.includes('history') || role.includes('geography') || role.includes('civics') || role.includes('social')) return 'social_science';
      
      // Fallback for generic teachers could be spread or put into all
      return 'social_science'; // Or return a default
    }

    const byDept = activeFilter === 'all'
      ? active
      : active.filter((s: any) => getCat(s) === activeFilter);

    const q = query.trim().toLowerCase()
    if (!q) return byDept
    return byDept.filter((s: any) => {
      const name = (lang === 'en' ? (s.name_en || s.name?.en) : (s.name_hi || s.name?.hi) || '').toLowerCase()
      const role = (lang === 'en' ? (s.role_en || s.designation?.en) : (s.role_hi || s.designation?.hi) || '').toLowerCase()
      return name.includes(q) || role.includes(q)
    })
  }, [activeFilter, query, lang, staffList])`;

code = code.replace(oldFiltered, newFiltered);
fs.writeFileSync(file, code);
