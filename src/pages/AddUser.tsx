import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    Typography,
    Grid,
    Snackbar,
    Alert,
    Divider,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AddUser = () => {
    const [open, setOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            role: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
                .required('Confirm password is required'),
            role: Yup.string().required('Role is required')
        }),
        onSubmit: (values) => {
            console.log(values);
            setSuccessMessage('User added successfully!');
            setOpen(true);
            formik.resetForm();
        }
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleCloseSnackbar = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ padding: 0 }}>
            <Typography variant="h5">
                Add New User
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            variant="outlined"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            variant="outlined"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            variant="outlined"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
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
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={toggleConfirmPasswordVisibility}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined" error={formik.touched.role && Boolean(formik.errors.role)}>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                name="role"
                                value={formik.values.role}
                                onChange={formik.handleChange}
                                label="Role"
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="casher">Casher</MenuItem>
                            </Select>
                            {formik.touched.role && formik.errors.role && (
                                <span style={{ color: 'red' }}>{formik.errors.role}</span>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary"
                        sx={{
                            mt: 2,
                            p: 2,
                            boxShadow: "none",
                            ":hover": {
                                boxShadow: "none"
                            }
                        }}>
                        Add User
                    </Button>
            </form>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddUser;
