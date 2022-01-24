import React from 'react';
import './App.css';
import {Router} from './router/Router';
import {RecoilRoot} from 'recoil';

function App() {
  return (
    <RecoilRoot>
        <Router/>
    </RecoilRoot>
  );
}

export default App;
