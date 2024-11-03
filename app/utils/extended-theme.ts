import { type Config } from 'tailwindcss'

export const extendedTheme = {
	colors: {
		border: 'hsl(var(--border))',
		input: {
			DEFAULT: 'hsl(var(--input))',
			invalid: 'hsl(var(--input-invalid))',
		},
		ring: {
			DEFAULT: 'hsl(var(--ring))',
			invalid: 'hsl(var(--foreground-destructive))',
		},
		background: 'hsl(var(--background))',
		foreground: {
			DEFAULT: 'hsl(var(--foreground))',
			destructive: 'hsl(var(--foreground-destructive))',
		},
		primary: {
			DEFAULT: 'hsl(var(--primary))',
			foreground: 'hsl(var(--primary-foreground))',
		},
		secondary: {
			DEFAULT: 'hsl(var(--secondary))',
			foreground: 'hsl(var(--secondary-foreground))',
		},
		destructive: {
			DEFAULT: 'hsl(var(--destructive))',
			foreground: 'hsl(var(--destructive-foreground))',
		},
		muted: {
			DEFAULT: 'hsl(var(--muted))',
			foreground: 'hsl(var(--muted-foreground))',
		},
		accent: {
			DEFAULT: 'hsl(var(--accent))',
			foreground: 'hsl(var(--accent-foreground))',
		},
		popover: {
			DEFAULT: 'hsl(var(--popover))',
			foreground: 'hsl(var(--popover-foreground))',
		},
		card: {
			DEFAULT: 'hsl(var(--card))',
			foreground: 'hsl(var(--card-foreground))',
		},
	},
	borderColor: {
		DEFAULT: 'hsl(var(--border))',
	},
	borderRadius: {
		lg: 'var(--radius)',
		md: 'calc(var(--radius) - 2px)',
		sm: 'calc(var(--radius) - 4px)',
	},
	fontSize: {
		// 1rem = 16px
		/** 80px size / 84px high / bold */
		mega: ['5rem', { lineHeight: '5.25rem', fontWeight: '700' }],

		/** 36px size / 120% high / bold */
		h1: ['2.25rem', { lineHeight: '120%', fontWeight: '700' }],
		/** 32px size / 120% high / bold */
		h2: ['2rem', { lineHeight: '120%', fontWeight: '700' }],
		/** 28px size / 120% high / bold */
		h3: ['1.75rem', { lineHeight: '120%', fontWeight: '700' }],
		/** 25px size / 120% high / bold */
		h4: ['1.563rem', { lineHeight: '120%', fontWeight: '700' }],
		/** 22px size / 120% high / bold */
		h5: ['1.375rem', { lineHeight: '120%', fontWeight: '700' }],
		/** 14px size / 120% high / bold */
		h6: ['0.875rem', { lineHeight: '120%', fontWeight: '700' }],
		/** 12px size / 120% high / bold */
		h7: ['0.75rem', { lineHeight: '120%', fontWeight: '700' }],


		/** 18px size / 120% high / normal */
		'body-1': ['1.125rem', { lineHeight: '120%' }],
		/** 16px size / 120% high / normal */
		'body-2': ['1rem', { lineHeight: '120%' }],
		/** 14px size / 120% high / normal */
		'body-3': ['0.875rem', { lineHeight: '120%' }],
		/** 14px size / 120% high / bold */
		'body-4': ['0.875rem', { lineHeight: '120%', fontWeight: 700 }],
		/** 12px size / 120% high / normal */
		'body-5': ['0.75rem', { lineHeight: '120%' }],
		/** 12px size / 120% high / bold */
		'body-6': ['0.75rem', { lineHeight: '120%', fontWeight: 700 }],

		/** 12px size / 120% high / regular */
		caption: ['0.75rem', { lineHeight: '120%', fontWeight: '400' }],
		/** 12px size / 120% high / semibold */
		'caption-2': ['0.75rem', { lineHeight: '120%', fontWeight: '600' }],

		/** 12px size / 120% high / medium */
		button: ['1rem', { lineHeight: '120%', fontWeight: '500' }],

		/** 18px size / auto high / medium */
		subtitle: ['1.125rem', { lineHeight: 'auto', fontWeight: '500' }],
		/** 12px size / auto high / medium */
		'subtitle-2': ['1rem', { lineHeight: 'auto', fontWeight: '500' }],
	},
	keyframes: {
		'caret-blink': {
			'0%,70%,100%': { opacity: '1' },
			'20%,50%': { opacity: '0' },
		},
	},
	animation: {
		'caret-blink': 'caret-blink 1.25s ease-out infinite',
	},
} satisfies Config['theme']
