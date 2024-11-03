import type { Preview } from '@storybook/react';
import '../app/styles/tailwind.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			options: {
				dark: {
					name: 'dark',
					value: '#525252',
				},
				light: {
					name: 'light',
					value: '#f7f9f2',
				},
			},
		},
	},
};

export default preview;
