import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar.js';
import CatSearch from '../components/CategorySearch.js';

function CatSearchView() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <CatSearch />
        </div>
      </div>
    </div>
  );
}

export default CatSearchView;
