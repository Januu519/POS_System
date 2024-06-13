import axios from "axios";

// Backend URI
const baseURL = 'http://localhost:3000';

export const getOrderDetails = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/v1/order/all`);
        console.log("Order details:", response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to get order details:', error);
        return null;
    }
};
