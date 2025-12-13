/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as contacts from "../contacts.js";
import type * as createDefaultCompany from "../createDefaultCompany.js";
import type * as maintenance from "../maintenance.js";
import type * as notifications from "../notifications.js";
import type * as properties from "../properties.js";
import type * as sendEmail from "../sendEmail.js";
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
  contacts: typeof contacts;
  createDefaultCompany: typeof createDefaultCompany;
  maintenance: typeof maintenance;
  notifications: typeof notifications;
  properties: typeof properties;
  sendEmail: typeof sendEmail;
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
