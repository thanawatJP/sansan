import React from 'react';
import { Link } from 'react-router-dom';
function Sidebar() {
  return (
    <aside className="w-64 h-screen p-4 sticky top-0 bg-orange-200">
      <nav className="space-y-4">
        <Link to="/" className="flex items-center space-x-2 text-brown-600">
          <span>🏠</span>
          <span>หน้าหลัก</span>
        </Link>
        <Link to="/PopularPost" className="flex items-center space-x-2 text-brown-600">
          <span>📈</span>
          <span>กระทู้ยอดนิยม</span>
        </Link>
        <Link to="/exploregroups" className="flex items-center space-x-2 text-brown-600">
          <span>📚</span>
          <span>สำรวจกลุ่ม</span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
