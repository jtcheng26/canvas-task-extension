import axios from 'axios';
import {
  filterTimeBounds,
  filterAssignmentTypes,
  mergePartial,
} from './useAssignments';
import { getAllAssignments } from '../canvas/loaders/loadCanvas';
import { AssignmentType, FinalAssignment } from '../../types';

import plannerRes from '../../tests/data/api/planner.json';

import beforeStartHour from '../../tests/data/assignment-list/due_at/beforeStartHour.json';
import afterStartHour from '../../tests/data/assignment-list/due_at/afterStartHour.json';
import beforeStartMinute from '../../tests/data/assignment-list/due_at/beforeStartMinute.json';
import afterStartMinute from '../../tests/data/assignment-list/due_at/afterStartMinute.json';

import afterEndHour from '../../tests/data/assignment-list/due_at/afterEndHour.json';
import beforeEndHour from '../../tests/data/assignment-list/due_at/beforeEndHour.json';
import afterEndMinute from '../../tests/data/assignment-list/due_at/afterEndMinute.json';
import beforeEndMinute from '../../tests/data/assignment-list/due_at/beforeEndMinute.json';

import beforeStartDay from '../../tests/data/assignment-list/due_at/beforeStartDay.json';
import afterEndDay from '../../tests/data/assignment-list/due_at/afterEndDay.json';
import forEachTZ from '../../tests/utils/forEachTZ';
import { AssignmentDefaults, OptionsDefaults } from '../../constants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getAllAssignment', () => {
  it('fetches assignments from the planner/items endpoint and fills in values', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: plannerRes, headers: {} });

    const assignments = await getAllAssignments(
      new Date('2022-01-01'),
      new Date('2022-01-01'),
      OptionsDefaults
    );
    expect(assignments.length).toBe(plannerRes.length);
    expect(assignments[0].course_id).toBe(plannerRes[0].course_id.toString());
    expect(assignments[0].id).toBe(plannerRes[0].plannable.id.toString());
    expect(assignments[0].marked_complete).toBe(false);
  });
  it('substitutes null/empty values with defaults', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: plannerRes, headers: {} });

    const assignments = await getAllAssignments(
      new Date('2022-01-01'),
      new Date('2022-01-01'),
      OptionsDefaults
    );
    // good values
    expect(assignments[0].name).toBe(plannerRes[0].plannable.title);
    // null values
    expect(assignments[0].marked_complete).toBe(false);
    expect(assignments[0].points_possible).toBe(
      AssignmentDefaults.points_possible
    );
    expect(assignments[0].submitted).toBe(AssignmentDefaults.submitted);
    expect(assignments[0].graded).toBe(AssignmentDefaults.graded);
  });
  it('filters to assignment types', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: plannerRes, headers: {} });

    let assignments = await getAllAssignments(
      new Date('2022-01-01'),
      new Date('2022-01-01'),
      OptionsDefaults
    );
    assignments = filterAssignmentTypes(assignments);
    expect(assignments.length).toBe(5);
    expect(assignments[0].type).toBe(AssignmentType.ASSIGNMENT);
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
      const newAssignments = data.map((d) => {
        const due_at = new Date(d.due_at);
        due_at.setMinutes(due_at.getMinutes() + due_at.getTimezoneOffset());
        return {
          ...AssignmentDefaults,
          due_at: due_at.toISOString(),
        } as FinalAssignment;
      });

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

describe('mergePartial', () => {
  it('returns a copy on the same object', () => {
    const res = mergePartial(AssignmentDefaults, AssignmentDefaults);
    Object.keys(AssignmentDefaults).forEach((k) =>
      expect(res[k as keyof FinalAssignment]).toBe(
        AssignmentDefaults[k as keyof FinalAssignment]
      )
    );
    res.course_id = '12345';
    expect(res.course_id).not.toBe(AssignmentDefaults.course_id);
  });

  it('keeps default values in a partial with undefined keys', () => {
    const partial: Partial<FinalAssignment> = {
      ...AssignmentDefaults,
    };
    delete partial.course_id;
    delete partial.id;
    delete partial.name;
    const res = mergePartial(partial, AssignmentDefaults);
    expect(res.course_id).toBe(AssignmentDefaults.course_id);
    expect(res.id).toBe(AssignmentDefaults.id);
    expect(res.name).toBe(AssignmentDefaults.name);
    expect('course_id' in partial).toBe(false);
    expect('id' in partial).toBe(false);
    expect('name' in partial).toBe(false);
  });

  it('keeps new values', () => {
    const partial: Partial<FinalAssignment> = {
      ...AssignmentDefaults,
      needs_grading_count: 1234,
      name: 'Test name different from default',
    };
    const res = mergePartial(partial, AssignmentDefaults);
    expect(partial.needs_grading_count).not.toBe(
      AssignmentDefaults.needs_grading_count
    );
    expect(res.needs_grading_count).toBe(partial.needs_grading_count);
    expect(partial.name).not.toBe(AssignmentDefaults.name);
    expect(res.name).toBe(partial.name);
  });

  it('keeps new values and fills in default values', () => {
    const partial: Partial<FinalAssignment> = {
      ...AssignmentDefaults,
      needs_grading_count: 1234,
      name: 'Test name different from default',
      marked_complete: !AssignmentDefaults.marked_complete,
    };
    delete partial.course_id;
    delete partial.id;
    const res = mergePartial(partial, AssignmentDefaults);
    expect(res.course_id).toBe(AssignmentDefaults.course_id);
    expect(res.id).toBe(AssignmentDefaults.id);
    expect('course_id' in partial).toBe(false);
    expect('id' in partial).toBe(false);
    expect(res.name).toBe(partial.name);
    expect(res.needs_grading_count).toBe(partial.needs_grading_count);
    expect(res.marked_complete).toBe(partial.marked_complete);
    expect(partial.name).not.toBe(AssignmentDefaults.name);
    expect(partial.needs_grading_count).not.toBe(
      AssignmentDefaults.needs_grading_count
    );
    expect(partial.marked_complete).not.toBe(
      AssignmentDefaults.marked_complete
    );
  });
});
