export const TaskListStates = ['Unfinished', 'Completed'] as const;
export type TaskListState = typeof TaskListStates[number];
