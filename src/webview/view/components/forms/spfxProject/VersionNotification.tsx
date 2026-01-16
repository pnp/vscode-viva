import * as React from 'react';


export const VersionNotification: React.FunctionComponent<{}> = ({ }: React.PropsWithChildren<{}>) => {
    return (
        <div className={'mb-6 border border-gray-500 p-2'}>
            <p className={'text-sm'}>The scaffolding form is currently aligned only with the latest SharePoint Framework version. If you are using an older version, please use the SharePoint Yeoman generator in the terminal instead.</p>
        </div>
    );
};