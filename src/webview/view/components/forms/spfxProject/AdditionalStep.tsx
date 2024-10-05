import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { StepHeader } from './StepHeader';
import { PackageSelector } from './PackageSelector';
import { WebviewCommand } from '../../../../../constants';
import { Messenger } from '@estruyf/vscode/dist/client';

interface AdditionalStepProps {
    shouldRunInit: boolean;
    setShouldRunInit: (value: boolean) => void;
    shouldInstallReusablePropertyPaneControls: boolean;
    setShouldInstallReusablePropertyPaneControls: (value: boolean) => void;
    shouldInstallReusableReactControls: boolean;
    setShouldInstallReusableReactControls: (value: boolean) => void;
    shouldInstallPnPJs: boolean;
    setShouldInstallPnPJs: (value: boolean) => void;
    shouldCreateNodeVersionFile: boolean;
    setShouldCreateNodeVersionFile: (value: boolean) => void;
    nodeVersionManagerFile: '.nvmrc' | '.node-version';
    setNodeVersionManagerFile: (value: '.nvmrc' | '.node-version') => void;
}

export const AdditionalStep: React.FunctionComponent<AdditionalStepProps> = ({
    shouldRunInit,
    setShouldRunInit,
    shouldInstallReusablePropertyPaneControls,
    setShouldInstallReusablePropertyPaneControls,
    shouldInstallReusableReactControls,
    setShouldInstallReusableReactControls,
    shouldInstallPnPJs,
    setShouldInstallPnPJs,
    shouldCreateNodeVersionFile,
    setShouldCreateNodeVersionFile,
    setNodeVersionManagerFile
}: React.PropsWithChildren<AdditionalStepProps>) => {

    const getCreateNodeVersionFileDefaultValue = React.useCallback(() => {
        Messenger.send(WebviewCommand.toVSCode.createNodeVersionFileDefaultValue, {});
    }, []);

    const getNodeVersionManagerFile = React.useCallback(() => {
        Messenger.send(WebviewCommand.toVSCode.nodeVersionManagerFile, {});
    }, []);

    React.useEffect(() => {
        const messageListener = (event: MessageEvent<any>) => {
            const { command, payload } = event.data;
            if (command === WebviewCommand.toWebview.createNodeVersionFileDefaultValue) {
                setShouldCreateNodeVersionFile(payload);
            }
        };

        Messenger.listen(messageListener);

        return () => {
            Messenger.unlisten(messageListener);
        };
    }, [setShouldCreateNodeVersionFile]);

    React.useEffect(() => {
        const messageListener = (event: MessageEvent<any>) => {
            const { command, payload } = event.data;
            if (command === WebviewCommand.toWebview.nodeVersionManagerFile) {
                setNodeVersionManagerFile(payload);
            }
        };

        Messenger.listen(messageListener);

        return () => {
            Messenger.unlisten(messageListener);
        };
    }, [setNodeVersionManagerFile]);

    getCreateNodeVersionFileDefaultValue();
    getNodeVersionManagerFile();

    // TODO: Check the selected node version manager from settings

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
                <PackageSelector value={shouldInstallReusablePropertyPaneControls}
                    setValue={setShouldInstallReusablePropertyPaneControls}
                    label='Install reusable property pane controls'
                    link='https://pnp.github.io/sp-dev-fx-property-controls/' />

                <PackageSelector
                    value={shouldInstallReusableReactControls}
                    setValue={setShouldInstallReusableReactControls}
                    label='Install reusable React controls'
                    link='https://pnp.github.io/sp-dev-fx-controls-react/' />

                <PackageSelector
                    value={shouldInstallPnPJs}
                    setValue={setShouldInstallPnPJs}
                    label='Install PnPjs (@pnp/sp, @pnp/graph)'
                    link='https://pnp.github.io/pnpjs/' />

                <PackageSelector
                    value={shouldCreateNodeVersionFile}
                    setValue={setShouldCreateNodeVersionFile}
                    label='Create Node version file' />
            </div>
        </div>
    );
};