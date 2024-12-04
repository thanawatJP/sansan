import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar.js';
import Search from '../components/Search.js';

function SearchView() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Search />
        </div>
      </div>
    </div>
  );
}

export default SearchView;
