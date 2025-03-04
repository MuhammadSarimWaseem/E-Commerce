import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import authStore from "../../Store/authStore";
import permissionStore from "../../Store/permission";

function Landing() {
    const navigate = useNavigate()

    const setValue = authStore((state) => state.setValue);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await Axios.get("http://localhost:8000/landing", {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });

                if (response.data.user) {
                    setValue(true)
                }
            } catch (error) {
                console.error("Auth error:", error);
                navigate("/login"); // Redirect only to login if user is not authenticated
                setValue(false)
            }
        };

        checkAuth();
    }, [navigate]);


    const setPermissionValue = permissionStore((state) => state.setPermissionValue);
    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await Axios.get("http://localhost:8000/userRole", { withCredentials: true });
                setPermissionValue(response.data.AddProducts);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetching();
    }, []);
    return (
        <div>
            <h1>Landing Page</h1>
        </div>
    );
}

export default Landing;