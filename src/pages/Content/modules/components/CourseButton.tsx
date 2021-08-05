import React from 'react';

interface CourseButtonProps {
  name: string;
  color: string;
  id: number;
  last: boolean;
  setCourse: (id: number) => void;
  menuVisible: boolean;
  setMenuVisible: (menuVisible: boolean) => void;
}

/*
  Individual options in course name dropdown
*/
export default function CourseButton({
  name,
  color = 'black',
  id = -1,
  last = false,
  setCourse,
  menuVisible,
  setMenuVisible,
}: CourseButtonProps) {
  function handleClick() {
    setCourse(id);
    setMenuVisible(false);
  }
  return (
    <div
      className={`course-btn${last ? ' course-btn-last' : ''}`}
      onClick={handleClick}
      style={{
        display: menuVisible ? 'block' : 'none',
        color: color,
      }}
    >
      {name}
    </div>
  );
}
