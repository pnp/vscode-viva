/* eslint-disable no-unused-vars */
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