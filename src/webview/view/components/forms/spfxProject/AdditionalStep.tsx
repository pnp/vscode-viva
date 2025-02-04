import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { StepHeader } from './StepHeader';
import { PackageSelector } from './PackageSelector';
import { ComponentType, ExtensionType, WebviewCommand } from '../../../../../constants';
import { Messenger } from '@estruyf/vscode/dist/client';

interface AdditionalStepProps {
    shouldRunInit: boolean;
    componentType: ComponentType;
    extensionType: ExtensionType;
    componentName: string;
    setShouldRunInit: (value: boolean) => void;
    shouldInstallReusablePropertyPaneControls: boolean;
    setShouldInstallReusablePropertyPaneControls: (value: boolean) => void;
    shouldInstallReusableReactControls: boolean;
    setShouldInstallReusableReactControls: (value: boolean) => void;
    shouldInstallReact: boolean;
    setShouldInstallReact: (value: boolean) => void;
    shouldInstallPnPJs: boolean;
    setShouldInstallPnPJs: (value: boolean) => void;
    shouldInstallSPFxFastServe: boolean;
    setShouldInstallSPFxFastServe: (value: boolean) => void;
    shouldCreateNodeVersionFile: boolean;
    setShouldCreateNodeVersionFile: (value: boolean) => void;
    nodeVersionManager: 'nvm' | 'nvs' | 'none';
    setNodeVersionManager: (value: 'nvm' | 'nvs' | 'none') => void;
    setNodeVersionManagerFile: (value: '.nvmrc' | '.node-version') => void;
}

export const AdditionalStep: React.FunctionComponent<AdditionalStepProps> = ({
    shouldRunInit,
    componentType,
    extensionType,
    componentName,
    setShouldRunInit,
    shouldInstallReusablePropertyPaneControls,
    setShouldInstallReusablePropertyPaneControls,
    shouldInstallReusableReactControls,
    setShouldInstallReusableReactControls,
    shouldInstallReact,
    setShouldInstallReact,
    shouldInstallPnPJs,
    setShouldInstallPnPJs,
    shouldInstallSPFxFastServe,
    setShouldInstallSPFxFastServe,
    shouldCreateNodeVersionFile,
    setShouldCreateNodeVersionFile,
    setNodeVersionManagerFile,
    nodeVersionManager,
    setNodeVersionManager
}: React.PropsWithChildren<AdditionalStepProps>) => {
    // Send a message to retrieve the default value for the create node version file
    const getCreateNodeVersionFileDefaultValue = React.useCallback(() => {
        Messenger.send(WebviewCommand.toVSCode.createNodeVersionFileDefaultValue, {});
    }, []);

    // Send a message to retrieve the node version manager file
    const getNodeVersionManagerFile = React.useCallback(() => {
        Messenger.send(WebviewCommand.toVSCode.nodeVersionManagerFile, {});
    }, []);

    // Send a message to retrieve the node version manager
    const getNodeVersionManager = React.useCallback(() => {
        Messenger.send(WebviewCommand.toVSCode.nodeVersionManager, {});
    }, []);

    // Listen for the response to the message/s
    React.useEffect(() => {
        const messageListener = (event: MessageEvent<any>) => {
            const { command, payload } = event.data;
            switch (command) {
                case WebviewCommand.toWebview.nodeVersionManager:
                    setNodeVersionManager(payload);
                    break;
                case WebviewCommand.toWebview.nodeVersionManagerFile:
                    setNodeVersionManagerFile(payload);
                    break;
                case WebviewCommand.toWebview.createNodeVersionFileDefaultValue:
                    setShouldCreateNodeVersionFile(payload);
                    break;
                default:
                    break;
            }
        };

        Messenger.listen(messageListener);

        return () => {
            Messenger.unlisten(messageListener);
        };
    }, [setNodeVersionManager, setNodeVersionManagerFile, setShouldCreateNodeVersionFile]);

    // Sends the requests to load the settings values only once
    React.useEffect(() => {
        // Get the default value for the create node version file
        getCreateNodeVersionFileDefaultValue();
        // Get the node version manager
        getNodeVersionManager();
        // Get the node version manager file
        getNodeVersionManagerFile();
    }, []);

    return (
        <div className={'spfx__form__step'}>
            <StepHeader step={3} title='Additional steps' />
            <div className={'spfx__form__step__content ml-10'}>
                <div className={'mb-2'}>
                    <label className={'block mb-1'}>
                        Run <code>npm install</code> after the project is created?
                    </label>
                    <VSCodeCheckbox checked={shouldRunInit} onChange={() => setShouldRunInit(!shouldRunInit)} />
                </div>
                {
                    componentType === ComponentType.webPart &&
                    <PackageSelector value={shouldInstallReusablePropertyPaneControls}
                    setValue={setShouldInstallReusablePropertyPaneControls}
                    label='Install reusable property pane controls'
                    link='https://pnp.github.io/sp-dev-fx-property-controls/' />
                }

                {
                    componentType === ComponentType.webPart &&
                    <PackageSelector
                    value={shouldInstallReusableReactControls}
                    setValue={setShouldInstallReusableReactControls}
                    label='Install reusable React controls'
                    link='https://pnp.github.io/sp-dev-fx-controls-react/' />
                }

                {
                    (componentType === ComponentType.extension && extensionType === ExtensionType.application) &&
                    <PackageSelector
                    value={shouldInstallReact}
                    setValue={setShouldInstallReact}
                    label='Install React, ReactDom (@react, @react-dom)'
                    link='https://github.com/facebook/react' />
                }

                <PackageSelector
                    value={shouldInstallPnPJs}
                    setValue={setShouldInstallPnPJs}
                    label='Install PnPjs (@pnp/sp, @pnp/graph)'
                    link='https://pnp.github.io/pnpjs/' />

                <PackageSelector
                    value={shouldInstallSPFxFastServe}
                    setValue={setShouldInstallSPFxFastServe}
                    label='Configure SPFx Fast Serve'
                    link='https://github.com/s-KaiNet/spfx-fast-serve' />

                {nodeVersionManager !== 'none' &&
                    <PackageSelector
                        value={shouldCreateNodeVersionFile}
                        setValue={setShouldCreateNodeVersionFile}
                        label='Create node version manager configuration file' />}
            </div>
        </div>
    );
};