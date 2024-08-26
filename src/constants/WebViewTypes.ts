// eslint-disable-next-line no-shadow
export enum WebViewType {
  samplesGallery = 'samplesGallery',
  workflowForm = 'workflowForm',
  scaffoldForm = 'scaffoldForm',
  registerEntraAppRegistration = 'registerEntraAppRegistration'
}

export const WebViewTypes = [
  {
    Title: 'CI/CD Workflow',
    homePageUrl: '/scaffold-workflow',
    value: WebViewType.workflowForm
  },
  {
    Title: 'Sample Gallery',
    homePageUrl: '/sp-dev-fx-samples',
    value: WebViewType.samplesGallery
  },
  {
    Title: 'Scaffold Form',
    homePageUrl: '/scaffold-form',
    value: WebViewType.scaffoldForm
  },
  {
    Title: 'Register Entra App',
    homePageUrl: '/register-entra-app',
    value: WebViewType.registerEntraAppRegistration
  }
];