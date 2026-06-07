import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

    const { cartItems, food_list, getTotalCartAmount, placeOrder } = useContext(StoreContext);
    const navigate = useNavigate();

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    const total = subtotal + deliveryFee;

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        street: '', city: '', state: '',
        zipCode: '', country: '', phone: '',
    });

    const [placed, setPlaced] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        placeOrder(formData);
        setPlaced(true);
    };

    const cartList = food_list.filter(item => cartItems[item._id] > 0);

    if (cartList.length === 0 && !placed) {
        return (
            <div className="place-order-empty">
                <h2>Your cart is empty!</h2>
                <p>Add items to your cart before placing an order.</p>
                <button onClick={() => navigate('/Tomato-UI')}>Browse Menu</button>
            </div>
        );
    }

    if (placed) {
        return (
            <div className="order-success">
                <div className="order-success-card">
                    <div className="order-success-check">✓</div>
                    <h2>Order Placed Successfully!</h2>
                    <p>Thank you for your order. We'll deliver it shortly!</p>
                    <div className="order-success-actions">
                        <button className="btn-primary" onClick={() => navigate('/profile')}>View My Orders</button>
                        <button className="btn-secondary" onClick={() => navigate('/Tomato-UI')}>Back to Home</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form className='place-order' onSubmit={handleSubmit}>
            {/* ─── Delivery Info ─── */}
            <div className="place-order-left">
                <p className="place-order-heading">Delivery Information</p>
                <div className="place-order-row">
                    <input type="text" name="firstName" placeholder="First name" required value={formData.firstName} onChange={handleChange} />
                    <input type="text" name="lastName" placeholder="Last name" required value={formData.lastName} onChange={handleChange} />
                </div>
                <input type="email" name="email" placeholder="Email address" required value={formData.email} onChange={handleChange} />
                <input type="text" name="street" placeholder="Street" required value={formData.street} onChange={handleChange} />
                <div className="place-order-row">
                    <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} />
                    <input type="text" name="state" placeholder="State" required value={formData.state} onChange={handleChange} />
                </div>
                <div className="place-order-row">
                    <input type="text" name="zipCode" placeholder="Zip code" required value={formData.zipCode} onChange={handleChange} />
                    <input type="text" name="country" placeholder="Country" required value={formData.country} onChange={handleChange} />
                </div>
                <input type="tel" name="phone" placeholder="Phone" required value={formData.phone} onChange={handleChange} />
            </div>

            {/* ─── Order Summary ─── */}
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Order Summary</h2>
                    <div className="order-summary-items">
                        {cartList.map(item => (
                            <div key={item._id} className="order-summary-row">
                                <img src={item.image} alt={item.name} />
                                <span className="order-item-name">{item.name} × {cartItems[item._id]}</span>
                                <span className="order-item-price">${(item.price * cartItems[item._id]).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div className="cart-total-details"><p>Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
                    <hr />
                    <div className="cart-total-details"><p>Delivery Fee</p><p>${deliveryFee.toFixed(2)}</p></div>
                    <hr />
                    <div className="cart-total-details"><b>Total</b><b>${total.toFixed(2)}</b></div>
                    <button type="submit" className="place-order-btn">Place Order →</button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;