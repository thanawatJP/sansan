import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './views/home';
import PopularPostView from './views/PopularPost';
import UserprofileView from './views/Userprofile';
import EditProfileView from './views/editprofile';
import ExploreGroupsView from './views/exploregroup';
import ThreadView from './views/Thread';
import Sidebar from './components/Sidebar';
import SearchView from './views/searchResults';
import CategorySearch from './views/catSearch';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/PopularPost" element={<PopularPostView />} />
                <Route path="/userprofile" element={<UserprofileView />} />
                <Route path="/editprofile" element={<EditProfileView />} />
                <Route path="/thread/:id/" element={<ThreadView />} />
                <Route path="/exploregroups" element={<ExploreGroupsView />} />
                <Route path="/search-results" element={<SearchView />} />
                <Route path="/search-results/categories/:category_id" element={<CategorySearch />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
