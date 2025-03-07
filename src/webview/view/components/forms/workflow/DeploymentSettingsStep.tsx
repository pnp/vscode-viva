import * as React from 'react';
import { StepHeader } from '../../controls';
import { VSCodeButton, VSCodeCheckbox, VSCodeDropdown, VSCodeOption, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';


interface IDeploymentSettingsStepProps {
  isTenantScope: boolean;
  setIsTenantScope: (value: boolean) => void;
  siteUrl: string;
  setSiteUrl: (value: string) => void;
  shouldSkipFeatureDeployment: boolean;
  setShouldSkipFeatureDeployment: (value: boolean) => void;
  siteAppCatalogUrls: string[];
}

export const DeploymentSettingsStep: React.FunctionComponent<IDeploymentSettingsStepProps> = ({
  isTenantScope,
  setIsTenantScope,
  siteUrl,
  setSiteUrl,
  shouldSkipFeatureDeployment,
  setShouldSkipFeatureDeployment,
  siteAppCatalogUrls
}) => {
  return (
    <div className={'workflow__form__step'}>
      <StepHeader step={3} title={'Deployment settings'} />
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
  );
};