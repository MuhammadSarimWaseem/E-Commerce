import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
    Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography,
    MenuItem, Select, List, ListItem, Divider
} from "@mui/material";
import { toast } from "react-toastify";
import authStore from "../../Store/authStore";

function ViewOrder() {
    const [orders, setOrders] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const setValue = authStore((state) => state.setValue);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const authResponse = await Axios.get(`${import.meta.env.VITE_BASE_URL}/landing`, { withCredentials: true });
                setValue(true);
                const { data } = await Axios.get(`${import.meta.env.VITE_BASE_URL}/userRole`, { withCredentials: true });
                setUserRole(data.role);
            } catch (error) {
                console.error("Error fetching user role:", error);
                toast.error("Failed to fetch user role");
                setValue(false);
            }
        };

        fetchUserRole();
    }, []);

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
            <Paper sx={{ p: 2, overflowX: "auto", borderRadius: 2 }}>
                <Table sx={{ minWidth: 750 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell><b>Customer</b></TableCell>
                            <TableCell><b>Contact</b></TableCell>
                            <TableCell><b>Shipping Address</b></TableCell>
                            <TableCell><b>Products</b></TableCell>
                            {userRole === "admin" &&
                            <TableCell><b>Profit</b></TableCell>
                            }
                            <TableCell><b>Order Status</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order._id} hover>
                                <TableCell>{order.customerName}</TableCell>

                                <TableCell>
                                    <Typography variant="body2">📞 {order.contactDetails?.phone || "N/A"}</Typography>
                                    <Typography variant="body2" color="textSecondary">✉️ {order.contactDetails?.email || "N/A"}</Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="body2">
                                        {order.shippingAddress
                                            ? `${order.shippingAddress.street1}, ${order.shippingAddress.city}, ${order.shippingAddress.country} - ${order.shippingAddress.zipCode}`
                                            : "Address not available"}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <List dense>
                                        {order.products.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
                                                    <Typography variant="body2">
                                                        • {item.product?.title || "Unnamed Product"} (x{item.quantity})
                                                    </Typography>
                                                </ListItem>
                                                {index < order.products.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </TableCell>
                                {userRole === "admin" &&

                                    <TableCell>
                                        <List dense>
                                            {order.products.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            ${item.profit || 0} each | <span style={{ color: "#4caf50" }}>Total: ${item.quantity * (item.profit || 0)}</span>
                                                        </Typography>
                                                    </ListItem>
                                                    {index < order.products.length - 1 && <Divider />}
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </TableCell>
                                }

                                <TableCell>
                                    <Select
                                        value={order.orderStatus || "Pending"}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        disabled={userRole !== "admin"}
                                        fullWidth
                                        sx={{
                                            minWidth: "120px",
                                            fontSize: "14px",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "8px"
                                        }}
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
