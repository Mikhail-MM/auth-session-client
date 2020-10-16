import React from "react";
import { connect } from 'react-redux';

import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';

const mapStateToProps = state => {
  const { user, isAuthenticated } = state;
  return { user, isAuthenticated };
}

function App(props) {
  console.log(props.isAuthenticated, props.user);
  return (
    <div className="App h-full flex justify-center items-center">
      <LoginForm />
      <RegisterForm />
    </div>
  );
}

export default connect(mapStateToProps)(App);
