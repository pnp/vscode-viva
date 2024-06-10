// eslint-disable-next-line no-shadow
export enum FrameworkType {
  none = 'none',
  react = 'react',
  minimal = 'minimal',
}

export const FrameworkTypes = [
  {
    name: 'No framework',
    value: FrameworkType.none
  },
  {
    name: 'React',
    value: FrameworkType.react
  },
  {
    name: 'Minimal',
    value: FrameworkType.minimal
  },
];