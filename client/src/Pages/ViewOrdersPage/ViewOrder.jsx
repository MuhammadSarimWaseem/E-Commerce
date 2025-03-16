import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
    Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography,
    MenuItem, Select, List, ListItem, Divider, Button, FormControl, InputLabel
} from "@mui/material";
import { toast } from "react-toastify";
import authStore from "../../Store/authStore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ViewOrder() {
    const [orders, setOrders] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [filterStatus, setFilterStatus] = useState(""); // New filter state
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

    const exportToExcel = () => {
        if (orders.length === 0) {
            toast.warn("No orders to export.");
            return;
        }

        const formattedOrders = orders.map(order => ({
            "Customer Name": order.customerName,
            "Phone": order.contactDetails?.phone || "N/A",
            "Email": order.contactDetails?.email || "N/A",
            "Shipping Address": order.shippingAddress
                ? `${order.shippingAddress.street1}, ${order.shippingAddress.city}, ${order.shippingAddress.country} - ${order.shippingAddress.zipCode}`
                : "N/A",
            "Products": order.products.map(p => `${p.product?.title || "Unnamed"} (x${p.quantity})`).join(", "),
            ...(userRole === "admin" && {
                "Profit": order.products.map(p => `$${p.profit || 0}`).join(", "),
                "Total Profit": `$${order.products.reduce((acc, p) => acc + (p.quantity * (p.profit || 0)), 0)}`
            }),
            "Order Status": order.orderStatus || "Pending"
        }));

        const ws = XLSX.utils.json_to_sheet(formattedOrders);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, `Orders_${new Date().toISOString().split("T")[0]}.xlsx`);
        toast.success("Orders exported successfully!");
    };

    // Filter orders based on selected status
    const filteredOrders = filterStatus
        ? orders.filter(order => order.orderStatus === filterStatus)
        : orders;

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                {userRole === "admin" ? "Manage Orders (Admin)" : "View Orders (Seller)"}
            </Typography>

            {/* Filter Dropdown */}
            <FormControl sx={{ minWidth: 200, mb: 2 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
            </FormControl>

            {/* Export Orders Button */}
            {userRole === "admin" &&
                <Button
                    variant="contained"
                    color="primary"
                    onClick={exportToExcel}
                    sx={{ mb: 2, ml: 2 }}
                >
                    Download Orders (Excel)
                </Button>
            }

            <Paper sx={{ p: 2, overflowX: "auto", borderRadius: 2 }}>
                <Table sx={{ minWidth: 750 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell><b>Customer</b></TableCell>
                            <TableCell><b>Contact</b></TableCell>
                            <TableCell><b>Shipping Address</b></TableCell>
                            <TableCell><b>Products</b></TableCell>
                            {userRole === "admin" && <TableCell><b>Profit</b></TableCell>}
                            <TableCell><b>Order Status</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map(order => (
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
                                                <ListItem>
                                                    <Typography variant="body2">
                                                        • {item.product?.title || "Unnamed"} (x{item.quantity})
                                                    </Typography>
                                                </ListItem>
                                                {index < order.products.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </TableCell>
                                {userRole === "admin" &&
                                    <TableCell>${order.products.reduce((acc, p) => acc + (p.quantity * (p.profit || 0)), 0)}</TableCell>
                                }
                                <TableCell>
                                    {userRole === "admin" ? (
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <Select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            >
                                                <MenuItem value="Pending">Pending</MenuItem>
                                                <MenuItem value="Processing">Processing</MenuItem>
                                                <MenuItem value="Shipped">Shipped</MenuItem>
                                                <MenuItem value="Delivered">Delivered</MenuItem>
                                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <Typography>{order.orderStatus}</Typography>
                                    )}
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
