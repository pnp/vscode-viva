import { VSCodeButton, VSCodeCheckbox, VSCodeDropdown, VSCodeOption, VSCodeProgressRing, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { RocketIcon } from '../../icons';
import { useLocation } from 'react-router-dom';
import { Messenger } from '@estruyf/vscode/dist/client';
import { GenerateWorkflowCommandInput, WebviewCommand } from '../../../../../constants';
import { EventData } from '@estruyf/vscode/dist/models/EventData';


export interface IScaffoldWorkflowViewProps { }

export const ScaffoldWorkflowView: React.FunctionComponent<IScaffoldWorkflowViewProps> = ({ }: React.PropsWithChildren<IScaffoldWorkflowViewProps>) => {
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
  const location: any = useLocation();

  useEffect(() => {
    if (location.state.spfxPackageName) {
      setName(`Deploy Solution ${location.state.spfxPackageName}`);
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

  const messageListener = (event: MessageEvent<EventData<any>>) => {
    const { command } = event.data;

    if (command === WebviewCommand.toWebview.WorkflowCreated) {
      setIsWorkflowCreated(true);
      setIsSubmitting(false);
    }
  };

  const submit = () => {
    setIsSubmitting(true);
    setIsWorkflowCreated(false);
    Messenger.send(WebviewCommand.toVSCode.createWorkFlow, {
      name,
      branch,
      shouldTriggerManually,
      isApplicationAuthentication,
      isTenantScope,
      siteUrl,
      shouldSkipFeatureDeployment
    } as GenerateWorkflowCommandInput);
  };

  return (
    <div className={'w-full h-full max-w-2xl mx-auto py-16 sm:px-6 lg:px-16'}>
      <div className={'text-center mb-6'}>
        <h1 className={'text-2xl'}>Create a CI/CD Workflow for your project</h1>
      </div>
      <div className={'workflow__form'}>
        <div className={'workflow__form__step'}>
          <div className={'border-b pb-2 mb-6'}>
            <label className={'text-xl border mt-4 rounded-full px-3 py-1 bg-vscode absolute'}>1</label>
            <div className={'pl-10'}>
              <p className={'text-lg'}>General information</p>
            </div>
          </div>
          <div className={'workflow__form__step__content ml-10'}>
            <div className={'mb-2'}>
              <label className={'block mb-1'}>
                What should be the name of your workflow?
              </label>
              <VSCodeTextField className={'w-full'} value={name} onChange={(e: any) => setName(e.target.value)} />
            </div>
            <div className={'mb-2'}>
              <label className={'block mb-1'}>
                What should be the branch name which should trigger the workflow on push?
              </label>
              <VSCodeTextField className={'w-full'} value={branch} onChange={(e: any) => setBranch(e.target.value)} />
            </div>
            <div className={'mb-2'}>
              <label className={'block mb-1'}>
                Should it be possible to trigger the workflow manually?
              </label>
              <VSCodeCheckbox checked={shouldTriggerManually} onChange={() => setShouldTriggerManually(!shouldTriggerManually)} />
            </div>
          </div>
        </div>
        <div className={'workflow__form__step'}>
          <div className={'border-b pb-2 mb-6 mt-2'}>
            <label className={'text-xl border mt-4 rounded-full px-3 py-1 bg-vscode absolute'}>2</label>
            <div className={'pl-10'}>
              <p className={'text-lg'}>Authentication method</p>
            </div>
          </div>
          <div className={'workflow__form__step__content ml-10'}>
            <div className={'mb-2'}>
              <label className={'block mb-2'}>
                How the flow will authenticate to your tenant?
              </label>
              <div className={'mb-10'}>
                <VSCodeButton onClick={() => setIsApplicationAuthentication(!isApplicationAuthentication)} appearance={!isApplicationAuthentication ? '' : 'secondary'} className={'float-left'}>
                  User
                </VSCodeButton>
                <VSCodeButton onClick={() => setIsApplicationAuthentication(!isApplicationAuthentication)} appearance={isApplicationAuthentication ? '' : 'secondary'} className={'float-left'}>
                  Application
                </VSCodeButton>
              </div>
              <div className={'mb-2'}>
                <div className={!isApplicationAuthentication ? '' : 'hidden'}>
                  <p className={'mb-1'}>Authenticating as a user is perfect for testing your workflow, in a dev context, for personal usage.</p>
                  <p className={'mb-1'}>👉 This method will require you to create the following secrets in your GitHub repository:</p>
                  <ul>
                    <li><code>ADMIN_USERNAME</code> - user email</li>
                    <li><code>ADMIN_PASSWORD</code> - user password</li>
                  </ul>
                  <br />
                  <p><strong>⚠️ WARNING</strong> <br /> It will not work for accounts with MFA</p>
                </div>
                <div className={isApplicationAuthentication ? '' : 'hidden'}>
                  <p className={'mb-1'}>Authenticating as an application is perfect in a production context as it does not create any dependencies on an account.</p>
                  <p className={'mb-1'}>👉 This method will require you to create the following secrets in your GitHub repository:</p>
                  <ul>
                    <li><code>APP_ID</code> - client id of the registered Entra ID application</li>
                    <li><code>CERTIFICATE_ENCODED</code> - application's encoded certificate</li>
                    <li><code>CERTIFICATE_PASSWORD</code> - certificate password. This applies only if the certificate is encoded which is the recommended approach</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={'workflow__form__step'}>
          <div className={'border-b pb-2 mb-6 mt-6'}>
            <label className={'text-xl border mt-4 rounded-full px-3 py-1 bg-vscode absolute'}>3</label>
            <div className={'pl-10'}>
              <p className={'text-lg'}>Deployment settings</p>
            </div>
          </div>
          <div className={'workflow__form__step__content ml-10'}>
            <div className={'mb-2'}>
              <label className={'block mb-2'}>
                What will be the scope of the deployment?
              </label>
              <div className={'mb-10'}>
                <VSCodeButton onClick={() => setIsTenantScope(!isTenantScope)} appearance={!isTenantScope ? '' : 'secondary'} className={'float-left'}>
                  Site
                </VSCodeButton>
                <VSCodeButton onClick={() => setIsTenantScope(!isTenantScope)} appearance={isTenantScope ? '' : 'secondary'} className={'float-left'}>
                  Tenant
                </VSCodeButton>
              </div>
            </div>
            <div className={!isTenantScope ? 'mb-2' : 'mb-2 hidden'}>
              <label className={'block mb-2'}>
                Which site app catalog should be used?
              </label>
              {
                siteAppCatalogUrls.length > 0 ?
                  <VSCodeDropdown className={'w-full'} onChange={(e: any) => setSiteUrl(e.target.value)}>
                    {siteAppCatalogUrls.map((url: string) => <VSCodeOption key={url} value={url}>{url}</VSCodeOption>)}
                  </VSCodeDropdown>
                  : <VSCodeTextField className={'w-full'} value={siteUrl} onChange={(e: any) => setSiteUrl(e.target.value)} />
              }
            </div>
            <div className={'mb-2'}>
              <label className={'block mb-1'}>
                Should the solution be deployed to all <span className={!isTenantScope ? '' : 'hidden'}>sub-</span>sites?
              </label>
              <VSCodeCheckbox checked={shouldSkipFeatureDeployment} onChange={() => setShouldSkipFeatureDeployment(!shouldSkipFeatureDeployment)} />
            </div>
          </div>
        </div>
      </div>
      <div className={'workflow__action mb-3 pb-3 border-b pl-10'}>
        <VSCodeButton className={isSubmitting ? 'w-full hidden' : 'w-full'} onClick={submit}>
          <span slot={'start'}><RocketIcon /></span>
          Create workflow
        </VSCodeButton>
        <div className={isSubmitting ? '' : 'hidden'}>
          <div className={'text-center h-5'}>
            <VSCodeProgressRing style={{
              width: '100%',
              height: '100%',
            }} />

            <p className={'mt-4'}>Generating GitHub CI/CD workflow...</p>
          </div>
        </div>
      </div>
      <div className={'workflow__summary mb-6 pb-3'}>
        <div className={isWorkflowCreated ? '' : 'hidden'}>
          <p className={'mb-3 mt-1 text-lg'}>Awesome 🤩! your CI/CD yaml file is ready 🚀!</p>
          <p className={'mb-1'}>👉 Follow the below steps to finish the setup and see it in action:</p>
          <ul>
            <li>1. Your workflow is currently only local, you need to <code>git commit</code> and <code>git push</code> your changes so that GitHub may pick it up.</li>
            <li>2. In order for your workflow to run it will require a couple of secrets which you need to manually add to your repository
              <ul className={'pl-6'}>
                <li>Go to repository <code>Settings</code> tab and using the left navigation under <code>Security</code> section open the <code>Secrets and variables</code> for <code>Actions</code></li>
                <li>Now using the <code>New repository secret</code> button add the following secrets:
                  <ul className={!isApplicationAuthentication ? 'pl-9' : 'hidden'}>
                    <li><code>ADMIN_USERNAME</code> - user email</li>
                    <li><code>ADMIN_PASSWORD</code> - user password</li>
                  </ul>
                  <ul className={isApplicationAuthentication ? 'pl-9' : 'hidden'}>
                    <li><code>APP_ID</code> - client id of the registered Entra ID application</li>
                    <li><code>CERTIFICATE_ENCODED</code> - application's encoded certificate</li>
                    <li><code>CERTIFICATE_PASSWORD</code> - certificate password. This applies only if the certificate is encoded which is the recommended approach</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>3. That's it. Check it out in action 🚀</li>
          </ul>
        </div>
      </div>
    </div>
  );
};