// move storage.sync items from older versions to storage.local
// reason: storage.sync has very low limits (< 8kb)
export default async function migrateGradescopeToLocal() {
  const res = await chrome.storage.sync.get('GSCOPE_INT_course_id_map');
  if (!res || !('GSCOPE_INT_course_id_map' in res)) return;
  const localKeys = ['GSCOPE_INT_canvas_courses'];
  Object.keys(res['GSCOPE_INT_course_id_map']).forEach((gid) => {
    localKeys.push(
      `GSCOPE_INT_tasks_${gid}`,
      `GSCOPE_INT_tasks_overrides_${gid}`
    );
  });
  const old = await chrome.storage.sync.get(localKeys);
  if (Object.values(old).filter((v) => !!v).length) {
    await chrome.storage.local.set(old);
    chrome.storage.sync.remove(localKeys);
  }
}
