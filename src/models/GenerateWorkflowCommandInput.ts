import { WorkflowType } from '../constants';

export interface GenerateWorkflowCommandInput {
  workflowType: WorkflowType
  name: string;
  branch: string
  shouldTriggerManually: boolean;
  isApplicationAuthentication: boolean;
  isTenantScope: boolean;
  siteUrl: string;
  shouldSkipFeatureDeployment: boolean;
  shouldCreateAppRegistrationForm: boolean;
  certPassword: string;
  appRegistrationName: string;
}