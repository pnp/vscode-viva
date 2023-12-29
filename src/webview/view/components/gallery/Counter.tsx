import * as React from 'react';


export interface ICounterProps {
  itemsCount: number;
}

export const Counter: React.FunctionComponent<ICounterProps> = ({ itemsCount }: React.PropsWithChildren<ICounterProps>) => {
  return (<label className={'float-right mt-1'}>{ itemsCount } samples found</label>);
};