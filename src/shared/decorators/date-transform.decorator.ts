import { Transform } from 'class-transformer';

import { toUTCDate } from '../utils/date.utils';

export function ToDate() {
  return Transform(({ value }) => {
    if (!value) return value;
    return toUTCDate(value);
  });
}
