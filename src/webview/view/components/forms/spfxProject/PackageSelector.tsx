import * as React from 'react';
import { VSCodeButton, VSCodeLink } from '@vscode/webview-ui-toolkit/react';


interface PackageSelectorProps {
    value: boolean;
    // eslint-disable-next-line no-unused-vars
    setValue: (value: boolean) => void,
    label: string,
    link?: string
}

export const PackageSelector: React.FunctionComponent<PackageSelectorProps> = ({
    value,
    setValue,
    label,
    link }: React.PropsWithChildren<PackageSelectorProps>) => {

    return (
        <div className={'mb-3'}>
            <VSCodeButton onClick={() => setValue(!value)} appearance={value ? '' : 'secondary'} className={'float-left'}>
                Yes
            </VSCodeButton>
            <VSCodeButton onClick={() => setValue(!value)} appearance={!value ? '' : 'secondary'} className={'float-left'}>
                No
            </VSCodeButton>
            <label className={'ml-2 pt-1 inline-block'}>
                {link ? (
                    <>
                        <VSCodeLink href={link}>{label}</VSCodeLink>
                    </>
                ) : (
                    `${label}`
                )}
            </label>
        </div>
    );
};