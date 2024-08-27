import * as React from 'react';


export interface IRegisterEntraAppRegViewProps { }

export const RegisterEntraAppRegView: React.FunctionComponent<IRegisterEntraAppRegViewProps> = ({ }: React.PropsWithChildren<IRegisterEntraAppRegViewProps>) => {
  return (
    <div className={'w-full h-full max-w-2xl mx-auto py-16 sm:px-6 lg:px-16'}>
        Entra App
    </div>
  );
};