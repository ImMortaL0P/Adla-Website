export const school = {
  name: { en: 'Uccha Madhyamik Vidyalaya Adala', hi: 'उच्च माध्यमिक विद्यालय अदला' },
  shortName: 'UMV Adala',
  type: { en: 'Bihar Government School', hi: 'बिहार सरकारी विद्यालय' },
  classes: '1 to 12',
  address: { en: 'Adla, Naubatpur, Patna District, Bihar — 809011', hi: 'अदला, नौबतपुर, पटना जिला, बिहार — 809011' },
  locality: 'Sarasat, Naubatpur block',
  coordinates: { lat: 25.508267, lng: 84.918096 },
  managedBy: { en: 'Department of Education, Government of Bihar', hi: 'शिक्षा विभाग, बिहार सरकार' },
  
  // PLACEHOLDERS below — TODO: replace with real data when available
  udise: 'XXXXXXXXXXX — to be updated', // TODO: replace
  phone: '+91 XXXXX XXXXX', // TODO: replace
  email: 'contact@umvadala.example', // TODO: replace
  principal: { name_en: 'Principal Name — to be updated', name_hi: 'प्रधानाचार्य का नाम — अद्यतन किया जाना है' }, // TODO: replace
  established: '2008',
  studentCount: '240+',
  teacherCount: 0, // TODO: replace
  officeHours: { en: 'Monday–Saturday, 10:00 AM – 4:00 PM', hi: 'सोमवार-शनिवार, सुबह 10:00 – शाम 4:00' }, // TODO: replace
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
