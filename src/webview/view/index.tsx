import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { App } from './components/App';
import './index.css';


export const routeEntries: { [routeKey: string]: string } = { ['SampleGallery']: '/sp-dev-fx-samples' };

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
      <App version={version} />
    </MemoryRouter>
  );
}

// Webpack HMR
if ((module as any).hot) {
  (module as any).hot.accept();
}