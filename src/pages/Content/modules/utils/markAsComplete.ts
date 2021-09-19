import { MAX_MARKED_ASSIGNMENTS } from '../constants';
import { Assignment } from '../types';

export default function markAsComplete(assignment: Assignment): void {
  if (!assignment.grade && !assignment.user_submitted) {
    assignment.user_submitted = true;
    chrome.storage.sync.get('complete_assignments', (result) => {
      const alreadyInStorage = result
        ? (result.complete_assignments as number[])
        : [];
      if (!alreadyInStorage.includes(assignment.id)) {
        while (alreadyInStorage.length >= MAX_MARKED_ASSIGNMENTS)
          alreadyInStorage.shift();
        alreadyInStorage.push(assignment.id);
      }
      chrome.storage.sync.set(
        {
          complete_assignments: alreadyInStorage,
        }
        // () => {
        //   chrome.storage.sync.get('complete_assignments', (res2) => {
        //     console.log(res2);
        //   });
        // }
      );
    });
  }
}
