import * as React from 'react';
import { StepHeader } from '../../controls';
import { VSCodeButton, VSCodeCheckbox, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { WorkflowType } from '../../../../../constants';


interface IAuthenticationMethodStepProps {
  workflowType: WorkflowType;
  isApplicationAuthentication: boolean;
  setIsApplicationAuthentication: (value: boolean) => void;
  isSignedIn: boolean;
  shouldCreateAppRegistrationForm: boolean;
  setShouldCreateAppRegistrationForm: (value: boolean) => void;
  certPassword: string;
  setCertPassword: (value: string) => void;
  appRegistrationName: string;
  setAppRegistrationName: (value: string) => void;
}

export const AuthenticationMethodStep: React.FunctionComponent<IAuthenticationMethodStepProps> = ({
  workflowType,
  isApplicationAuthentication,
  setIsApplicationAuthentication,
  isSignedIn,
  shouldCreateAppRegistrationForm,
  setShouldCreateAppRegistrationForm,
  certPassword,
  setCertPassword,
  appRegistrationName,
  setAppRegistrationName
}) => {
  return (
    <div className={'workflow__form__step'}>
      <StepHeader step={2} title={'Authentication method'} />
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
              {
                workflowType === WorkflowType.gitHub ?
                  <>
                    <p className={'mb-1'}>👉 This method will require you to create the following secrets in your GitHub repository:</p>
                    <ul>
                      <li><code>ADMIN_USERNAME</code> - user email</li>
                      <li><code>ADMIN_PASSWORD</code> - user password</li>
                    </ul>
                  </> :
                  <>
                    <p className={'mb-1'}>👉 This method will require you to fill the following variables, or what is more preferable, create a dedicated variable group to store those properties:</p>
                    <ul>
                      <li><code>UserName</code> - user email</li>
                      <li><code>Password</code> - user password</li>
                    </ul>
                  </>
              }
              <br />
              <p><strong>⚠️ WARNING</strong> <br /> It will not work for accounts with MFA</p>
            </div>
            <div className={isApplicationAuthentication ? '' : 'hidden'}>
              <p className={'mb-1'}>Authenticating as an application is perfect in a production context as it does not create any dependencies on an account.</p>
              {
                workflowType === WorkflowType.gitHub ?
                  <>
                    <p className={'mb-1'}>👉 This method will require you to create the following secrets in your GitHub repository:</p>
                    <ul>
                      <li><code>APP_ID</code> - client id of the registered Entra application</li>
                      <li><code>CERTIFICATE_ENCODED</code> - application's encoded certificate string</li>
                      <li><code>CERTIFICATE_PASSWORD</code> - certificate password. This applies only if the certificate is encoded which is the recommended approach</li>
                      <li><code>TENANT_ID</code> - tenant Id</li>
                    </ul>
                  </> :
                  <>
                    <p className={'mb-1'}>👉 This method will require you to fill the following variables, or what is more preferable, create a dedicated variable group to store those properties:</p>
                    <ul>
                      <li><code>EntraAppId</code> - client id of the registered Entra application</li>
                      <li><code>CertificatePassword</code> - certificate password. This applies only if the certificate is encoded which is the recommended approach</li>
                      <li><code>CertificateBase64Encoded</code> - base 64 encoded certificate. Use either <code>CertificateBase64Encoded</code> or <code>CertificateSecureFileId</code> but not both</li>
                      <li><code>CertificateSecureFileId</code> - id of a certificate file in the secure files section of the DevOps library. .pfx file. Use either <code>CertificateBase64Encoded</code> or <code>CertificateSecureFileId</code> but not both</li>
                      <li><code>TenantId</code> - tenant Id</li>
                    </ul>
                  </>
              }
              <div>
                <div className={isSignedIn ? '' : 'hidden'}>
                  <div className={'mt-2'}>
                    <p className={'mb-1'}><strong>Don't have an app registration yet?</strong></p>
                    <p className={'mb-2'}>👇 No problem, generate all that you need for your {workflowType === WorkflowType.gitHub ? 'workflow' : 'pipeline'} 👇</p>
                    <VSCodeCheckbox checked={shouldCreateAppRegistrationForm} onChange={() => setShouldCreateAppRegistrationForm(!shouldCreateAppRegistrationForm)}>
                      Generate a certificate and create an app registration
                    </VSCodeCheckbox>
                  </div>
                </div>
                <div className={shouldCreateAppRegistrationForm ? '' : 'hidden'}>
                  <p className={'mt-1 mb-1'}>Here you may generate a new certificate and register a new app registration with a single click 🤩</p>
                  <div className={'mb-2'}>
                    <label className={'block mb-1'}>
                      What should be the certificate password?
                    </label>
                    <VSCodeTextField className={'w-full'} value={certPassword} type={'password'} onChange={(e: any) => setCertPassword(e.target.value)} />
                  </div>
                  <div className={'mb-2'}>
                    <label className={'block mb-1'}>
                      What should be the Entra app name?
                    </label>
                    <VSCodeTextField className={'w-full'} value={appRegistrationName} onChange={(e: any) => setAppRegistrationName(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};