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
import { getAllCustomers, updateCustomer } from '../store/slices/customerSlice';

interface Customer {
    id: string;
    name: string;
    phone: string;
    moneyOwed: number;
    payments: [] | null;
    orders: [] | null;
    totalPayments: number;
    outstandingBalance: number;
    totalOrderAmount: number;
}

interface Props {
    open: boolean;
    onClose: () => void;
    customerData?: Customer;
}

const UpdateCustomer: React.FC<Props> = ({ open, onClose, customerData }) => {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.users);
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            id: customerData?.id || 0,
            name: customerData?.name || '',
            phone: customerData?.phone || '',
            moneyOwed: customerData?.moneyOwed || 0,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().required('Phone number is required'),
        }),
        onSubmit: (values) => {
            console.log(values);
            if (customerData) {
                setSuccessMessage('Customer updated successfully!');
                dispatch(updateCustomer({ body: values, customerId: customerData.id, token: userState.token })).then(() => {
                    dispatch(getAllCustomers({ token: userState.token }))
                    setSuccessMessage('Expense added successfully!');
                    formik.resetForm();
                    navigate("/customers")
                })
            } else {
                setSuccessMessage('Customer added successfully!');
            }
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
            <DialogTitle>{customerData ? 'Update Customer' : 'Add New Customer'}</DialogTitle>
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
                <Button onClick={onClose} color="error" variant="outlined">
                    Cancel
                </Button>
                <Button
                    type="submit"
                    onClick={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                    }}
                    variant="contained"
                    color="primary"
                    sx={{
                        boxShadow: "none",
                        ":hover": {
                            boxShadow: "none",
                        },
                    }}
                >
                    {customerData ? 'Update Customer' : 'Add Customer'}
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

export default UpdateCustomer;
