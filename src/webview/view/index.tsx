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
};

const elm = document.querySelector('#root');
if (elm) {
  const root = createRoot(elm);

  const homePageUrl = elm.getAttribute('data-homePageUrl');
  const spfxPackageName = elm.getAttribute('data-spfxPackageName');
  const appCatalogUrls = elm.getAttribute('data-appCatalogUrls');
  const type = elm.getAttribute('data-type');
  const isNewProject = elm.getAttribute('data-isNewProject');
  const nodeVersion = elm.getAttribute('data-nodeVersion');
  const data: any = {};

  if (spfxPackageName) {
    data.spfxPackageName = spfxPackageName;
  }

  if (appCatalogUrls) {
    data.appCatalogUrls = appCatalogUrls;
  }

  if (isNewProject) {
    data.isNewProject = isNewProject;
  }

  if (nodeVersion) {
    data.nodeVersion = nodeVersion;
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