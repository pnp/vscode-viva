import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { StepHeader } from './StepHeader';
import { PackageSelector } from './PackageSelector';


interface AdditionalStepProps {
    shouldRunInit: boolean;
    setShouldRunInit: (value: boolean) => void;
    shouldInstallReusablePropertyPaneControls: boolean;
    setShouldInstallReusablePropertyPaneControls: (value: boolean) => void;
    shouldInstallReusableReactControls: boolean;
    setShouldInstallReusableReactControls: (value: boolean) => void;
    shouldInstallPnPJs: boolean;
    setShouldInstallPnPJs: (value: boolean) => void;
}

export const AdditionalStep: React.FunctionComponent<AdditionalStepProps> = ({
    shouldRunInit,
    setShouldRunInit,
    shouldInstallReusablePropertyPaneControls,
    setShouldInstallReusablePropertyPaneControls,
    shouldInstallReusableReactControls,
    setShouldInstallReusableReactControls,
    shouldInstallPnPJs,
    setShouldInstallPnPJs }: React.PropsWithChildren<AdditionalStepProps>) => {
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
            </div>
        </div>
    );
};