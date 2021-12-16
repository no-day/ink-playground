import { ReactElement, MouseEvent } from 'react';
import { Tooltip } from 'primereact/tooltip';

import tailwindConfig from '../../playground/tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';
import { TailwindConfig } from 'tailwindcss/tailwind-config';

const fullConfig = resolveConfig(tailwindConfig as TailwindConfig);

// Get colors from tailwind config
type Colors = {
  gray: Record<string, string>;
  green: Record<string, string>;
  blue: Record<string, string>;
  yellow: Record<string, string>;
  red: Record<string, string>;
};

export type ButtonProps = {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void | Promise<void> | null;
  testId?: string;
  disabled?: boolean;
  loading?: boolean;
  isMenuOption?: boolean;
  tooltipContent?: string;
  borderColor?: { color: keyof Colors; shade: string };
  darkmode?: boolean;
};

export const ButtonWithIcon = ({
  label,
  Icon,
  onClick,
  testId,
  disabled,
  loading,
  isMenuOption = false,
  tooltipContent = '',
  borderColor = { color: 'gray', shade: '600' },
  darkmode = true,
}: ButtonProps): ReactElement => {
  const disabledClasses = disabled || loading ? 'cursor-not-allowed opacity-60' : '';

  const IconOfState = (): ReactElement => {
    const iconStyle = 'mt-1.5 mr-1.5 w-4';
    const spinnerIcon = `pi pi-spinner animate-spin ${iconStyle}`;
    const disabledIcon = `dark:text-gray-600 text-gray-400 ${iconStyle}`;

    const colors = fullConfig.theme.colors as Colors;
    // Icon colors
    const grayDark = colors.gray['200'];
    const grayLight = colors.gray['600'];
    const grayIcon = darkmode ? grayDark : grayLight;
    // Icon colors contract size
    const sizeColor = borderColor.shade;

    const bundleSize_ = colors[borderColor.color][sizeColor];

    let bundleSize = colors.green[sizeColor];

    if (loading) return <i className={spinnerIcon} data-testid={'icon-loading'} />;
    if (disabled) return <Icon color={bundleSize} className={disabledIcon} data-testid={testId} />;
    return <Icon color={bundleSize} className={iconStyle} data-testid={testId} />;
  };

  const menuOptionStyle =
    'dark:hover:bg-elevation-3 bg-gray-100 hover:bg-gray-200 dark:bg-elevation-1 dark:border-dark border-light border-t last:rounded-b py-2 px-4 w-full text-lg flex whitespace-nowrap';

  const buttonStyle =
    'dark:hover:bg-elevation hover:bg-gray-200 pt-px3 px-3 mr-1 rounded text-lg flex whitespace-nowrap';

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
  }`;

  return (
    <>
      {tooltipContent && (
        <Tooltip
          target={`.${tooltipTarget}`}
          position="bottom"
          autoHide={false}
          className="custom-tooltip"
        >
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
