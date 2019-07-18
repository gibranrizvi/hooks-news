import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { spanner } from 'google-proto-files';

import { getDomain } from '../../utils';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { FirebaseContext } from '../../firebase';

function LinkItem({ link, index, showCount, history }) {
  const { user, firebase } = useContext(FirebaseContext);

  const handleVote = () => {
    if (!user) {
      history.push('/login');
    } else {
      // Get ref to an individual document to update it
      const linkRef = firebase.db.collection('links').doc(link.id);

      // Get document
      linkRef.get().then(doc => {
        if (doc.exists) {
          const previousVotes = doc.data().votes;
          const vote = {
            votedBy: {
              id: user.uid,
              name: user.displayName
            }
          };
          const updatedVotes = [...previousVotes, vote];

          linkRef.update({
            votes: updatedVotes
          });
        }
      });
    }
  };

  const handleDeleteLink = () => {
    const linkRef = firebase.db.collection('links').doc(link.id);

    linkRef
      .delete()
      .then(() => {
        console.log(`Document with ID ${link.id} deleted`);
      })
      .catch(err => {
        console.error('Error deleting document');
      });
  };

  const postedByAuthUser = user && user.uid === link.postedBy.id;
  const upvotedByAuthUser =
    user &&
    link.votes.filter(vote => vote.votedBy.id === user.uid).length === 1;

  return (
    <div className="flex items-start mt2">
      <div className="flex items-center">
        {showCount && <span className="gray">{index}.</span>}
        <div
          style={{
            color: upvotedByAuthUser ? 'black' : 'gray',
            cursor: 'pointer',
            marginRight: 8
          }}
          className="vote-button"
          onClick={upvotedByAuthUser ? null : handleVote}
        >
          ▲
        </div>
        <div className="ml1">
          <div className="">
            {link.description}{' '}
            <span className="link">({getDomain(link.url)})</span>
          </div>
          <div className="f6 lh-copy gray">
            {link.votes.length}
            {link.votes.length !== 1 ? ' votes' : ' vote'} by{' '}
            {link.postedBy.name} {distanceInWordsToNow(link.created)} {' | '}
            <Link to={`/link/${link.id}`}>
              {link.comments.length > 0
                ? `${link.comments.length} comments`
                : 'discuss'}
            </Link>
            {postedByAuthUser && (
              <>
                {' | '}
                <span className="delete-button" onClick={handleDeleteLink}>
                  delete
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(LinkItem);
