import { useContext, useState } from 'react';
import { FinalAssignment } from '../types';
import { useObjectStore } from './useStore';
import { AssignmentStoreContext } from '../contexts/contexts';
import { AssignmentStatus } from '../types/assignment';
import markAssignment from '../components/task-container/utils/markAssignment';

export interface AssignmentStoreInterface {
  state: Record<string, FinalAssignment>; // for components that rely on individual values
  assignmentList: string[]; // for components that rely on filtering/sorting/etc. the entire list
  createAssignment: (assignment: FinalAssignment | FinalAssignment[]) => void;
  updateAssignment: (
    assignment: FinalAssignment,
    status?: AssignmentStatus
  ) => void;
  deleteAssignment: (assignment: FinalAssignment | string) => void;
  getAssignmentList: (assignments?: string[]) => FinalAssignment[]; // return list of Course objects from subset of course ids (or return all if none specified)
  newPage: (assignments: FinalAssignment[]) => void; // replace everything in the store
}

export function useNewAssignmentStore(
  assignments: FinalAssignment[] = []
): AssignmentStoreInterface {
  const initial: Record<string, FinalAssignment> = {};
  assignments.forEach((assignment) => (initial[assignment.id] = assignment));
  const {
    state,
    update: updateStore,
    delete: deleteEntry,
    initialize,
  } = useObjectStore<FinalAssignment>(initial);
  const [assignmentList, setAssignmentList] = useState(Object.keys(initial));
  function createAssignment(assignment: FinalAssignment | FinalAssignment[]) {
    if (!Array.isArray(assignment)) assignment = [assignment];
    const res: Record<string, FinalAssignment> = assignment.reduce(
      (_, assignment) => updateStore([assignment.id], assignment),
      {}
    );
    setAssignmentList(Object.keys(res));
  }
  function updateAssignment(
    assignment: FinalAssignment,
    status?: AssignmentStatus
  ) {
    if (status) {
      assignment = markAssignment(status, assignment);
      if (status == AssignmentStatus.DELETED)
        return deleteAssignment(assignment);
    }
    const res = updateStore([assignment.id], assignment);
    setAssignmentList(Object.keys(res)); // force re-render
  }
  function deleteAssignment(assignment: FinalAssignment | string) {
    const res = deleteEntry([
      typeof assignment == 'string' || assignment instanceof String
        ? (assignment as string)
        : assignment.id,
    ]);
    setAssignmentList(Object.keys(res));
  }
  function getAssignmentList(assignments?: string[]): FinalAssignment[] {
    if (!assignments) return Object.values(state);
    return assignments.map((c) => state[c]);
  }
  function replaceAll(assignments: FinalAssignment[]) {
    const temp: Record<string, FinalAssignment> = {};
    assignments.forEach((assignment) => (temp[assignment.id] = assignment));
    initialize(temp);
    setAssignmentList(Object.keys(temp));
    console.log(temp);
  }

  return {
    state,
    assignmentList,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentList,
    newPage: replaceAll,
  };
}

export default function useAssignmentStore(): AssignmentStoreInterface {
  return useContext(AssignmentStoreContext);
}
