import React, { useEffect, useState, Fragment, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import {
    Container, Typography, Grid, Skeleton, Card, CardMedia, CardContent,
    TextField, Button, Box, Modal
} from "@mui/material";
import { motion } from "framer-motion";
import authStore from "../../Store/authStore";
import permissionStore from "../../Store/permission";
import { toast } from "react-toastify";
import cartStore from "../../Store/cartStore";

function Landing() {
    const navigate = useNavigate();
    const setValue = authStore((state) => state.setValue);
    const setPermissionValue = permissionStore((state) => state.setPermissionValue);
    const addToCart = cartStore((state) => state.addToCart);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [open, setOpen] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [authResponse, roleResponse, productsResponse] = await Promise.allSettled([
                Axios.get(`${import.meta.env.VITE_BASE_URL}/landing`, { withCredentials: true }),
                Axios.get(`${import.meta.env.VITE_BASE_URL}/userRole`, { withCredentials: true }),
                Axios.get(`${import.meta.env.VITE_BASE_URL}/products`)
            ]);

            if (authResponse.status === "fulfilled" && authResponse.value.data.user) {
                setValue(true);
            } else {
                throw new Error("Unauthorized");
            }

            if (roleResponse.status === "fulfilled") {
                setPermissionValue(roleResponse.value.data.AddProducts);
            }

            if (productsResponse.status === "fulfilled" && Array.isArray(productsResponse.value.data)) {
                setProducts(productsResponse.value.data);
            } else {
                console.error("Invalid data format received");
            }
        } catch (error) {
            console.error("Error:", error);
            setValue(false);
            navigate("/login");
        } finally {
            setLoading(false);
        }
    }, [navigate, setValue, setPermissionValue]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // **Filter and Search Logic**
    let filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filter === "recent") {
        filteredProducts = [...filteredProducts].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filter === "last7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filteredProducts = filteredProducts.filter(product => new Date(product.date) >= sevenDaysAgo);
    }

    const handleAddToCart = (item) => {
        addToCart(item);
        toast.success("Item added to cart!");
    };

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedProduct(null);
    };

    return (
        <Fragment>
            <Container maxWidth="lg" sx={{ mt: 10, pb: 6, backgroundColor: "#f7f7f7", borderRadius: "8px", padding: "20px" }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <Typography variant="h4" fontWeight={600} textAlign="center" gutterBottom sx={{ color: "#333", padding: "10px 20px" }}>
                        Explore Our Premium Products
                    </Typography>
                </motion.div>

                {/* Search & Filter Section */}
                <Box display="flex" flexDirection="column" alignItems="center" gap={2} mb={3}>
                    <TextField
                        label="Search by Product Name"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ width: "100%", maxWidth: "400px", backgroundColor: "#fff" }}
                    />
                    <Box display="flex" gap={2}>
                        <Button variant={filter === "all" ? "contained" : "outlined"} onClick={() => setFilter("all")}>All Products</Button>
                        <Button variant={filter === "recent" ? "contained" : "outlined"} onClick={() => setFilter("recent")}>Recent</Button>
                        <Button variant={filter === "last7days" ? "contained" : "outlined"} onClick={() => setFilter("last7days")}>Last 7 Days</Button>
                    </Box>
                </Box>

                {loading ? (
                    <Grid container spacing={4}>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
                                <Skeleton variant="text" sx={{ mt: 1, width: "80%" }} />
                                <Skeleton variant="text" sx={{ width: "60%" }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={4}>
                        {filteredProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product._id}>
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <Card sx={{ backgroundColor: "#fff", color: "#333", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={product.image || "/default-product.jpg"}
                                            alt={product.title || "Product Image"}
                                            sx={{ borderRadius: "8px 8px 0 0", cursor: "pointer" }}
                                            onClick={() => handleOpenModal(product)}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" fontWeight={600}>{product.title || "Untitled Product"}</Typography>
                                            <Typography variant="body2">Price: <strong>${product.price || "N/A"}</strong></Typography>
                                            <Typography variant="body2">WholesalePrice: <strong>${product.wholesalePrice || "N/A"}</strong></Typography>
                                            <Button onClick={() => handleAddToCart(product)}
                                                fullWidth
                                                variant="contained"
                                                size="large"
                                                sx={{
                                                    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    "&:hover": { background: "linear-gradient(90deg, #0072ff, #00c6ff)" },
                                                }}
                                            >Add to Cart</Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Modal */}
            <Modal open={open} onClose={handleCloseModal} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box sx={{ backgroundColor: "#fff", padding: 3, borderRadius: 2, textAlign: "center", width: 400 }}>
                    {selectedProduct && (
                        <>
                            <CardMedia
                                component="img"
                                height="250"
                                image={selectedProduct.image || "/default-product.jpg"}
                                alt={selectedProduct.title || "Product Image"}
                                sx={{ borderRadius: 2 }}
                            />
                            <Typography variant="h6" mt={2}>{selectedProduct.title}</Typography>
                            <Typography variant="body1" mt={1}>Price: <strong>${selectedProduct.price}</strong></Typography>
                            <Button onClick={handleCloseModal} sx={{ mt: 2 }} variant="contained">Close</Button>
                        </>
                    )}
                </Box>
            </Modal>
        </Fragment>
    );
}

export default Landing;
