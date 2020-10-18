import { createAction } from '@reduxjs/toolkit';

const LOG_IN = createAction("LOG_IN");
const LOG_OUT = createAction("LOG_OUT");

export { LOG_IN, LOG_OUT }