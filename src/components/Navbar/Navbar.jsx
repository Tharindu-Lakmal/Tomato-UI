import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

export default function Navbar({ setShowLogin }) {

    const [showSearch, setShowSearch] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const { getTotalCartCount, user, logout, setSearchQuery, searchQuery } = useContext(StoreContext);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const cartCount = getTotalCartCount();

    const isActive = (path) => location.pathname === path;

    const handleSearchToggle = () => {
        setShowSearch((prev) => {
            if (!prev) {
                setTimeout(() => searchRef.current?.focus(), 50);
            } else {
                setSearchQuery('');
            }
            return !prev;
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value) {
            // If on Home, scroll to food; otherwise navigate to menu
            if (location.pathname === '/Tomato-UI' || location.pathname === '/') {
                document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/menu');
            }
        }
    };

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
        navigate('/Tomato-UI');
    };

    return (
        <div className='navbar'>
            <Link to='/Tomato-UI'>
                <img src={assets.logo} alt="Tomato logo" className="logo" />
            </Link>

            <ul className="navbar-menu">
                <Link to='/Tomato-UI' className={isActive('/Tomato-UI') || isActive('/') ? 'active' : ''}>Home</Link>
                <Link to='/menu' className={isActive('/menu') ? 'active' : ''}>Menu</Link>
                <a href='#app-download'>Mobile App</a>
                <a href='#footer'>Contact us</a>
            </ul>

            <div className="navbar-right">

                {/* Search */}
                <div className={`navbar-search ${showSearch ? 'search-open' : ''}`}>
                    <img
                        src={assets.search_icon}
                        alt="search"
                        className="navbar-icon"
                        onClick={handleSearchToggle}
                        title="Search food"
                    />
                    <input
                        ref={searchRef}
                        type="text"
                        className="search-input"
                        placeholder="Search dishes..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => e.key === 'Escape' && handleSearchToggle()}
                    />
                </div>

                {/* Cart */}
                <Link to='/cart' className="navbar-cart-icon" title="Your cart">
                    <img src={assets.basket_icon} alt="cart" className="navbar-icon" />
                    {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
                </Link>

                {/* Sign In / Profile */}
                {!user
                    ? (
                        <button onClick={() => setShowLogin(true)} className="navbar-signin-btn">Sign in</button>
                    )
                    : (
                        <div className="navbar-profile" onClick={() => setShowProfileMenu((p) => !p)}>
                            <div className="navbar-avatar">{user.name.charAt(0).toUpperCase()}</div>
                            <span className="profile-name">{user.name}</span>
                            {showProfileMenu && (
                                <div className="profile-dropdown">
                                    <div className="profile-dropdown-header">
                                        <div className="dropdown-avatar">{user.name.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <p className="dropdown-name">{user.name}</p>
                                            <p className="dropdown-email">{user.email}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <ul>
                                        <li onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}>
                                            <img src={assets.profile_icon} alt="" />
                                            <p>My Profile</p>
                                        </li>
                                        <li onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}>
                                            <img src={assets.bag_icon} alt="" />
                                            <p>My Orders</p>
                                        </li>
                                        <hr />
                                        <li className="dropdown-logout" onClick={handleLogout}>
                                            <img src={assets.logout_icon} alt="" />
                                            <p>Logout</p>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    );
}
