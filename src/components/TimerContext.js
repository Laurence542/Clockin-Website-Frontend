import React, { createContext, useReducer, useEffect } from 'react';

// Define actions
const START_TIMER = 'START_TIMER';
const STOP_TIMER = 'STOP_TIMER';
const RESET_TIMER = 'RESET_TIMER';
const UPDATE_TIMER = 'UPDATE_TIMER';

// Initial state
const initialState = {
  startTime: null,
  elapsedTime: 0,
  isRunning: false,
};

// Reducer function
function timerReducer(state, action) {
  switch (action.type) {
    case START_TIMER:
      return { ...state, startTime: action.payload, isRunning: true };
    case STOP_TIMER:
      return { ...state, isRunning: false };
    case RESET_TIMER:
      return initialState;
    case UPDATE_TIMER:
      return { ...state, elapsedTime: action.payload };
    default:
      return state;
  }
}

// Create Context
export const TimerContext = createContext();

// Provider Component
export const TimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Sync with localStorage
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('timerState'));
    if (savedState) {
      dispatch({ type: UPDATE_TIMER, payload: savedState.elapsedTime });
      if (savedState.isRunning) {
        dispatch({ type: START_TIMER, payload: savedState.startTime });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify(state));
  }, [state]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};
