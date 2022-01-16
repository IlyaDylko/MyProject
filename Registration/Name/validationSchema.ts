import {object, string} from 'yup';

export const validationSchema = object({
  name: string().matches(/^[a-zA-Z'’. ]*$/, 'aA-zZ; excluded numbers and special characters'),
});
