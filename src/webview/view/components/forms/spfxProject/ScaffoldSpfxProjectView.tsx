import { VSCodeButton, VSCodeCheckbox, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeProgressRing, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { AdaptiveCardTypesNode16, AdaptiveCardTypesNode18, ComponentType, ComponentTypes, ExtensionType, ExtensionTypes, FrameworkType, FrameworkTypes, SpfxAddComponentCommandInput, SpfxScaffoldCommandInput, WebviewCommand } from '../../../../../constants';
import { useLocation } from 'react-router-dom';
import { AddIcon, FolderIcon } from '../../icons';
import { Messenger } from '@estruyf/vscode/dist/client';
import { EventData } from '@estruyf/vscode/dist/models/EventData';


export interface IScaffoldSpfxProjectViewProps { }

export const ScaffoldSpfxProjectView: React.FunctionComponent<IScaffoldSpfxProjectViewProps> = ({ }: React.PropsWithChildren<IScaffoldSpfxProjectViewProps>) => {
  const [isNewProject, setIsNewProject] = useState<boolean>(true);
  const [nodeVersion, setNodeVersion] = useState<string>('18');
  const [folderPath, setFolderPath] = useState<string>('');
  const [solutionName, setSolutionName] = useState<string>('');
  const [isValidSolutionName, setIsValidSolutionName] = useState<boolean | null>();
  const [componentType, setComponentType] = useState<ComponentType>(ComponentType.webPart);
  const [componentName, setComponentName] = useState<string>('');
  const [isValidComponentName, setIsValidComponentName] = useState<boolean | null>();
  const [frameworkType, setFrameworkType] = useState<string>(FrameworkType.none);
  const [extensionType, setExtensionType] = useState<ExtensionType>(ExtensionType.application);
  const [aceType, setAceType] = useState<string>(AdaptiveCardTypesNode18[0].value);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [shouldRunInit, setShouldRunInit] = useState<boolean>(true);
  const [shouldInstallReusablePropertyPaneControls, setShouldInstallReusablePropertyPaneControls] = useState<boolean>(false);
  const [shouldInstallReusableReactControls, setShouldInstallReusableReactControls] = useState<boolean>(false);
  const [shouldInstallPnPJs, setShouldInstallPnPJs] = useState<boolean>(false);
  const location: any = useLocation();
  const componentTypeName = ComponentTypes.find((component) => component.value === componentType)?.name;

  useEffect(() => {
    Messenger.listen(messageListener);

    return () => {
      Messenger.unlisten(messageListener);
    };
  }, []);

  useEffect(() => {
    if (location.state.isNewProject !== undefined) {
      const isNewProjectBool = typeof (location.state.isNewProject) === 'string' ? (location.state.isNewProject === 'false' ? false : true) : location.state.isNewProject;
      setIsNewProject(isNewProjectBool);
    }

    if (location.state.nodeVersion) {
      setNodeVersion(location.state.nodeVersion);
      if (location.state.nodeVersion === '16') {
        setAceType(AdaptiveCardTypesNode16[0].value);
      }
    }
  }, [location]);

  useEffect(() => {
    if (isNewProject) {
      if (!folderPath || !solutionName || !componentName) {
        setIsFormValid(false);
        return;
      }

      if (!isValidSolutionName) {
        setIsFormValid(false);
        return;
      }
    } else {
      if (!isValidComponentName) {
        setIsFormValid(false);
        return;
      }
    }

    setIsFormValid(true);
  }, [folderPath, solutionName, isValidSolutionName, componentName, isValidComponentName]);

  const messageListener = (event: MessageEvent<EventData<any>>) => {
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

    if (command === WebviewCommand.toWebview.validateComponentName) {
      setIsValidComponentName(payload);
    }
  };

  const pickFolder = () => {
    Messenger.send(WebviewCommand.toVSCode.pickFolder, {});
  };

  const validateSolutionName = (solutionNameInput: string) => {
    setSolutionName(solutionNameInput);
    if (!solutionNameInput) {
      setIsValidSolutionName(null);
      return;
    }

    Messenger.send(WebviewCommand.toVSCode.validateSolutionName, { folderPath, solutionNameInput });
  };

  const validateComponentName = (componentNameInput: string) => {
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
  };

  const submit = () => {
    setIsSubmitting(true);
    if (!isNewProject) {
      Messenger.send(WebviewCommand.toVSCode.addSpfxComponent, {
        componentType,
        componentName,
        frameworkType,
        extensionType,
        aceType
      } as SpfxAddComponentCommandInput);
    } else {
      Messenger.send(WebviewCommand.toVSCode.createSpfxProject, {
        folderPath,
        solutionName,
        componentType,
        componentName,
        frameworkType,
        extensionType,
        aceType,
        shouldRunInit,
        shouldInstallReusablePropertyPaneControls,
        shouldInstallReusableReactControls,
        shouldInstallPnPJs
      } as SpfxScaffoldCommandInput);
    }
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
        {
              isNewProject &&
          <div className={'spfx__form__step'}>
            <div className={'border-b pb-2 mb-6'}>
              <label className={'text-xl border mt-4 rounded-full px-3 py-1 bg-vscode absolute'}>3</label>
              <div className={'pl-10'}>
                <p className={'text-lg'}>Additional steps</p>
              </div>
            </div>
            <div className={'spfx__form__step__content ml-10'}>
                <div className={'mb-2'}>
                  <label className={'block mb-1'}>
                    Run <code>npm install</code> after the project is created?
                  </label>
                  <VSCodeCheckbox checked={shouldRunInit} onChange={() => setShouldRunInit(!shouldRunInit)} />
                </div>
                <div className={'mb-3'}>
                  <VSCodeButton onClick={() => setShouldInstallReusablePropertyPaneControls(!shouldInstallReusablePropertyPaneControls)} appearance={shouldInstallReusablePropertyPaneControls ? '' : 'secondary'} className={'float-left'}>
                    Yes
                  </VSCodeButton>
                  <VSCodeButton onClick={() => setShouldInstallReusablePropertyPaneControls(!shouldInstallReusablePropertyPaneControls)} appearance={!shouldInstallReusablePropertyPaneControls ? '' : 'secondary'} className={'float-left'}>
                    No
                  </VSCodeButton>
                  <label className={'ml-2 pt-1 inline-block'}>
                    Install <VSCodeLink href='https://pnp.github.io/sp-dev-fx-property-controls/'>reusable property pane controls</VSCodeLink>
                  </label>
               </div>
               <div className={'mb-3'}>
                  <VSCodeButton onClick={() => setShouldInstallReusableReactControls(!shouldInstallReusableReactControls)} appearance={shouldInstallReusableReactControls ? '' : 'secondary'} className={'float-left'}>
                    Yes
                  </VSCodeButton>
                  <VSCodeButton onClick={() => setShouldInstallReusableReactControls(!shouldInstallReusableReactControls)} appearance={!shouldInstallReusableReactControls ? '' : 'secondary'} className={'float-left'}>
                    No
                  </VSCodeButton>
                  <label className={'ml-2 pt-1 inline-block'}>
                    Install <VSCodeLink href='https://pnp.github.io/sp-dev-fx-controls-react/'>reusable React controls</VSCodeLink>
                  </label>
               </div>
               <div className={'mb-3'}>
                  <VSCodeButton onClick={() => setShouldInstallPnPJs(!shouldInstallPnPJs)} appearance={shouldInstallPnPJs ? '' : 'secondary'} className={'float-left'}>
                    Yes
                  </VSCodeButton>
                  <VSCodeButton onClick={() => setShouldInstallPnPJs(!shouldInstallPnPJs)} appearance={!shouldInstallPnPJs ? '' : 'secondary'} className={'float-left'}>
                    No
                  </VSCodeButton>
                  <label className={'ml-2 pt-1 inline-block'}>
                    Install <VSCodeLink href='https://pnp.github.io/pnpjs/'>PnPjs</VSCodeLink> (@pnp/sp, @pnp/graph)
                  </label>
               </div>
            </div>
          </div>
        }
      </div>
      <div className={'spfx__action mb-3 pb-3 border-b pl-10'}>
        {!isFormValid ?
          <p><strong>Please provide fill up the required fields with valid values</strong></p> :
          ''}
        <VSCodeButton disabled={!isFormValid ? true : null} className={isSubmitting ? 'w-full hidden' : 'w-full'} onClick={submit}>
          <span slot={'start'}><AddIcon /></span>
          {isNewProject ? 'Create a new SPFx project' : 'Add a new SPFx component'}
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
