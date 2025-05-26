// eslint-disable-next-line no-shadow
export enum FrameworkType {
  none = 'none',
  react = 'react',
  minimal = 'minimal',
}

export const FrameworkTypes = [
  {
    name: 'No framework',
    value: FrameworkType.none,
    description:
      'Use any library or write pure JavaScript for maximum flexibility.'
  },
  {
    name: 'React',
    value: FrameworkType.react,
    description:
      'Popular library for building dynamic and responsive UI components.'
  },
  {
    name: 'Minimal',
    value: FrameworkType.minimal,
    description:
      'Lightweight setup with minimal dependencies for straightforward functionality.'
  },
];