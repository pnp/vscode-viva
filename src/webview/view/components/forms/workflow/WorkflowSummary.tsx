import * as React from 'react';
import { VSCodeButton, VSCodeLink, VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { CopyIcon, RocketIcon } from '../../icons';
import { WorkflowType } from '../../../../../constants';


interface WorkflowSummaryProps {
    shouldCreateAppRegistrationForm: boolean;
    certPassword: string;
    isSubmitting: boolean;
    submit: () => void;
    workflowType: WorkflowType;
    isWorkflowCreated: boolean;
    isApplicationAuthentication: boolean;
    appId: string;
    base64CertPrivateKey: string;
    isBase64CertPrivateKeyTrimmed: boolean;
    setIsBase64CertPrivateKeyTrimmed: (value: boolean) => void;
    tenantId: string;
    appRegistrationName: string;
}

export const WorkflowSummary: React.FunctionComponent<WorkflowSummaryProps> = ({
    shouldCreateAppRegistrationForm,
    certPassword,
    isSubmitting,
    submit,
    workflowType,
    isWorkflowCreated,
    isApplicationAuthentication,
    appId,
    base64CertPrivateKey,
    isBase64CertPrivateKeyTrimmed,
    setIsBase64CertPrivateKeyTrimmed,
    tenantId,
    appRegistrationName
}) => {
    return (
        <div>
            <div className={'workflow__action mb-3 pb-3 border-b pl-10'}>
                {shouldCreateAppRegistrationForm && certPassword.length < 5 ?
                    <p className={'py-2'}><strong>Please provide a password for your certificate which is at least 6 characters long</strong></p> :
                    ''}
                <VSCodeButton disabled={shouldCreateAppRegistrationForm && certPassword.length < 5 ? true : null} className={isSubmitting ? 'w-full text-center hidden' : 'w-full block text-center'} onClick={submit}>
                    <span slot={'start'}><RocketIcon /></span>
                    {shouldCreateAppRegistrationForm ? `Create ${workflowType === WorkflowType.gitHub ? 'workflow' : 'pipeline'} & new app registration` : `Create ${workflowType === WorkflowType.gitHub ? 'workflow' : 'pipeline'}`}
                </VSCodeButton>
                <div className={isSubmitting ? '' : 'hidden'}>
                    <div className={'text-center h-5'}>
                        <VSCodeProgressRing style={{
                            width: '100%',
                            height: '100%',
                        }} />

                        <p className={'mt-4'}>Generating GitHub CI/CD {workflowType === WorkflowType.gitHub ? 'workflow' : 'pipeline'}...</p>
                    </div>
                </div>
            </div>
            <div className={'workflow__summary mb-6 pb-3'}>
                <div className={isWorkflowCreated ? '' : 'hidden'}>
                    <p className={'mb-3 mt-1 text-lg'}>Awesome 🤩! your CI/CD yaml file is ready 🚀!</p>
                    <p className={'mb-1'}>👉 Follow the below steps to finish the setup and see it in action:</p>
                    {
                        workflowType === WorkflowType.gitHub ?
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
                                                <li><code>CERTIFICATE_ENCODED</code> - application's encoded certificate string</li>
                                                <li><code>CERTIFICATE_PASSWORD</code> - certificate password. This applies only if the certificate is encoded which is the recommended approach</li>
                                                <li><code>TENANT_ID</code> - tenant Id</li>
                                            </ul>
                                            <div className={isApplicationAuthentication && shouldCreateAppRegistrationForm && appId && base64CertPrivateKey ? '' : 'hidden'}>
                                                <p className={'pl-9 mt-2'}><strong>Your certificate and app registration are ready as well!</strong></p>
                                                <p className={'pl-9'}>You may find your generated certificate in the temp folder in your solution.</p>
                                                <p className={'pl-9'}>Check out your new app registration:
                                                    <VSCodeLink href={`https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/${appId}`}>{appRegistrationName}</VSCodeLink>
                                                </p>
                                                <p className={'pl-9'}>Use the below values for your secrets: </p>
                                                <table>
                                                    <tr>
                                                        <td className={'border p-1'}><code>APP_ID</code></td>
                                                        <td className={'border p-1'}>{appId}</td>
                                                        <td className={'border'}>
                                                            <VSCodeButton appearance={'secondary'} onClick={() => navigator.clipboard.writeText(appId)}>
                                                                <span><CopyIcon /></span>
                                                            </VSCodeButton>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className={'border p-1'}><code>CERTIFICATE_ENCODED</code></td>
                                                        <td className={'border p-1 text-wrap break-all text-xs'}>
                                                            <div className={isBase64CertPrivateKeyTrimmed ? '' : 'hidden'}>
                                                                <span>{base64CertPrivateKey.substring(0, 100)}...</span>
                                                                <span><VSCodeLink onClick={() => setIsBase64CertPrivateKeyTrimmed(false)}>Show more</VSCodeLink></span>
                                                            </div>
                                                            <div className={!isBase64CertPrivateKeyTrimmed ? '' : 'hidden'}>
                                                                <span>{base64CertPrivateKey}</span>
                                                                <span><VSCodeLink onClick={() => setIsBase64CertPrivateKeyTrimmed(true)}>Show less</VSCodeLink></span>
                                                            </div>
                                                        </td>
                                                        <td className={'border'}>
                                                            <VSCodeButton appearance={'secondary'} onClick={() => navigator.clipboard.writeText(base64CertPrivateKey)}>
                                                                <span><CopyIcon /></span>
                                                            </VSCodeButton>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className={'border p-1'}><code>TENANT_ID</code></td>
                                                        <td className={'border p-1'}>{tenantId}</td>
                                                        <td className={'border'}>
                                                            <VSCodeButton appearance={'secondary'} onClick={() => navigator.clipboard.writeText(tenantId)}>
                                                                <span><CopyIcon /></span>
                                                            </VSCodeButton>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                                <li>3. That's it. Check it out in action 🚀</li>
                            </ul> :
                            <ul>
                                <li>1. Your pipeline is currently only local, you need to <code>git commit</code> and <code>git push</code> your changes so that Azure DevOps may pick it up.</li>
                                <li>2. Go to Azure DevOps Pipelines page and select <code>New pipeline</code>. Next select <code>Azure Repos Git</code>, pick your repository, and select <code>Existing Azure Pipelines YAML file</code> and pick the path to your .yaml pipeline file</li>
                                <li>3. In order for your pipeline to run it will require a couple of variables which you need to manually set, or what is more preferable, create a dedicated variable group to store those properties.
                                    <ul className={'pl-6'}>
                                        <li>Edit the pipeline file and fill the following variables:
                                            <ul className={!isApplicationAuthentication ? 'pl-9' : 'hidden'}>
                                                <li><code>UserName</code> - user email</li>
                                                <li><code>Password</code> - user password</li>
                                                <li><code>SharePointBaseUrl</code> - URL of the root SharePoint site collection</li>
                                            </ul>
                                            <ul className={isApplicationAuthentication ? 'pl-9' : 'hidden'}>
                                                <li><code>EntraAppId</code> - client id of the registered Entra application</li>
                                                <li><code>CertificatePassword</code> - certificate password. This applies only if the certificate is encoded which is the recommended approach</li>
                                                <li><code>CertificateBase64Encoded</code> - base 64 encoded certificate. Use either <code>CertificateBase64Encoded</code> or <code>CertificateSecureFileId</code> but not both</li>
                                                <li><code>CertificateSecureFileId</code> - id of a certificate file in the secure files section of the DevOps library. .pfx file. Use either <code>CertificateBase64Encoded</code> or <code>CertificateSecureFileId</code> but not both</li>
                                                <li><code>TenantId</code> - tenant Id</li>
                                                <li><code>SharePointBaseUrl</code> - URL of the root SharePoint site collection</li>
                                            </ul>
                                            <div className={isApplicationAuthentication && shouldCreateAppRegistrationForm && appId && base64CertPrivateKey ? '' : 'hidden'}>
                                                <p className={'pl-9 mt-2'}><strong>Your certificate and app registration are ready as well!</strong></p>
                                                <p className={'pl-9'}>You may find your generated certificate in the temp folder in your solution.</p>
                                                <p className={'pl-9'}>Check out your new app registration:
                                                    <VSCodeLink href={`https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/${appId}`}>{appRegistrationName}</VSCodeLink>
                                                </p>
                                                <p className={'pl-9'}>Use the below values for your secrets: </p>
                                                <table>
                                                    <tr>
                                                        <td className={'border p-1'}><code>EntraAppId</code></td>
                                                        <td className={'border p-1'}>{appId}</td>
                                                        <td className={'border'}>
                                                            <VSCodeButton appearance={'secondary'} onClick={() => navigator.clipboard.writeText(appId)}>
                                                                <span><CopyIcon /></span>
                                                            </VSCodeButton>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className={'border p-1'}><code>CertificateBase64Encoded</code></td>
                                                        <td className={'border p-1 text-wrap break-all text-xs'}>
                                                            <div className={isBase64CertPrivateKeyTrimmed ? '' : 'hidden'}>
                                                                <span>{base64CertPrivateKey.substring(0, 100)}...</span>
                                                                <span><VSCodeLink onClick={() => setIsBase64CertPrivateKeyTrimmed(false)}>Show more</VSCodeLink></span>
                                                            </div>
                                                            <div className={!isBase64CertPrivateKeyTrimmed ? '' : 'hidden'}>
                                                                <span>{base64CertPrivateKey}</span>
                                                                <span><VSCodeLink onClick={() => setIsBase64CertPrivateKeyTrimmed(true)}>Show less</VSCodeLink></span>
                                                            </div>
                                                        </td>
                                                        <td className={'border'}>
                                                            <VSCodeButton appearance={'secondary'} onClick={() => navigator.clipboard.writeText(base64CertPrivateKey)}>
                                                                <span><CopyIcon /></span>
                                                            </VSCodeButton>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className={'border p-1'}><code>TenantId</code></td>
                                                        <td className={'border p-1'}>{tenantId}</td>
                                                        <td className={'border'}>
                                                            <VSCodeButton appearance={'secondary'} onClick={() => navigator.clipboard.writeText(tenantId)}>
                                                                <span><CopyIcon /></span>
                                                            </VSCodeButton>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                                <li>4. That's it. Run the pipeline and check it out in action 🚀</li>
                            </ul>
                    }
                </div>
            </div>
        </div>
    );
};