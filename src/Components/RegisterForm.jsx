import React, { useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Message } from 'primereact/message';

import { parseAxiosError } from '../utils/network/parseAxiosError';

import { LOG_IN } from '../actions/authActions';

import config from '../config';
const { rootURI } = config;

const requestConfiguration = {
  url: `${rootURI}/users`,
  method: 'POST',
  withCredentials: true,
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (data) => dispatch(LOG_IN(data)),
  };
};

function RegisterForm({ toast, onLogin }) {
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const { register, errors, handleSubmit, getValues } = useForm({
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  });

  const onSubmit = (formData) => {
    setLoading(true);
    axios({
      ...requestConfiguration,
      data: formData,
    })
      .then(({ data }) => {
        const { id, email } = data;
        toast.current.show({
          sticky: true,
          severity: 'success',
          summary: 'Registration Success!',
        });
        onLogin({ id, email });
        history.push('/blog');
      })
      .catch((err) => {
        const parsed = parseAxiosError(err).message;
        toast.current.show({
          sticky: true,
          severity: 'error',
          summary: 'Registration Error',
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
          <label htmlFor="email" className="text-sm block font-bold pb-2">
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
          {errors?.email?.message && (
            <Message severity="warn" text={errors.email.message} />
          )}
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
          {errors?.password?.types?.required && (
            <Message severity="warn" text={errors.password.types.required} />
          )}
        </div>
        <div className="px-4 pb-4">
          <label htmlFor="password" className="text-sm block font-bold pb-2">
            CONFIRM PASSWORD
          </label>
          <input
            ref={register({
              required: {
                value: true,
                message: 'Confirmed Password Is Required!',
              },
              validate: {
                matchPW: (value) =>
                  value === getValues().password || 'Password must match!',
              },
            })}
            type="password"
            name="confirmPassword"
            id=""
            className="form-input"
            placeholder="Confirm your password"
          />
          {errors?.confirmPassword?.types?.required && (
            <Message
              severity="warn"
              text={errors.confirmPassword.types.required}
            />
          )}
          {errors?.confirmPassword?.types?.matchPW ? (
            <Message
              severity="warn"
              text={errors.confirmPassword.types.matchPW}
            />
          ) : null}
        </div>
        <div>
          <input
            type="submit"
            className={classNames('btn', { 'btn-loading': loading })}
            value={loading ? 'Loading...' : 'Register'}
          />
        </div>
      </form>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(RegisterForm);
