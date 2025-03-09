import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Typography, List, ListItem, ListItemText, Button, IconButton, Card, CardContent, Box } from '@mui/material';
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
            <Container maxWidth="sm">
                <Card sx={{ mt: 4, p: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h5" align="center" gutterBottom>
                            Cart Items
                        </Typography>
                        <List>
                            {cartValue.length > 0 ? (
                                cartValue.map((item, index) => (
                                    <ListItem key={index} secondaryAction={
                                        <IconButton edge="end" color="error" onClick={() => handleDelete(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }>
                                        <ListItemText primary={`${item.title} - $${item.price}`} />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                                    Your cart is empty!
                                </Typography>
                            )}
                            <ListItem>
                                <ListItemText primary={`Total Amount: $${totalAmount.toFixed(2)}`} />
                            </ListItem>
                        </List>
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <Button variant="contained" color="primary"
                                sx={{
                                    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    "&:hover": { background: "linear-gradient(90deg, #0072ff, #00c6ff)" },
                                }} onClick={() => navigate('/landing')}>
                                Products
                            </Button>
                            <Button variant="contained" color="secondary"
                                sx={{
                                    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    "&:hover": { background: "linear-gradient(90deg, #0072ff, #00c6ff)" },
                                }} disabled={cartValue.length === 0}>
                                Order
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Fragment>
    );
}

export default Cart;