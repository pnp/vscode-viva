import * as React from 'react';
import { WebviewType } from '../../WebviewType';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useMemo } from 'react';
import { SamplesView } from './samples';

export interface IAppProps {
  version: string | null;
  type: WebviewType | null;
}

export const App: React.FunctionComponent<IAppProps> = ({ version, type }: React.PropsWithChildren<IAppProps>) => {
  const routeEntries: { [routeKey: string]: string } = {
    [WebviewType.SampleGallery]: "/sample-gallery"
  };

  const routeEntry = useMemo(() => {
    return Object.keys(routeEntries).findIndex(key => key === type);
  }, [type]);

  return (
    <MemoryRouter 
      initialEntries={Object.keys(routeEntries).map(key => routeEntries[key] as string) as string[]}
      initialIndex={routeEntry || 0}>
      <Routes>
        <Route path="/sample-gallery" element={<SamplesView />} />
      </Routes>
    </MemoryRouter>
  );
};