import * as React from 'react';


export interface ICounterProps {
  itemsCount: number;
}

export const Counter: React.FunctionComponent<ICounterProps> = ({ itemsCount }: React.PropsWithChildren<ICounterProps>) => {
  return (
    <div className={'text-right w-full mb-1'}>
      { itemsCount } samples found
    </div>
  );
};