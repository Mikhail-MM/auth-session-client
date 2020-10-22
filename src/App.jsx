import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';

import { connect } from 'react-redux';
import { Route, useLocation } from 'react-router-dom';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { Toast } from 'primereact/toast';
import { CSSTransition } from 'react-transition-group';

import Page from './Components/Layout/Page';
import Header from './Components/Header';
import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';
import Blog from './Components/Blog';
import Chat from './Components/Chat';

import { parseAxiosError } from './utils/network/parseAxiosError';

import { LOG_IN } from './actions/authActions';

import config from './config';
const { rootURI, webSocketURI } = config;

const requestConfiguration = {
  url: `${rootURI}/users/checkSession`,
  method: 'GET',
  withCredentials: true,
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (data) => dispatch(LOG_IN(data)),
  };
};

const routes = [
  { path: '/login', Component: LoginForm },
  { path: '/register', Component: RegisterForm },
  { path: '/blog', Component: Blog },
  { path: '/chat', Component: Chat },
  { path: '/', Component: SplashPlaceholder },
];

const routeLayouts = {
  '/login': 'centered',
  '/register': 'centered',
  '/blog': 'normal',
  '/': 'centered',
};

const tailwindLayouts = {
  centered: 'flex justify-center items-center',
  normal: 'justify-center items-start',
};

const routeTransitionDelay = 1000;

function SplashPlaceholder() {
  return (
    <div className="w-full p-2 max-w-md text-center">
      <h1 className="font-serif p-2 text-xl">Welcome to Posty!</h1>
      <h4 className="p-2">Log In to Continue</h4>
    </div>
  );
}

function App({ onLogin }) {
  const location = useLocation();
  const [layout, setLayout] = useState(routeLayouts[location.pathname]);

  const toast = useRef(null);

  useEffect(() => {
    axios(requestConfiguration)
      .then(({ data }) => {
        const { user_id, email } = data;
        if (user_id) {
          onLogin({ user_id, email });
          toast.current.show({
            sticky: true,
            severity: 'success',
            summary: `Logged in as (User ${user_id})`,
          });
        }
      })
      .catch((err) => {
        const parsed = parseAxiosError(err).message;
        toast.current.show({
          sticky: true,
          severity: 'error',
          summary: 'Authentication Error',
          detail: parsed,
        });
      });
  }, [onLogin]);

  useEffect(() => {
    setTimeout(() => {
      const layout = routeLayouts[location.pathname];
      setLayout(layout);
    }, routeTransitionDelay);
  }, [location.pathname]);

  return (
    <Page>
      <Header toast={toast} />
      <Toast ref={toast} position="bottom-right" />
      <div className="App h-full relative overflow-hidden">
        {routes.map(({ path, Component }) => {
          return (
            <Route key={path} exact path={path}>
              {({ match }) => (
                <CSSTransition
                  in={match != null}
                  timeout={routeTransitionDelay}
                  appear={true}
                  classNames="page"
                  unmountOnExit
                >
                  <div
                    style={{
                      transitionDelay: match
                        ? `${routeTransitionDelay}ms`
                        : '0ms',
                    }}
                    className="absolute inset-0"
                  >
                    <div
                      className={classNames(
                        'w-full h-full flex overflow-auto',
                        tailwindLayouts[layout]
                      )}
                    >
                      <Component toast={toast} />
                    </div>
                  </div>
                </CSSTransition>
              )}
            </Route>
          );
        })}
      </div>
    </Page>
  );
}

export default connect(null, mapDispatchToProps)(App);
