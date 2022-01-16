import {object, date} from 'yup';
import dayjs from 'dayjs';

export const validationSchema = object({
  dateOfBirth: date().max(dayjs().subtract(18, 'year').endOf('day'), 'You must be at least 18 years old'),
});
