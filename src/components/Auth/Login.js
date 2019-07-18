import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import useFormValidation from './useFormValidation';
import validateLogin from './validateLogin';
import { FirebaseContext } from '../../firebase';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: ''
};

function Login(props) {
  const { firebase } = useContext(FirebaseContext);
  const [login, setLogin] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  const authenticateUser = async () => {
    const { name, email, password } = values;
    try {
      login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password);
      props.history.push('/');
    } catch (error) {
      console.error('Authentication Error', error);
      setFirebaseError(error.message);
    }
  };

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    isSubmitting
  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser);

  return (
    <div>
      <h2 className="mv3">{login ? 'Login' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-column">
        {!login && (
          <input
            onChange={handleChange}
            value={values.name}
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="off"
          />
        )}
        <input
          autoFocus
          onChange={handleChange}
          value={values.email}
          name="email"
          type="email"
          placeholder="Your email"
          autoComplete="off"
          className={errors.email && 'error-input'}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          onChange={handleChange}
          value={values.password}
          name="password"
          type="password"
          placeholder={login ? 'Your password' : 'Choose a secure password'}
          className={errors.password && 'error-input'}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        {firebaseError && <p className="error-text">{firebaseError}</p>}
        <div className="flex mt3">
          <button
            type="submit"
            className="button pointer mr2"
            disabled={isSubmitting}
            style={{ backgroundColor: isSubmitting ? 'grey' : 'orange' }}
          >
            Submit
          </button>
          <button
            type="button"
            className="button pointer"
            onClick={() => setLogin(prevLogin => !prevLogin)}
          >
            {login ? 'Create an account' : 'Already have an account?'}
          </button>
        </div>
      </form>
      <div className="forgot-password">
        <Link to="/forgot">Forgot your password?</Link>
      </div>
    </div>
  );
}

export default Login;
