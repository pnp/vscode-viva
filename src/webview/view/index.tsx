import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { App } from './components/App';
import './index.css';
import { WebViewType, WebViewTypes } from '../../constants';


export const routeEntries: { [routeKey: string]: string } = {
  [WebViewType.samplesGallery]: WebViewTypes.find(type => type.value === WebViewType.samplesGallery)?.homePageUrl as string,
  [WebViewType.workflowForm]: WebViewTypes.find(type => type.value === WebViewType.workflowForm)?.homePageUrl as string,
  [WebViewType.scaffoldForm]: WebViewTypes.find(type => type.value === WebViewType.scaffoldForm)?.homePageUrl as string,
  [WebViewType.registerEntraAppRegistration]: WebViewTypes.find(type => type.value === WebViewType.registerEntraAppRegistration)?.homePageUrl as string,
};

const elm = document.querySelector('#root');
if (elm) {
  const root = createRoot(elm);

  const homePageUrl = elm.getAttribute('data-homePageUrl');
  const spfxPackageName = elm.getAttribute('data-spfxPackageName');
  const isSignedIn = elm.getAttribute('data-isSignedIn');
  const appCatalogUrls = elm.getAttribute('data-appCatalogUrls');
  const type = elm.getAttribute('data-type');
  const isNewProject = elm.getAttribute('data-isNewProject');
  const data: any = {};

  if (spfxPackageName) {
    data.spfxPackageName = spfxPackageName;
  }

  if (isSignedIn) {
    data.isSignedIn = isSignedIn;
  }

  if (appCatalogUrls) {
    data.appCatalogUrls = appCatalogUrls;
  }

  if (isNewProject !== undefined) {
    data.isNewProject = isNewProject;
  }

  const routeEntry = Object.keys(routeEntries).findIndex(key => key === type);

  root.render(
    <MemoryRouter
      initialEntries={Object.keys(routeEntries).map(key => routeEntries[key] as string) as string[]}
      initialIndex={routeEntry || 0}>
      <App url={homePageUrl} data={data} />
    </MemoryRouter>
  );
}

// Webpack HMR
if ((module as any).hot) {
  (module as any).hot.accept();
}