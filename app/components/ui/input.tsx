import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '#app/utils/misc.tsx';

const inputVariants = cva(
  'h-10 border p-2.5 font-primary text-caption file:border-0 file:bg-transparent file:text-base file:font-medium disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-state-error md:text-sm md:file:text-sm focus-visible:outline focus-visible:outline-1',
  {
    variants: {
      variant: {
        default: 'rounded-full',
        box: 'rounded-lg',
      },
      colors: {
        gray: 'bg-transparent text-mono-700 border-mono-700 placeholder:text-mono-600 focus-visible:border-mono-900 focus-visible:outline-base-black',
        black: 'bg-transparent text-base-black border-base-black placeholder:text-mono-700',
        white: 'bg-transparent text-base-white border-base-white',
        whiteFull: 'bg-base-white text-base-black border-base-black',
      },
      variantSize: {
        full: 'w-full flex',
        inline: 'w-64 flex-inline',
        inlineSmall: 'w-32 flex-inline',
      },
    },
    defaultVariants: {
      variant: 'default',
      colors: 'gray',
      variantSize: 'full',
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, colors, variantSize, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, colors, variantSize, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
