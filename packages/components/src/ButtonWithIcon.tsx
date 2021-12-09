import { ReactElement, MouseEvent } from 'react';
import { Tooltip } from 'primereact/tooltip';

import tailwindConfig from '../../playground/tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';
import { TailwindConfig } from 'tailwindcss/tailwind-config';

const fullConfig = resolveConfig(tailwindConfig as TailwindConfig);

export type ButtonProps = {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  darkmode: boolean;
  onClick: (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void | Promise<void> | null;
  testId?: string;
  disabled?: boolean;
  loading?: boolean;
  isMenuOption?: boolean;
  tooltipContent?: string;
  borderColor?: string;
};

export const ButtonWithIcon = ({
  label,
  Icon,
  darkmode,
  onClick,
  testId,
  disabled,
  loading,
  isMenuOption = false,
  tooltipContent = '',
  borderColor = '',
}: ButtonProps): ReactElement => {
  const disabledClasses =
    disabled || loading
      ? 'cursor-not-allowed dark:text-gray-600 text-gray-400 dark:bg-elevation bg-gray-200'
      : '';

  const IconOfState = (): ReactElement => {
    const iconStyle = 'mt-1.5 mr-1.5 w-4';
    const spinnerIcon = `pi pi-spinner animate-spin ${iconStyle}`;
    const disabledIcon = `dark:text-gray-600 text-gray-400 ${iconStyle}`;

    // Get shades of gray from tailwind config
    type Colors = { gray: Record<string, string> };
    const colors = fullConfig.theme.colors as Colors;
    // Icon colors dark mode
    const grayDisabledDark = colors.gray['600'];
    const grayEnabledDark = colors.gray['200'];
    // Icon colors light mode
    const grayDisabledLight = colors.gray['400'];
    const grayEnabledLight = colors.gray['600'];

    if (loading) return <i className={spinnerIcon} data-testid={'icon-loading'} />;
    if (disabled)
      return (
        <Icon
          color={darkmode ? grayDisabledDark : grayDisabledLight}
          className={disabledIcon}
          data-testid={testId}
        />
      );
    return (
      <Icon
        color={darkmode ? grayEnabledDark : grayEnabledLight}
        className={iconStyle}
        data-testid={testId}
      />
    );
  };

  const menuOptionStyle =
    'dark:hover:bg-elevation-3 bg-gray-100 hover:bg-gray-200 dark:bg-elevation-1 dark:border-dark border-light border-t last:rounded-b py-2 px-4 w-full text-lg flex whitespace-nowrap';

  const buttonStyle =
    'dark:hover:bg-elevation hover:bg-gray-200 pt-px3 px-3 mr-1 rounded text-lg flex whitespace-nowrap';

  const borderStyle = `border ${borderColor ? borderColor : 'dark:border-primary border-white'}`;

  // create an identifier, because otherwise tooltip would render
  // multiple times, for all button occurrences in the app
  const tooltipTargetIdentifier = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);
  // Build a unique class name as target for the tooltip
  const tooltipTarget = 'tooltip-button-' + tooltipTargetIdentifier;

  const mergedButtonClasses = `${tooltipTarget} ${disabledClasses} ${
    isMenuOption ? menuOptionStyle : buttonStyle
  } ${borderStyle}`;

  return (
    <>
      {tooltipContent && (
        <Tooltip target={`.${tooltipTarget}`} position="bottom" autoHide={false}>
          {tooltipContent}
        </Tooltip>
      )}
      <button
        disabled={disabled || loading}
        className={mergedButtonClasses}
        onClick={(e?) => onClick(e)}
      >
        <IconOfState />
        {label}
      </button>
    </>
  );
};
