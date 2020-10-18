import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';

import { parseAxiosError } from '../utils/network/parseAxiosError';
import { LOG_IN } from '../actions/authActions';

import config from '../config';
const { rootURI } = config;

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (data) => dispatch(LOG_IN(data)),
  };
};

const requestConfiguration = {
  url: `${rootURI}/users/login`,
  method: 'POST',
  withCredentials: true,
};

function LoginForm({ toast, onLogin }) {
  
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const { register, errors, handleSubmit } = useForm();

  const onSubmit = (formData) => {
    setLoading(true);
    axios({
      ...requestConfiguration,
      data: formData,
    })
      .then(({ data }) => {
        const { id } = data;
        toast.current.show({
          sticky: true,
          severity: 'success',
          summary: `Logged in as ${formData.email} (User ${id})`,
        });
        onLogin({ id });
        history.push('/blog');
      })
      .catch((err) => {
        const parsed = parseAxiosError(err).message;
        toast.current.show({
          sticky: true,
          severity: 'error',
          summary: 'Authentication Error',
          detail: parsed,
        });
      })
      .finally(() => setLoading(false));
  };

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
              required: { value: true, message: 'Email Is Required!' },
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
              required: { value: true, message: 'Password Is Required!' },
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
          <input
            type="submit"
            className={classNames('btn', { 'btn-loading': loading })}
            value={loading ? 'Loading...' : 'Sign In'}
          />
        </div>
      </form>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(LoginForm);
