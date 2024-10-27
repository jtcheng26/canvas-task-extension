import { AssignmentStatus, FinalAssignment } from '../../types/assignment';
import { deleteCustomTask } from './customTask';

// local storage backed assignment overrides
export interface CustomOverrides {
  [key: string]:
    | AssignmentStatus.COMPLETE
    | AssignmentStatus.UNFINISHED
    | AssignmentStatus.DELETED;
}

// ID isn't always present, so keep as many identifiers as possible
export async function setCustomOverride(
  id: string,
  course_id: string,
  platformKey: string,
  status:
    | AssignmentStatus.COMPLETE
    | AssignmentStatus.DELETED
    | AssignmentStatus.UNFINISHED
) {
  const key = `${platformKey}_overrides`;
  const overrideId = `${id}_${course_id}`;
  const overrides = (await chrome.storage.local.get(key))[key] || {};
  const newOverrides = {
    ...overrides,
    [overrideId]: status,
  };
  if (status === AssignmentStatus.DELETED) {
    delete newOverrides[overrideId];
    deleteCustomTask('gradescope_custom', id);
  }
  chrome.storage.local.set({ [key]: newOverrides });

  return newOverrides;
}

export async function getCustomOverrides(
  platformKey: string
): Promise<CustomOverrides> {
  const key = `${platformKey}_overrides`;
  const res = await chrome.storage.local.get(key);
  if (!(key in res)) return {};
  return res[key] || {};
}

export async function applyCustomOverrides(
  assignments: FinalAssignment[],
  platformKey: string
): Promise<FinalAssignment[]> {
  const overrides = await getCustomOverrides(platformKey);
  return assignments.map((a) => {
    const key = `${a.id}_${a.course_id}`;
    return {
      ...a,
      override_id: key in overrides ? key : '',
      marked_complete:
        key in overrides && overrides[key] === AssignmentStatus.COMPLETE,
    };
  });
}

/* Mark an assignment either complete or incomplete via planner overrides.*/
function markCustomAssignment(
  complete: AssignmentStatus,
  assignment: FinalAssignment,
  key: string
): FinalAssignment {
  if (complete === AssignmentStatus.SEEN) return assignment; // shouldn't happen, just needed to make TS happy
  const retAssignment = { ...assignment };
  if (complete === AssignmentStatus.COMPLETE) {
    retAssignment.marked_complete = true;
  } else if (complete === AssignmentStatus.UNFINISHED) {
    retAssignment.marked_complete = false;
    retAssignment.submitted = false;
    retAssignment.graded = false;
  }
  setCustomOverride(assignment.id, assignment.course_id, key, complete);
  return retAssignment;
}

export const makeMarkAssignment =
  (platformKey: string) =>
  (complete: AssignmentStatus, assignment: FinalAssignment) =>
    markCustomAssignment(complete, assignment, platformKey);
