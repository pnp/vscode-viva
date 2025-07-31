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
					link: 'getting-started',
				},
				{
					label: 'Scenarios',
					link: 'scenarios',
				},
				{
					label: 'Features',
					items: [
						{ label: 'Welcome experience & Walkthrough', link: 'features/welcome-experience-and-walkthrough' },
						{ label: 'Setup', link: 'features/setup' },
						{ label: 'Sign in', link: 'features/sign-in' },
						// { label: 'Create new project', link: '/' }, //TODO: merge work
						{ label: 'GitHub Copilot Capabilities', link: 'features/github-copilot-capabilities' },
						{ label: 'Actions', link: 'features/actions' },
						{ label: 'Management capabilities', link: 'features/management-capabilities' },
						{ label: 'CI/CD scaffolding', link: 'features/ci-cd' },
						{ label: 'Coding support', link: 'features/coding' },
						{ label: 'Better Together', link: 'features/m365-agents-toolkit' },
					],
				},
				{
					label: 'Support & Contribution',
					link: 'contributing-guidance',
				},
				{
					label: 'Technical insights',
					link: 'technical-insights',
				},
				{
					label: 'About',
					items: [
						{ label: 'Changelog', link: 'about/changelog' },
						{ label: 'Meet the Team', link: 'about/meet-the-team' },
						{ label: 'Telemetry', link: 'about/telemetry' },
						{ label: 'Marketing Resources', link: 'about/marketing-resources' },
						{ label: 'License', link: 'about/license' },
						{ label: 'Code of Conduct', link: 'about/code-of-conduct' },
						{ label: 'Disclaimer', link: 'about/disclaimer' },
					],
				},
			]

		}),
		tailwind({ applyBaseStyles: false }),
	],
});
