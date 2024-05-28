import { VSCodeButton, VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { AddIcon } from '../../icons';


export interface IFormActionsProps {
    isFormValid: boolean;
    isSubmitting: boolean;
    isNewProject: boolean;
    submit: () => void;
}

export const FormActions: React.FunctionComponent<IFormActionsProps> = ({
    isFormValid,
    isSubmitting,
    isNewProject,
    submit }: React.PropsWithChildren<IFormActionsProps>) => {
    return (
        <div className={'spfx__action mb-3 pb-3 border-b pl-10'}>
            {!isFormValid ? (
                <p className={'py-2'}>
                    <strong>Please fill up the required fields with valid values</strong>
                </p>
            ) : (
                ''
            )}
            <VSCodeButton
                disabled={!isFormValid ? true : null}
                className={isSubmitting ? 'w-full hidden' : 'w-full'}
                onClick={submit}
            >
                <span slot={'start'}>
                    <AddIcon />
                </span>
                {isNewProject ? 'Create a new SPFx project' : 'Add a new SPFx component'}
            </VSCodeButton>
            <div className={isSubmitting ? '' : 'hidden'}>
                <div className={'text-center h-5'}>
                    <VSCodeProgressRing
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    />
                    <p className={'mt-4'}>Working on it...</p>
                </div>
            </div>
        </div>
    );
};
