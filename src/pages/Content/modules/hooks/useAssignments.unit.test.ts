import axios from 'axios';
import {
  filterTimeBounds,
  applyDefaults,
  getAllAssignments,
  filterAssignmentTypes,
} from './useAssignments';
import { AssignmentType, FinalAssignment } from '../types';

import plannerRes from '../tests/data/api/planner.json';

import beforeStartHour from '../tests/data/assignment-list/due_at/beforeStartHour.json';
import afterStartHour from '../tests/data/assignment-list/due_at/afterStartHour.json';
import beforeStartMinute from '../tests/data/assignment-list/due_at/beforeStartMinute.json';
import afterStartMinute from '../tests/data/assignment-list/due_at/afterStartMinute.json';

import afterEndHour from '../tests/data/assignment-list/due_at/afterEndHour.json';
import beforeEndHour from '../tests/data/assignment-list/due_at/beforeEndHour.json';
import afterEndMinute from '../tests/data/assignment-list/due_at/afterEndMinute.json';
import beforeEndMinute from '../tests/data/assignment-list/due_at/beforeEndMinute.json';

import beforeStartDay from '../tests/data/assignment-list/due_at/beforeStartDay.json';
import afterEndDay from '../tests/data/assignment-list/due_at/afterEndDay.json';
import forEachTZ from '../tests/utils/forEachTZ';
import { AssignmentDefaults } from '../constants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getAllAssignment', () => {
  it('fetches assignments from the planner/items endpoint', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: plannerRes });

    const assignments = await getAllAssignments(
      new Date('2022-01-01'),
      new Date('2022-01-01')
    );
    expect(assignments.length).toBe(plannerRes.length);
    expect(assignments[0].course_id).toBe(plannerRes[0].course_id);
  });
  it('filters to assignment types', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: plannerRes });

    let assignments = await getAllAssignments(
      new Date('2022-01-01'),
      new Date('2022-01-01')
    );
    assignments = filterAssignmentTypes(assignments);
    expect(assignments.length).toBe(10);
    expect(assignments[0].type).toBe(AssignmentType.ASSIGNMENT);
  });
});

describe('applyDefaults', () => {
  it('sets the default values', () => {
    const defaults = AssignmentDefaults;
    let assignments = [{}] as FinalAssignment[];
    assignments = applyDefaults(defaults, assignments);
    expect(assignments[0].course_id).toBe(defaults.course_id);
    expect(assignments[0].due_at).toBe(defaults.due_at);
    expect(assignments[0].graded).toBe(defaults.graded);
    expect(assignments[0].html_url).toBe(defaults.html_url);
    expect(assignments[0].id).toBe(defaults.id);
    expect(assignments[0].marked_complete).toBe(defaults.marked_complete);
    expect(assignments[0].name).toBe(defaults.name);
    expect(assignments[0].points_possible).toBe(defaults.points_possible);
    // unrequired properties
    expect(assignments[0].color).toBe(defaults.color);
    expect(assignments[0].course_name).toBe(defaults.course_name);
    expect(assignments[0].position).toBe(defaults.position);
    expect(assignments[0].score).toBe(defaults.score);
  });
  it('prioritizes existing values', () => {
    const defaults = AssignmentDefaults;
    const htmlValue = 'This is my url';
    const courseNameValue = 'This is my course name';
    const nameValue = 'This is my name';
    let assignments = [
      { html_url: htmlValue, course_name: courseNameValue, name: nameValue },
    ] as FinalAssignment[];
    assignments = applyDefaults(defaults, assignments);

    expect(assignments[0].html_url).toBe(htmlValue);
    expect(assignments[0].html_url).not.toBe(defaults.html_url);
    expect(assignments[0].course_name).toBe(courseNameValue);
    expect(assignments[0].course_name).not.toBe(defaults.course_name);
    expect(assignments[0].name).toBe(nameValue);
    expect(assignments[0].name).not.toBe(defaults.name);

    expect(assignments[0].course_id).toBe(defaults.course_id);
    expect(assignments[0].due_at).toBe(defaults.due_at);
    expect(assignments[0].graded).toBe(defaults.graded);
    expect(assignments[0].id).toBe(defaults.id);
    expect(assignments[0].marked_complete).toBe(defaults.marked_complete);
    expect(assignments[0].points_possible).toBe(defaults.points_possible);
    // unrequired properties
    expect(assignments[0].color).toBe(defaults.color);
    expect(assignments[0].position).toBe(defaults.position);
    expect(assignments[0].score).toBe(defaults.score);
  });
});

describe('filterTimeBounds', () => {
  function testBounds(
    start: string,
    end: string,
    data: FinalAssignment[],
    assertion: (res: FinalAssignment[]) => void
  ) {
    forEachTZ(() => {
      const startDate = new Date(start);
      const endDate = new Date(end);

      /* Modify due date to timezone so tests can remain the same */
      const newAssignments = applyDefaults(
        AssignmentDefaults,
        data.map((d) => {
          const due_at = new Date(d.due_at);
          due_at.setMinutes(due_at.getMinutes() + due_at.getTimezoneOffset());
          return { due_at: due_at.toISOString() } as FinalAssignment;
        })
      );

      assertion(filterTimeBounds(startDate, endDate, newAssignments));
    });
  }

  function mergeTestData(sample: Record<string, unknown>[]): FinalAssignment[] {
    return sample.map((s) => ({ ...AssignmentDefaults, ...s }));
  }

  it('excludes assignments due before start hour', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      mergeTestData(beforeStartHour),
      (res) => {
        expect(res.length).toBe(0);
      }
    );
  });

  it('includes assignments after start hour before end', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      mergeTestData(afterStartHour),
      (res) => {
        expect(res.length).toBe(1);
      }
    );
  });

  it('excludes assignments due before start minute', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      mergeTestData(beforeStartMinute),
      (res) => {
        expect(res.length).toBe(0);
      }
    );
  });

  it('includes assignments due after start minute', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      mergeTestData(afterStartMinute),
      (res) => {
        expect(res.length).toBe(1);
      }
    );
  });

  it('excludes assignments due after end hour', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      mergeTestData(afterEndHour),
      (res) => {
        expect(res.length).toBe(0);
      }
    );
  });

  it('includes assignments before end hour after start', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      mergeTestData(beforeEndHour),
      (res) => {
        expect(res.length).toBe(1);
      }
    );
  });

  it('excludes assignments due after end minute', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      mergeTestData(afterEndMinute),
      (res) => {
        expect(res.length).toBe(0);
      }
    );
  });

  it('includes assignments due before end minute', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      mergeTestData(beforeEndMinute),
      (res) => {
        expect(res.length).toBe(1);
      }
    );
  });

  it('excludes assignments before the start day', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      mergeTestData(beforeStartDay),
      (res) => {
        expect(res.length).toBe(0);
      }
    );
  });

  it('excludes assignments after the end day', () => {
    testBounds(
      '2018-02-26 10:15:00',
      '2018-03-05 10:15:00',
      mergeTestData(afterEndDay),
      (res) => {
        expect(res.length).toBe(0);
      }
    );
  });
});
