import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    Button,
    IconButton,
    Grid,
    Avatar,
    TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import cartStore from "../../Store/cartStore";
import Axios from "axios";
import authStore from "../../Store/authStore";
import permissionStore from "../../Store/permission";

function Cart() {
    const cartValue = cartStore((state) => state.cartValue) || [];
    const setCartValue = cartStore((state) => state.setCartValue);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    const setValue = authStore((state) => state.setValue);
    const setPermissionValue = permissionStore((state) => state.setPermissionValue);

    const [shippingDetails, setShippingDetails] = useState({
        customerName: "",
        contactDetails: "",
        shippingAddress: "",
    });

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const [authResponse, roleResponse] = await Promise.all([
                    Axios.get(`${import.meta.env.VITE_BASE_URL}/landing`, { withCredentials: true }),
                    Axios.get(`${import.meta.env.VITE_BASE_URL}/userRole`, { withCredentials: true }),
                ]);

                if (!authResponse.data.user) throw new Error("Unauthorized");

                setValue(true);
                setPermissionValue(roleResponse.data.AddProducts);
            } catch (error) {
                setValue(false);
                navigate("/login");
            }
        };

        authenticateUser();
    }, [navigate, setValue, setPermissionValue]);

    useEffect(() => {
        const total = cartValue.reduce((acc, item) => acc + (item.price || 0), 0);
        setTotalAmount(total);
    }, [cartValue]);

    const handleDelete = (index) => {
        const newCart = cartValue.filter((_, i) => i !== index);
        setCartValue(newCart);
        toast.info("Item removed from cart", { theme: "dark" });
    };

    const handleOrder = async () => {
        if (cartValue.length === 0) {
            toast.warn("Cart is empty!", { theme: "dark" });
            return;
        }

        if (!shippingDetails.customerName || !shippingDetails.contactDetails || !shippingDetails.shippingAddress) {
            toast.warn("Please fill in all shipping details!", { theme: "dark" });
            return;
        }

        try {
            const response = await Axios.post(
                `${import.meta.env.VITE_BASE_URL}/order`,{ cart: cartValue, shippingDetails },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                setCartValue([]);
                setShippingDetails({ customerName: "", contactDetails: "", shippingAddress: "" });
                toast.success("Order placed successfully!", { theme: "dark" });
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.response?.data?.error || "Failed to place order", { theme: "dark" });
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4, fontWeight: "bold", color: "#0072ff" }}>
                Your Cart
            </Typography>

            {cartValue.length === 0 ? (
                <Typography variant="h6" align="center" sx={{ mt: 4, color: "#888" }}>
                    Your cart is empty! 🛒
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {/* Left Side: Cart Items */}
                    <Grid item xs={12} md={7}>
                        {cartValue.map((item, index) => (
                            <Card key={index} sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3, mb: 2 }}>
                                <Avatar src={item.image} alt={item.title} sx={{ width: 80, height: 80, mr: 2 }} />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{item.title}</Typography>
                                    <Typography variant="body1" color="text.secondary">Price: ${item.price.toFixed(2)}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Wholesale Price: ${item.wholesalePrice?.toFixed(2)}
                                    </Typography>
                                </CardContent>
                                <IconButton color="error" onClick={() => handleDelete(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Card>
                        ))}
                    </Grid>

                    {/* Right Side: Shipping Form & Summary */}
                    <Grid item xs={12} md={5}>
                        <Card sx={{ p: 3, boxShadow: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Shipping Details
                            </Typography>
                            <TextField
                                fullWidth
                                label="Customer Name"
                                variant="outlined"
                                margin="normal"
                                value={shippingDetails.customerName}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, customerName: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Contact Details"
                                variant="outlined"
                                margin="normal"
                                value={shippingDetails.contactDetails}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, contactDetails: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Shipping Address"
                                variant="outlined"
                                margin="normal"
                                multiline
                                rows={3}
                                value={shippingDetails.shippingAddress}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, shippingAddress: e.target.value })}
                            />
                        </Card>

                        {/* Order Summary */}
                        <Card sx={{ mt: 3, p: 3, boxShadow: 3 }}>
                            <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
                                Total Amount: ${totalAmount.toFixed(2)}
                            </Typography>
                            <Box display="flex" justifyContent="center" mt={3} gap={2}>
                                <Button
                                    variant="contained"
                                    sx={{ background: "#0072ff", color: "#fff", fontWeight: "bold", px: 4 }}
                                    onClick={() => navigate("/landing")}
                                >
                                    Products
                                </Button>
                                <Button
                                    onClick={handleOrder}
                                    variant="contained"
                                    sx={{ background: "#ff4b2b", color: "#fff", fontWeight: "bold", px: 4 }}
                                    disabled={cartValue.length === 0}
                                >
                                    Order
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}

export default Cart;