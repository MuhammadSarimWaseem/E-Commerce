import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const InputHandler = (event) => {
    const { name, value } = event.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = input;
    try {
      setIsSubmitting(true); // Disable button during submission

      const { data } = await Axios.post(
        "http://localhost:8000/login",
        { email, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (data.token) {
        Cookies.set("token", data.token, { expires: 7 }); // Save token for 7 days
        toast.success(data.message || "Login successful!");
        setInput({ email: "", password: "" });
        navigate("/Home"); // Redirect on success
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#0072ff" }}>
            Login
          </Typography>

          {/* ✅ Added onSubmit={handleLogin} */}
          <form style={{ width: "100%" }} onSubmit={handleLogin}>
            <TextField
              label="Email"
              name="email"
              value={input.email}
              onChange={InputHandler}
              fullWidth
              required
              variant="outlined"
              margin="normal"
            />

            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={input.password}
              onChange={InputHandler}
              fullWidth
              required
              variant="outlined"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <Typography variant="body2">
            Don't have an account?{" "}
            <Link to="/Signup" style={{ color: "#0072ff", textDecoration: "none", fontWeight: "bold" }}>
              Sign up
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
