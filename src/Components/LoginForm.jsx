import React from "react";
import { useForm } from "react-hook-form";
import { connect } from 'react-redux';

import { LOG_IN } from '../actions/authActions';

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (data) => dispatch(LOG_IN(data))
  }
}

function LoginForm(props) {
  const { toast } = props;
  const { register, errors, handleSubmit } = useForm();
  
  const onSubmit = (data) => {
    
  }

  return (
    <div className="w-full max-w-md bg-gray-800">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" bg-white shadow-md rounded px-8 py-8 pt-8"
      >
        <div className="px-4 pb-4">
          <label htmlFor="email" className="text-sm block font-bold  pb-2">
            EMAIL ADDRESS
          </label>
          <input
            ref={register({
              required: { value: true, message: "Email Is Required!" },
            })}
            type="email"
            name="email"
            id=""
            className="form-input"
            placeholder="Johnbull@example.com"
          />
          {errors?.email?.message}
        </div>
        <div className="px-4 pb-4">
          <label htmlFor="password" className="text-sm block font-bold pb-2">
            PASSWORD
          </label>
          <input
            ref={register({
              required: { value: true, message: "Password Is Required!" },
            })}
            type="password"
            name="password"
            id=""
            className="form-input"
            placeholder="Enter your password"
          />
          {errors?.password?.message}
        </div>
        <div>
          <input type="submit" className="btn" value="Sign In" />
        </div>
      </form>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(LoginForm)