import React, { useEffect, useRef, useState } from "react";
import { TextField, Button, Container, Typography, Paper, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import authStore from "../../Store/authStore";
import permissionStore from "../../Store/permissionStore";
import Axios from "axios";
import { toast } from "react-toastify";

function AddCourse() {
    const navigate = useNavigate();

    // Auth Check
    const setValue = authStore((state) => state.setValue);
    const setPermissionValue = permissionStore((state) => state.setPermissionValue);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await Axios.get("http://localhost:8000/landing", {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
                if (response.data.user) {
                    setValue(true);
                } else {
                    throw new Error("Unauthorized");
                }
            } catch (error) {
                console.error("Auth error:", error);
                setValue(false);
                navigate("/login");
            }
        };

        // Permission Check
        const fetching = async () => {
            try {
                const response = await Axios.get("http://localhost:8000/userInfo", { withCredentials: true });
                setPermissionValue(response.data.AddProducts);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const initialize = async () => {
            await checkAuth();
            await fetching();
        };

        initialize();
    }, [navigate, setValue, setPermissionValue]);

    // State for course data
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const [products, setProducts] = useState({
        title: "",
        description: "",
        price: "",
        image: null,
        video: null
    });

    const [loading, setLoading] = useState(false);  // Loader state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducts((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setProducts((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader

        const formData = new FormData();
        formData.append("title", products.title);
        formData.append("description", products.description);
        formData.append("price", products.price);
        formData.append("image", products.image);
        formData.append("video", products.video);

        try {
            const response = await Axios.post("http://localhost:8000/addProducts", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setCourse({
                title: "",
                description: "",
                price: "",
                image: null,
                video: null
            });

            // Reset file input fields
            if (imageInputRef.current) imageInputRef.current.value = "";
            if (videoInputRef.current) videoInputRef.current.value = "";

            toast.success(response.data.message || "Course added successfully!");
            navigate("/Course/Course")
            console.log(response.data);
        } catch (error) {
            console.error("Error adding course:", error);
            toast.error("Failed to add course.");
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <Container maxWidth="sm">
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Paper elevation={5} style={{ padding: 20, marginTop: 20, borderRadius: 10 }}>
                    <Typography variant="h5" gutterBottom style={{ textAlign: "center", fontWeight: "bold" }}>
                        Add New Course
                    </Typography>
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <TextField
                            label="Title"
                            name="title"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={course.title}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Description"
                            name="description"
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            variant="outlined"
                            value={course.description}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={course.price}
                            onChange={handleChange}
                            required
                        />
                        <input
                            ref={imageInputRef}
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ marginTop: 15, display: "block" }}
                            required
                        />
                        <input
                            ref={videoInputRef}
                            type="file"
                            name="video"
                            accept="video/*"
                            onChange={handleFileChange}
                            style={{ marginTop: 15, display: "block" }}
                            required
                        />
                        <motion.div whileHover={!loading ? { scale: 1.05 } : {}} whileTap={!loading ? { scale: 0.95 } : {}}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                style={{
                                    marginTop: 10,
                                    backgroundColor: "#1976d2",
                                    color: "#fff",
                                    position: "relative"
                                }}
                                disabled={loading}  // Disable button while loading
                            >
                                {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "Submit"}
                            </Button>
                        </motion.div>
                    </motion.form>
                </Paper>
            </motion.div>
        </Container>
    );
}

export default AddCourse;