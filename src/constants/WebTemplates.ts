export enum WebTemplate {
  Group = 'GROUP#0',
  SitePagePublishing = 'SITEPAGEPUBLISHING#0',
  ModernTeamSite = 'STS#3',
  ClassicTeamSite = 'STS#0',
  BlankInternetSite = 'BLANKINTERNET#0'
}

export const WebTemplates = [
  {
    name: 'Clear',
    value: '',
    template: '',
    description: 'Apply to all sites'
  },
  {
    name: 'Group associated team site',
    value: WebTemplate.Group,
    template: WebTemplate.Group,
    description: 'Modern team sites connected to Microsoft 365 Groups'
  },
  {
    name: 'Communication site',
    value: WebTemplate.SitePagePublishing,
    template: WebTemplate.SitePagePublishing,
    description: 'Modern communication sites for broadcasting information'
  },
  {
    name: 'Modern team site without a group',
    value: WebTemplate.ModernTeamSite,
    template: WebTemplate.ModernTeamSite,
    description: 'Modern team sites without Microsoft 365 Groups'
  },
  {
    name: 'Classic team site',
    value: WebTemplate.ClassicTeamSite,
    template: WebTemplate.ClassicTeamSite,
    description: 'Classic team sites with standard collaboration features'
  },
  {
    name: 'Classic publishing site',
    value: WebTemplate.BlankInternetSite,
    template: WebTemplate.BlankInternetSite,
    description: 'Classic publishing sites for publishing web pages'
  }
];