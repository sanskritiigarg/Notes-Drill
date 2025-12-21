import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scal-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace: flex-nowrap';

  const variantStyles = {
    primary:
      'bg-linear-to-r  from-primary to-accent shadow-md shadow-secondary hover:from-secondary hover:to-primary hover:shadow-lg',
    secondary: 'bg-light',
    outline: 'bg-white',
  };

  const sizeStyles = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-5 text-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[baseStyles, variantStyles[variant], sizeStyles[size], className].join(' ')}
    >
      {children}
    </button>
  );
};

export default Button;
