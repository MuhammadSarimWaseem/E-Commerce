import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { toast } from "react-toastify";
import { Container, TextField, Button, Paper, Typography, Grid } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

function AddSeller() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [input, setInput] = useState({
        name: "",
        contactDetails: { phone: "", email: "" },
        shippingAddress: { street1: "", street2: "", city: "", country: "", zipCode: "" },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("contactDetails.")) {
            setInput((prev) => ({
                ...prev,
                contactDetails: { ...prev.contactDetails, [name.split(".")[1]]: value },
            }));
        } else if (name.includes("shippingAddress.")) {
            setInput((prev) => ({
                ...prev,
                shippingAddress: { ...prev.shippingAddress, [name.split(".")[1]]: value },
            }));
        } else {
            setInput((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data } = await Axios.post(`${import.meta.env.VITE_BASE_URL}/addSeller`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            toast.success(data.message);
            setInput({
                name: "",
                contactDetails: { phone: "", email: "" },
                shippingAddress: { street1: "", street2: "", city: "", country: "", zipCode: "" },
            });
            navigate("/landing");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to add seller. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: "10px", width: "100%" }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#0072ff" }}>Add Seller</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Name" name="name" value={input.name} onChange={handleInputChange} fullWidth required margin="normal" />

                    <PhoneInput
                                country={"us"} // Default country
                                enableSearch={true} // Allows users to search for country codes
                                value={input.contactDetails.phone}
                                onChange={(phone) =>
                                    setInput((prev) => ({
                                        ...prev,
                                        contactDetails: { ...prev.contactDetails, phone },
                                    }))
                                }
                                
                                inputStyle={{
                                    width: "100%",
                                    height: "56px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    paddingLeft: "50px",
                                }}
                            />
                    <TextField label="Email" name="contactDetails.email" value={input.contactDetails.email} onChange={handleInputChange} fullWidth margin="normal" />

                    <TextField label="Street 1" name="shippingAddress.street1" value={input.shippingAddress.street1} onChange={handleInputChange} fullWidth required margin="normal" />
                    <TextField label="Street 2" name="shippingAddress.street2" value={input.shippingAddress.street2} onChange={handleInputChange} fullWidth margin="normal" />

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField label="City" name="shippingAddress.city" value={input.shippingAddress.city} onChange={handleInputChange} fullWidth required margin="normal" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Country" name="shippingAddress.country" value={input.shippingAddress.country} onChange={handleInputChange} fullWidth required margin="normal" />
                        </Grid>
                    </Grid>
                    <TextField label="Zip Code" name="shippingAddress.zipCode" value={input.shippingAddress.zipCode} onChange={handleInputChange} fullWidth required margin="normal" />

                    <Button type="submit" fullWidth variant="contained" size="large" disabled={isSubmitting} sx={{ mt: 3, mb: 2, background: "linear-gradient(90deg, #00c6ff, #0072ff)", color: "#fff", fontWeight: "bold" }}>
                        {isSubmitting ? "Adding Seller..." : "Add Seller"}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default AddSeller;
