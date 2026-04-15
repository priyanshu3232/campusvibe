// CampusVibe — College logo mapping
// Maps college email domains to their logo files in /public/logos/colleges/
// Usage: import { getCollegeLogo, COLLEGE_LOGOS } from '../data/collegeLogos'

export const COLLEGE_LOGOS = {
  // IITs
  'iitd.ac.in': '/logos/colleges/iit-delhi.png',
  'iitb.ac.in': '/logos/colleges/iit-bombay.png',
  'iitk.ac.in': '/logos/colleges/iit-kanpur.png',
  'iitkgp.ac.in': '/logos/colleges/iit-kharagpur.png',
  'iitg.ac.in': '/logos/colleges/iit-guwahati.png',
  'iitr.ac.in': '/logos/colleges/iit-roorkee.png',

  // Other colleges with logos
  'bhu.ac.in': '/logos/colleges/bhu.png',
  'iitbhilai.ac.in': '/logos/colleges/iit-bhilai.jpg',
};

// Helper: get logo path by email domain, college name, or return null
export function getCollegeLogo(identifier) {
  if (!identifier) return null;

  // Direct domain match
  if (COLLEGE_LOGOS[identifier]) {
    return COLLEGE_LOGOS[identifier];
  }

  // Match by college name (e.g., "IIT Delhi" → iitd.ac.in)
  const nameMatch = Object.entries(COLLEGE_LOGOS).find(([domain]) => {
    const name = domainToName[domain];
    return name && name.toLowerCase() === identifier.toLowerCase();
  });

  return nameMatch ? nameMatch[1] : null;
}

// Reverse mapping: domain → college name (for name-based lookups)
const domainToName = {
  'iitd.ac.in': 'IIT Delhi',
  'iitb.ac.in': 'IIT Bombay',
  'iitk.ac.in': 'IIT Kanpur',
  'iitkgp.ac.in': 'IIT Kharagpur',
  'iitg.ac.in': 'IIT Guwahati',
  'iitr.ac.in': 'IIT Roorkee',
  'bhu.ac.in': 'Banaras Hindu University',
  'iitbhilai.ac.in': 'IIT Bhilai',
};

// Helper: get logo by college name string
export function getCollegeLogoByName(collegeName) {
  if (!collegeName) return null;
  const entry = Object.entries(domainToName).find(
    ([, name]) => name.toLowerCase() === collegeName.toLowerCase()
  );
  return entry ? COLLEGE_LOGOS[entry[0]] : null;
}

export default COLLEGE_LOGOS;
