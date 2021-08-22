import axios from 'axios';
import LongCourseList from '../tests/data/api/courses/longCourseList.json';
import {
  getAllAssignmentRequests,
  onlyUnlockedAssignments,
  onlyTheseCourses,
  onlyActiveAssignments,
  withinTimeBounds,
} from './useAssignments';
import AssignmentMap from '../types/assignmentMap';
import { Options } from '../types';

import someLocked from '../tests/data/assignmentMap/someLocked.json';
import lockedButSubmitted from '../tests/data/assignmentMap/lockedButSubmitted.json';
import lockedButGraded from '../tests/data/assignmentMap/lockedButGraded.json';
import allCourses from '../tests/data/assignmentMap/allCourses.json';
import someActive from '../tests/data/assignmentMap/someActive.json';

import weekOptions from '../tests/data/options/week.json';

import beforeStartHour from '../tests/data/assignmentMap/due_at/beforeStartHour.json';
import afterStartHour from '../tests/data/assignmentMap/due_at/afterStartHour.json';
import beforeStartMinute from '../tests/data/assignmentMap/due_at/beforeStartMinute.json';
import afterStartMinute from '../tests/data/assignmentMap/due_at/afterStartMinute.json';

import afterEndHour from '../tests/data/assignmentMap/due_at/afterEndHour.json';
import beforeEndHour from '../tests/data/assignmentMap/due_at/beforeEndHour.json';
import afterEndMinute from '../tests/data/assignmentMap/due_at/afterEndMinute.json';
import beforeEndMinute from '../tests/data/assignmentMap/due_at/beforeEndMinute.json';

import beforeStartDay from '../tests/data/assignmentMap/due_at/beforeStartDay.json';
import afterEndDay from '../tests/data/assignmentMap/due_at/afterEndDay.json';
import forEachTZ from '../tests/utils/forEachTZ';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getAllAssignmentRequests', () => {
  it('fetches assignments from 10 courses at a time', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: 'test' });

    const start = 'startDate';
    const end = 'endDate';
    const courses = LongCourseList;

    const res = getAllAssignmentRequests(start, end, courses);
    expect(res.length).toBe(3);
  });
});

describe('onlyUnlockedAssignments', () => {
  it('excludes locked assignments if not submitted/graded', () => {
    const data = someLocked as AssignmentMap;
    const res = onlyUnlockedAssignments(data);
    Object.keys(res).forEach((course) => {
      expect(res[course].length).toBe(
        data[course].reduce((a, b) => a + (b.locked_for_user ? 0 : 1), 0)
      );
    });
  });

  it('includes locked assignments that have been submitted', () => {
    const data = lockedButSubmitted as AssignmentMap;
    const res = onlyUnlockedAssignments(data);
    Object.keys(res).forEach((course) => {
      expect(res[course].length).toBe(data[course].length);
    });
  });

  it('includes locked assignments that have been graded', () => {
    const data = lockedButGraded as AssignmentMap;
    const res = onlyUnlockedAssignments(data);
    Object.keys(res).forEach((course) => {
      expect(res[course].length).toBe(data[course].length);
    });
  });
});

describe('onlyTheseCourses', () => {
  it('filters by the given courses', () => {
    const data = allCourses as AssignmentMap;
    const required = Object.keys(data)
      .slice(0, Object.keys(data).length / 2)
      .map((c) => parseInt(c));

    const res = onlyTheseCourses(required, data);
    expect(Object.keys(res).length).toBe(required.length);
    Object.keys(res).forEach((course, i) => {
      expect(parseInt(course)).toBe(required[i]);
    });
  });
});

describe('onlyActiveAssignments', () => {
  it('excludes courses with no active assignments', () => {
    const data = someActive as AssignmentMap;

    const res = onlyActiveAssignments(data);
    expect(Object.keys(res).length).toBe(
      Object.keys(data).reduce((a, b) => a + (data[b].length > 0 ? 1 : 0), 0)
    );
  });
});

describe('withinTimeBounds', () => {
  function testBounds(
    start: string,
    end: string,
    data: AssignmentMap,
    assertion: (res: AssignmentMap) => void
  ) {
    forEachTZ(() => {
      const options = weekOptions as Options;
      const startDate = new Date(start);
      const endDate = new Date(end);

      /* Modify due date to timezone so tests can remain the same */
      const newAssignments: AssignmentMap = {};
      Object.keys(data).forEach((course) => {
        newAssignments[course] = data[course].map((d) => {
          const due_at = new Date(d.due_at);
          due_at.setMinutes(due_at.getMinutes() + due_at.getTimezoneOffset());
          return { ...d, due_at: due_at.toISOString() };
        });
      });

      assertion(withinTimeBounds(startDate, endDate, options, newAssignments));
    });
  }

  it('excludes assignments due before start hour', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      beforeStartHour,
      (res) => {
        expect(res['1'].length).toBe(0);
      }
    );
  });

  it('includes assignments after start hour before end', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      afterStartHour,
      (res) => {
        expect(res['1'].length).toBe(1);
      }
    );
  });

  it('excludes assignments due before start minute', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      beforeStartMinute,
      (res) => {
        expect(res['1'].length).toBe(0);
      }
    );
  });

  it('includes assignments due after start minute', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      afterStartMinute,
      (res) => {
        expect(res['1'].length).toBe(1);
      }
    );
  });

  it('excludes assignments due after end hour', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      afterEndHour,
      (res) => {
        expect(res['1'].length).toBe(0);
      }
    );
  });

  it('includes assignments before end hour after start', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      beforeEndHour,
      (res) => {
        expect(res['1'].length).toBe(1);
      }
    );
  });

  it('excludes assignments due after end minute', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      afterEndMinute,
      (res) => {
        expect(res['1'].length).toBe(0);
      }
    );
  });

  it('includes assignments due before end minute', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      beforeEndMinute,
      (res) => {
        expect(res['1'].length).toBe(1);
      }
    );
  });

  it('excludes assignments before the start day', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      beforeStartDay,
      (res) => {
        expect(res['1'].length).toBe(0);
      }
    );
  });

  it('excludes assignments after the end day', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      afterEndDay,
      (res) => {
        expect(res['1'].length).toBe(0);
      }
    );
  });
});
