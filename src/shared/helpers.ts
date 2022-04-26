export function hasOwn<T = any>(object: T | any, key: keyof T): boolean {
    return Object.prototype.hasOwnProperty.call(object, key);
  }
  
export function objectKeys<T>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}

export const isNullOrUndefined = (arg: any): boolean => {
    return arg === null || arg === undefined;
};

export const isFunction = (arg: any): boolean => typeof arg === 'function';
  

/* eslint-disable no-nested-ternary */
/**
 * Wraps the provided value in an array, unless the provided value is an array.
 * Returns empty array if value is `null` or `undefined`.
 */

 export function coerceArray<T>(value: T | T[]): T[] {
   return Array.isArray(value) ? value : isNullOrUndefined(value) ? [] : [value];
 }
 
 export function coerceNumber(value: any): number;
 export function coerceNumber<D>(value: any, fallback: D): number | D;
 export function coerceNumber(value: any, fallbackValue = 0) {
   return isNumber(value) ? Number(value) : fallbackValue;
 }
 
 export function isNumber(value: any): boolean {
   // parseFloat(value) handles most of the cases we're interested in (it treats null, empty string,
   // and other non-number values as NaN, where Number just uses 0) but it considers the string
   // '123hello' to be a valid number. Therefore we also check if Number(value) is NaN.
   return !Number.isNaN(Number(parseFloat(value as any))) && !Number.isNaN(Number(value));
 }
 