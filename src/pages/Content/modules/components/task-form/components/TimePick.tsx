import React, { useMemo } from 'react';
import CourseDropdown from '../../course-dropdown';
import { DropdownChoice } from '../../course-dropdown/CourseDropdown';

function fmtTime(minutes: number): string {
  const h =
    Math.floor(minutes / 60) % 12 === 0 ? 12 : Math.floor(minutes / 60) % 12;
  const mm = (minutes % 60 < 10 ? '0' : '') + (minutes % 60);
  const ampm = minutes / 60 >= 12 ? 'PM' : 'AM';
  return `${h}:${mm} ${ampm}`;
}

type Props = {
  color?: string;
  dark?: boolean;
  selected: string;
  setSelected: (value: string) => void;
};

export default function TimePick({
  color,
  dark,
  selected,
  setSelected,
}: Props): JSX.Element {
  const timeChoices = useMemo(() => {
    const times: DropdownChoice[] = [];
    for (let i = 0; i < 48; i++) {
      times.push({
        id: i * 30 + '',
        name: fmtTime(i * 30),
        color: dark ? 'var(--tfc-dark-mode-text-primary)' : '#2d3b45',
      });
    }

    times.push({
      id: '1439',
      name: fmtTime(1439),
      color: dark ? 'var(--tfc-dark-mode-text-primary)' : '#2d3b45',
    });

    return times;
  }, []);

  function chooseTime(id: string) {
    setSelected(id);
  }

  return (
    <CourseDropdown
      choices={timeChoices}
      defaultColor={color}
      instructureStyle
      maxHeight={150}
      noDefault
      onCoursePage={false}
      selectedId={selected}
      setChoice={chooseTime}
      zIndex={30} // above the course dropdown under this
    />
  );
}
