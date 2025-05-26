import * as React from 'react';
import { VSCodeTextField, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';


interface IAppRegistrationFormProps {
  shouldCreateAppRegistrationForm: boolean;
  setShouldCreateAppRegistrationForm: (value: boolean) => void;
  isSignedIn: boolean;
  certPassword: string;
  setCertPassword: (value: string) => void;
  appRegistrationName: string;
  setAppRegistrationName: (value: string) => void;
  appId: string;
  setAppId: (value: string) => void;
  base64CertPrivateKey: string;
  setBase64CertPrivateKey: (value: string) => void;
  isBase64CertPrivateKeyTrimmed: boolean;
  setIsBase64CertPrivateKeyTrimmed: (value: boolean) => void;
  tenantId: string;
  setTenantId: (value: string) => void;
}

export const AppRegistrationForm: React.FunctionComponent<IAppRegistrationFormProps> = ({
  shouldCreateAppRegistrationForm,
  setShouldCreateAppRegistrationForm,
  isSignedIn,
  certPassword,
  setCertPassword,
  appRegistrationName,
  setAppRegistrationName,
  appId,
  setAppId,
  base64CertPrivateKey,
  setBase64CertPrivateKey,
  isBase64CertPrivateKeyTrimmed,
  setIsBase64CertPrivateKeyTrimmed,
  tenantId,
  setTenantId
}) => {
  return (
    <div>
      <div className={isSignedIn ? '' : 'hidden'}>
        <div className={'mt-2'}>
          <p className={'mb-1'}><strong>Don't have an app registration yet?</strong></p>
          <p className={'mb-2'}>👇 No problem, generate all that you need for your workflow or pipeline 👇</p>
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
      <VSCodeTextField value={appId} onInput={(e: any) => setAppId(e.target.value)}>
        App ID
      </VSCodeTextField>
      <VSCodeTextField value={base64CertPrivateKey} onInput={(e: any) => setBase64CertPrivateKey(e.target.value)}>
        Base64 Cert Private Key
      </VSCodeTextField>
      <VSCodeCheckbox checked={isBase64CertPrivateKeyTrimmed} onChange={(e: any) => setIsBase64CertPrivateKeyTrimmed(e.target.checked)}>
        Trim Base64 Cert Private Key
      </VSCodeCheckbox>
      <VSCodeTextField value={tenantId} onInput={(e: any) => setTenantId(e.target.value)}>
        Tenant ID
      </VSCodeTextField>
    </div>
  );
};