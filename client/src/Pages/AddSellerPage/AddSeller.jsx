import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { toast } from "react-toastify";
import {
    Container,
    TextField,
    Button,
    Paper,
    Typography
} from "@mui/material";

function AddSeller() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [input, setInput] = useState({ name: "", address: "", contact_no: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic input validation
        if (!input.name || !input.address || !input.contact_no) {
            toast.error("All fields are required!");
            return;
        }
        if (input.contact_no.length < 10 || input.contact_no.length > 15) {
            toast.error("Enter a valid contact number.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { data } = await Axios.post(`${import.meta.env.VITE_BASE_URL}/addSeller`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            toast.success(data.message);
            setInput({ name: "", address: "", contact_no: "" });
            navigate("/landing");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Signup failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    borderRadius: "10px",
                    width: "100%",
                }}
            >
                <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#0072ff" }}>
                    Add Seller
                </Typography>

                <form style={{ width: "100%" }} onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        value={input.name}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                    />

                    <TextField
                        label="Address"
                        name="address"
                        value={input.address}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                    />

                    <TextField
                        label="Contact Number"
                        name="contact_no"
                        type="tel"
                        value={input.contact_no}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        inputProps={{ maxLength: 15 }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        sx={{
                            mt: 3,
                            mb: 2,
                            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                            color: "#fff",
                            fontWeight: "bold",
                            "&:hover": {
                                background: "linear-gradient(90deg, #0072ff, #00c6ff)",
                            },
                        }}
                    >
                        {isSubmitting ? "Adding Seller..." : "Add Seller"}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default AddSeller;
