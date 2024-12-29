import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Snackbar,
    Alert,
    Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { addCustomer, getAllCustomers } from '../store/slices/customerSlice';

interface Props {
    open: boolean;
    onClose: () => void;
}

const AddCustomer: React.FC<Props> = ({ open, onClose }: Props) => {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.users);
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            id: 0,
            name: '',
            phone: '',
            moneyOwed: 0,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().required('Phone number is required'),
            moneyOwed: Yup.number().required('Money Owed is required'),
        }),
        onSubmit: (values) => {
            setSuccessMessage('Customer added successfully!');
            dispatch(addCustomer({ body: values, token: userState.token })).then(() => {
                dispatch(getAllCustomers({ token: userState.token }))
                setSuccessMessage('Expense added successfully!');
                formik.resetForm();
                navigate("/customers")
            })
            setSnackbarOpen(true);
            formik.resetForm();
            onClose();
        },
    });

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the customer’s name and phone number.
                </DialogContentText>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type='number'
                                label="Money Owed"
                                name="moneyOwed"
                                variant="outlined"
                                value={formik.values.moneyOwed}
                                onChange={formik.handleChange}
                                error={formik.touched.moneyOwed && Boolean(formik.errors.moneyOwed)}
                                helperText={formik.touched.moneyOwed && formik.errors.moneyOwed}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error" variant='outlined'>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={formik.handleSubmit as never}
                    sx={{
                        boxShadow: "none",
                        ":hover": {
                            boxShadow: "none"
                        }
                    }}>
                    Add Customer
                </Button>
            </DialogActions>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default AddCustomer;
