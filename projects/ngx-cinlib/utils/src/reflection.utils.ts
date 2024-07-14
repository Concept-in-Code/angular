/* eslint-disable @typescript-eslint/no-explicit-any */

import { Maybe } from "ngx-cinlib/core";

export const fieldValue = (
  object: any,
  field: Maybe<string>
): any =>
  field?.split('.').reduce((obj, field) => (obj as never)?.[field], object);

export const setFieldValue = (
  object: any,
  field: string | undefined,
  newValue: any
): any => {
  if (!field) {
    // If the field is undefined, return the original object unchanged
    return object;
  }

  const fields = field.split('.');
  const copy = { ...object };

  const updateField = (obj: any, fields: string[], index: number) => {
    if (index === fields.length - 1) {
      obj[fields[index]] = newValue;
    } else {
      obj[fields[index]] = {
        ...obj[fields[index]],
        [fields[index]]: updateField(obj[fields[index]], fields, index + 1),
      };
    }
    return obj;
  };

  return updateField(copy, fields, 0);
};

export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;

  if (obj1 && typeof obj1 === 'object' && obj2 && typeof obj2 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  }

  return false;
}
