// CampusVibe — Input validation utilities

import { COLLEGE_DOMAINS } from '../data/colleges';

/**
 * Validates whether an email belongs to a recognized college domain.
 *
 * @param {string} email
 * @returns {{ valid: boolean, domain: string|null, college: object|null }}
 */
export function validateCollegeEmail(email) {
  const result = { valid: false, domain: null, college: null };

  if (!email || typeof email !== 'string') return result;

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return result;

  const domain = email.split('@')[1].toLowerCase();
  result.domain = domain;

  const college = COLLEGE_DOMAINS[domain] || null;
  if (college) {
    result.valid = true;
    result.college = college;
  }

  return result;
}

/**
 * Returns the college object associated with an email's domain, or null.
 *
 * @param {string} email
 * @returns {object|null}
 */
export function getCollegeFromEmail(email) {
  if (!email || typeof email !== 'string') return null;

  const parts = email.split('@');
  if (parts.length !== 2) return null;

  const domain = parts[1].toLowerCase();
  return COLLEGE_DOMAINS[domain] || null;
}
