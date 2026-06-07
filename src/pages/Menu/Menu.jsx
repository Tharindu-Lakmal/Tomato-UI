import React, { useState } from 'react'
import './Menu.css'
import ExploreMenu from '../../components/Navbar/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'

const Menu = () => {
    const [category, setCategory] = useState("All");

    return (
        <div className="menu-page">
            <div className="menu-hero">
                <div className="menu-hero-content">
                    <span className="menu-hero-tag">Full Menu</span>
                    <h1>Explore Our <span>Delicious</span> Menu</h1>
                    <p>Browse through our wide variety of fresh, handcrafted dishes — curated for every craving.</p>
                </div>
                <div className="menu-hero-decoration">
                    <div className="deco-circle deco-1"></div>
                    <div className="deco-circle deco-2"></div>
                    <div className="deco-circle deco-3"></div>
                </div>
            </div>

            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
        </div>
    );
};

export default Menu;
