// eslint-disable-next-line no-shadow
export enum ExtensionType {
  application = 'ApplicationCustomizer',
  field = 'FieldCustomizer',
  listViewCommandSet = 'ListViewCommandSet',
  formCustomizer = 'FormCustomizer',
  searchQueryModifier = 'SearchQueryModifier'
}

export const ExtensionTypes = [
  {
    name: 'Application Customizer',
    value: ExtensionType.application,
    templates: [],
    description: "Customizes the appearance and behavior of pages."
  },
  {
    name: 'Field Customizer',
    value: ExtensionType.field,
    templates: ['No framework', 'React', 'Minimal'],
    description: "Modifies the way fields are displayed in lists."
  },
  {
    name: 'ListView Command Set',
    value: ExtensionType.listViewCommandSet,
    templates: [],
    description: "Adds custom commands to list view toolbars."
  },
  {
    name: 'Form Customizer',
    value: ExtensionType.formCustomizer,
    templates: ['No framework', 'React'],
    description: "Customizes the look and feel of forms."
  },
  {
    name: 'Search Query Modifier',
    value: ExtensionType.searchQueryModifier,
    templates: [],
    description: "Modifies search queries to enhance search results."
  }
];