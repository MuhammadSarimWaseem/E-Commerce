import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Typography, Card, CardContent, Box, Button, IconButton, Grid, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import cartStore from '../../Store/cartStore';

function Cart() {
    const cartValue = cartStore((state) => state.cartValue) || [];
    const setCartValue = cartStore((state) => state.setCartValue);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const total = cartValue.reduce((acc, item) => acc + (item.price || 0), 0);
        setTotalAmount(total);
    }, [cartValue]);

    const handleDelete = (index) => {
        const newCart = cartValue.filter((_, i) => i !== index);
        setCartValue(newCart);
        toast.info("Item removed from cart", { theme: "dark" });
    };

    // const handleOrder = async () => {
    //     if (cartValue.length === 0) {
    //         toast.warn("Cart is empty!", { theme: "dark" });
    //         return;
    //     }

    //     try {
    //         const response = await fetch(process.env.REACT_APP_FIREBASE_CART_DATABASE_URL, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ cartValue: cartValue }),
    //         });

    //         if (response.ok) {
    //             setCartValue([]);
    //             toast.success("Order placed successfully!", { theme: "dark" });
    //         } else {
    //             throw new Error("Failed to place order");
    //         }
    //     } catch (error) {
    //         toast.error(error.message, { theme: "dark" });
    //     }
    // };

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
                                        <Typography variant="body2" color="text.secondary">Wholesale Price: ${item.wholesalrPrice?.toFixed(2)}</Typography>
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
