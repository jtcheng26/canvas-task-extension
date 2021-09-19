export default async function assignmentsMarkedAsComplete(): Promise<
  Set<number>
> {
  return new Promise((resolve) => {
    chrome.storage.sync.get('complete_assignments', (result) => {
      const markedSet: Set<number> = new Set();
      (result.complete_assignments as number[]).forEach((assignment_id) => {
        markedSet.add(assignment_id);
      });
      resolve(markedSet);
    });
  });
}
