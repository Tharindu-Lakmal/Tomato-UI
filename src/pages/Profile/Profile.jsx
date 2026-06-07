import React, { useContext, useState } from 'react'
import './Profile.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Profile = ({ setShowLogin }) => {

    const { user, orders, logout } = useContext(StoreContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders'); // 'account' | 'orders'

    if (!user) {
        return (
            <div className="profile-guest">
                <div className="profile-guest-card">
                    <img src={assets.profile_icon} alt="profile" className="profile-guest-icon" />
                    <h2>You're not signed in</h2>
                    <p>Sign in to view your account and order history.</p>
                    <button onClick={() => setShowLogin(true)}>Sign In</button>
                </div>
            </div>
        );
    }

    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const pastOrders = orders.filter(o => o.status === 'Delivered');

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const handleLogout = () => {
        logout();
        navigate('/Tomato-UI');
    };

    return (
        <div className="profile-page">

            {/* ─── Sidebar ─── */}
            <aside className="profile-sidebar">
                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {getInitials(user.name)}
                    </div>
                    <div className="profile-sidebar-info">
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                    </div>
                </div>

                <nav className="profile-nav">
                    <button
                        className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <img src={assets.bag_icon} alt="" />
                        <span>My Orders</span>
                        {orders.length > 0 && <span className="nav-badge">{orders.length}</span>}
                    </button>
                    <button
                        className={`profile-nav-item ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                    >
                        <img src={assets.profile_icon} alt="" />
                        <span>Account Details</span>
                    </button>
                </nav>

                <button className="profile-logout-btn" onClick={handleLogout}>
                    <img src={assets.logout_icon} alt="" />
                    <span>Logout</span>
                </button>
            </aside>

            {/* ─── Main Content ─── */}
            <main className="profile-main">

                {/* ══ ORDERS TAB ══ */}
                {activeTab === 'orders' && (
                    <div className="profile-section" id="orders-section">
                        <div className="profile-section-header">
                            <h2>My Orders</h2>
                            <button className="browse-btn" onClick={() => navigate('/menu')}>+ Order More</button>
                        </div>

                        {orders.length === 0 ? (
                            <div className="orders-empty">
                                <img src={assets.parcel_icon} alt="no orders" />
                                <h3>No orders yet</h3>
                                <p>Your placed orders will appear here.</p>
                                <button onClick={() => navigate('/menu')}>Browse Menu</button>
                            </div>
                        ) : (
                            <>
                                {/* Pending Orders */}
                                {pendingOrders.length > 0 && (
                                    <div className="orders-group">
                                        <div className="orders-group-label">
                                            <span className="status-dot pending"></span>
                                            Pending / On the way
                                        </div>
                                        {pendingOrders.map(order => (
                                            <OrderCard key={order.id} order={order} formatDate={formatDate} />
                                        ))}
                                    </div>
                                )}

                                {/* Past Orders */}
                                {pastOrders.length > 0 && (
                                    <div className="orders-group">
                                        <div className="orders-group-label">
                                            <span className="status-dot delivered"></span>
                                            Delivered
                                        </div>
                                        {pastOrders.map(order => (
                                            <OrderCard key={order.id} order={order} formatDate={formatDate} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* ══ ACCOUNT TAB ══ */}
                {activeTab === 'account' && (
                    <div className="profile-section">
                        <div className="profile-section-header">
                            <h2>Account Details</h2>
                        </div>

                        <div className="account-card">
                            <div className="account-avatar-large">
                                {getInitials(user.name)}
                            </div>

                            <div className="account-fields">
                                <div className="account-field">
                                    <label>Full Name</label>
                                    <div className="account-field-value">{user.name}</div>
                                </div>
                                <div className="account-field">
                                    <label>Email Address</label>
                                    <div className="account-field-value">{user.email}</div>
                                </div>
                                <div className="account-field">
                                    <label>Member Since</label>
                                    <div className="account-field-value">
                                        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                    </div>
                                </div>
                                <div className="account-field">
                                    <label>Total Orders</label>
                                    <div className="account-field-value">{orders.length} order{orders.length !== 1 ? 's' : ''}</div>
                                </div>
                                <div className="account-field">
                                    <label>Total Spent</label>
                                    <div className="account-field-value account-highlight">
                                        ${orders.reduce((s, o) => s + o.total, 0).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="account-stats">
                            <div className="stat-card">
                                <span className="stat-number">{orders.length}</span>
                                <span className="stat-label">Total Orders</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">{pendingOrders.length}</span>
                                <span className="stat-label">Pending</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">{pastOrders.length}</span>
                                <span className="stat-label">Delivered</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">${orders.reduce((s, o) => s + o.total, 0).toFixed(0)}</span>
                                <span className="stat-label">Total Spent</span>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

/* ─── Order Card Sub-component ─── */
const OrderCard = ({ order, formatDate }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`order-card ${order.status === 'Pending' ? 'order-card--pending' : 'order-card--delivered'}`}>
            <div className="order-card-header" onClick={() => setExpanded(p => !p)}>
                <div className="order-card-left">
                    <div className="order-card-images">
                        {order.items.slice(0, 3).map(item => (
                            <img key={item._id} src={item.image} alt={item.name} />
                        ))}
                        {order.items.length > 3 && (
                            <div className="order-more-imgs">+{order.items.length - 3}</div>
                        )}
                    </div>
                    <div className="order-card-meta">
                        <p className="order-id">{order.id}</p>
                        <p className="order-date">{formatDate(order.date)}</p>
                        <p className="order-items-count">{order.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                    </div>
                </div>
                <div className="order-card-right">
                    <span className={`order-status ${order.status === 'Pending' ? 'status-pending' : 'status-delivered'}`}>
                        {order.status === 'Pending' ? '🚚 On the Way' : '✓ Delivered'}
                    </span>
                    <p className="order-total">${order.total.toFixed(2)}</p>
                    <button className="order-expand-btn">{expanded ? '▲' : '▼'}</button>
                </div>
            </div>

            {expanded && (
                <div className="order-card-body">
                    <div className="order-body-items">
                        {order.items.map(item => (
                            <div key={item._id} className="order-body-item">
                                <img src={item.image} alt={item.name} />
                                <span className="order-body-name">{item.name}</span>
                                <span className="order-body-qty">× {item.quantity}</span>
                                <span className="order-body-price">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="order-body-delivery">
                        <p className="order-body-section-title">Delivery Address</p>
                        <p className="order-body-address">
                            {order.deliveryInfo.firstName} {order.deliveryInfo.lastName},&nbsp;
                            {order.deliveryInfo.street}, {order.deliveryInfo.city},&nbsp;
                            {order.deliveryInfo.state} {order.deliveryInfo.zipCode},&nbsp;
                            {order.deliveryInfo.country}
                        </p>
                        <p className="order-body-phone">📞 {order.deliveryInfo.phone}</p>
                    </div>
                    <div className="order-body-totals">
                        <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
                        <span>Delivery: ${order.deliveryFee.toFixed(2)}</span>
                        <strong>Total: ${order.total.toFixed(2)}</strong>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
