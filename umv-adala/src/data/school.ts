export const school = {
  name: { en: 'Uchcha Madhyamik Vidyalaya Adla', hi: 'उच्च माध्यमिक विद्यालय अदला' },
  shortName: 'UMV Adla',
  type: { en: 'Bihar Government School', hi: 'बिहार सरकारी विद्यालय' },
  classes: '9 to 12',
  address: { en: 'Adla, Naubatpur, Patna District, Bihar — 801109', hi: 'अदला, नौबतपुर, पटना जिला, बिहार — 801109' },
  locality: 'Sarasat, Naubatpur block',
  coordinates: { lat: 25.508267, lng: 84.918096 },
  managedBy: { en: 'Department of Education, Government of Bihar', hi: 'शिक्षा विभाग, बिहार सरकार' },
  
  // PLACEHOLDERS below — TODO: replace with real data when available
  udise: '10280606804', // TODO: replace
  phone: '+91 XXXXX XXXXX', // TODO: replace
  email: 'umvadla@gmail.com, contact@umvadla.in', // TODO: replace
  headMaster: { name_en: 'Chandan Kumar', name_hi: 'चंदन कुमार' }, // TODO: replace
  established: '2020',
  studentCount: 190,
  teacherCount: 15, // TODO: replace
  officeHours: { en: 'Monday - Friday 9:30 AM to 4:00 PM and Saturday 9:30 AM to 1:00 PM', hi: 'सोमवार - शुक्रवार सुबह 9:30 से शाम 4:00 और शनिवार सुबह 9:30 से दोपहर 1:00' }, // TODO: replace
} as const

// Straight-line ("as the crow flies") distances from school.coordinates,
// computed via the haversine formula — not road/driving distance.
export const nearbyLandmarks = [
  {
    key: 'airport',
    name: { en: 'Jay Prakash Narayan Airport, Patna', hi: 'जय प्रकाश नारायण हवाई अड्डा, पटना' },
    distanceKm: 19.4,
    icon: 'Plane',
  },
  {
    key: 'railway',
    name: { en: 'Patna Junction Railway Station', hi: 'पटना जंक्शन रेलवे स्टेशन' },
    distanceKm: 25.1,
    icon: 'TrainFront',
  },
  {
    key: 'cityCentre',
    name: { en: 'Gandhi Maidan, Patna (city centre)', hi: 'गांधी मैदान, पटना (शहर केंद्र)' },
    distanceKm: 25.5,
    icon: 'Landmark',
  },
] as const
