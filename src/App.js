import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FirebaseCodeGenerator from './FirebaseCodeGenerator';
import Finder from './finder';
import Upgrade from './Upgrade';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<FirebaseCodeGenerator />} />
          <Route path="/finder" element={<Finder />} />
          <Route path="/upgrade" element={<Upgrade />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
