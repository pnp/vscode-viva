import { VSCodeButton, VSCodeCheckbox, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeProgressRing, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { AzureDevOpsIcon, CopyIcon, GitHubIcon, RocketIcon } from '../../icons';
import { useLocation } from 'react-router-dom';
import { Messenger } from '@estruyf/vscode/dist/client';
import { WebviewCommand, WorkflowType } from '../../../../../constants';
import { EventData } from '@estruyf/vscode/dist/models/EventData';
import { GenerateWorkflowCommandInput } from '../../../../../models';
import { WorkflowHeader, GeneralInfoStep, AuthenticationMethodStep, DeploymentSettingsStep, WorkflowSummary } from '../workflow';


export interface IScaffoldWorkflowViewProps { }

export const ScaffoldWorkflowView: React.FunctionComponent<IScaffoldWorkflowViewProps> = ({ }: React.PropsWithChildren<IScaffoldWorkflowViewProps>) => {
  const [workflowType, setWorkflowType] = useState<WorkflowType>(WorkflowType.gitHub);
  const [name, setName] = useState<string>('');
  const [branch, setBranch] = useState<string>('main');
  const [shouldTriggerManually, setShouldTriggerManually] = useState<boolean>(true);
  const [isApplicationAuthentication, setIsApplicationAuthentication] = useState<boolean>(true);
  const [isTenantScope, setIsTenantScope] = useState<boolean>(true);
  const [siteUrl, setSiteUrl] = useState<string>('');
  const [shouldSkipFeatureDeployment, setShouldSkipFeatureDeployment] = useState<boolean>(false);
  const [siteAppCatalogUrls, setSiteAppCatalogUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isWorkflowCreated, setIsWorkflowCreated] = useState<boolean>(false);
  const [shouldCreateAppRegistrationForm, setShouldCreateAppRegistrationForm] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [certPassword, setCertPassword] = useState<string>('');
  const [appRegistrationName, setAppRegistrationName] = useState<string>('CI/CD Application');
  const [appId, setAppId] = useState<string>('');
  const [base64CertPrivateKey, setBase64CertPrivateKey] = useState<string>('');
  const [isBase64CertPrivateKeyTrimmed, setIsBase64CertPrivateKeyTrimmed] = useState<boolean>(true);
  const [tenantId, setTenantId] = useState<string>('');
  const location: any = useLocation();

  useEffect(() => {
    if (location.state.spfxPackageName) {
      setName(`Deploy Solution ${location.state.spfxPackageName}`);
      setAppRegistrationName(`CI/CD Application for ${location.state.spfxPackageName}`);
    }

    if (location.state.isSignedIn) {
      setIsSignedIn(location.state.isSignedIn);
    }

    if (location.state.appCatalogUrls) {
      let appCatalogUrls = location.state.appCatalogUrls;
      if (location.state.appCatalogUrls.indexOf(',') > -1) {
        appCatalogUrls = location.state.appCatalogUrls.split(',');
      }
      setSiteUrl(appCatalogUrls[0]);
      setSiteAppCatalogUrls(appCatalogUrls);
    }
  }, [location]);

  useEffect(() => {
    Messenger.listen(messageListener);

    return () => {
      Messenger.unlisten(messageListener);
    };
  }, []);

  useEffect(() => {
    if (isWorkflowCreated) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [isWorkflowCreated]);

  useEffect(() => {
    setIsWorkflowCreated(false);
  }, [workflowType]);

  const messageListener = (event: MessageEvent<EventData<any>>) => {
    const { command, payload } = event.data;

    if (command === WebviewCommand.toWebview.WorkflowCreated) {
      if (payload.success && payload.appId) {
        setAppId(payload.appId);
      }

      if (payload.success && payload.tenantId) {
        setTenantId(payload.tenantId);
      }

      if (payload.success && payload.pfxBase64) {
        setBase64CertPrivateKey(payload.pfxBase64);
      }

      setIsWorkflowCreated(payload.success);
      setIsSubmitting(false);
    }
  };

  const submit = () => {
    setIsSubmitting(true);
    setIsWorkflowCreated(false);
    Messenger.send(WebviewCommand.toVSCode.createWorkFlow, {
      workflowType,
      name,
      branch,
      shouldTriggerManually,
      isApplicationAuthentication,
      isTenantScope,
      siteUrl,
      shouldSkipFeatureDeployment,
      shouldCreateAppRegistrationForm,
      certPassword,
      appRegistrationName
    } as GenerateWorkflowCommandInput);
  };

  return (
    <div className={'w-full h-full max-w-2xl mx-auto py-16 sm:px-6 lg:px-16'}>
      <WorkflowHeader
        workflowType={workflowType}
        setWorkflowType={setWorkflowType} />
      <div className={'workflow__form'}>
        <GeneralInfoStep
          workflowType={workflowType}
          name={name}
          setName={setName}
          branch={branch}
          setBranch={setBranch}
          shouldTriggerManually={shouldTriggerManually}
          setShouldTriggerManually={setShouldTriggerManually}
        />
        <AuthenticationMethodStep
          workflowType={workflowType}
          isApplicationAuthentication={isApplicationAuthentication}
          setIsApplicationAuthentication={setIsApplicationAuthentication}
          isSignedIn={isSignedIn}
          shouldCreateAppRegistrationForm={shouldCreateAppRegistrationForm}
          setShouldCreateAppRegistrationForm={setShouldCreateAppRegistrationForm}
          certPassword={certPassword}
          setCertPassword={setCertPassword}
          appRegistrationName={appRegistrationName}
          setAppRegistrationName={setAppRegistrationName}
        />
        <DeploymentSettingsStep
          isTenantScope={isTenantScope}
          setIsTenantScope={setIsTenantScope}
          siteUrl={siteUrl}
          setSiteUrl={setSiteUrl}
          shouldSkipFeatureDeployment={shouldSkipFeatureDeployment}
          setShouldSkipFeatureDeployment={setShouldSkipFeatureDeployment}
          siteAppCatalogUrls={siteAppCatalogUrls}
        />
      </div>
      <WorkflowSummary
        workflowType={workflowType}
        shouldCreateAppRegistrationForm={shouldCreateAppRegistrationForm}
        certPassword={certPassword}
        submit={submit}
        isSubmitting={isSubmitting}
        isWorkflowCreated={isWorkflowCreated}
        isApplicationAuthentication={isApplicationAuthentication}
        appId={appId}
        base64CertPrivateKey={base64CertPrivateKey}
        tenantId={tenantId}
        appRegistrationName={appRegistrationName}
        isBase64CertPrivateKeyTrimmed={isBase64CertPrivateKeyTrimmed}
        setIsBase64CertPrivateKeyTrimmed={setIsBase64CertPrivateKeyTrimmed}
      />
    </div>
  );
};