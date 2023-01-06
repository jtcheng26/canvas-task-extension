import React, { useState, MouseEvent } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

const Group = styled.g`
  &:hover {
    filter: opacity(0.6);
    cursor: pointer;
  }
  transition: filter 0.2s;
`;

interface BgProps {
  opacity: number;
}

const BgCircle = styled.circle.attrs((props) => ({
  style: {
    opacity: props.opacity,
  },
}))<BgProps>`
  fill: none;
`;

interface ColorProps {
  rounded?: boolean;
  transition?: boolean;
}

const ColorCircle = styled.circle<ColorProps>`
  transform-origin: center center;
  transform: rotate(-90deg);
  fill: none;

  ${(props) =>
    props.transition ? 'transition: stroke-dashoffset 1s ease-in-out;' : ''}
  stroke-linecap: ${(props) => (props.rounded ? 'round' : 'butt')};
`;

interface Props {
  progress: number;
  color: string;
  bg?: string;
  center: number;
  radius: number;
  rounded?: boolean;
  width: number;
  id: number;
  onClick?: (id: number, e: MouseEvent) => void;
  onMouseEnter?: (id: number, e: MouseEvent) => void;
  onMouseLeave?: (id: number, e: MouseEvent) => void;
}

export default function RadialChartBar({
  progress,
  color,
  bg,
  center,
  radius,
  width,
  id,
  onClick,
  onMouseEnter,
  onMouseLeave,
  rounded = true,
}: Props): JSX.Element {
  const circumference = 2 * Math.PI * radius;
  const [strokeDashoffset, setOffset] = useState(circumference);
  const [transition, setTransition] = useState(true);
  const [firstLoad, setFirstLoad] = useState(false);
  useEffect(() => {
    setFirstLoad(true);
    if (strokeDashoffset === circumference) {
      const timeout = setTimeout(() => {
        setOffset((1 - progress) * circumference);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setOffset((1 - progress) * circumference);
    }
  }, [progress]);

  useEffect(() => {
    if (circumference !== strokeDashoffset && firstLoad) {
      setTransition(false);
      setOffset((1 - progress) * circumference);
      const to = setTimeout(() => {
        setTransition(true);
      }, 100);
      return () => clearTimeout(to);
    }
  }, [circumference]);

  function handleClick(e: MouseEvent) {
    if (onClick) onClick(id, e);
  }

  function handleMouseEnter(e: MouseEvent) {
    if (onMouseEnter) onMouseEnter(id, e);
  }

  function handleMouseLeave(e: MouseEvent) {
    if (onMouseLeave) onMouseLeave(id, e);
  }
  return (
    <Group
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <BgCircle
        cx={center}
        cy={center}
        opacity={bg ? 1 : 0.1}
        r={radius}
        stroke={bg || color}
        strokeWidth={width}
      />
      <ColorCircle
        cx={center}
        cy={center}
        r={radius}
        rounded={rounded}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeWidth={width}
        transition={transition}
      />
    </Group>
  );
}
