import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar.js';
import PostList from '../components/ThreadList.js';
import TagList from '../components/TagList';

function PopularPostView() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <TagList />
          <PostList />
        </div>
      </div>
    </div>
  );
}

export default PopularPostView;
