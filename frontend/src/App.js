import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';

// Pages
import Home from './pages/Home';
import Rules from './pages/Rules';
import AddRules from './pages/AddRules';
import EditRule from './pages/EditRule';
import Metrics from './pages/Metrics';
import Notifications from './pages/Notifications';
import AddMetric from './pages/AddMetrics';
import EditMetric from './pages/EditMetric';
import Login from './pages/auth/LoginForm';
import Register from './pages/auth/RegisterForm';
import EditProfile from './pages/UserProfile';

// Components
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

const AppContent = () => {
    const location = useLocation();
    const hideUI = ['/login', '/register'].includes(location.pathname);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const sidebarWidth = isCollapsed ? 80 : 250;
    const navbarHeight = 56;
    const footerHeight = 50;

    if (hideUI) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        );
    }

    return (
        <>
            {/* Sidebar */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: sidebarWidth,
                    backgroundColor: '#212529',
                    zIndex: 1040,
                }}
            >
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </div>

            {/* Navbar */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: sidebarWidth,
                    right: 0,
                    height: navbarHeight,
                    zIndex: 1030,
                    backgroundColor: '#f8f9fa',
                }}
            >
                <NavBar />
            </div>

            {/* Footer */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: sidebarWidth,
                    right: 0,
                    height: footerHeight,
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #dee2e6',
                    zIndex: 1030,
                }}
            >
                <Footer />
            </div>

            {/* Main Content */}
            <div
                style={{
                    marginLeft: sidebarWidth,
                    marginTop: navbarHeight,
                    marginBottom: footerHeight,
                    overflowY: 'auto',
                    height: `calc(100vh - ${navbarHeight + footerHeight}px)`,
                    padding: '1rem',
                }}
            >
                <Routes>
                    <Route path="/profile" element={<EditProfile />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/rules" element={<Rules />} />
                    <Route path="/rules/create" element={<AddRules />} />
                    <Route path="/rules/:id" element={<EditRule />} />
                    <Route path="/metrics" element={<Metrics />} />
                    <Route path="/metrics/create" element={<AddMetric />} />
                    <Route path="/metrics/:id" element={<EditMetric />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Routes>
            </div>
        </>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
