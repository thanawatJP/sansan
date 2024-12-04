import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar.js';
import ExploreGroups from '../components/ExploreGroups.js';
import userIcon from '../images/download.webp';

function ExploreGroupsView() {

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <ExploreGroups />
        </div>
      </div>
    </div>
  );
}

export default ExploreGroupsView;
