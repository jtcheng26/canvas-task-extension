export default async function assignmentsMarkedAsIncomplete(): Promise<
  Set<number>
> {
  return new Promise((resolve) => {
    chrome.storage.sync.get('incomplete_assignments', (result) => {
      const markedSet: Set<number> = new Set();
      (result.incomplete_assignments as number[]).forEach((assignment_id) => {
        markedSet.add(assignment_id);
      });
      resolve(markedSet);
    });
  });
}
