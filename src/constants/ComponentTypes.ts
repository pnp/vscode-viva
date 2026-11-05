// eslint-disable-next-line no-shadow
export enum ComponentType {
  adaptiveCardExtension = 'adaptiveCardExtension',
  webPart = 'webpart',
  library = 'library',
  extension = 'extension',
  copilotComponent = 'copilotComponent',
}

export const ComponentTypes = [
  {
    name: 'Web Part',
    value: ComponentType.webPart,
    description:
      'SharePoint Framework (SPFx) client-side web parts are built with modern tools and frameworks, and can be deployed to modern and classic SharePoint pages. They are the building blocks of pages that appear on a SharePoint site. They also enable extending Microsoft Teams tabs, providing powerful ways to enhance both SharePoint and Teams.'

  },
  {
    name: 'Extension',
    value: ComponentType.extension,
    description:
      'SharePoint Framework (SPFx) Extensions lets you enhance SharePoint user experience by customizing toolbars, list views, forms, and notifications. They work with frameworks like React and Angular, and include four main types: Application Customizers, Field Customizers, Command Sets, and Form Customizers.'
  },
  {
    name: 'Library',
    value: ComponentType.library,
    description:
      'SharePoint Framework (SPFx) library is a component that allows you to create and share reusable code across multiple components within a tenant, providing a way to manage and reference common functionality.'
  },
  {
    name: 'Adaptive Card Extension',
    value: ComponentType.adaptiveCardExtension,
    description:
      'ACEs are the primary way to extend Viva Connections and SharePoint. They use the Adaptive Card Framework with a JSON schema to create a unified UI, managed by Microsoft, allowing you to focus on business logic.',
  },
  {
    name: 'Copilot Component',
    value: ComponentType.copilotComponent,
    description:
      'The SharePoint Framework Copilot Component lets you build interactive user experiences that render directly on the Microsoft 365 Copilot canvas. The component can bring a real UI, such as cards, forms, actions, and business data, into the conversation, providing a more engaging and interactive user experience.'
  }
];