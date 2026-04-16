import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ErrorMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

const ErrorMessage = forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  ({ className, message, children, ...props }, ref) => {
    if (!message && !children) return null;

    return (
      <p
        ref={ref}
        className={clsx('text-sm text-red-600', className)}
        role="alert"
        {...props}
      >
        {message || children}
      </p>
    );
  }
);

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;
