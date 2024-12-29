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
    InputAdornment,
    IconButton,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPassword: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('New password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match')
                .required('Confirm password is required'),
        }),
        onSubmit: async (values) => {
            console.log(values);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSubmitted(true);
        },
    });

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };


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
                            Reset Password
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
                            Enter your new password to reset your account
                        </Typography>
                        {submitted ? (
                            <Typography variant="body1" color="success.main" sx={{ textAlign: 'center', mt: 2 }}>
                                Your password has been reset successfully.
                            </Typography>
                        ) : (
                            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ width: '100%' }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    id="newPassword"
                                    name="newPassword"
                                    label="New Password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                    helperText={formik.touched.newPassword && formik.errors.newPassword}
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
                                                    onClick={toggleNewPasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
                                                    onClick={toggleConfirmPasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
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
                                    {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
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

export default ResetPassword;
