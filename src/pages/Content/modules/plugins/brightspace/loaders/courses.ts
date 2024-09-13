import { Course } from '../../../types';
import baseURL from '../../../utils/baseURL';
import { loadCustomColorsWithDefaults } from '../../shared/customColors';

type BrightspaceEnrollment = {
  OrgUnit: {
    Id: number;
    Type: {
      Id: number;
      Code: string;
      Name: string;
    };
    Name: string;
    Code: string;
  };
  Access: {
    IsActive: boolean;
    CanAccess: boolean;
  };
  PinDate: string | null;
};

type PaginatedAPIResponse<T> =
  | {
      // PagedResultSet
      PagingInfo: {
        Bookmark: string;
        HasMoreItems: boolean;
      };
      Items: T[];
    }
  | {
      // ObjectListPage
      Objects: T[];
      Next?: string;
    };

export async function getPaginatedRequestBrightspace<T>(
  url: string,
  recurse = false
): Promise<T[]> {
  const res = (await (await fetch(url)).json()) as PaginatedAPIResponse<T>;
  console.log(url, res);
  if (recurse) {
    if ('Next' in res && res.Next)
      return res.Objects.concat(
        await getPaginatedRequestBrightspace(res.Next, true)
      );
    else if ('PagingInfo' in res && res.PagingInfo.HasMoreItems) {
      const page = new URL(url);
      page.searchParams.set('bookmark', res.PagingInfo.Bookmark);
      return res.Items.concat(
        await getPaginatedRequestBrightspace(page.toString(), true)
      );
    }
  }
  return 'Items' in res ? res.Items : res.Objects;
}

async function getCourseColors(
  courses: string[]
): Promise<Record<string, string>> {
  const colors = await loadCustomColorsWithDefaults(
    'brightspace_custom',
    courses
  );

  return colors;
}

export default async function loadBrightspaceCourses() {
  const res = await getPaginatedRequestBrightspace<BrightspaceEnrollment>(
    `${baseURL()}/d2l/api/lp/1.43/enrollments/myenrollments/`,
    true
  );
  const courses = res.filter(
    (c) => c.Access.CanAccess && c.Access.IsActive && c.OrgUnit.Type.Id === 3
  );
  const colors = await getCourseColors(
    courses.map((c) => c.OrgUnit.Id.toString())
  );
  const coursesWithColors: Course[] = courses.map((c) => {
    return {
      id: c.OrgUnit.Id + '',
      name: c.OrgUnit.Name,
      course_code: c.OrgUnit.Code,
      position: !c.PinDate ? 0 : 1,
      color: colors[c.OrgUnit.Id.toString()],
    };
  });

  return coursesWithColors;
}
