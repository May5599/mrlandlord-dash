/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _lib_auth from "../_lib/auth.js";
import type * as _lib_email from "../_lib/email.js";
import type * as _lib_getCompanyFromToken from "../_lib/getCompanyFromToken.js";
import type * as _lib_getTenantFromToken from "../_lib/getTenantFromToken.js";
import type * as _lib_password from "../_lib/password.js";
import type * as companyAdmins from "../companyAdmins.js";
import type * as contacts from "../contacts.js";
import type * as createDefaultCompany from "../createDefaultCompany.js";
import type * as dashboard from "../dashboard.js";
import type * as maintenance from "../maintenance.js";
import type * as notifications from "../notifications.js";
import type * as platformAdmins from "../platformAdmins.js";
import type * as properties from "../properties.js";
import type * as sendEmail from "../sendEmail.js";
import type * as services_notificationService from "../services/notificationService.js";
import type * as superAdmins from "../superAdmins.js";
import type * as tenantMaintenance from "../tenantMaintenance.js";
import type * as tenantProfiles from "../tenantProfiles.js";
import type * as tenantSessions from "../tenantSessions.js";
import type * as tenants from "../tenants.js";
import type * as tenantsAuth from "../tenantsAuth.js";
import type * as tenantsDashboard from "../tenantsDashboard.js";
import type * as units from "../units.js";
import type * as vendors from "../vendors.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "_lib/auth": typeof _lib_auth;
  "_lib/email": typeof _lib_email;
  "_lib/getCompanyFromToken": typeof _lib_getCompanyFromToken;
  "_lib/getTenantFromToken": typeof _lib_getTenantFromToken;
  "_lib/password": typeof _lib_password;
  companyAdmins: typeof companyAdmins;
  contacts: typeof contacts;
  createDefaultCompany: typeof createDefaultCompany;
  dashboard: typeof dashboard;
  maintenance: typeof maintenance;
  notifications: typeof notifications;
  platformAdmins: typeof platformAdmins;
  properties: typeof properties;
  sendEmail: typeof sendEmail;
  "services/notificationService": typeof services_notificationService;
  superAdmins: typeof superAdmins;
  tenantMaintenance: typeof tenantMaintenance;
  tenantProfiles: typeof tenantProfiles;
  tenantSessions: typeof tenantSessions;
  tenants: typeof tenants;
  tenantsAuth: typeof tenantsAuth;
  tenantsDashboard: typeof tenantsDashboard;
  units: typeof units;
  vendors: typeof vendors;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
