import * as React from 'react';
import { Dropdown, IDropdownOption, IDropdownStyles, IStyle } from '@fluentui/react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';


export interface IMultiSelectProps {
  onChange: (event: any, option?: IDropdownOption) => void;
  options: IDropdownOption[];
  label?: string;
}

export const MultiSelect: React.FunctionComponent<IMultiSelectProps> = ({ onChange, options, label }: React.PropsWithChildren<IMultiSelectProps>) => {
  const getDropdownStyles = (): Partial<IDropdownStyles> => {
    const dropDownStyle: IStyle = {
      'span:first-child': {
        height: 26,
        lineHeight: 23,
        backgroundColor: 'var(--vscode-input-background)',
        color: 'var(--vscode-input-foreground)',
        fontSize: 13,
        border: '1px solid var(--vscode-input-border, #CECECE)',
        fontFamily: 'var(--font-family)',
        marginTop: 10
      },
    };
    const caretStyle: IStyle = {
      color: 'var(--vscode-input-foreground)',
      fontSize: 23,
      lineHeight: 23,
    };
    const checkboxStyle: IStyle = {
      '.ms-Checkbox-checkbox': {
        backgroundColor: 'var(--vscode-dropdown-background, #3C3C3C)',
        border: '1px solid var(--vscode-button-secondaryHoverBackground, #3C3C3C)',
        i: {
          color: 'var(--vscode-dropdown-background, #3C3C3C)',
        },
      },
    };
    const checkboxStyleSelected: IStyle = {
      '.ms-Checkbox-checkbox': {
        backgroundColor: 'var(--vscode-badge-background)',
        border: '1px solid var(--vscode-badge-background)',
        i: {
          color: 'var(--vscode-button-secondaryHoverBackground, #cccccc)',
        },
      },
    };
    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: {
        ...dropDownStyle,
        ':hover': {
          ...dropDownStyle,
          '.ms-Dropdown-caretDown': {
            color: 'var(--vscode-input-foreground)',
          },
        },
        ':focus': {
          ...dropDownStyle,
          '.ms-Dropdown-caretDown': {
            color: 'var(--vscode-input-foreground)',
          },
        },
        ':active': {
          '.ms-Dropdown-caretDown': {
            color: 'var(--vscode-input-foreground)',
          },
        },
      },
      caretDown: {
        ...caretStyle,
      },
      caretDownWrapper: {
        height: 24,
        lineHeight: 24,
        fontSize: 18,
        color: 'var(--vscode-input-foreground)',
      },
      callout: {
        '.ms-Callout-main': {
          border: '1px solid var(--vscode-inputValidation-infoBorder, #007ACC)',
        },
      },
      dropdownItemsWrapper: {
        padding: '4px 0',
        backgroundColor: 'var(--vscode-editorGroupHeader-tabsBackground, #252526)',
      },
      dropdownItem: {
        backgroundColor: 'var(--vscode-editorGroupHeader-tabsBackground, #252526)',
        minHeight: 22,
        height: 22,
        ...checkboxStyle,
        ':active': {
          backgroundColor: 'var(--vscode-editorGroupHeader-tabsBackground, #252526) !important',
        },
        'input:focus + .ms-Checkbox-label': {
          ...checkboxStyle,
        },
        'input:focus + .ms-Checkbox-label .ms-Checkbox-checkbox': {
          borderColor: 'var(--vscode-inputValidation-infoBorder, #007ACC)',
        },
        'input:focus + .ms-Checkbox-label .ms-Checkbox-checkmark': {
          color: 'var(--vscode-dropdown-background, #3C3C3C)',
        },
        ':hover': {
          backgroundColor: 'var(--vscode-editorStickyScrollHover-background, #303031) !important',
          '.ms-Checkbox-checkmark': {
            color: 'var(--vscode-dropdown-background, #3C3C3C)',
          },
          '.ms-Checkbox-checkbox': {
            borderColor: 'var(--vscode-button-secondaryHoverBackground, #3C3C3C)',
          },
        },
      },
      dropdownItemSelected: {
        minHeight: 22,
        height: 22,
        backgroundColor: 'var(--vscode-editorGroupHeader-tabsBackground, #252526)',
        ...checkboxStyleSelected,
        ':active': {
          backgroundColor: 'var(--vscode-editorGroupHeader-tabsBackground, #252526) !important',
        },
        'input:focus + .ms-Checkbox-label': {
          ...checkboxStyleSelected,
        },
        'input:focus + .ms-Checkbox-label .ms-Checkbox-checkbox': {
          borderColor: 'var(--vscode-inputValidation-infoBorder, #007ACC)',
        },
        ':focus': {
          ...checkboxStyleSelected,
        },
        ':hover': {
          backgroundColor: 'var(--vscode-editorStickyScrollHover-background, #303031) !important',
          ...checkboxStyleSelected,
        },
      },
      dropdownOptionText: {
        fontSize: '13px',
        color: 'var(--vscode-dropdown-foreground, #CCCCCC)',
      },
    };
    return dropdownStyles;
  };

  return (
    <div className={'multiselect'}>
      <Dropdown
        placeholder={label ?? 'Select'}
        multiSelect
        selectedKeys={[...options.filter((option) => option.selected).map((option) => option.key as any)]}
        options={options}
        styles={getDropdownStyles()}
        onChange={onChange}
        dropdownWidth='auto'
        onRenderCaretDown={() => <ChevronDownIcon />}
      />
    </div>
  );
};