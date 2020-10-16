import { createReducer } from '@reduxjs/toolkit';
import { LOG_IN, LOG_OUT } from '../actions/authActions';

const initialState = { isAuthenticated: false, user: null };

const authReducer = createReducer(initialState, {
  [LOG_IN.type]: (state, action) => ({
    isAuthenticated: true,
    user: action.payload,
  }),
  [LOG_OUT.type]: (state) => initialState,
});

export { authReducer };
