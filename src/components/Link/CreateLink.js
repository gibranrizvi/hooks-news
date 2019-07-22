import React, { useContext } from 'react';

import useFormValidation from '../Auth/useFormValidation';
import validateCreateLink from '../Auth/validateCreateLink';
import { FirebaseContext } from '../../firebase';

const INITIAL_STATE = {
  description: '',
  url: ''
};

function CreateLink(props) {
  const { user, firebase } = useContext(FirebaseContext);

  const handleCreateLink = () => {
    if (!user) {
      props.history.push('/login');
    } else {
      const { url, description } = values;
      const newLink = {
        url,
        description,
        postedBy: {
          id: user.uid,
          name: user.displayName
        },
        voteCount: 0,
        votes: [],
        comments: [],
        created: Date.now()
      };

      firebase.db.collection('links').add(newLink);
      props.history.push('/');
    }
  };

  const { handleSubmit, handleChange, values, errors } = useFormValidation(
    INITIAL_STATE,
    validateCreateLink,
    handleCreateLink
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-column mt3">
      <input
        autoFocus
        onChange={handleChange}
        value={values.description}
        name="description"
        placeholder="A description for your link"
        autoComplete="off"
        type="text"
        className={errors.description && 'error-input'}
      />
      {errors.description && <p className="error-text">{errors.description}</p>}
      <input
        onChange={handleChange}
        value={values.url}
        name="url"
        placeholder="The URL for the link"
        autoComplete="off"
        type="url"
        className={errors.url && 'error-input'}
      />
      {errors.url && <p className="error-text">{errors.url}</p>}
      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
}

export default CreateLink;
