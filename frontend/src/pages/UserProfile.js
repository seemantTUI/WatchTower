import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [notificationChannel, setNotificationChannel] = useState('email');
    const [telephone, setTelephone] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Load user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:4000/api/v1/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const user = res.data;
                setName(user.name || '');
                setEmail(user.email || '');
                setNotificationChannel(user.notificationChannel || 'email');
                setTelephone(user.telephone || '');
                setWebhookUrl(user.webhookUrl || '');
            } catch (err) {
                setError('Failed to load profile');
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                'http://localhost:4000/api/v1/auth/me',
                {
                    name,
                    email,
                    notificationChannel,
                    ...(notificationChannel === 'sms' && { telephone }),
                    ...(notificationChannel === 'webhook' && { webhookUrl }),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage('Profile updated successfully');
            setTimeout(() => navigate('/home'), 1500);
        } catch (err) {
            setError(err.response?.data?.msg || 'Update failed');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h3 className="mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        className="form-control"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        className="form-control"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Notification Channel</label>
                    <select
                        className="form-select"
                        value={notificationChannel}
                        onChange={(e) => setNotificationChannel(e.target.value)}
                    >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="webhook">Webhook</option>
                    </select>
                </div>

                {(
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                            className="form-control"
                            type="text"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                        />
                    </div>
                )}

                {(
                    <div className="mb-3">
                        <label className="form-label">Webhook URL</label>
                        <input
                            className="form-control"
                            type="url"
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                        />
                    </div>
                )}

                <button className="btn btn-primary w-100" type="submit">
                    Update Profile
                </button>

                {error && <div className="text-danger mt-2">{error}</div>}
                {message && <div className="text-success mt-2">{message}</div>}
            </form>
        </div>
    );
}

export default EditProfile;
