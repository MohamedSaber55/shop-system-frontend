import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    CssBaseline,
    Avatar,
    CircularProgress,
    Paper,
    Stack,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { forgetPass } from '../store/slices/accountSlice';

const ForgotPassword: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const state = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
        }),
        onSubmit: async (values) => {
            dispatch(forgetPass({ body: values }))
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSubmitted(true);
        },
    });
    if (state.token) return <Navigate to="/" replace={true} />

    return (
        <Stack justifyContent="center" alignItems="center" sx={{ height: '100vh', backgroundColor: '#f4f6f8' }}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper elevation={0} sx={{ p: 5, borderRadius: 3, maxWidth: "sm", width: '100%' }}>
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
                        <Typography component="h1" variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                            Forgot Password
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
                            Enter your email to receive a password reset link
                        </Typography>
                        {submitted ? (
                            <Typography variant="body1" color="success.main" sx={{ textAlign: 'center', mt: 2 }}>
                                If an account with that email exists, you will receive a reset link.
                            </Typography>
                        ) : (
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
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
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
                                    {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                                </Button>
                                <Typography
                                    variant="body1"
                                    color="primary"
                                    sx={{ my: 3, cursor: 'pointer', textAlign: 'center' }}
                                >
                                    <Link to={`/login`} style={{ color: "inherit" }}>
                                        Return to login?
                                    </Link>
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Stack>
    );
};

export default ForgotPassword;
