import * as React from "react";
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from "react-router-dom";
import { WebviewType } from "../WebviewType";
import { App } from "./components/App";
import "./index.css";

export const paths: { [pathName: string ]: string } = {
  aCESample: "/sp-dev-fx-aces-samples",
  aCEScenario: "/sp-dev-fx-aces-scenarios",
  extensionSample: "/sp-dev-fx-extensions-samples",
  webpartSample: "/sp-dev-fx-webparts-samples"
};

export const routeEntries: { [routeKey: string]: string } = {
  [WebviewType.ACESampleGallery]: paths.aCESample,
  [WebviewType.ACEScenarioGallery]: paths.aCEScenario,
  [WebviewType.ExtensionSampleGallery]: paths.extensionSample,
  [WebviewType.WebpartSampleGallery]: paths.webpartSample
};

const elm = document.querySelector('#root');
if (elm) {
  const root = createRoot(elm);

  const version = elm.getAttribute('data-version');
  const type = elm.getAttribute('data-type');

  const routeEntry = Object.keys(routeEntries).findIndex(key => key === type);

  root.render(
    <MemoryRouter 
      initialEntries={Object.keys(routeEntries).map(key => routeEntries[key] as string) as string[]}
      initialIndex={routeEntry || 0}>
      <App version={version} type={type as WebviewType | null} />
    </MemoryRouter>
  );
}

// Webpack HMR
if ((module as any).hot) (module as any).hot.accept();