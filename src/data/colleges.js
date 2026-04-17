// CampusVibe — College domain mapping for email verification
// Maps institutional email domains to college metadata

export const COLLEGE_DOMAINS = {
  // IITs
  'iitd.ac.in': { name: 'IIT Delhi', city: 'New Delhi', type: 'IIT' },
  'iitb.ac.in': { name: 'IIT Bombay', city: 'Mumbai', type: 'IIT' },
  'iitm.ac.in': { name: 'IIT Madras', city: 'Chennai', type: 'IIT' },
  'iitk.ac.in': { name: 'IIT Kanpur', city: 'Kanpur', type: 'IIT' },
  'iitkgp.ac.in': { name: 'IIT Kharagpur', city: 'Kharagpur', type: 'IIT' },
  'iith.ac.in': { name: 'IIT Hyderabad', city: 'Hyderabad', type: 'IIT' },
  'iitg.ac.in': { name: 'IIT Guwahati', city: 'Guwahati', type: 'IIT' },
  'iitr.ac.in': { name: 'IIT Roorkee', city: 'Roorkee', type: 'IIT' },

  // BITS
  'pilani.bits-pilani.ac.in': { name: 'BITS Pilani', city: 'Pilani', type: 'Private' },
  'goa.bits-pilani.ac.in': { name: 'BITS Goa', city: 'Goa', type: 'Private' },
  'hyderabad.bits-pilani.ac.in': { name: 'BITS Hyderabad', city: 'Hyderabad', type: 'Private' },

  // VIT, SRM, Manipal
  'vitstudent.ac.in': { name: 'VIT Vellore', city: 'Vellore', type: 'Private' },
  'srmist.edu.in': { name: 'SRM Institute of Science and Technology', city: 'Chennai', type: 'Private' },
  'learner.manipal.edu': { name: 'Manipal Institute of Technology', city: 'Manipal', type: 'Private' },

  // Delhi State Universities
  'dtu.ac.in': { name: 'Delhi Technological University', city: 'New Delhi', type: 'State' },
  'nsut.ac.in': { name: 'Netaji Subhas University of Technology', city: 'New Delhi', type: 'State' },

  // IIITs
  'iiitd.ac.in': { name: 'IIIT Delhi', city: 'New Delhi', type: 'IIIT' },
  'iiit.ac.in': { name: 'IIIT Hyderabad', city: 'Hyderabad', type: 'IIIT' },

  // NITs
  'nitt.edu': { name: 'NIT Trichy', city: 'Tiruchirappalli', type: 'NIT' },
  'nitw.ac.in': { name: 'NIT Warangal', city: 'Warangal', type: 'NIT' },
  'nitk.edu.in': { name: 'NIT Karnataka', city: 'Surathkal', type: 'NIT' },
  'mnnit.ac.in': { name: 'MNNIT Allahabad', city: 'Prayagraj', type: 'NIT' },

  // Central Universities
  'du.ac.in': { name: 'University of Delhi', city: 'New Delhi', type: 'Central' },
  'jnu.ac.in': { name: 'Jawaharlal Nehru University', city: 'New Delhi', type: 'Central' },
  'bhu.ac.in': { name: 'Banaras Hindu University', city: 'Varanasi', type: 'Central' },

  // Other Private
  'christuniversity.in': { name: 'Christ University', city: 'Bangalore', type: 'Private' },
  'thapar.edu': { name: 'Thapar Institute of Engineering & Technology', city: 'Patiala', type: 'Private' },
  'lnmiit.ac.in': { name: 'LNMIIT Jaipur', city: 'Jaipur', type: 'Private' },
  'pes.edu': { name: 'PES University', city: 'Bangalore', type: 'Private' },
  'bennett.edu.in': { name: 'Bennett University', city: 'Greater Noida', type: 'Private' },

  // IIMs
  'iimb.ac.in': { name: 'IIM Bangalore', city: 'Bangalore', type: 'IIM' },
  'iima.ac.in': { name: 'IIM Ahmedabad', city: 'Ahmedabad', type: 'IIM' },
  'iimcal.ac.in': { name: 'IIM Calcutta', city: 'Kolkata', type: 'IIM' },

  // Law Schools
  'nls.ac.in': { name: 'National Law School of India University', city: 'Bangalore', type: 'Law' },
  'nalsar.ac.in': { name: 'NALSAR University of Law', city: 'Hyderabad', type: 'Law' },
};

// Match an email domain to a college, allowing department subdomains.
// Examples:
//   'iitr.ac.in'         -> IIT Roorkee  (exact)
//   'ma.iitr.ac.in'      -> IIT Roorkee  (subdomain)
//   'cse.iitb.ac.in'     -> IIT Bombay   (subdomain)
//   'ee.pilani.bits-pilani.ac.in' -> BITS Pilani (deep subdomain)
export function findCollegeByDomain(emailDomain) {
  if (!emailDomain) return null;
  const d = emailDomain.toLowerCase();
  if (COLLEGE_DOMAINS[d]) return { domain: d, ...COLLEGE_DOMAINS[d] };
  const parts = d.split('.');
  for (let i = 1; i < parts.length - 1; i++) {
    const suffix = parts.slice(i).join('.');
    if (COLLEGE_DOMAINS[suffix]) return { domain: suffix, ...COLLEGE_DOMAINS[suffix] };
  }
  return null;
}

// Given an email, return the root college domain (e.g. "ma.iitr.ac.in" -> "iitr.ac.in").
export function rootCollegeDomain(emailDomain) {
  const match = findCollegeByDomain(emailDomain);
  return match?.domain || null;
}

export default COLLEGE_DOMAINS;
