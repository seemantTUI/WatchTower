import { Link } from 'react-router-dom';
import React from 'react';

const Sidebar = () => {
  return (
      <div
          className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
          style={{ width: '250px', minHeight: '100%' }}
      >
        <div className="d-flex align-items-center mb-3">
          <img
              src="/logo.png"
              alt="Watch Tower"
              width="40"
              height="40"
              className="me-2"
          />
          <span className="fs-4 fw-bold text-white">Watch Tower</span>
        </div>

        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/" className="nav-link text-white">
              <i className="bi bi-house me-2" />
              Home
            </Link>
          </li>
          <li>
            <Link to="/rules" className="nav-link text-white">
              <i className="bi bi-list-task me-2" />
              Rules
            </Link>
          </li>
          <li>
            <Link to="/metrics" className="nav-link text-white">
              <i className="bi bi-bar-chart me-2" />
              Metrics
            </Link>
          </li>
          <li>
            <Link to="/notifications" className="nav-link text-white">
              <i className="bi bi-bell me-2" />
              Notifications
            </Link>
          </li>
        </ul>

        <hr />
        <div className="dropdown">
          <a
              href="#"
              className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
          >
            <img
                src="https://github.com/mdo.png"
                alt="avatar"
                width="32"
                height="32"
                className="rounded-circle me-2"
            />
            <strong>Seemant</strong>
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
            <li>
              <Link className="dropdown-item" to="/profile">
                Profile
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item" to="/login">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
  );
};

export default Sidebar;
