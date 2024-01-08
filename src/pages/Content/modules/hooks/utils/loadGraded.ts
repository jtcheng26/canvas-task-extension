import graphqlReq from './gqlReq';

interface GQLResponse {
  [key: string]: {
    submissionsConnection: {
      nodes: {
        gradingStatus: string;
        score: number | null;
        grade: string | null;
      }[];
    };
  };
}

export interface GradeStatus {
  score: number;
  grade: string;
}

/*
Check how many of the assignments have a >0 grade
- assignments that (do NOT have a >0 grade) and (are NEITHER submitted nor marked complete) are incomplete
- ideally this is only querying graded assignments, which should not take long
*/
export async function queryGraded(
  ids: string[]
): Promise<Record<string, GradeStatus>> {
  const newQuery = (
    id: string,
    idx: number
  ) => `  item${idx}: assignment(id: ${id}) {
      submissionsConnection {
        nodes {
          gradingStatus
          grade
          score
        }
      }
    }`;

  const queries = ids.map((id, idx) => newQuery(id, idx));

  try {
    const counts = await graphqlReq<GQLResponse>(queries);

    const keys = Object.keys(counts);

    const ret: Record<string, GradeStatus> = {};
    ids.forEach((id, idx) => {
      // will be null if id is invalid
      if (
        counts[keys[idx]] &&
        counts[keys[idx]].submissionsConnection?.nodes.length
      ) {
        const res = counts[keys[idx]].submissionsConnection?.nodes[0];
        ret[id] = {
          score: res.score ? res.score : 0,
          grade: res.grade ? res.grade : '',
        };
        if (res.gradingStatus === 'excused') ret[id].grade = 'Excused';
      }
    });
    return ret;
  } catch (err) {
    console.error(err);
    return {};
  }
}
