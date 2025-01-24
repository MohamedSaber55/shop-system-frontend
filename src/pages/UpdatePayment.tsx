import React, { useEffect } from 'react';
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
    Box,
    Autocomplete,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getAllCustomers } from '../store/slices/customerSlice';
import { getPaymentInfo, updatePayment } from '../store/slices/paymentSlice';
import { useParams } from 'react-router-dom';

const UpdatePayment = () => {
    const [open, setOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const params = useParams();
    const paymentId = params.id;

    const state = useSelector((state: RootState) => state.customers);
    const userState = useSelector((state: RootState) => state.users);
    const paymentState = useSelector((state: RootState) => state.payments);
    const dispatch = useDispatch<AppDispatch>();
    const customers = state?.customers;
    const paymentDetails = paymentState.payment;

    useEffect(() => {
        dispatch(getAllCustomers({ token: userState.token }));
        if (paymentId) {
            dispatch(getPaymentInfo({ paymentId, token: userState.token }));
        }
    }, [dispatch, userState.token, paymentId]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: paymentDetails?.id || 0,
            amount: paymentDetails?.amount || 0,
            customerId: paymentDetails?.customerId || '',
            date: paymentDetails?.date || '',
            info: paymentDetails?.info || ''
        },
        validationSchema: Yup.object({
            amount: Yup.number()
                .required('Amount is required')
                .positive('Amount must be a positive number'),
            customerId: Yup.string().required('Customer is required'),
            date: Yup.date()
                .required('Date is required')
                .max(new Date(), 'Date cannot be in the future'),
            info: Yup.string()
        }),
        onSubmit: (values) => {
            dispatch(updatePayment({ token: userState.token, paymentId, body: values }));
            setSuccessMessage('Payment updated successfully!');
            setOpen(true);
            formik.resetForm();
        }
    });

    const handleCloseSnackbar = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ padding: 0 }}>
            <Typography variant="h5">Update Payment</Typography>
            <Divider sx={{ marginY: 2 }} />
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Amount"
                            name="amount"
                            variant="outlined"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                            helperText={formik.touched.amount && formik.errors.amount}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Date"
                            name="date"
                            type="date"
                            variant="outlined"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            error={formik.touched.date && Boolean(formik.errors.date)}
                            helperText={formik.touched.date && formik.errors.date}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            fullWidth
                            id="customerId"
                            value={customers.find(cust => cust.id === formik.values.customerId) || null}
                            onChange={(_event, newValue) => {
                                formik.setFieldValue('customerId', newValue ? newValue.id : null);
                            }}
                            options={customers}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Choose Customer"
                                    variant="outlined"
                                    error={formik.touched.customerId && Boolean(formik.errors.customerId)}
                                    helperText={formik.touched.customerId && formik.errors.customerId}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Additional Info"
                            name="info"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={formik.values.info}
                            onChange={formik.handleChange}
                            error={formik.touched.info && Boolean(formik.errors.info)}
                            helperText={formik.touched.info && formik.errors.info}
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        mt: 2,
                        p: 2,
                        boxShadow: "none",
                        ":hover": {
                            boxShadow: "none"
                        }
                    }}
                >
                    Update Payment
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

export default UpdatePayment;
