import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-3 mt-auto">
      <div className="container text-center">
        <p>
          <a href="/about" className="text-white text-decoration-none">
            About: A monitoring application for rules and metrics
          </a>
        </p>
        <p>
          Contact:{' '}
          <a href="mailto:seem.singh94@gmail.com" className="text-white">
            seem.singh94@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
