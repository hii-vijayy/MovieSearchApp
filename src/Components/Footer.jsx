import React from 'react';
import '../App.css';

function Footer() {
    return (
        <div className="footer">
            <div className="footer-brand"><p>&copy; {new Date().getFullYear()} Movie Hub. All Rights Reserved.</p></div>
            <div className="social-links">
                <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
                <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
        </div>
    );
}

export default Footer;
