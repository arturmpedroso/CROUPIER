import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { useEffect } from 'react';

function App() {

  useEffect(() => {
    fetch('http://localhost:3000/cards')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Meu App</h1>
    </div>
  );
}

export default App;
