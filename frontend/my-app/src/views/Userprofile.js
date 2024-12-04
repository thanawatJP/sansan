import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar.js';
import Userprofile from '../components/Userprofile';
import ThreadUserList from '../components/ThreadUserList.js';

function PopularPostView() {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    <Userprofile />
                    <ThreadUserList />
                </div>
            </div>
        </div>
    );
}

export default PopularPostView;
