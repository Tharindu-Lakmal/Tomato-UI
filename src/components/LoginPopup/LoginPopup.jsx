import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const LoginPopup = ({ setShowLogin }) => {

    const { login } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (currState === 'Sign Up' && !data.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = 'Enter a valid email';
        }
        if (data.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!agreeTerms) {
            newErrors.terms = 'You must agree to the terms';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        // Simulate login/signup success
        const userData = {
            name: currState === 'Sign Up' ? data.name : data.email.split('@')[0],
            email: data.email,
        };
        login(userData);
        setShowLogin(false);
    };

    return (
        <div className='login-popup' onClick={(e) => { if (e.target.classList.contains('login-popup')) setShowLogin(false); }}>
            <form className="login-popup-container" onSubmit={handleSubmit}>

                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
                </div>

                <div className="login-popup-inputs">
                    {currState === 'Sign Up' && (
                        <div className="login-field">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your name"
                                value={data.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span className="login-error">{errors.name}</span>}
                        </div>
                    )}

                    <div className="login-field">
                        <input
                            type="email"
                            name="email"
                            placeholder="Your email"
                            value={data.email}
                            onChange={handleChange}
                        />
                        {errors.email && <span className="login-error">{errors.email}</span>}
                    </div>

                    <div className="login-field">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={handleChange}
                        />
                        {errors.password && <span className="login-error">{errors.password}</span>}
                    </div>
                </div>

                <button type="submit">
                    {currState === 'Sign Up' ? 'Create account' : 'Login'}
                </button>

                <div className="login-popup-condition">
                    <input
                        type="checkbox"
                        id="terms-check"
                        checked={agreeTerms}
                        onChange={(e) => { setAgreeTerms(e.target.checked); setErrors({ ...errors, terms: '' }); }}
                    />
                    <label htmlFor="terms-check">By continuing, I agree to the terms of use &amp; privacy policy</label>
                </div>
                {errors.terms && <span className="login-error">{errors.terms}</span>}

                {currState === 'Login'
                    ? <p>Create a new account? <span onClick={() => { setCurrState('Sign Up'); setErrors({}); }}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => { setCurrState('Login'); setErrors({}); }}>Login here</span></p>
                }

            </form>
        </div>
    );
};

export default LoginPopup;