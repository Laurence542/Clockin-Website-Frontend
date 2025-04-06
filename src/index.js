import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';

// Definiere das Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2c2f33',
      paper: '#2c2f33',
    },
    header: {
      default: '#23272a'
    },
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />  {/* Fügt Baseline-Styles hinzu */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
