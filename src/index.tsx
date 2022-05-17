import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { MainContainer } from './Main.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainContainer />
  </React.StrictMode>
);
