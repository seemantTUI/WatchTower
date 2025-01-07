const NavBar = () => {
  return (
    <div className="nav-bar">
      <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <i className="bi bi-shield-lock-fill me-2"></i> Watch Tower
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  <i className="bi bi-house-fill me-2"></i> Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/rules">
                  <i className="bi bi-list-task me-2"></i> Rules
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/metrics">
                  <i className="bi bi-bar-chart-fill me-2"></i> Metrics
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/notifications">
                  <i className="bi bi-bell-fill me-2"></i> Notifications
                </a>
              </li>
            </ul>
            <span className="navbar-text">
              <i className="bi bi-person-circle me-2"></i> User Profile
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
