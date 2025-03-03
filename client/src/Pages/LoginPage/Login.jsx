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
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

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
              Log in
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
