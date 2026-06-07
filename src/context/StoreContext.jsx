
import { createContext, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState([]);

    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    };

    const getTotalCartAmount = () => {
        let total = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const item = food_list.find((f) => f._id === itemId);
                if (item) {
                    total += item.price * cartItems[itemId];
                }
            }
        }
        return total;
    };

    const getTotalCartCount = () => {
        let count = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                count += cartItems[itemId];
            }
        }
        return count;
    };

    const placeOrder = (deliveryInfo) => {
        const cartList = food_list.filter(item => cartItems[item._id] > 0);
        const subtotal = getTotalCartAmount();
        const deliveryFee = subtotal === 0 ? 0 : 2;

        const newOrder = {
            id: `ORD-${Date.now()}`,
            date: new Date().toISOString(),
            items: cartList.map(item => ({
                _id: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: cartItems[item._id],
            })),
            deliveryInfo,
            subtotal,
            deliveryFee,
            total: subtotal + deliveryFee,
            // First order is always "Pending", previous ones become "Delivered"
            status: "Pending",
        };

        setOrders(prev => {
            // Mark previous pending orders as delivered for demo purposes
            const updated = prev.map(o =>
                o.status === "Pending" ? { ...o, status: "Delivered" } : o
            );
            return [newOrder, ...updated];
        });

        setCartItems({});
    };

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        setOrders([]);
    };

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartCount,
        placeOrder,
        orders,
        user,
        login,
        logout,
        searchQuery,
        setSearchQuery,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;