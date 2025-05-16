import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function LoginForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState();
    const [user, setUser] = useState(null);

    const handleLogin = (userInfo) => {
        setUser(userInfo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:4000/api/v1/auth/login', {
                email,
                password,
            });
            const { token, user } = res.data;
            if (token) {
                localStorage.setItem('token', token);
                setEmail('');
                setPassword('');
                handleLogin(user);
                navigate('/home');
            }
        } catch (error) {
            setError(error.response?.data?.msg || 'Login failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const res = await axios.post('http://localhost:4000/api/v1/auth/google', {
                token: credential,
            });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            handleLogin(user);
            navigate('/home');
        } catch (err) {
            setError('Google login failed');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="container-sm" style={{ maxWidth: "400px" }}>
                <form className="w-100 text-center" onSubmit={handleSubmit}>
                    <div className="text-center mb-4">
                        <img
                            src="/logo.png"
                            alt="Watch Tower Logo"
                            width="80"
                            height="80"
                            className="mb-2"
                        />
                        <h2 className="fw-bold">Watch Tower</h2>
                    </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className="input-group-text"
                                style={{cursor: 'pointer'}}
                                onClick={() => setShowPassword(prev => !prev)}
                            >
      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
    </span>
                        </div>
                    </div>


                    <button type="submit" className="btn btn-primary w-100">
                        Sign In
                    </button>

                    <div className="mt-3">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google login failed')}
                        />
                    </div>

                    <br/><br/>
                    <h6>New user? <Link to="/register">Register here</Link></h6>

                    {error && (
                        <div className="text-danger mt-2">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
