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
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getUserInfo, updateUser } from '../store/slices/accountSlice';

type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: number;
};

const UpdateUser = () => {
    const [open, setOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const { id } = useParams()
    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((state: RootState) => state.users);

    const user: User = state?.user || {
        id: "",
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 0,
    };

    React.useEffect(() => {
        if (state.token) {
            dispatch(getUserInfo({ token: state.token, userId: id }));
        }
    }, [dispatch, id, state.token]);

    // const initialData = {
    //     name: "Mohamed Saber",
    //     email: "admin@admin.com",
    //     phone: "+201210529969",
    //     role: "admin",
    // }
    const formik = useFormik({
        initialValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            password: '',
            confirmPassword: '',
            role: user?.role || ''
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), undefined], 'Passwords must match'),
            role: Yup.string().required('Role is required')
        }),
        onSubmit: (values) => {
            dispatch(updateUser({ body: values, token: state.token , userId: id }));
            setSuccessMessage('User updated successfully!');
            setOpen(true);
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
                Update User
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="FirstName"
                            name="firstName"
                            variant="outlined"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="LastName"
                            name="lastName"
                            variant="outlined"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
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
                    <Grid item xs={12} sm={6}>
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
                                <MenuItem value="1">Admin</MenuItem>
                                <MenuItem value="0">Casher</MenuItem>
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
                    Update User
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

export default UpdateUser;
