import Course from './course';
import {
  FinalAssignment,
  PlannerAssignment,
  AssignmentType,
} from './assignment';
import UserData from './userData';
import Options, { Period } from './options';
import { Direction } from './misc';
import { ExperimentConfig } from './experiment';

// https://stackoverflow.com/questions/41253310/typescript-retrieve-element-type-information-from-array-type
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export {
  Course,
  FinalAssignment,
  ExperimentConfig,
  PlannerAssignment,
  AssignmentType,
  UserData,
  Options,
  Period,
  Direction,
};
