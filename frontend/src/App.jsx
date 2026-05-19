import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Cards from './Cards';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cards" element={<Cards />} />
    </Routes>
  );
}

export default App;