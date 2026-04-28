import React from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import CreatePost from './pages/CreatePost.jsx'
import Feed from './pages/Feed.jsx'

const App = () => {
  return (
    <Router>
      {/* ── Navbar ── */}
      <nav className="app-nav">
        <NavLink to="/feed" className="nav-brand">
          frame<em>.</em>
        </NavLink>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/feed"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Feed
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create-post"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              + New Post
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* ── Pages ── */}
      <div className="page-shell">
        <Routes>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/" element={<Feed />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
