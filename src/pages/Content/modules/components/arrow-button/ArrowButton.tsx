import React, { useState } from 'react';
import { Direction } from '../../types';

type Props = {
  direction?: Direction;
  disabled?: boolean;
  onClick?: () => void;
  hovering?: boolean;
  hoverIndependent?: boolean;
};

export default function ArrowButton({
  direction = Direction.UP,
  disabled = false,
  onClick,
  hovering = false,
  hoverIndependent = true,
}: Props): JSX.Element {
  const [isHovering, setHovering] = useState(hovering);
  function handleClick() {
    if (!disabled && onClick) onClick();
  }
  function onHover() {
    if (hoverIndependent) setHovering(true);
  }
  function onLeave() {
    if (hoverIndependent) setHovering(false);
  }

  const rotation = {
    [Direction.LEFT]: -90,
    [Direction.RIGHT]: 90,
    [Direction.UP]: 0,
    [Direction.DOWN]: 180,
  };

  console.log(rotation[direction]);
  return (
    <div
      onClick={handleClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        backgroundColor:
          hoverIndependent && !disabled && isHovering
            ? '#4c586040'
            : 'transparent',
        display: 'flex',
        padding: 4,
        borderRadius: 100,
        transform: `rotate(${rotation[direction]}deg)`,
        cursor: !disabled ? 'pointer' : 'default',
      }}
    >
      <svg
        height="8"
        viewBox="0 0 24 24"
        width="8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.677 18.52c.914 1.523-.183 3.472-1.967 3.472h-19.414c-1.784 0-2.881-1.949-1.967-3.472l9.709-16.18c.891-1.483 3.041-1.48 3.93 0l9.709 16.18z"
          fill={hovering || disabled ? 'rgb(125, 134, 141)' : 'rgb(62, 76, 86)'}
        />
      </svg>
    </div>
  );
}
