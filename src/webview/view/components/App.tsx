import * as React from 'react';
import { WebviewType } from '../../WebviewType';
import { Route, Routes } from "react-router-dom";
import { useEffect } from 'react';
import { GalleryView } from './gallery';
import { Messenger } from '@estruyf/vscode/dist/client';
import { EventData } from '@estruyf/vscode/dist/models/EventData';
import { WebviewCommand } from '../../../constants';
import { useNavigate } from "react-router-dom";
import { paths, routeEntries } from '..';


export interface IAppProps {
  version: string | null;
  type: WebviewType | null;
}



export const App: React.FunctionComponent<IAppProps> = ({ version, type }: React.PropsWithChildren<IAppProps>) => {
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
    }
  }, []);

  return (
    <Routes>
      <Route path={paths.sample} element={<GalleryView type={`samples`} />} />
      <Route path={paths.scenario} element={<GalleryView type={`scenarios`} />} />
    </Routes>
  );
};