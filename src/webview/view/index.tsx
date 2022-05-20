import * as React from "react";
import { createRoot } from 'react-dom/client';
import { WebviewType } from "../WebviewType";
import { App } from "./components/App";
import "./index.css";

const elm = document.querySelector('#root');
if (elm) {
  const root = createRoot(elm);

  const version = elm.getAttribute('data-version');
  const type = elm.getAttribute('data-type');

  root.render(<App version={version} type={type as WebviewType | null} />);
}

// Webpack HMR
if ((module as any).hot) (module as any).hot.accept();