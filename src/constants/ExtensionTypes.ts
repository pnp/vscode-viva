export enum ExtensionType {
  Application = "ApplicationCustomizer",
  field = "FieldCustomizer",
  listViewCommandSet = "ListViewCommandSet"
}

export const ExtensionTypes = [
  {
    name: 'Application Customizer',
    value: ExtensionType.Application,
    templates: []
  },
  {
    name: 'Field Customizer',
    value: ExtensionType.field,
    templates: ['react', 'minimal']
  },
  {
    name: 'ListView Command Set',
    value: ExtensionType.listViewCommandSet,
    templates: []
  },
];