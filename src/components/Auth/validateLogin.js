export default function validateLogin(values) {
  const { email, password } = values;

  let errors = {};

  // Email errors
  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.email = 'Invalid email address';
  }

  // Password errors
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be atleast 6 characters';
  }

  return errors;
}
