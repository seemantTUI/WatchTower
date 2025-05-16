import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';



function RegisterForm() {
    const navigate = useNavigate(); // initialize router navigation

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notificationChannel, setNotificationChannel] = useState('email');
    const [error, setError] = useState();
    const [user, setUser] = useState(null);
    const [telephone, setTelephone] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:4000/api/v1/auth/register', {
                name,
                email,
                password,
                notificationChannel,
                ...(notificationChannel === 'sms' && { telephone }),
                ...(notificationChannel === 'webhook' && { webhookUrl }),
            });
            const {token, user} = res.data;
            if (token) {
                setName('')
                setEmail('')
                setPassword('')
                setNotificationChannel('')
                setTelephone('')
                setWebhookUrl('')
                navigate('/Login');
            }
        } catch (error) {
            setError(error.response?.data?.msg || 'Login failed')
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="container-sm" style={{maxWidth: "400px"}}>
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
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                            type="name"
                            className="form-control"
                            id="name"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
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
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="notificationChannel" className="form-label">Notification Channel</label>
                         <select
                            className="form-select"
                            id="notificationChannel"
                            value={notificationChannel}
                            onChange={(e) => setNotificationChannel(e.target.value)}
                        >
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="webhook">Webhook</option>
                        </select>
                    </div>
                    {notificationChannel === 'sms' && (
                        <div className="mb-3 text-start">
                            <label htmlFor="telephone" className="form-label">Telephone</label>
                            <input
                                type="text"
                                className="form-control"
                                id="telephone"
                                placeholder="Enter your phone number"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                            />
                        </div>
                    )}

                    {notificationChannel === 'webhook' && (
                        <div className="mb-3 text-start">
                            <label htmlFor="webhookUrl" className="form-label">Webhook URL</label>
                            <input
                                type="url"
                                className="form-control"
                                id="webhookUrl"
                                placeholder="Enter your webhook URL"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                            />
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100">
                        Register
                    </button>
                    <br/><br/>
                    <h6>
                        Already registered? <Link to="/login">Login here</Link>
                    </h6>
                    {error && (
                        <div className="text-danger">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>


    )


}

export default RegisterForm