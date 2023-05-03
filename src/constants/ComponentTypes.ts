export enum ComponentType {
  adaptiveCardExtension = 'adaptiveCardExtension',
  webPart = 'webpart',
  library = 'library',
  extension = 'extension',
}

export const ComponentTypes = [
  {
    name: 'WebPart',
    value: ComponentType.webPart
  },
  {
    name: 'Extension',
    value: ComponentType.extension
  },
  {
    name: 'Library',
    value: ComponentType.library
  },
  {
    name: 'Adaptive Card Extension',
    value: ComponentType.adaptiveCardExtension
  }
];