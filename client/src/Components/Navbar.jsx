import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Button } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Axios from "axios";
import authStore from "../Store/authStore";
import permissionStore from "../Store/permission";

function Navbar() {
    const navigate = useNavigate();
    const value = authStore((state) => state.value);
    const setValue = authStore((state) => state.setValue);
    const [anchorEl, setAnchorEl] = useState(null);

    // Sync state with store
    const [isAuthenticated, setIsAuthenticated] = useState(value);
    useEffect(() => {
        setIsAuthenticated(value);
    }, [value]);

    const handleLogin = () => navigate("/Login");
    const handleSignup = () => navigate("/Signup");

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        try {
            await Axios.post(`${import.meta.env.VITE_BASE_URL}/logout`, {}, { withCredentials: true });
            setValue(false);
            setAddProducts(false)
            navigate("/Home");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const permissionValue = permissionStore((state) => state.permissionValue);
    const [AddProducts, setAddProducts] = useState(permissionValue)

    useEffect(() => {
        setAddProducts(permissionValue)
    }, [permissionValue]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    padding: "5px 20px",
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5" sx={{ color: "#0072ff", fontWeight: "bold" }}>
                        SNAPCART
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {!isAuthenticated ? (
                            <>
                                <Button color="inherit" sx={{ color: "#0072ff", fontWeight: "bold" }} onClick={handleLogin}>
                                    Login
                                </Button>
                                <Button
                                    onClick={handleSignup}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "linear-gradient(90deg, #00c6ff, #0072ff)",
                                        color: "#fff",
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        "&:hover": { backgroundColor: "linear-gradient(90deg, #00c6ff, #0072ff)" },
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleLogout}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#d32f2f",
                                        color: "#fff",
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        "&:hover": { backgroundColor: "#b71c1c" },
                                    }}
                                >
                                    Logout
                                </Button>
                                <IconButton size="large" color="inherit" onClick={handleMenu}>
                                    <AccountCircle sx={{ color: "#0f3460" }} />
                                </IconButton>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                    <MenuItem >Add Order</MenuItem>
                                    <MenuItem onClick={() => navigate("/cart")} >Cart</MenuItem>
                                    <MenuItem onClick={() => navigate("/landing")} >Products</MenuItem>
                                    <MenuItem onClick={() => navigate("/Orders")} >Order</MenuItem>
                                    {AddProducts && (
                                        <div>
                                            <MenuItem onClick={() => navigate("/addProducts")}>Add Product</MenuItem>
                                            <MenuItem onClick={handleClose} >Add Seller</MenuItem>
                                        </div>
                                    )}
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;