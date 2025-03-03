import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState({ name: "", email: "", password: "", role: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = input;

    if (!role) {
      toast.error("Please select a role.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await Axios.post("http://localhost:8000/signup", input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (data.token) {
        Cookies.set("token", data.token);
      }

      toast.success(data.message);
      setInput({ name: "", email: "", password: "", role: "" });
      navigate("/Home");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Signup failed. Please try again.";
      console.log(errorMessage);
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
          Sign Up
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
            label="Email"
            name="email"
            type="email"
            value={input.email}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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

          {/* Role Selection Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select name="role" value={input.role} onChange={handleInputChange} required>
              <MenuItem value="seller">Seller</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

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
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <Typography variant="body2">
          Already have an account?{" "}
          <Link to="/Login" style={{ color: "#0072ff", textDecoration: "none", fontWeight: "bold" }}>
            Log in
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Signup;
