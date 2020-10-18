import React, { useRef, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Toast } from 'primereact/toast';
import { CSSTransition } from 'react-transition-group';
import { Route, useLocation } from 'react-router-dom';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import Page from './Components/Layout/Page';

import Header from './Components/Header';

import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';

import { parseAxiosError } from './utils/network/parseAxiosError';

import { LOG_IN } from './actions/authActions';

import config from './config';

const { rootURI } = config;

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

const mapStateToProps = (state) => {
  const { user, isAuthenticated } = state;
  return { user, isAuthenticated };
};

const routes = [
  { path: '/login', Component: LoginForm },
  { path: '/register', Component: RegisterForm },
  { path: '/blog', Component: Blog },
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

/*
  Animating Routes in React Router:

    The issue with animating routes is that React Router is concerned primarily with un-mounting an old component and re-mounting a new component immediately, when a route change is registered.
    For a pair of transitions, we actually want both routes rendered simultaneously - both routes actually need to be mounted until the exiting transition is complete for the route that we just navigated away from, 
    and until the entering transition can complete.

    The other issue is delaying the transition - React Transition Group will begin both sets of transitions immediately. That means that the exiting route and entering route will begin their animations at the same time,
    and there may be an overlap, which is a problem if you want a clear, staggered transition.

    The solution is to introduce a transition delay - at first I placed this `transition-delay` (matching the duration of the total transition time) directly in CSS on the page-enter-active class 
    This would essentially trigger the exit transition but force CSS to delay the enterance of the newly mounted component.

    However, this was broken in chrome.

    The solution was to manage the property directly on the child element rendered by CSSTransition:

      <div
        style={{
          transitionDelay: match
            ? `${routeTransitionDelay}ms`
            : '0ms',
        }}
        className="w-full max-w-md absolute"
      >
      
    A second challenge was managing the layout of the container.

    Problem: Both routes must be rendered simultaneously

    Sometimes, routes are entire pages.
    We generally don't design apps to render two entire page containers sequentially. Logically, only one would render.
    In this situation, it's easiest if the container of our route contents is `position: absolute;`

    Alignment becomes a problem, for example, if we want to transition out a center-aligned absolute container and transition in a flex-start aligned absolute container.
    When these alignment containers were rendered inside of the CSSTransition, the boundaries of the page overflowed and I was unable to solve why. 

    The solution was to store the alignment as state in the React component. 

    The alignment container would house the entire array of transitionable routes.

    We used the `useLocation()` hook to track the location props injected by the Router on each render of App.

    We pass the path.name as a dependency to useEffect, so each time the path changed, we were able to determine what the alignment of that route's contents should be, and we triggered a state change
    on a `setTimeout` callback that used the transitionDelay to make the layout change just as the exiting route finished its exit transition.
*/

const routeTransitionDelay = 1000;

function SplashPlaceholder() {
  return (
    <div className="w-full p-2 max-w-md text-center">
      <h1 className="font-serif p-2 text-xl">Welcome to Posty!</h1>
      <h4 className="p-2">Log In to Continue</h4>
    </div>
  );
}

function Blog() {
  return <div>Blog Component</div>;
}
function App({ user, isAuthenticated, onLogin }) {
  console.log({ user, isAuthenticated });
  const location = useLocation();
  const [layout, setLayout] = useState(routeLayouts[location.pathname]);

  const toast = useRef(null);

  useEffect(() => {
    axios(requestConfiguration)
      .then(({ data }) => {
        console.log(data);
        if (data.userId) {
          onLogin({ id: data.userId });
          toast.current.show({
            sticky: true,
            severity: 'success',
            summary: `Logged in as (User ${data.userId})`,
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
                        'w-full h-full flex',
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
