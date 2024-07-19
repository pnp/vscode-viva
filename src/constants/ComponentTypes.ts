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
      "A reusable component for displaying content and functionality on SharePoint pages."

  },
  {
    name: 'Extension',
    value: ComponentType.extension,
    description:
      "Custom scripts that enhance or modify the SharePoint or Teams UI."
  },
  {
    name: 'Library',
    value: ComponentType.library,
    description:
      "A collection of files and documents with collaboration and version control features."
  },
  {
    name: 'Adaptive Card Extension',
    value: ComponentType.adaptiveCardExtension,
    description:
      "Components that render adaptive cards in SharePoint or Teams for flexible and interactive content.",
  }
];