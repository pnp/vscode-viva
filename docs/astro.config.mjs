// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	base: '/vscode-viva/',
	output: 'static',
	integrations: [
		starlight({
			title: 'SPFx Toolkit',
			description: 'SPFx Toolkit is a Visual Studio Code extension that helps you build and manage SharePoint Framework projects with ease.',
			logo: {
				src: './../assets/logo.svg',
			},
			customCss: ['./src/styles/docs.css'],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/pnp/vscode-viva' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/YtYrav2VGW' },
				{ icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/m365pnp' },
				{ icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/playlist?list=PLR9nK3mnD-OVKlm8lyeFuuHmiouR-u40a' },
				{ icon: 'open-book', label: 'Microsoft 365 & Power Platform Community Website', href: 'https://pnp.github.io/' }
			],
			sidebar: [
				{
					label: 'Home',
					link: '/',
				},
				{
					label: 'Get Started',
					link: 'guides/getting-started',
				},
				{
					label: 'Welcome Experience',
					link: 'guides/welcome-experience',
				},
				{
					label: 'Toolkit Features',
					items: [
						{ label: 'Validate and set up a local workspace', link: 'features/setup-workspace' },
						{ label: 'Scaffolding', link: 'features/scaffolding' },
						{ label: 'Login to your tenant & retrieve environment details', link: 'features/login-tenant' },
						{ label: 'Gulp Tasks', link: 'features/gulp-tasks' },
						{ label: 'Actions', link: 'features/actions' },
						{ label: 'App Management', link: 'features/app-management' },
					],
				},
				{
					label: 'Extended Capabilities',
					items: [
						{ label: 'SPFx Toolkit Chat Participant', link: 'guides/chat-participant' },
						{ label: 'Coding Snippets', link: 'guides/snippets' },
						{ label: 'Microsoft 365 Agents Toolkit Integration', link: 'guides/microsoft365-agents-toolkit' }
					],
				},
				{
					label: 'Support & Contribution',
					items: [
						{ label: 'Technical reference & contributing guidance', link: 'guides/contributing-guidance' },
						{ label: 'Help & Feedback', link: 'guides/help-feedback' },
					],
				},
				{
					label: 'Marketing Resources',
					link: 'reference/marketing-resources',
				},
			]

		}),
		tailwind({ applyBaseStyles: false }),
	],
});
