export enum ComponentType {
  AdaptiveCardExtension = 'adaptiveCardExtension',
  WebPart = 'webpart',
  Library = 'library',
  Extension = 'extension',
}

export const ComponentTypes = [
  {
    name: 'WebPart',
    value: ComponentType.WebPart
  },
  {
    name: 'Extension',
    value: ComponentType.Extension
  },
  {
    name: 'Library',
    value: ComponentType.Library
  },
  {
    name: 'Adaptive Card Extension',
    value: ComponentType.AdaptiveCardExtension
  }
];