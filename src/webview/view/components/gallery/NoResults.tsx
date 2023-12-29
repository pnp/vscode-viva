import * as React from 'react';


export interface INoResultsProps {
}

export const NoResults: React.FunctionComponent<INoResultsProps> = ({ }: React.PropsWithChildren<INoResultsProps>) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center h-16">
        <p className='mt-4 text-xl'>No samples found.</p>
      </div>
    </div>
  );
};