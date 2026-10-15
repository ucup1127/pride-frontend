import { Link } from 'react-router-dom';

// Satu tombol untuk semua kebutuhan: tautan internal (to), tautan luar (href), atau tombol biasa.
export default function Button({
  to,
  href,
  variant = 'outline',
  size,
  block = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    variant !== 'outline' && `btn--${variant}`,
    size && `btn--${size}`,
    block && 'btn--block',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
