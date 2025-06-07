import * as React from 'react';
import { StepHeader } from '../../controls';
import { VSCodeTextField, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import { WorkflowType } from '../../../../../constants';


interface IGeneralInfoProps {
  workflowType: WorkflowType;
  name: string;
  setName: (name: string) => void;
  branch: string;
  setBranch: (branch: string) => void;
  shouldTriggerManually: boolean;
  setShouldTriggerManually: (shouldTriggerManually: boolean) => void;
}

export const GeneralInfoStep: React.FunctionComponent<IGeneralInfoProps> = ({
  workflowType,
  name,
  setName,
  branch,
  setBranch,
  shouldTriggerManually,
  setShouldTriggerManually
}) => {
  return (
    <div className={'workflow__form__step'}>
      <StepHeader step={1} title={'General information'} />
      <div className={'workflow__form__step__content ml-10'}>
        <div className={'mb-2'}>
          <label className={'block mb-1'}>
            What should be the name of your {workflowType === WorkflowType.gitHub ? 'workflow' : 'pipeline'}?
          </label>
          <VSCodeTextField className={'w-full'} value={name} onChange={(e: any) => setName(e.target.value)} />
        </div>
        <div className={'mb-2'}>
          <label className={'block mb-1'}>
            What should be the branch name which should trigger the {workflowType === WorkflowType.gitHub ? 'workflow' : 'pipeline'} on push?
          </label>
          <VSCodeTextField className={'w-full'} value={branch} onChange={(e: any) => setBranch(e.target.value)} />
        </div>
        {
          workflowType === WorkflowType.gitHub ?
            <div className={'mb-2'}>
              <label className={'block mb-1'}>
                Should it be possible to trigger the workflow manually?
              </label>
              <VSCodeCheckbox checked={shouldTriggerManually} onChange={() => setShouldTriggerManually(!shouldTriggerManually)} />
            </div>
            : ''
        }
      </div>
    </div>
  );
};