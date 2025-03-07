import * as React from 'react';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { WorkflowType } from '../../../../../constants';
import { GitHubIcon, AzureDevOpsIcon } from '../../icons';


interface IWorkflowHeaderProps {
    workflowType: WorkflowType;
    setWorkflowType: (workflowType: WorkflowType) => void;
}

export const WorkflowHeader: React.FunctionComponent<IWorkflowHeaderProps> = ({ workflowType, setWorkflowType }) => {
    return (
        <div className={'text-center mb-6'}>
            <div className={'mb-1'}>
                <VSCodeButton onClick={() => setWorkflowType(WorkflowType.gitHub)} appearance={workflowType === WorkflowType.gitHub ? '' : 'secondary'} className={'pl-3 pr-4 pt-2 pb-3'}>
                    <span className={'text-2xl'}><GitHubIcon /></span>
                </VSCodeButton>
                <VSCodeButton onClick={() => setWorkflowType(WorkflowType.azureDevOps)} appearance={workflowType === WorkflowType.azureDevOps ? '' : 'secondary'} className={'pl-3 pr-4 pt-2 pb-3'}>
                    <span className={'text-2xl'}><AzureDevOpsIcon /></span>
                </VSCodeButton>
            </div>
            <h1 className={'text-2xl'}>Create a CI/CD {workflowType === WorkflowType.gitHub ? 'GitHub Workflow' : 'Azure DevOps Pipeline'} for your project</h1>
        </div>
    );
};