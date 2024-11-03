import { type Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import radixPlugin from 'tailwindcss-radix'
import { marketingPreset } from './app/routes/_marketing+/tailwind-preset'
import { extendedTheme } from './app/utils/extended-theme.ts'

export default {
	content: ['./app/**/*.{ts,tsx,jsx,js}'],
	darkMode: 'class',
	theme: {
		colors: {
			base: {
				primary: '#4058A0',
				secondary: '#FF6339',
				tertiary: '#DEE21B',
				black: '#0E0E0E',
				white: '#F6FBF4',
			},
			primary: {
				100: '#d9deec',
				200: '#b3bcd9',
				300: '#8c9bc6',
				400: '#6679b3',
				500: '#4058a0',
				600: '#334680',
				700: '#263560',
				800: '#1a2340',
				900: '#0d1220',
			},
			secondary: {
				100: '#ffe0d7',
				200: '#ffc1b0',
				300: '#ffa188',
				400: '#ff8261',
				500: '#ff6339',
				600: '#cc4f2e',
				700: '#993b22',
				800: '#662817',
				900: '#33140b',
			},
			tertiary: {
				100: '#f8f9d1',
				200: '#f2f3a4',
				300: '#ebee76',
				400: '#e5e849',
				500: '#dee21b',
				600: '#b2b516',
				700: '#858810',
				800: '#595a0b',
				900: '#2c2d05',
			},
      mono: {
        100: '#F6FBF4',
        200: '#FFFFFF',
        300: '#F9F9F9',
        400: '#EDEDED',
        500: '#CBCBCB',
        600: '#ADADAD',
        700: '#717171',
        800: '#353535',
        900: '#0E0E0E',
      },
      state: {
        'error': '#F96D63',
        'error-light': '#FED4C1',
        'success': '#388916',
        'success-light': '#CAF3A1',
        'warning': '#F8A828',
        'warning-light': '#FEE7A8',
        'info': '#05B5BF',
        'info-light': '#97F8E5',
      }
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
    fontFamily: {
      primary: ['Montserrat', 'sans-serif'],
      secondary: ['Aqrada', 'serif'],
    },
		extend: extendedTheme,
	},
	presets: [marketingPreset],
	plugins: [animatePlugin, radixPlugin],
} satisfies Config
