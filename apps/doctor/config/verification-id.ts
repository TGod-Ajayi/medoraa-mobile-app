export type SelectedMethodProps =
  | 'national_id'
  | 'international_passport'
  | 'drivers_license';

export const METHOD_BY_ID: Record<number, SelectedMethodProps> = {
  1: 'national_id',
  2: 'international_passport',
  3: 'drivers_license',
};

/** Matches `id-method` / deep links that use kebab-case ids. */
export function selectedMethodToRouteParam(method: SelectedMethodProps): string {
  switch (method) {
    case 'national_id':
      return 'national-id';
    case 'international_passport':
      return 'passport';
    case 'drivers_license':
      return 'drivers-license';
  }
}

export function routeParamToSelectedMethod(
  param: string | undefined
): SelectedMethodProps | null {
  switch (param) {
    case 'national-id':
      return 'national_id';
    case 'passport':
      return 'international_passport';
    case 'drivers-license':
      return 'drivers_license';
    default:
      return null;
  }
}
