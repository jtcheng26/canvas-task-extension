import React, { useEffect, useState } from 'react';
import { GradescopeIntegrationState } from './types';
import Modal from './components/Modal';
import CoursePopup from './components/CoursePopup';
import { syncCourse, unsyncCourse, updateCourseTasks } from './utils/scrape';
import SyncStatus from './components/SyncStatus';
import GradescopePromo from './components/GradescopePromo';
import { viewPromo } from './utils/store';

type Props = {
  course: string;
  courseName: string;
  data: GradescopeIntegrationState;
  promo: boolean;
};

export default function GradescopeIntegration({
  course,
  courseName,
  data,
  promo,
}: Props) {
  const [modalShowing, setModalShowing] = useState(false);
  const [synced, setSynced] = useState(course in data.GSCOPE_INT_course_id_map);
  const [showPromo, setShowPromo] = useState(promo);
  useEffect(() => {
    const listener = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      const key = 'GSCOPE_INT_course_id_map';
      if (key in changes) {
        const isSynced = course in changes[key].newValue;
        setSynced(isSynced);
        if (isSynced) updateCourseTasks([course]);
      }
      if (promo) {
        const key = 'GSCOPE_INT_promo';
        if (key in changes && changes[key].newValue.includes(course))
          setShowPromo(false);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);
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
    hidePromo();
  }
  function handleSyncButton() {
    showModal();
  }
  function hidePromo() {
    viewPromo(course);
  }
  if (promo && !showPromo) return null;
  return (
    <div style={{ display: 'flex' }}>
      {modalShowing && (
        <Modal onClick={hideModal}>
          <CoursePopup
            courseName={courseName}
            courseToName={data.GSCOPE_INT_canvas_courses}
            onCancel={hideModal}
            onSubmit={handleSync}
            synced={synced}
          />
        </Modal>
      )}
      {!showPromo ? (
        <SyncStatus onClick={handleSyncButton} synced={synced} />
      ) : (
        <GradescopePromo onExit={hidePromo} onSubmit={showModal} />
      )}
    </div>
  );
}
