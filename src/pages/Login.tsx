import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    CssBaseline,
    Avatar,
    CircularProgress,
    Paper,
    Grid,
    InputAdornment,
    IconButton,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import loginPageImage from './../assets/login-bg.jpg';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSelector, useDispatch } from "react-redux"
import { login } from '../store/slices/accountSlice';
import { AppDispatch, RootState } from '../store/store';
// Interface for form values
interface LoginFormValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const state = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const formik = useFormik<LoginFormValues>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            dispatch(login({ body: values })).then(() => {
                navigate('/')
            })
            await new Promise((resolve) => setTimeout(resolve, 1000));
        },
    });
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    if (state.token) return <Navigate to="/" replace={true} />

    return (
        <Grid container component="main" sx={{ height: '100vh', backgroundColor: '#f4f6f8' }}>
            <CssBaseline />
            {/* Left Side with Image */}
            <Grid
                item
                xs={false}
                sm={false}
                md={6}
                sx={{
                    backgroundImage: `url(${loginPageImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Right Side with Form */}
            <Grid
                item
                xs={12}
                sm={12}
                md={6}
                component={Container}
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                }}
            >
                <Paper elevation={0} sx={{ p: 5, width: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 64, height: 64 }}>
                            <LockOutlinedIcon fontSize="large" />
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                            Sign In
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
                            Enter your email and password to access your account
                        </Typography>
                        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ width: '100%' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                id="email"
                                name="email"
                                label="Email Address"
                                autoComplete="email"
                                autoFocus
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {/* Forgot Password Link */}
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{ mb: 3, cursor: 'pointer', textAlign: 'right' }}
                            >
                                <Link to={`/forget-password`} style={{ color: "inherit" }}>
                                    Forgot Password?
                                </Link>
                            </Typography>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={formik.isSubmitting}
                                sx={{
                                    py: 1.5,
                                    mt: 2,
                                    borderRadius: 3,
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                }}
                            >
                                {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Login;
