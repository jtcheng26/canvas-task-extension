import React from 'react';
import isDarkMode from '../utils/isDarkMode';
import { CourseStoreInterface } from '../hooks/useCourseStore';
import { ExperimentsHubInterface } from '../hooks/useExperiment';
import { OptionsInterface } from '../hooks/useOptions';
import { AssignmentStoreInterface } from '../hooks/useAssignmentStore';
import { LMSConfig } from '../types/config';

export const DarkContext = React.createContext(isDarkMode());
export const CourseStoreContext = React.createContext<CourseStoreInterface>(
  {} as CourseStoreInterface
);
export const AssignmentStoreContext =
  React.createContext<AssignmentStoreInterface>({} as AssignmentStoreInterface);
export const ExperimentsContext = React.createContext<ExperimentsHubInterface>(
  {} as ExperimentsHubInterface
);
export const OptionsContext = React.createContext<OptionsInterface>(
  {} as OptionsInterface
);
export const LMSContext = React.createContext<LMSConfig>({} as LMSConfig);
