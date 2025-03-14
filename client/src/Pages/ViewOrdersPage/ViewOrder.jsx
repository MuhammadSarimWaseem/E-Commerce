import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
    Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography,
    MenuItem, Select, List, ListItem
} from "@mui/material";
import { toast } from "react-toastify";
import authStore from "../../Store/authStore";

function ViewOrder() {
    const [orders, setOrders] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const setValue = authStore((state) => state.setValue);

    // ✅ Fetch User Role
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const authResponse = await Axios.get(`${import.meta.env.VITE_BASE_URL}/landing`, { withCredentials: true });
                setValue(true);
                const { data } = await Axios.get(`${import.meta.env.VITE_BASE_URL}/userRole`, { withCredentials: true });
                setUserRole(data.role); 
                console.log("User Role:", data.role);
            } catch (error) {
                console.error("Error fetching user role:", error);
                toast.error("Failed to fetch user role");
                setValue(false);
            }
        };

        fetchUserRole();
    }, []);

    // ✅ Set API URL Dynamically
    
    // ✅ Fetch Orders After `userRole` is Available
    useEffect(() => {
        if (!userRole) return; 
        
        const fetchOrders = async () => {
            try {
                const API_URL = userRole === "admin" ? "/adminOrders" : "/sellerOrders";
                const { data } = await Axios.get(`${import.meta.env.VITE_BASE_URL}${API_URL}`, { withCredentials: true });
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        };

        fetchOrders();
    }, [userRole]);

    const handleStatusChange = async (orderId, newStatus) => {
        if (userRole !== "admin") return; 

        setOrders(prevOrders =>
            prevOrders.map(order =>
                order._id === orderId ? { ...order, orderStatus: newStatus } : order
            )
        );

        try {
            await Axios.put(
                `${import.meta.env.VITE_BASE_URL}/adminOrders/${orderId}`,
                { orderStatus: newStatus },
                { withCredentials: true }
            );
            toast.success("Order status updated!");
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                {userRole === "admin" ? "Manage Orders (Admin)" : "View Orders (Seller)"}
            </Typography>
            <Paper sx={{ p: 2, overflowX: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Customer</b></TableCell>
                            <TableCell><b>Contact</b></TableCell>
                            <TableCell><b>Shipping Address</b></TableCell>
                            <TableCell><b>Products</b></TableCell>
                            <TableCell><b>Order Status</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order._id}>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>{order.contactDetails}</TableCell>
                                <TableCell>{order.shippingAddress}</TableCell>
                                
                                {/* ✅ Display Products Correctly */}
                                <TableCell>
                                    <List dense>
                                        {order.products.map((item, index) => (
                                            <ListItem key={index} sx={{ p: 0 }}>
                                                • {item.product.title || "Unnamed Product"} (x{item.quantity})
                                            </ListItem>
                                        ))}
                                    </List>
                                </TableCell>

                                {/* ✅ Order Status Dropdown */}
                                <TableCell>
                                    <Select
                                        value={order.orderStatus || "Pending"}  // Default to "Pending"
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        disabled={userRole !== "admin"}
                                        sx={{ minWidth: "120px" }}
                                    >
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="Processing">Processing</MenuItem>
                                        <MenuItem value="Shipped">Shipped</MenuItem>
                                        <MenuItem value="Delivered">Delivered</MenuItem>
                                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}

export default ViewOrder;
