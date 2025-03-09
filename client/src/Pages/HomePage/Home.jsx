import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Container, Typography, Button, Paper, Box } from "@mui/material";
import { toast } from "react-toastify";
import Axios from "axios";
import Cookies from "js-cookie";

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const clearToken = async () => {
            try {
                const response = await Axios.get("http://localhost:8000/home", {
                    headers: { "Content-Type": "application/json" }, withCredentials: true
                });
                const { token } = response.data;

                // Clear token in cookies
                if (!token) {
                    Cookies.remove("token");
                    toast.info("Token cleared.");
                } else {
                    toast.info("Token still exists.");
                }
            } catch (error) {
                toast.error("Failed to clear token. Please check your backend.");
                console.error("Error clearing token:", error);
            }
        };

        clearToken();
    }, []);

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: "10px",
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: "bold", color: "#0072ff", mb: 2 }}>
                        Welcome!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Sign up or log in to continue
                    </Typography>

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            mb: 2,
                            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                            color: "#fff",
                            fontWeight: "bold",
                            "&:hover": { background: "linear-gradient(90deg, #0072ff, #00c6ff)" },
                        }}
                        onClick={() => navigate("/Login")}
                    >
                        Log in
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                            color: "#fff",
                            fontWeight: "bold",
                            "&:hover": { background: "linear-gradient(90deg, #0072ff, #00c6ff)" },
                        }}
                        onClick={() => navigate("/Signup")}
                    >
                        Sign up
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}

export default Home;