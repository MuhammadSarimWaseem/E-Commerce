import React, { useEffect, useRef, useState, useCallback } from "react";
import { TextField, Button, Container, Typography, Paper, Grid, CircularProgress, Card, CardContent, CardMedia } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import authStore from "../../Store/authStore";
import Axios from "axios";
import { toast } from "react-toastify";
import permissionStore from "../../Store/permission";

function AddProducts() {
    const navigate = useNavigate();
    const setValue = authStore((state) => state.setValue);
    const setPermissionValue = permissionStore((state) => state.setPermissionValue);
    const imageInputRef = useRef(null);

    const [products, setProducts] = useState({
        title: "",
        description: "",
        price: "",
        image: null,
        preview: "",
    });

    const [loading, setLoading] = useState(false);

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

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setProducts((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file && file !== products.image) {
            setProducts((prev) => ({
                ...prev,
                image: file,
                preview: URL.createObjectURL(file),
            }));
        }
    }, [products.image]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!products.title || !products.description || !products.price || !products.image) {
            toast.error("All fields are required.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        Object.entries(products).forEach(([key, value]) => {
            if (key !== "preview") formData.append(key, value);
        });

        try {
            const response = await Axios.post("http://localhost:8000/addProducts", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setProducts({ title: "", description: "", price: "", image: null, preview: "" });
            if (imageInputRef.current) imageInputRef.current.value = "";

            toast.success(response.data.message || "Product added successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Paper elevation={5} sx={{ padding: 4, mt: 3, borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
                        Add New Product
                    </Typography>
                    <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField label="Title" name="title" fullWidth variant="outlined" value={products.title} onChange={handleChange} required />
                                <TextField label="Description" name="description" fullWidth multiline rows={4} variant="outlined" value={products.description} onChange={handleChange} required sx={{ mt: 2 }} />
                                <TextField label="Price" name="price" type="number" fullWidth variant="outlined" value={products.price} onChange={handleChange} required sx={{ mt: 2 }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    {products.preview ? (
                                        <CardMedia component="img" image={products.preview} alt="Preview" sx={{ height: 180, maxWidth: "100%", objectFit: "contain" }} />
                                    ) : (
                                        <Typography variant="body2" sx={{ textAlign: "center", padding: 2 }}>
                                            No Image Selected
                                        </Typography>
                                    )}
                                    <CardContent>
                                        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} id="file-input" />
                                        <label htmlFor="file-input">
                                            <Button variant="contained" component="span" sx={{
                                                background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                                                color: "#fff",
                                                fontWeight: "bold",
                                                "&:hover": { background: "linear-gradient(90deg, #0072ff, #00c6ff)" },
                                                mt: 1
                                            }}>
                                                Upload Image
                                            </Button>
                                        </label>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <motion.div whileHover={!loading ? { scale: 1.05 } : {}} whileTap={!loading ? { scale: 0.95 } : {}}>
                            <Button type="submit" variant="contained" fullWidth sx={{
                                mt: 3,
                                background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                                color: "#fff",
                                fontWeight: "bold",
                                "&:hover": { background: "linear-gradient(90deg, #0072ff, #00c6ff)" },
                            }} disabled={loading}>
                                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Submit"}
                            </Button>
                        </motion.div>
                    </motion.form>
                </Paper>
            </motion.div>
        </Container>
    );
}

export default AddProducts;