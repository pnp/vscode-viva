import * as React from 'react';


export interface IFormHeaderProps {
    isNewProject: boolean;
}

export const FormHeader: React.FunctionComponent<IFormHeaderProps> = ({ isNewProject }: React.PropsWithChildren<IFormHeaderProps>) => {
    const title = isNewProject ? 'Create a new SPFx project' : 'Extend an existing SPFx project with a new component';

    return (
        <div className={'text-center mb-6'}>
            <h1 className="text-2xl">{title}</h1>
        </div>
    );
};