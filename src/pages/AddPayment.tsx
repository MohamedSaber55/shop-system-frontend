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
    Box,
} from '@mui/material';

const AddPayment = () => {
    const [open, setOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

    const customers = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Michael Johnson' },
    ];

    const formik = useFormik({
        initialValues: {
            amount: '',
            customer: '',
            date: '',
            info: ''
        },
        validationSchema: Yup.object({
            amount: Yup.number()
                .required('Amount is required')
                .positive('Amount must be a positive number'),
            customer: Yup.string().required('Customer is required'),
            date: Yup.date()
                .required('Date is required')
                .max(new Date(), 'Date cannot be in the future'),
            info: Yup.string()
        }),
        onSubmit: (values) => {
            console.log(values);
            setSuccessMessage('Payment added successfully!');
            setOpen(true);
            formik.resetForm();
        }
    });

    const handleCloseSnackbar = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ padding: 0 }}>
            <Typography variant="h5">Add New Payment</Typography>
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
                        <TextField
                            fullWidth
                            label="Choose Customer"
                            name="customer"
                            select
                            variant="outlined"
                            value={formik.values.customer}
                            onChange={formik.handleChange}
                            error={formik.touched.customer && Boolean(formik.errors.customer)}
                            helperText={formik.touched.customer && formik.errors.customer}
                        >
                            {customers.map((cust) => (
                                <MenuItem key={cust.id} value={cust.id}>
                                    {cust.name}
                                </MenuItem>
                            ))}
                        </TextField>
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
                    Add Payment
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

export default AddPayment;
