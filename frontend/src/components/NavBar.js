import React from 'react';
import { useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();

  // Determine current page title
  const getPageTitle = (pathname) => {
    if (pathname === '/' || pathname === '/home') return 'Home';
    if (pathname.includes('/rules')) return 'Rules';
    if (pathname.includes('/metrics')) return 'Metrics';
    if (pathname.includes('/notifications')) return 'Notifications';
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname.includes('/login')) return 'Login';
    if (pathname.includes('/register')) return 'Register';
    return 'Watch Tower';
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
      <div className="nav-bar">
        <nav className="navbar bg-light shadow-sm px-3 py-2" style={{ minHeight: '48px' }}>
          <div className="container-fluid d-flex justify-content-between align-items-center">

            {/* Left: Page Title */}
            <span className="fw-semibold text-muted">{pageTitle}</span>

            {/* Right: Theme Toggle */}
            <div className="dropdown">
              <button
                  className="btn btn-sm btn-dark dropdown-toggle d-flex align-items-center"
                  id="bd-theme"
                  type="button"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  aria-label="Toggle theme (auto)"
              >
                <svg className="bi theme-icon-active" width="1em" height="1em">
                  <use href="#circle-half"></use>
                </svg>
                <span className="visually-hidden" id="bd-theme-text">Toggle theme</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
                <li>
                  <button type="button" className="dropdown-item d-flex align-items-center" data-bs-theme-value="light">
                    <svg className="bi me-2 opacity-50" width="1em" height="1em">
                      <use href="#sun-fill"></use>
                    </svg>
                    Light
                  </button>
                </li>
                <li>
                  <button type="button" className="dropdown-item d-flex align-items-center" data-bs-theme-value="dark">
                    <svg className="bi me-2 opacity-50" width="1em" height="1em">
                      <use href="#moon-stars-fill"></use>
                    </svg>
                    Dark
                  </button>
                </li>
                <li>
                  <button type="button" className="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto">
                    <svg className="bi me-2 opacity-50" width="1em" height="1em">
                      <use href="#circle-half"></use>
                    </svg>
                    Auto
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
  );
};

export default NavBar;
