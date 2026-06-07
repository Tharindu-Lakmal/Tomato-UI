import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Cart = () => {

    const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount } = useContext(StoreContext);
    const navigate = useNavigate();

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 2;
    const total = subtotal + deliveryFee;

    const cartList = food_list.filter(item => cartItems[item._id] > 0);

    return (
        <div className='cart'>
            {cartList.length === 0
                ? (
                    <div className="cart-empty">
                        <img src={assets.basket_icon} alt="Empty cart" className="cart-empty-icon" />
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything yet.</p>
                        <button onClick={() => navigate('/Tomato-UI')} className="cart-back-btn">Browse Menu</button>
                    </div>
                )
                : (
                    <>
                        <div className="cart-items">
                            <div className="cart-items-title">
                                <p>Items</p>
                                <p>Title</p>
                                <p>Price</p>
                                <p>Quantity</p>
                                <p>Total</p>
                                <p>Remove</p>
                            </div>
                            <hr />
                            {cartList.map((item) => (
                                <div key={item._id}>
                                    <div className="cart-items-title cart-items-item">
                                        <img src={item.image} alt={item.name} />
                                        <p>{item.name}</p>
                                        <p>${item.price}</p>
                                        <div className="cart-item-counter">
                                            <img
                                                src={assets.remove_icon_red}
                                                alt="remove"
                                                onClick={() => removeFromCart(item._id)}
                                                className="cart-qty-btn"
                                            />
                                            <span>{cartItems[item._id]}</span>
                                            <img
                                                src={assets.add_icon_green}
                                                alt="add"
                                                onClick={() => addToCart(item._id)}
                                                className="cart-qty-btn"
                                            />
                                        </div>
                                        <p>${(item.price * cartItems[item._id]).toFixed(2)}</p>
                                        <img
                                            src={assets.cross_icon}
                                            className="cart-remove-btn"
                                            onClick={() => {
                                                // remove all of this item
                                                const count = cartItems[item._id];
                                                for (let i = 0; i < count; i++) removeFromCart(item._id);
                                            }}
                                            alt="remove"
                                        />
                                    </div>
                                    <hr />
                                </div>
                            ))}
                        </div>

                        <div className="cart-bottom">
                            <div className="cart-total">
                                <h2>Cart Totals</h2>
                                <div className="cart-total-details">
                                    <p>Subtotal</p>
                                    <p>${subtotal.toFixed(2)}</p>
                                </div>
                                <hr />
                                <div className="cart-total-details">
                                    <p>Delivery Fee</p>
                                    <p>${deliveryFee.toFixed(2)}</p>
                                </div>
                                <hr />
                                <div className="cart-total-details">
                                    <b>Total</b>
                                    <b>${total.toFixed(2)}</b>
                                </div>
                                <button onClick={() => navigate('/order')} className="cart-checkout-btn">
                                    Proceed to Checkout
                                </button>
                            </div>

                            <div className="cart-promocode">
                                <p>If you have a promo code, enter it here</p>
                                <div className="cart-promocode-input">
                                    <input type="text" placeholder="Promo code" />
                                    <button>Submit</button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Cart