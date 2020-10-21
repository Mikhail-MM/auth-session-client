import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import AuthReader from './AuthReader';

import { parseAxiosError } from '../utils/network/parseAxiosError';

import { LOG_OUT } from '../actions/authActions';

import config from '../config';
const { rootURI } = config;

const requestConfiguration = {
  url: `${rootURI}/users/logout`,
  method: 'GET',
  withCredentials: true,
};

const mapStateToProps = ({ isAuthenticated, user }) => {
  return {
    isAuthenticated,
    user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(LOG_OUT()),
  };
};

function Header({ toast, isAuthenticated, onLogout }) {
  const history = useHistory();

  const onLogoutClick = (e) => {
    e.preventDefault();
    axios(requestConfiguration)
      .then(({ data }) => {
        toast.current.show({
          sticky: true,
          severity: 'success',
          summary: `Logged Out.`,
        });
        onLogout();
        history.push('/');
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
  };

  return (
    <header className="w-full">
      <nav className="w-full flex justify-end">
        <AuthReader />
        <ul className="flex flex-row">
          <li>
            <Link className="text-indigo-500 px-2" to="/login">
              Login
            </Link>
          </li>
          <li>
            <Link className="text-indigo-500 px-2" to="/register">
              Register
            </Link>
          </li>
          <li>
            <Link className="text-indigo-500 px-2" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="text-indigo-500 px-2" to="/blog">
              Blog
            </Link>
          </li>
          <li>
            <Link className="text-indigo-500 px-2" to="/chat">
              Chat
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <a
                className="text-indigo-500 px-2"
                onClick={onLogoutClick}
                href="/"
              >
                Log Out
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
