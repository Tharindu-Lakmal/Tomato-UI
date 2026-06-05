import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

function Footer() {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p>
                    We use the same event handler function for both input 
                    fields, we could write one event handler for each, but 
                    this gives us much cleaner code and is the preferred way 
                    in React.
                </p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GRT IN TOUCH</h2>
                <ul>
                    <li>+9471 455 247</li>
                    <li>contact@tomato.com</li>
                </ul>
            </div>
        </div>

        
        <hr />

        <p className="footer-copyright">
            Copyright 1999-2024 by Refsnes Data. All Rights Reserved. 
        </p>
    </div>
  )
}

export default Footer