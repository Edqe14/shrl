import * as yup from 'yup';

const shorterValidator = yup.object().shape({
  name: yup.string(),
  url: yup.string().url().required()
});

export const optionalShorterValidator = yup.object().shape({
  name: yup.string(),
  url: yup.string().url()
});


export default shorterValidator;