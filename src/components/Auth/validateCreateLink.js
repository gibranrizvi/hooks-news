export default function validateCreateLink(values) {
  const { description, url } = values;

  let errors = {};

  // Description errors
  if (!description) {
    errors.description = 'Description is required';
  } else if (description.length < 10) {
    errors.description = 'Description must be atleast 10 characters';
  }

  // URL errors
  if (!url) {
    errors.url = 'URL is required';
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(url)) {
    errors.url = 'URL must be valid';
  }

  return errors;
}
