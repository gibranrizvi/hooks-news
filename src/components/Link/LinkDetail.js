import React, { useEffect, useContext, useState } from 'react';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

import { FirebaseContext } from '../../firebase';
import LinkItem from './LinkItem';

function LinkDetail(props) {
  const { user, firebase } = useContext(FirebaseContext);

  const [link, setLink] = useState(null);
  const [commentText, setCommentText] = useState('');

  const { linkId } = props.match.params;
  const linkRef = firebase.db.collection('links').doc(linkId);

  useEffect(() => {
    getLink();
  }, []);

  const getLink = () => {
    linkRef.get().then(doc => {
      setLink({ id: doc.id, ...doc.data() });
    });
  };

  const handleAddComment = () => {
    if (!user) {
      props.history.push('/login');
    } else {
      linkRef.get().then(doc => {
        if (doc.exists) {
          const previousComments = doc.data().comments;
          const comment = {
            postedBy: { id: user.uid, name: user.displayName },
            created: Date.now(),
            text: commentText
          };
          const updatedComments = [...previousComments, comment];
          linkRef.update({ comments: updatedComments });
          setLink(previousState => ({
            ...previousState,
            comments: updatedComments
          }));
          setCommentText('');
        }
      });
    }
  };

  return !link ? (
    <div>Loading...</div>
  ) : (
    <div>
      <LinkItem showCount={false} link={link} />
      <p>Comments ({link.comments.length})</p>

      {link.comments.map((comment, index) => (
        <div key={index}>
          <p className="comment-author">
            {comment.postedBy.name} | {distanceInWordsToNow(comment.created)}
          </p>
          <p>{comment.text}</p>
        </div>
      ))}
      <textarea
        autoFocus={true}
        onChange={event => setCommentText(event.target.value)}
        value={commentText}
        rows="6"
        cols="60"
      />
      <div>
        <button className="button" onClick={handleAddComment}>
          Add Comment
        </button>
      </div>
    </div>
  );
}

export default LinkDetail;
