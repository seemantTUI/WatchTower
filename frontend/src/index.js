import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="1057805475992-23pgnv42rdsbhh4uvm0rfu1ej78tgc86.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>
);
