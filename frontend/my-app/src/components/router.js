// src/router.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeView from './components/HomeView';
import ProductDetail from './components/ProductDetail';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/productDetail/:productid" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
