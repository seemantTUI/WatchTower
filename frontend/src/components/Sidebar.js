import { Link } from 'react-router-dom';
import { useState } from 'react';
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`sidebar bg-dark text-light vh-100 p-3 ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        width: isCollapsed ? '80px' : '250px',
        transition: 'width 0.3s',
        position: 'fixed',
      }}
    >
      <button
        onClick={toggleCollapse}
        className="btn btn-light btn-sm mb-3"
        style={{ width: '100%' }}
      >
        {isCollapsed ? '>' : '<'}
      </button>
      <h4 className={`${isCollapsed ? 'd-none' : ''} text-primary`}>Menu</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/" className="nav-link text-light">
            <i className="bi bi-house"></i> {!isCollapsed && 'Dashboard'}
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/rules" className="nav-link text-light">
            <i className="bi bi-card-list"></i> {!isCollapsed && 'Rules'}
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/metrics" className="nav-link text-light">
            <i className="bi bi-bar-chart"></i> {!isCollapsed && 'Metrics'}
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/notifications" className="nav-link text-light">
            <i className="bi bi-bell"></i> {!isCollapsed && 'Notifications'}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
