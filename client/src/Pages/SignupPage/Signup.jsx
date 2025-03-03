import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(""); // Set initial state as an empty string

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

        <form style={{ width: "100%" }}>
          <TextField label="Email" fullWidth required variant="outlined" margin="normal" />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
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
            <Select value={role} onChange={(e) => setRole(e.target.value)} required>
              <MenuItem value="seller">Seller</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
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
            Sign Up
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
