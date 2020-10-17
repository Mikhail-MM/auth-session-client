import React, { useRef, useMemo } from 'react';
import { connect } from 'react-redux';
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

const mapStateToProps = (state) => {
  const { user, isAuthenticated } = state;
  return { user, isAuthenticated };
};

const routes = [
  { path: '/login', Component: LoginForm },
  { path: '/register', Component: RegisterForm },
];

const routeLayouts = {
  '/login': 'centered',
  '/register': 'normal',
  '/': 'normal',
};

const tailwindContainerLayouts = {
  centered: 'App h-full flex justify-center items-center',
  normal: 'App h-full flex justify-center items-start',
};

function App() {
  const toast = useRef(null);

  const location = useLocation();

  const layout = useMemo(() => {
    return tailwindContainerLayouts[routeLayouts[location.pathname]];
  }, [location.pathname]);

  console.log(layout);

  return (
    <Page>
      <Header />
      <Toast ref={toast} />
      <div className={layout}>
        {routes.map(({ path, Component }) => {
          return (
            <Route key={path} exact path={path}>
              {({ match }) => (
                <CSSTransition
                  in={match != null}
                  timeout={500}
                  classNames="page"
                  unmountOnExit
                >
                  <div className="w-full max-w-md absolute">
                    <Component />
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

export default connect(mapStateToProps)(App);
