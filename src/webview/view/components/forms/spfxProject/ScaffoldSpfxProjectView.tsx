import * as React from 'react';
import { useEffect, useState } from 'react';
import { AdaptiveCardTypesNode16, AdaptiveCardTypesNode18, ComponentType, ComponentTypes, ExtensionType, FrameworkType, WebviewCommand } from '../../../../../constants';
import { useLocation } from 'react-router-dom';
import { Messenger } from '@estruyf/vscode/dist/client';
import { SpfxAddComponentCommandInput, SpfxScaffoldCommandInput } from '../../../../../models';
import { FormHeader, GeneralInfoStep, ComponentDetailsStep, AdditionalStep, FormActions } from '../spfxProject';


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
      <FormHeader isNewProject={isNewProject} />
      <div className={'spfx__form'}>
        <GeneralInfoStep
          isNewProject={isNewProject}
          folderPath={folderPath}
          setFolderPath={setFolderPath}
          solutionName={solutionName}
          setSolutionName={setSolutionName}
          isValidSolutionName={isValidSolutionName}
          setIsValidSolutionName={setIsValidSolutionName}
          setComponentType={setComponentType}
          componentTypes={ComponentTypes}
        />
        <ComponentDetailsStep
          isNewProject={isNewProject}
          componentType={componentType}
          componentName={componentName}
          isValidComponentName={isValidComponentName}
          setComponentName={setComponentName}
          setIsValidComponentName={setIsValidComponentName}
          nodeVersion={nodeVersion}
          frameworkType={frameworkType}
          setFrameworkType={setFrameworkType}
          extensionType={extensionType}
          setExtensionType={setExtensionType}
          aceType={aceType}
          setAceType={setAceType}
        />
        {
          isNewProject &&
          <AdditionalStep
            shouldRunInit={shouldRunInit}
            setShouldRunInit={setShouldRunInit}
            shouldInstallReusablePropertyPaneControls={shouldInstallReusablePropertyPaneControls}
            setShouldInstallReusablePropertyPaneControls={setShouldInstallReusablePropertyPaneControls}
            shouldInstallReusableReactControls={shouldInstallReusableReactControls}
            setShouldInstallReusableReactControls={setShouldInstallReusableReactControls}
            shouldInstallPnPJs={shouldInstallPnPJs}
            setShouldInstallPnPJs={setShouldInstallPnPJs}
          />
        }
      </div>
      <FormActions
        isFormValid={isFormValid}
        isSubmitting={isSubmitting}
        isNewProject={isNewProject}
        submit={submit}
      />
    </div>
  );
};
