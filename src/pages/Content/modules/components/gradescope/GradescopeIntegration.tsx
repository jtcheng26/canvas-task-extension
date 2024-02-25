import React, { useState } from 'react';
import { GradescopeIntegrationState } from './types';
import Modal from './components/Modal';
import CoursePopup from './components/CoursePopup';
import { syncCourse, unsyncCourse } from './utils/scrape';
import SyncStatus from './components/SyncStatus';

type Props = {
  course: string;
  data: GradescopeIntegrationState;
};

export default function GradescopeIntegration({ course, data }: Props) {
  const [modalShowing, setModalShowing] = useState(false);
  const [synced, setSynced] = useState(course in data.GSCOPE_INT_course_id_map);
  function hideModal() {
    setModalShowing(false);
  }
  function showModal() {
    setModalShowing(true);
  }
  function handleSync(canvasCourse: string) {
    if (synced) unsyncCourse(course);
    else syncCourse(course, canvasCourse);
    setModalShowing(false);
    setSynced(!synced);
  }
  function handleSyncButton() {
    showModal();
  }
  return (
    <div style={{ display: 'flex' }}>
      {modalShowing && (
        <Modal onClick={hideModal}>
          <CoursePopup
            courseToName={data.GSCOPE_INT_canvas_courses}
            onCancel={hideModal}
            onSubmit={handleSync}
            synced={synced}
          />
        </Modal>
      )}
      <SyncStatus onClick={handleSyncButton} synced={synced} />
    </div>
  );
}
