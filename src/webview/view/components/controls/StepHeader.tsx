import * as React from 'react';


export interface IStepHeaderProps {
    step: number;
    title: string;
}

export const StepHeader: React.FunctionComponent<IStepHeaderProps> = ({ step, title }: React.PropsWithChildren<IStepHeaderProps>) => {
    return (
        <div className={'border-b pb-2 mb-6'}>
            <label className={'text-xl border mt-4 rounded-full px-3 py-1 bg-vscode absolute'}>{step}</label>
            <div className={'pl-10'}>
                <p className={'text-lg'}>{title}</p>
            </div>
        </div>
    );
};