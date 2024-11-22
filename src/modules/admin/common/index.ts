export const IAdminServiceToken = Symbol('IAdminServiceToken');
export const IAdminClientServiceToken = Symbol('IAdminClientServiceToken');

export const IAdminClientServicePath = 'IAdminClientServicePath';

export const IJdbcStartServiceToken = Symbol('IJdbcStartServiceToken');

export const IJdbcStartServicePath = 'IJdbcStartServicePath';

export interface IVersionResult {
  expire?: boolean;
  latestVersion?: string;
}
