import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Typography, Card, CardContent, Box, Button, IconButton, Grid, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import cartStore from '../../Store/cartStore';
import Axios from 'axios';
import Cookies from 'js-cookie';
import authStore from '../../Store/authStore';
import permissionStore from '../../Store/permission';

function Cart() {
    const cartValue = cartStore((state) => state.cartValue) || [];
    const setCartValue = cartStore((state) => state.setCartValue);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();


    const setValue = authStore((state) => state.setValue);
    const setPermissionValue = permissionStore((state) => state.setPermissionValue);
    
    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const [authResponse, roleResponse] = await Promise.all([
                    Axios.get("http://localhost:8000/landing", { withCredentials: true }),
                    Axios.get("http://localhost:8000/userRole", { withCredentials: true })
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

        try {
            const response = await Axios.post(
                "http://localhost:8000/order", cartValue, {
                withCredentials: true, // Important for sending cookies
                headers: {
                    "Content-Type": "application/json"
                },
            }
            );

            console.log("Response:", response);

            if (response.status === 201) {
                setCartValue([]); // Clear cart
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
        <Fragment>
            <Container maxWidth="md">
                <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4, fontWeight: 'bold', color: '#0072ff' }}>
                    Your Cart
                </Typography>
                {cartValue.length > 0 ? (
                    <Grid container spacing={2}>
                        {cartValue.map((item, index) => (
                            <Grid item xs={12} key={index}>
                                <Card sx={{ display: 'flex', alignItems: 'center', p: 2, boxShadow: 3 }}>
                                    <Avatar src={item.image} alt={item.title} sx={{ width: 80, height: 80, mr: 2 }} />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                                        <Typography variant="body1" color="text.secondary">Price: ${item.price.toFixed(2)}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Wholesale Price: ${item.wholesalePrice?.toFixed(2)}
                                        </Typography>

                                    </CardContent>
                                    <IconButton color="error" onClick={() => handleDelete(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="h6" align="center" sx={{ mt: 4, color: '#888' }}>
                        Your cart is empty! 🛒
                    </Typography>
                )}
                {cartValue.length > 0 && (
                    <Typography variant="h5" align="center" sx={{ mt: 3, fontWeight: 'bold' }}>
                        Total Amount: ${totalAmount.toFixed(2)}
                    </Typography>
                )}
                <Box display="flex" justifyContent="center" mt={3} gap={2}>
                    <Button
                        variant="contained"
                        sx={{
                            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                            color: "#fff",
                            fontWeight: "bold",
                            px: 4,
                            '&:hover': { background: "linear-gradient(90deg, #0072ff, #00c6ff)" }
                        }}
                        onClick={() => navigate('/landing')}
                    >
                        Products
                    </Button>
                    <Button
                        onClick={handleOrder}
                        variant="contained"
                        sx={{
                            background: "linear-gradient(90deg, #ff7e5f, #ff4b2b)",
                            color: "#fff",
                            fontWeight: "bold",
                            px: 4,
                            '&:hover': { background: "linear-gradient(90deg, #ff4b2b, #ff7e5f)" }
                        }}
                        disabled={cartValue.length === 0}
                    >
                        Order
                    </Button>
                </Box>
            </Container>
        </Fragment>
    );
}

export default Cart;
