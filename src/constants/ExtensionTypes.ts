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
    description: 'Adds scripts to the page, and accesses well-known HTML element placeholders and extends them with custom renderings.'
  },
  {
    name: 'Field Customizer',
    value: ExtensionType.field,
    templates: ['No framework', 'React', 'Minimal'],
    description: 'Provides modified views to data for fields within a list.'
  },
  {
    name: 'ListView Command Set',
    value: ExtensionType.listViewCommandSet,
    templates: [],
    description: 'Extends the SharePoint command surfaces to add new actions, and provides client-side code that you can use to implement behaviors.'
  },
  {
    name: 'Form Customizer',
    value: ExtensionType.formCustomizer,
    templates: ['No framework', 'React'],
    description: 'Provides a way to associate and override default new, edit and view form experience of list and libraries with custom forms by associating component to content type.'
  },
  {
    name: 'Search Query Modifier',
    value: ExtensionType.searchQueryModifier,
    templates: [],
    description: 'Modifies search queries to enhance search results.'
  }
];