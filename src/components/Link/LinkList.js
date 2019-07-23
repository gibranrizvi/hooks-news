import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { FirebaseContext } from '../../firebase';
import { LINKS_PER_PAGE } from '../../utils';

import LinkItem from './LinkItem';

function LinkList(props) {
  const { firebase } = useContext(FirebaseContext);
  const [links, setLinks] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const isTopPage = props.location.pathname.includes('top');
  const page = Number(props.match.params.page);
  const linksRef = firebase.db.collection('links');

  useEffect(() => {
    const unsubscribe = getLinks();

    return () => unsubscribe();
  }, [isTopPage, page]);

  const getLinks = () => {
    const hasCursor = Boolean(cursor);
    setLoading(true);

    if (isTopPage) {
      return linksRef.orderBy('voteCount', 'desc').onSnapshot(handleSnapshot);
    } else if (page === 1) {
      return linksRef
        .orderBy('created', 'desc')
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else if (hasCursor) {
      return linksRef
        .orderBy('created', 'desc')
        .startAfter(cursor.created)
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else {
      const offset = page * LINKS_PER_PAGE - LINKS_PER_PAGE;
      axios
        .get(
          `https://us-central1-hooks-news-rzvgib.cloudfunctions.net/linksPagination?offset=${offset}`
        )
        .then(response => {
          const links = response.data;
          const lastLink = links[links.length - 1];
          setLinks(links);
          setCursor(lastLink);
          setLoading(false);
        });
      return () => {};
    }
  };

  const handleSnapshot = snapshot => {
    const links = snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });

    setLinks(links);
    const lastLink = links[links.length - 1];
    setCursor(lastLink);
    setLoading(false);
  };

  const visitPreviousPage = () => {
    if (page > 1) {
      props.history.push(`/new/${page - 1}`);
      setCursor(null);
    }
  };

  const visitNextPage = () => {
    if (page <= links.length / LINKS_PER_PAGE) {
      props.history.push(`/new/${page + 1}`);
    }
  };

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE + 1 : 0;

  return (
    <div style={{ opacity: loading ? 0.25 : 1 }}>
      {links.map((link, index) => (
        <LinkItem
          key={link.id}
          showCount={true}
          link={link}
          index={index + pageIndex}
        />
      ))}
      {!isTopPage && (
        <div className="pagination">
          <div className="pointer mr2" onClick={visitPreviousPage}>
            Previous
          </div>
          <div className="pointer" onClick={visitNextPage}>
            Next
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkList;
