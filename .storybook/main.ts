import { mergeConfig } from 'vite';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: [
		'../stories/**/*.mdx',
		'../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	addons: [
		'@storybook/addon-onboarding',
		'@storybook/addon-essentials',
		'@chromatic-com/storybook',
		'@storybook/addon-interactions',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {
			builder: {
				viteConfigPath: 'vite.storybook.config.ts',
			},
		},
	},
	core: {
		builder: '@storybook/builder-vite',
	},
	async viteFinal(config) {
		 // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode'],
      },
			resolve: {
				alias: {
					// prettier-ignore
					"@remix-run/react/dist/components": "@remix-run/react/dist/esm/components",
					'.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
				},
			},
    });
	}
};
export default config;
