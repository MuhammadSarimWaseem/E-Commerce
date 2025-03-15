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
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

function Cart() {
    const cartValue = cartStore((state) => state.cartValue) || [];
    const setCartValue = cartStore((state) => state.setCartValue);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    const setValue = authStore((state) => state.setValue);
    const setPermissionValue = permissionStore((state) => state.setPermissionValue);

    const [shippingDetails, setShippingDetails] = useState({
        customerName: "",
        contactDetails: {
            phone: "",
            email: ""
        },
        shippingAddress: {
            street1: "",
            street2: "",
            city: "",
            country: "",
            zipCode: ""
        }
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
        const total = cartValue.reduce((acc, item) => acc + (item.wholesalePrice || 0) * (item.quantity || 1), 0);
        setTotalAmount(total);
    }, [cartValue]);

    const handleDelete = (index) => {
        const newCart = cartValue.filter((_, i) => i !== index);
        setCartValue(newCart);
        toast.info("Item removed from cart", { theme: "dark" });
    };

    const updateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return; // Prevent negative quantity

        const updatedCart = cartValue.map((item, i) =>
            i === index ? { ...item, quantity: newQuantity } : item
        );

        setCartValue([...updatedCart]);
    };

    const handleOrder = async () => {
        if (cartValue.length === 0) {
            toast.warn("Cart is empty!", { theme: "dark" });
            return;
        }

        const { customerName, contactDetails, shippingAddress } = shippingDetails;
        if (!customerName || !contactDetails.phone || !shippingAddress.street1 || !shippingAddress.city || !shippingAddress.country || !shippingAddress.zipCode) {
            toast.warn("Please fill in all required shipping details!", { theme: "dark" });
            return;
        }

        try {
            const token = Cookies.get("token");
            if (!token) {
                toast.error("Authentication error! Please log in again.", { theme: "dark" });
                return;
            }

            const response = await Axios.post(
                `${import.meta.env.VITE_BASE_URL}/order`,
                { cart: cartValue, shippingDetails },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                }
            );

            if (response.status === 201) {
                setCartValue([]);
                setShippingDetails({
                    customerName: "",
                    contactDetails: { phone: "", email: "" },
                    shippingAddress: { street1: "", street2: "", city: "", country: "", zipCode: "" }
                });
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
                    <Grid item xs={12} md={7}>
                        {cartValue.map((item, index) => (
                            <Card key={index} sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3, mb: 2 }}>
                                <Avatar src={item.image} alt={item.title} sx={{ width: 80, height: 80, mr: 2 }} />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{item.title}</Typography>
                                    <Typography variant="body1" color="text.secondary">Price: ${item.price.toFixed(2)}</Typography>
                                    <Typography variant="body1" color="text.secondary">Wholesale Price: ${item.wholesalePrice.toFixed(2)}</Typography>
                                    {/* Quantity Update Field */}
                                    <TextField
                                        type="number"
                                        label="Quantity"
                                        variant="outlined"
                                        size="small"
                                        value={item.quantity || 1}
                                        onChange={(e) => updateQuantity(index, parseInt(e.target.value, 10))}
                                        sx={{ mt: 1, width: 80 }}
                                    />
                                </CardContent>
                                <IconButton color="error" onClick={() => handleDelete(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Card>
                        ))}
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Card sx={{ p: 3, boxShadow: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Shipping Details</Typography>
                            <TextField fullWidth label="Name" variant="outlined" margin="normal"
                                value={shippingDetails.customerName}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, customerName: e.target.value })}
                            />
                            <PhoneInput
                                country={"us"} // Default country
                                enableSearch={true} // Allows users to search for country codes
                                value={shippingDetails.contactDetails.phone}
                                onChange={(phone) =>
                                    setShippingDetails({
                                        ...shippingDetails,
                                        contactDetails: { ...shippingDetails.contactDetails, phone },
                                    })
                                }
                                inputStyle={{
                                    width: "100%",
                                    height: "56px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    paddingLeft: "50px",
                                }}
                            />

                            <TextField fullWidth label="Email (Optional)" variant="outlined" margin="normal"
                                value={shippingDetails.contactDetails.email}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, contactDetails: { ...shippingDetails.contactDetails, email: e.target.value } })}
                            />
                            <TextField fullWidth label="Street 1" variant="outlined" margin="normal"
                                value={shippingDetails.shippingAddress.street1}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, shippingAddress: { ...shippingDetails.shippingAddress, street1: e.target.value } })}
                            />
                            <TextField fullWidth label="Street 2 (Optional)" variant="outlined" margin="normal"
                                value={shippingDetails.shippingAddress.street2}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, shippingAddress: { ...shippingDetails.shippingAddress, street2: e.target.value } })}
                            />
                            <TextField fullWidth label="City" variant="outlined" margin="normal"
                                value={shippingDetails.shippingAddress.city}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, shippingAddress: { ...shippingDetails.shippingAddress, city: e.target.value } })}
                            />
                            <TextField fullWidth label="Country" variant="outlined" margin="normal"
                                value={shippingDetails.shippingAddress.country}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, shippingAddress: { ...shippingDetails.shippingAddress, country: e.target.value } })}
                            />
                            <TextField fullWidth label="Zip Code" variant="outlined" margin="normal"
                                value={shippingDetails.shippingAddress.zipCode}
                                onChange={(e) => setShippingDetails({ ...shippingDetails, shippingAddress: { ...shippingDetails.shippingAddress, zipCode: e.target.value } })}
                            />
                        </Card>

                        {/* Total Pricing Section */}
                        <Card sx={{ p: 3, mt: 3, boxShadow: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Order Summary</Typography>
                            <Box display="flex" justifyContent="space-between" mt={2}>
                                <Typography variant="body1">Subtotal:</Typography>
                                <Typography variant="body1">${totalAmount.toFixed(2)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mt={1}>
                                <Typography variant="body1">Shipping Fee:</Typography>
                                <Typography variant="body1">${totalAmount > 50 ? "Free" : "5.00"}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mt={1} fontWeight="bold">
                                <Typography variant="body1">Total:</Typography>
                                <Typography variant="body1">${(totalAmount > 50 ? totalAmount : totalAmount + 5).toFixed(2)}</Typography>
                            </Box>
                        </Card>
                        <Button onClick={handleOrder} variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>Order</Button>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}

export default Cart;