import apiReq from '../../../utils/apiReq';

/* From my understanding, graphql never paginates unless client explicitly specifies it */
export default async function graphqlReq<Type>(
  queries: string[]
): Promise<Type> {
  if (queries.length === 0) return {} as Type;
  const data = {
    query: `query MyQuery {
          ${queries.reduce((prev, curr) => prev + '\n' + curr, '')}
        }`,
  };
  try {
    const resp = await apiReq('/graphql', JSON.stringify(data), 'post');
    if ('errors' in resp.data || resp.status / 100 != 2) return {} as Type;
    const res = resp.data.data as Type;
    return res;
  } catch (err) {
    console.error(err);
    return {} as Type;
  }
}
