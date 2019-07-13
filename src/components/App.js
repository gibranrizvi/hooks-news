import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Login from './Auth/Login';
import ForgotPassword from './Auth/ForgotPassword';
import CreateLink from './Link/CreateLink';
import SearchLinks from './Link/SearchLinks';
import LinkList from './Link/LinkList';
import LinkDetail from './Link/LinkDetail';
import Header from './Header';

import useAuth from '../components/Auth/useAuth';
import firebase, { FirebaseContext } from '../firebase';

function App() {
  const user = useAuth();

  return (
    <BrowserRouter>
      <FirebaseContext.Provider value={{ user, firebase }}>
        <div className="app-container">
          <Header />
          <div className="route-container">
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/new/1" />} />
              <Route exact path="/create" component={CreateLink} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/forgot" component={ForgotPassword} />
              <Route exact path="/search" component={SearchLinks} />
              <Route exact path="/top" component={LinkList} />
              <Route exact path="/new/:page" component={LinkList} />
              <Route exact path="/link/:linkId" component={LinkDetail} />
            </Switch>
          </div>
        </div>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}

export default App;
