import { MAX_MARKED_ASSIGNMENTS } from '../constants';
import { Assignment } from '../types';

export default function markAsIncomplete(assignment: Assignment): void {
  if (!(!assignment.grade && !assignment.user_submitted)) {
    assignment.user_submitted = false;
    assignment.grade = 0;
    chrome.storage.sync.get('incomplete_assignments', (result) => {
      const alreadyInStorage = result
        ? (result.incomplete_assignments as number[])
        : [];
      if (!alreadyInStorage.includes(assignment.id)) {
        while (alreadyInStorage.length >= MAX_MARKED_ASSIGNMENTS)
          alreadyInStorage.shift();
        alreadyInStorage.push(assignment.id);
      }
      chrome.storage.sync.set(
        {
          incomplete_assignments: alreadyInStorage,
        }
        // () => {
        //   chrome.storage.sync.get('incomplete_assignments', (res2) => {
        //     console.log(res2);
        //   });
        // }
      );
    });
    chrome.storage.sync.get('complete_assignments', (result) => {
      const alreadyInStorage = result
        ? (result.complete_assignments as number[])
        : [];
      if (alreadyInStorage.includes(assignment.id)) {
        alreadyInStorage.splice(alreadyInStorage.indexOf(assignment.id));
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
