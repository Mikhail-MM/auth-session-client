import React, {useRef} from "react";
import { connect } from 'react-redux';
import { Toast } from 'primereact/toast';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';

const mapStateToProps = state => {
  const { user, isAuthenticated } = state;
  return { user, isAuthenticated };
}

function App(props) {
  const toast = useRef(null);
  console.log(toast);
  return (
    <div className="App h-full flex justify-center items-center">
      <Toast ref={toast} />
      <LoginForm toast={toast}/>
      <RegisterForm />
    </div>
  );
}

export default connect(mapStateToProps)(App);
