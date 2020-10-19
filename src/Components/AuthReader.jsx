import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = ({ isAuthenticated, user }) => ({
  isAuthenticated,
  user,
});

const AuthReader = ({ isAuthenticated, user }) => {
  return (
    <div>
      <span>{isAuthenticated ? 'Logged In' : 'Logged Out'}</span>
      {user
        ? Object.entries(user).map(([key, value]) => (
            <span key={key}>
              {key}: {value}
            </span>
          ))
        : null}
    </div>
  );
};

export default connect(mapStateToProps)(AuthReader);
