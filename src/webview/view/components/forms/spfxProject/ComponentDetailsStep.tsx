import * as React from 'react';
import { useEffect, useCallback } from 'react';
import { VSCodeDropdown, VSCodeOption, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { ComponentType, ComponentTypes, WebviewCommand, ExtensionType, ExtensionTypes, FrameworkTypes, AdaptiveCardTypesNode16, AdaptiveCardTypesNode18 } from '../../../../../constants';
import { StepHeader } from './StepHeader';
import { Messenger } from '@estruyf/vscode/dist/client';


interface IComponentDetailsStepProps {
    isNewProject: boolean;
    componentType: ComponentType;
    componentName: string;
    isValidComponentName: boolean | null | undefined;
    setComponentName: (name: string) => void;
    setIsValidComponentName: (value: boolean | null) => void;
    nodeVersion: string;
    frameworkType: string;
    setFrameworkType: (type: string) => void;
    extensionType: ExtensionType;
    setExtensionType: (type: ExtensionType) => void;
    aceType: string;
    setAceType: (type: string) => void;
}

export const ComponentDetailsStep: React.FunctionComponent<IComponentDetailsStepProps> = ({
    isNewProject,
    componentType,
    componentName,
    isValidComponentName,
    setComponentName,
    setIsValidComponentName,
    nodeVersion,
    frameworkType,
    setFrameworkType,
    extensionType,
    setExtensionType,
    aceType,
    setAceType }: React.PropsWithChildren<IComponentDetailsStepProps>) => {
    const componentTypeName = ComponentTypes.find((component) => component.value === componentType)?.name;

    useEffect(() => {
        const messageListener = (event: MessageEvent<any>) => {
            const { command, payload } = event.data;
            if (command === WebviewCommand.toWebview.validateComponentName) {
                setIsValidComponentName(payload);
            }
        };

        Messenger.listen(messageListener);

        return () => {
            Messenger.unlisten(messageListener);
        };
    }, [setIsValidComponentName]);


    const validateComponentName = useCallback((componentNameInput: string) => {
        setComponentName(componentNameInput);
        if (!componentNameInput) {
            setIsValidComponentName(null);
            return;
        }

        if (isNewProject) {
            setIsValidComponentName(true);
            return;
        }

        Messenger.send(WebviewCommand.toVSCode.validateComponentName, { componentType, componentNameInput });
    }, [setComponentName, setIsValidComponentName, isNewProject, componentType]);

    return (
        <div className={'spfx__form__step'}>
            <StepHeader step={2} title={`${componentTypeName} details`} />
            <div className={'spfx__form__step__content ml-10'}>
                <div className={'mb-2'}>
                    <label className={'block mb-1'}>
                        What should be the name for your {componentTypeName}? *
                    </label>
                    <VSCodeTextField className={'w-full'} value={componentName} onChange={(e: any) => validateComponentName(e.target.value)} />
                    {
                        isValidComponentName === false &&
                        <p className={'text-red-500 text-sm mt-1'}>The component name already exists</p>
                    }
                </div>
                {
                    componentType === 'extension' &&
                    <div className={'mb-2'}>
                        <label className={'block mb-1'}>
                            Which extension type would you like to create?
                        </label>
                        <VSCodeDropdown className={'w-full'} value={extensionType} onChange={(e: any) => setExtensionType(e.target.value)}>
                            {ExtensionTypes.map((type) => <VSCodeOption key={type.value} value={type.value}>{type.name}</VSCodeOption>)}
                        </VSCodeDropdown>
                    </div>
                }
                {
                    componentType === ComponentType.adaptiveCardExtension &&
                    <div className={'mb-2'}>
                        <label className={'block mb-1'}>
                            Which adaptive card extension template do you want to use?
                        </label>
                        <VSCodeDropdown className={'w-full'} value={aceType} onChange={(e: any) => setAceType(e.target.value)}>
                            {nodeVersion === '16' ?
                                AdaptiveCardTypesNode16.map((type) => <VSCodeOption key={type.value} value={type.value}>{type.name}</VSCodeOption>) :
                                AdaptiveCardTypesNode18.map((type) => <VSCodeOption key={type.value} value={type.value}>{type.name}</VSCodeOption>)
                            }
                        </VSCodeDropdown>
                    </div>
                }
                {
                    componentType === ComponentType.webPart &&
                    <div className={'mb-2'}>
                        <label className={'block mb-1'}>
                            Which template would you like to use?
                        </label>
                        <VSCodeDropdown className={'w-full'} value={frameworkType} onChange={(e: any) => setFrameworkType(e.target.value)}>
                            {FrameworkTypes.map((framework) => <VSCodeOption key={framework.value} value={framework.value}>{framework.name}</VSCodeOption>)}
                        </VSCodeDropdown>
                    </div>
                }
                {
                    componentType === ComponentType.extension && ExtensionTypes.find(e => e.value === extensionType)?.templates.some(t => t) &&
                    <div className={'mb-2'}>
                        <label className={'block mb-1'}>
                            Which template would you like to use?
                        </label>
                        <VSCodeDropdown className={'w-full'} value={frameworkType} onChange={(e: any) => setFrameworkType(e.target.value)}>
                            {ExtensionTypes.find(e => e.value === extensionType)?.templates.map((framework) => {
                                const key = FrameworkTypes.find(f => f.name === framework)?.value;
                                return (<VSCodeOption key={key} value={key}>{framework}</VSCodeOption>);
                            }
                            )}
                        </VSCodeDropdown>
                    </div>
                }
            </div>
        </div>
    );
};