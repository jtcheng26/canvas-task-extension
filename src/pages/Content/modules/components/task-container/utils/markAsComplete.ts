import { MAX_MARKED_ASSIGNMENTS } from '../../../constants';
import { FinalAssignment } from '../../../types';

export default function markAsComplete(
  assignment: FinalAssignment
): FinalAssignment {
  assignment.marked_complete = true;
  chrome.storage.sync.get('complete_assignments', (result) => {
    const alreadyInStorage = result
      ? (result.complete_assignments as number[])
      : [];
    if (!alreadyInStorage.includes(assignment.id)) {
      while (alreadyInStorage.length >= MAX_MARKED_ASSIGNMENTS)
        alreadyInStorage.shift();
      alreadyInStorage.push(assignment.id);
    }
    chrome.storage.sync.set({
      complete_assignments: alreadyInStorage,
    });
  });
  return assignment;
}
