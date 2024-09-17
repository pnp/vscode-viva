// eslint-disable-next-line no-shadow
export enum ComponentType {
  adaptiveCardExtension = 'adaptiveCardExtension',
  webPart = 'webpart',
  library = 'library',
  extension = 'extension',
}

export const ComponentTypes = [
  {
    name: 'Web Part',
    value: ComponentType.webPart,
    description:
      "SharePoint client-side web parts run in the browser, are built with modern tools and frameworks, and can be deployed to modern and classic SharePoint pages. They also enable extending Microsoft Teams tabs, providing powerful ways to enhance both SharePoint and Teams."

  },
  {
    name: 'Extension',
    value: ComponentType.extension,
    description:
      "SPFx Extensions let you enhance SharePoint's user experience by customizing toolbars, list views, forms, and notifications. They work with frameworks like React and Angular, and include four main types: Application Customizers, Field Customizers, Command Sets, and Form Customizers."
  },
  {
    name: 'Library',
    value: ComponentType.library,
    description:
      "A SharePoint Framework (SPFx) library is a component that allows you to create and share reusable code across multiple components within a tenant, providing a way to manage and reference common functionality."
  },
  {
    name: 'Adaptive Card Extension',
    value: ComponentType.adaptiveCardExtension,
    description:
      "ACEs are the primary way to extend Viva Connections and SharePoint. They use the Adaptive Card Framework with a JSON schema to create a unified UI, managed by Microsoft, allowing you to focus on business logic.",
  }
];