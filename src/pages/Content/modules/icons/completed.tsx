import React from 'react';
import { ICON_FILL } from './constants';
// import { HoverProvider } from './assignment';

interface IconProps {
  size?: string;
  color?: string;
  variant?: 'solid' | 'outline';
}

export function CompletedIconComponent({
  color = ICON_FILL,
  size = '21px',
  variant = 'solid',
}: IconProps): JSX.Element {
  return (
    <svg
      className="tfc-completed-tab"
      fill={color}
      height={size || 20}
      version="1.1"
      viewBox="0 0 1920 1920"
      width={size || 20}
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant === 'solid' ? (
        <path
          d="M459.897 902.842v689.845h1034.767v-574.87h230.064v804.819H229.948V902.842h229.949Zm1299.37-570.916L1920 496.455l-845.06 825.86-408.044-398.846 160.85-164.413 247.194 241.675 684.326-668.805ZM459.896 98v230.063H689.96v229.949H459.897v229.833H229.948V558.012H0V328.063h229.948V98h229.949Zm919.816 229.983V557.93h-574.87V327.983h574.87Z"
          fillRule="evenodd"
        />
      ) : (
        <path
          clipRule="evenodd"
          d="M1709.29 854.673V1709.28H341.808V911.533H455.755V1595.33H1595.34V854.673H1709.29ZM1840.35 329.57L1920 411.156L1122.37 1190.78L757.852 834.243L837.501 752.883L1122.37 1031.37L1840.35 329.57ZM455.789 0V341.956H797.745V455.903H455.789V797.631H341.842V455.903H0V341.956H341.842V0H455.789ZM1538.32 341.876V455.823H911.612V341.876H1538.32Z"
          fillRule="evenodd"
        />
      )}
    </svg>
  );
}
