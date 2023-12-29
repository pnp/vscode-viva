import * as React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { GalleryView, DetailsView } from './gallery';
import { Messenger } from '@estruyf/vscode/dist/client';
import { EventData } from '@estruyf/vscode/dist/models/EventData';
import { WebviewCommand } from '../../../constants';
import { routeEntries } from '..';


export interface IAppProps {
  version: string | null;
}

// eslint-disable-next-line no-unused-vars
export const App: React.FunctionComponent<IAppProps> = ({ version }: React.PropsWithChildren<IAppProps>) => {
  const navigate = useNavigate();

  const messageListener = (event: MessageEvent<EventData<any>>) => {
    const { command, payload } = event.data;

    if (command === WebviewCommand.toWebview.viewType) {
      navigate(routeEntries[payload]);
    }
  };

  useEffect(() => {
    Messenger.listen(messageListener);

    return () => {
      Messenger.unlisten(messageListener);
    };
  }, []);

  return (
    <Routes>
      <Route path={'/sp-dev-fx-samples'} element={<GalleryView />} />
      <Route path={'/sp-dev-fx-sample-details-view'} element={<DetailsView />} />
    </Routes>
  );
};