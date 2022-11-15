import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './context/User'
import { EventsProvider } from './context/Events'
import { StocksProvider } from './context/Stocks';

const logOutput = true

if (process.env.NODE_ENV !== "development" || !logOutput)
  console.log = () => { };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StocksProvider>
    <UserProvider>
      <EventsProvider>
        <App />
      </EventsProvider>
    </UserProvider>
  </StocksProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
