import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '#app/utils/misc.tsx'

const inputVariants = cva(
	'flex h-10 w-full border p-2.5 font-primary text-caption file:border-0 file:bg-transparent file:text-base file:font-medium disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-state-error md:text-sm md:file:text-sm focus-visible:outline focus-visible:outline-1',
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
		},
		defaultVariants: {
			variant: 'default',
			colors: 'gray',
		},
	},
);

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, variant, colors, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants({ variant, colors, className }),
				)}
				ref={ref}
				{...props}
			/>
		)
	},
)
Input.displayName = 'Input'

export { Input }
