import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Toast } from 'primereact/toast';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import Page from './Components/Layout/Page';

import Header from './Components/Header';

import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';

const mapStateToProps = (state) => {
  const { user, isAuthenticated } = state;
  return { user, isAuthenticated };
};

const routes = [
  { path: '/login', Component: LoginForm },
  { path: '/register', Component: RegisterForm }
];

function App(props) {
  const toast = useRef(null);
  return (
    <Page>
      <Header />
      <Toast ref={toast} />
      <div className="App h-full flex justify-center items-center">
          {routes.map(({ path, Component }, index) => {
            return <Route key={path} exact path={path}>
              {({ match }) => (
                <CSSTransition
                  in={match != null}
                  timeout={300}
                  classNames="page"
                  unmountOnExit
                >
                  <div className="page">
                    <Component />
                  </div>
                </CSSTransition>
              )}
            </Route>
          })}
      </div>
    </Page>
  );
}

export default connect(mapStateToProps)(App);
