import { VSCodeButton, VSCodeLink, VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useState } from 'react';
import { WebviewCommand } from '../../../../../constants';
import { Messenger } from '@estruyf/vscode/dist/client';


export interface IRegisterEntraAppRegViewProps { }

export const RegisterEntraAppRegView: React.FunctionComponent<IRegisterEntraAppRegViewProps> = ({ }: React.PropsWithChildren<IRegisterEntraAppRegViewProps>) => {
  const [isManualMethod, setEntraAppRegistrationMethod] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submit = () => {
    setIsSubmitting(true);

    Messenger.send(WebviewCommand.toVSCode.createAppReg);
  };

  return (
    <div className={'w-full h-full max-w-2xl mx-auto py-16 sm:px-6 lg:px-16'}>
      <div className={'entraAppReg__form'}>
        <div className={'text-center mb-6'}>
          <h1 className="text-2xl">Register Single Tenant App Registration</h1>
        </div>
        <div className={'mb-4'}>
          <label className={'block mb-1'}>
            SPFx Toolkit needs an Entra App Registration in order to grant the required permissions when signing in to your tenant.
            You may create such an app if you are a tenant administrator or have the required permissions.
            This page will guide you through the process of creating a new App Registration either manually or automatically using CLI for Microsoft 365.
          </label>
        </div>
      </div>
      <div className={'mb-2'}>
        <label className={'block mb-2'}>
          For more information please visit <VSCodeLink href='https://pnp.github.io/vscode-viva/features/login-tenant/'>SPFx Toolkit login docs</VSCodeLink>
        </label>
      </div>
      <div className={'mb-2'}>
        <label className={'block mb-2'}>
          How would you like to create the Entra App Registration?
        </label>
        <div className={'mb-10'}>
          <VSCodeButton onClick={() => setEntraAppRegistrationMethod(!isManualMethod)} appearance={!isManualMethod ? '' : 'secondary'} className={'float-left'}>
            Automatically
          </VSCodeButton>
          <VSCodeButton onClick={() => setEntraAppRegistrationMethod(!isManualMethod)} appearance={isManualMethod ? '' : 'secondary'} className={'float-left'}>
            Manually
          </VSCodeButton>
        </div>
        <div className={'mb-2 border-t'}>
          <div className={!isManualMethod ? '' : 'hidden'}>
            <p className={'mb-1'}>SPFx Toolkit will use CLI for Microsoft 365 to sign in as Azure CLI app to your tenant to create a new App Registration.</p>
            <br />
            <div>
              <VSCodeButton className={isSubmitting ? 'w-full hidden' : 'w-full'} onClick={submit}>
                Create the Entra App Registration
              </VSCodeButton>
            </div>
            <div className={isSubmitting ? 'mb-4' : 'hidden'}>
              <div className={'text-center h-5'}>
                <VSCodeProgressRing style={{
                  width: '100%',
                  height: '100%',
                }} />

                <p className={'mt-4'}>Adding SPFx Toolkit App Registration...</p>
              </div>
            </div>
            <br />
            <p className={'mb-1'}>In this process the following Entra App Registration will be created:</p>
            <table>
              <tr>
                <td className={'border p-1'}>Name</td>
                <td className={'border p-1'}>SPFx Toolkit</td>
              </tr>
              <tr>
                <td className={'border p-1'}>Platform configurations</td>
                <td className={'border p-1'}>Mobile and desktop applications</td>
              </tr>
              <tr>
                <td className={'border p-1'}>Redirect URL</td>
                <td className={'border p-1'}>
                  http://localhost,<br />https://localhost,<br />https://login.microsoftonline.com/common/oauth2/nativeclient
                </td>
              </tr>
              <tr>
                <td className={'border p-1'}>Supported account types</td>
                <td className={'border p-1'}>Single Tenant</td>
              </tr>
              <tr>
                <td className={'border p-1'}>Scopes</td>
                <td className={'border p-1'}>
                  Microsoft Graph:<br />
                  <code>AppCatalog.ReadWrite.All</code><br />
                  <code>AuditLog.Read.All</code><br />
                  <code>Directory.AccessAsUser.All</code><br />
                  <code>Directory.ReadWrite.All</code><br />
                  <code>SecurityEvents.Read.All</code><br />
                  <code>ServiceHealth.Read.All</code><br />
                  <code>ServiceMessage.Read.All</code><br />
                  <code>Sites.Read.All</code><br />
                  <code>User.Read</code><br />
                  <br />
                  Azure Active Directory Graph:<br />
                  <code>Directory.AccessAsUser.All</code><br />
                  <br />
                  Azure Service Management:<br />
                  <code>user_impersonation</code><br />
                  <br />
                  Office 365 Management APIs:<br />
                  <code>ActivityFeed.Read</code><br />
                  <code>ServiceHealth.Read</code><br />
                  <br />
                  SharePoint:<br />
                  <code>AllSites.FullControl</code><br />
                  <code>User.ReadWrite.All</code><br />
                </td>
              </tr>
            </table>
          </div>
          <div className={isManualMethod ? '' : 'hidden'}>
            <p className={'mb-1'}>Please follow the below steps to Create the Entra App Registration manually</p>
            <ul className={'entraAppReg_manual_steps'}>
              <li>Navigate to the <VSCodeLink href='https://portal.azure.com/'>Azure Portal</VSCodeLink></li>
              <li>Select Microsoft Entra ID from the global menu, select App Registrations in the Microsoft Entra ID blade and then select the New registration action button to open the Register an application form.</li>
              <li>In the form, enter a name for your new application. It's recommended to name this app SPFx Toolkit but you may give it any preferable name</li>
              <li>Leave the <code>Supported account types</code> and <code>Redirect URI</code> values as they are and select the <code>Register</code> button at the foot of the form to create your custom application</li>
              <li>Next we need to configure the <code>Authentication</code> for our new app. Go to the <code>Authentication</code> page and select the <code>Add a platform</code> button to open up the <code>Configure platforms</code> menu and under the <code>Mobile and desktop applications</code> heading, select <code>Mobile and desktop applications</code>. This will open another menu called <code>Configure Desktop + Devices</code> displaying a section called <code>Redirect URIs</code> and a list of checkboxes with some pre-defined URIs.</li>
              <li>Select the first option in the list, <code>https://login.microsoftonline.com/common/oauth2/nativeclient</code> and select the <code>Configure</code> button at the foot of the menu.</li>
              <li>we can skip over the <code>Supported account type</code> section, as this is defaulted to <code>Accounts in this organizational directory only (tenant only - Single tenant)</code> meaning, that only users within the current tenant directory can use this application.</li>
              <li>In the <code>Advanced settings</code> section, we need to enable the <code>Allow public client flows</code> toggle, as we are using the <code>Device code flow</code> method to authenticate to our tenant using the CLI for Microsoft 365.</li>
              <li>To make sure all these changes are applied, select the <code>Save</code> button before moving on.</li>
              <li>Now that we have configured the application to work with the SPFx Toolkit, we next need to grant the required permissions. Select the <code>API permissions</code> in the menu option.
                You will see a section called <code>Configured permissions</code> with one permission already granted. This is the default permission which allows the application to sign in the user account used when authenticating to the Microsoft Graph.
                <br />
                Add the following permissions:
                <div className='w-full'>
                  <table>
                    <tr>
                      <td className={'border p-1'}>Scopes</td>
                      <td className={'border p-1 w-full'}>
                        Microsoft Graph:<br />
                        <code>AppCatalog.ReadWrite.All</code><br />
                        <code>AuditLog.Read.All</code><br />
                        <code>Directory.AccessAsUser.All</code><br />
                        <code>Directory.ReadWrite.All</code><br />
                        <code>SecurityEvents.Read.All</code><br />
                        <code>ServiceHealth.Read.All</code><br />
                        <code>ServiceMessage.Read.All</code><br />
                        <code>Sites.Read.All</code><br />
                        <code>User.Read</code><br />
                        <br />
                        Azure Active Directory Graph:<br />
                        <code>Directory.AccessAsUser.All</code><br />
                        <br />
                        Azure Service Management:<br />
                        <code>user_impersonation</code><br />
                        <br />
                        Office 365 Management APIs:<br />
                        <code>ActivityFeed.Read</code><br />
                        <code>ServiceHealth.Read</code><br />
                        <br />
                        SharePoint:<br />
                        <code>AllSites.FullControl</code><br />
                        <code>User.ReadWrite.All</code><br />
                      </td>
                    </tr>
                  </table>
                </div>
              </li>
              <li>Go to <code>Overview</code> page and note down the <code>Application (client) ID</code> and <code>Directory (tenant) ID</code></li>
              <li>Click on the <code>Sign in to Microsoft 365</code> and provide the noted down <code>Client Id</code> and <code>Tenant Id</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};