export interface GenerateWorkflowCommandInput {
  name: string;
  branch: string
  shouldTriggerManually: boolean;
  isApplicationAuthentication: boolean;
  isTenantScope: boolean;
  siteUrl: string;
  shouldSkipFeatureDeployment: boolean;
}