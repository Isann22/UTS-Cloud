import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm',
          'bg-white text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all',
          'focus:bg-white',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
          {
            'border-gray-300 focus:border-green-500 focus:ring-green-500': !error,
            'border-red-500 focus:border-red-500 focus:ring-red-500': error,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
