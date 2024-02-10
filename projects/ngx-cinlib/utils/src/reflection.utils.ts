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
