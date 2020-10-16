import React from "react";

import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';

function App() {
  return (
    <div className="App h-full flex justify-center items-center">
      <LoginForm />
      <RegisterForm />
    </div>
  );
}

export default App;
