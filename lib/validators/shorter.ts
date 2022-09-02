import * as yup from 'yup';

const BLACKLIST = [
  'api',
  'dashboard',
  'admin',
  'login',
  'logout',
  'register',
  'forgot',
  'reset',
  'settings',
  'profile',
  'account',
  'email',
  'password',
  'username',
  'user',
  'users',
];

const shorterValidator = yup.object().shape({
  name: yup.string().test('name', (value) => !BLACKLIST.includes(value?.toLowerCase() as string)),
  url: yup.string().url().required()
});

export const optionalShorterValidator = yup.object().shape({
  name: yup.string().test('name', (value) => !BLACKLIST.includes(value?.toLowerCase() as string)),
  url: yup.string().url()
});


export default shorterValidator;