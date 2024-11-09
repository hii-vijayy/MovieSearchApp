import { Link } from 'react-router-dom';

function NavBar({ clearSearch }) {
    return (
        <div className="navbar">
            <div className="navbar-brand">Movie Hub</div>
            <div className="navbar-items">
                <Link className="navbar-item" to="/" onClick={clearSearch}>Home</Link>
                <Link className="navbar-item" to="/bollywood" onClick={clearSearch}>Bollywood</Link>
                <Link className="navbar-item" to="/hollywood" onClick={clearSearch}>Hollywood</Link>
                <Link className="navbar-item" to="/punjabi" onClick={clearSearch}>Punjabi</Link>
            </div>
        </div>
    );
}

export default NavBar;
