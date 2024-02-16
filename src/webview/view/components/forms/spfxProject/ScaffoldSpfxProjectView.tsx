import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeProgressRing, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { AdaptiveCardTypesNode16, AdaptiveCardTypesNode18, ComponentType, ComponentTypes, ExtensionType, ExtensionTypes, FrameworkType, FrameworkTypes, SpfxScaffoldCommandInput, WebviewCommand } from '../../../../../constants';
import { useLocation } from 'react-router-dom';
import { AddIcon, FolderIcon } from '../../icons';
import { Messenger } from '@estruyf/vscode/dist/client';
import { EventData } from '@estruyf/vscode/dist/models/EventData';


export interface IScaffoldSpfxProjectViewProps { }

export const ScaffoldSpfxProjectView: React.FunctionComponent<IScaffoldSpfxProjectViewProps> = ({ }: React.PropsWithChildren<IScaffoldSpfxProjectViewProps>) => {
  const [isNewProject, setIsNewProject] = useState<boolean>(true);
  const [nodeVersion, setNodeVersion] = useState<string>('18');
  const [folderPath, setFolderPath] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isValidName, setIsValidName] = useState<boolean | null>();
  const [componentType, setComponentType] = useState<ComponentType>(ComponentType.webPart);
  const [componentName, setComponentName] = useState<string>('');
  const [frameworkType, setFrameworkType] = useState<string>(FrameworkType.none);
  const [extensionType, setExtensionType] = useState<ExtensionType>(ExtensionType.application);
  const [aceType, setAceType] = useState<string>(AdaptiveCardTypesNode18[0].value);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const location: any = useLocation();
  const componentTypeName = ComponentTypes.find((component) => component.value === componentType)?.name;

  useEffect(() => {
    Messenger.listen(messageListener);

    return () => {
      Messenger.unlisten(messageListener);
    };
  }, []);

  useEffect(() => {
    if (location.state.isNewProject) {
      setIsNewProject(location.state.isNewProject);
    }

    if (location.state.nodeVersion) {
      setNodeVersion(location.state.nodeVersion);
      if (location.state.nodeVersion === '16') {
        setAceType(AdaptiveCardTypesNode16[0].value);
      }
    }
  }, [location]);

  useEffect(() => {
    if (!folderPath || !name || !componentName) {
      setIsFormValid(false);
      return;
    }

    if (!isValidName) {
      setIsFormValid(false);
      return;
    }

    setIsFormValid(true);
  }, [folderPath, name, isValidName, componentName]);

  const messageListener = (event: MessageEvent<EventData<any>>) => {
    const { command, payload } = event.data;

    if (command === WebviewCommand.toWebview.folderPath) {
      setFolderPath(payload);
      if (name) {
        Messenger.send(WebviewCommand.toVSCode.validateSolutionName, {
          folderPath: payload,
          solutionName: name
        });
      }
    }

    if (command === WebviewCommand.toWebview.validateSolutionName) {
      setIsValidName(payload);
    }
  };

  const pickFolder = () => {
    Messenger.send(WebviewCommand.toVSCode.pickFolder, {});
  };

  const validateSolutionName = (solutionName: string) => {
    setName(solutionName);
    if (!solutionName) {
      setIsValidName(null);
      return;
    }

    Messenger.send(WebviewCommand.toVSCode.validateSolutionName, { folderPath, solutionName });
  };

  const submit = () => {
    setIsSubmitting(true);
    Messenger.send(WebviewCommand.toVSCode.createSpfxProject, {
      folderPath,
      name,
      componentType,
      componentName,
      frameworkType,
      extensionType,
      aceType
    } as SpfxScaffoldCommandInput);
  };

  return (
    <div className={'w-full h-full max-w-2xl mx-auto py-16 sm:px-6 lg:px-16'}>
      <div className={'text-center mb-6'}>
        <h1 className={'text-2xl'}>
          {
            isNewProject
              ? 'Create a new SPFx project'
              : 'Extend an existing SPFx project with a new component'
          }
        </h1>
      </div>
      <div className={'spfx__form'}>
        <div className={'spfx__form__step'}>
          <div className={'border-b pb-2 mb-6'}>
            <label className={'text-xl border mt-4 rounded-full px-3 py-1 bg-vscode absolute'}>1</label>
            <div className={'pl-10'}>
              <p className={'text-lg'}>General information</p>
            </div>
          </div>
          <div className={'spfx__form__step__content ml-10'}>
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
              <VSCodeTextField className={'w-full'} value={name} onChange={(e: any) => validateSolutionName(e.target.value)} />
              {
                isValidName === false &&
                <p className={'text-red-500 text-sm mt-1'}>The solution name already exists</p>
              }
            </div>
            <div className={'mb-2'}>
              <label className={'block mb-1'}>
                What component you wish to create?
              </label>
              <VSCodeDropdown className={'w-full'} onChange={(e: any) => setComponentType(e.target.value)}>
                {ComponentTypes.map((component) => <VSCodeOption key={component.value} value={component.value}>{component.name}</VSCodeOption>)}
              </VSCodeDropdown>
            </div>
          </div>
        </div>
        <div className={'spfx__form__step'}>
          <div className={'border-b pb-2 mb-6'}>
            <label className={'text-xl border mt-4 rounded-full px-3 py-1 bg-vscode absolute'}>2</label>
            <div className={'pl-10'}>
              <p className={'text-lg'}>{componentTypeName} details</p>
            </div>
          </div>
          <div className={'spfx__form__step__content ml-10'}>
            <div className={'mb-2'}>
              <label className={'block mb-1'}>
                What should be the name for your {componentTypeName}? *
              </label>
              <VSCodeTextField className={'w-full'} value={componentName} onChange={(e: any) => setComponentName(e.target.value)} />
            </div>
            {
              componentType === 'extension' &&
              <div className={'mb-2'}>
                <label className={'block mb-1'}>
                  Which extension type would you like to create?
                </label>
                <VSCodeDropdown className={'w-full'} onChange={(e: any) => setExtensionType(e.target.value)}>
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
                <VSCodeDropdown className={'w-full'} onChange={(e: any) => setAceType(e.target.value)}>
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
                <VSCodeDropdown className={'w-full'} onChange={(e: any) => setFrameworkType(e.target.value)}>
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
                <VSCodeDropdown className={'w-full'} onChange={(e: any) => setFrameworkType(e.target.value)}>
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
      </div>
      <div className={'spfx__action mb-3 pb-3 border-b pl-10'}>
        {!isFormValid ?
          <p><strong>Please provide fill up the required fields with valid values</strong></p> :
          ''}
        <VSCodeButton disabled={!isFormValid ? true : null} className={isSubmitting ? 'w-full hidden' : 'w-full'} onClick={submit}>
          <span slot={'start'}><AddIcon /></span>
          {isNewProject ? 'Create a new SPFx project' : 'Extend an existing SPFx project'}
        </VSCodeButton>
        <div className={isSubmitting ? '' : 'hidden'}>
          <div className={'text-center h-5'}>
            <VSCodeProgressRing style={{
              width: '100%',
              height: '100%',
            }} />

            <p className={'mt-4'}>Working on it...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
