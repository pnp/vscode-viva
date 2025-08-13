export enum ListTemplate {
    GenericList = '100',
    DocumentLibrary = '101'
}

export const ListTemplates = [
    {
        name: 'Clear',
        value: '',
        template: '',
        description: 'Apply to all lists'
    },
    {
        name: 'Custom list',
        value: ListTemplate.GenericList,
        template: ListTemplate.GenericList,
        description: 'Generic lists for storing items with custom columns'
    },
    {
        name: 'Document library',
        value: ListTemplate.DocumentLibrary,
        template: ListTemplate.DocumentLibrary,
        description: 'Document library for storing documents'
    }
];