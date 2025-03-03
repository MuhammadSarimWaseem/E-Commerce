import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "axios";
import Cookies from "js-cookie";

import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
    return (
        <div>
            <h1>Login Page</h1>
        </div>
    );
}

export default Login;