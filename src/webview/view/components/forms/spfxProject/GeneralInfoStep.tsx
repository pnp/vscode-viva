import * as React from 'react';
import { useEffect, useCallback } from 'react';
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { ComponentType, WebviewCommand } from '../../../../../constants';
import { FolderIcon } from '../../icons';
import { StepHeader } from './StepHeader';
import { Messenger } from '@estruyf/vscode/dist/client';
import { LabelWithTooltip } from '../../controls';


export interface IGeneralInfoProps {
    isNewProject: boolean;
    folderPath: string;
    setFolderPath: (folderPath: string) => void;
    solutionName: string;
    setSolutionName: (value: string) => void;
    isValidSolutionName: boolean | null | undefined;
    setIsValidSolutionName: (value: boolean | null) => void;
    setComponentType: (componentType: ComponentType) => void;
    componentTypes: { value: string; name: string; description: string }[];
    componentType: ComponentType;
}

export const GeneralInfoStep: React.FunctionComponent<IGeneralInfoProps> = ({
    isNewProject,
    folderPath,
    setFolderPath,
    solutionName,
    setSolutionName,
    isValidSolutionName,
    setIsValidSolutionName,
    setComponentType,
    componentTypes,
    componentType
  }: React.PropsWithChildren<IGeneralInfoProps>) => {

    const pickFolder = useCallback(() => {
        Messenger.send(WebviewCommand.toVSCode.pickFolder, {});
    }, []);

    const validateSolutionName = useCallback((solutionNameInput: string) => {
        setSolutionName(solutionNameInput);
        if (!solutionNameInput) {
            setIsValidSolutionName(null);
            return;
        }

        Messenger.send(WebviewCommand.toVSCode.validateSolutionName, { folderPath, solutionNameInput });
    }, [folderPath, setSolutionName, setIsValidSolutionName]);

    useEffect(() => {
        const messageListener = (event: MessageEvent<any>) => {
            const { command, payload } = event.data;
            if (command === WebviewCommand.toWebview.folderPath) {
                setFolderPath(payload);
                if (solutionName) {
                    Messenger.send(WebviewCommand.toVSCode.validateSolutionName, {
                        folderPath: payload,
                        solutionName: solutionName
                    });
                }
            }
            if (command === WebviewCommand.toWebview.validateSolutionName) {
                setIsValidSolutionName(payload);
            }
        };

        Messenger.listen(messageListener);

        return () => {
            Messenger.unlisten(messageListener);
        };
    }, [setFolderPath, setSolutionName]);
    const getComponentType = componentTypes.find((component) => component.value === componentType);
    return (
        <div className={'spfx__form__step'}>
            <StepHeader step={1} title='General information' />
            <div className={'spfx__form__step__content ml-10'}>
                {
                    isNewProject &&
                    <>
                        <div className={'mb-2'}>
                            <label className={'block mb-1'}>
                                What should be the parent folder where you want to create the project? *
                            </label>
                            <div className={'flex'}>
                                <div className={'w-4/5'}>
                                    <VSCodeTextField disabled className={'w-full'} value={folderPath} />
                                </div>
                                <div className={'w-1/5'}>
                                    <VSCodeButton className={'w-full'} appearance={'secondary'} onClick={pickFolder}>
                                        <span slot={'start'}><FolderIcon /></span>
                                        Folder
                                    </VSCodeButton>
                                </div>
                            </div>
                        </div>
                        <div className={'mb-2'}>
                            <label className={'block mb-1'}>
                                What should be the name of your solution? *
                            </label>
                            <VSCodeTextField className={'w-full'} value={solutionName} onChange={(e: any) => validateSolutionName(e.target.value)} />
                            {
                                isValidSolutionName === false &&
                                <p className={'text-red-500 text-sm mt-1'}>The solution name already exists</p>
                            }
                        </div>
                    </>
                }
                <div className={'mb-2'}>
                    <LabelWithTooltip label={'What component you wish to create?'} tooltip={getComponentType ? getComponentType.description : ''} />
                    <VSCodeDropdown className={'w-full'} onChange={(e: any) => setComponentType(e.target.value)}>
                        {componentTypes.map((component) => <VSCodeOption key={component.value} value={component.value}>{component.name}</VSCodeOption>)}
                    </VSCodeDropdown>
                </div>
            </div>
        </div>
    );
};
