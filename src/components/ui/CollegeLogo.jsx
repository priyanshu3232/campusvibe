import { getCollegeLogo } from '../../data/collegeLogos';

const sizes = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export default function CollegeLogo({ domain, size = 'sm', className = '' }) {
  const logo = getCollegeLogo(domain);
  if (!logo) return null;

  return (
    <img
      src={logo}
      alt=""
      className={`${sizes[size] || sizes.sm} object-contain shrink-0 ${className}`}
      loading="lazy"
    />
  );
}
