import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = ({ user, isAuthenticated }) => ({
  user,
  isAuthenticated,
});

function Chat({ user, isAuthenticated }) {
  console.log({ user, isAuthenticated });
  return <div>
    <h1>CHAT!</h1> 
    <p>Logged IN: {isAuthenticated} </p>
  </div>
}

export default connect(mapStateToProps)(Chat);