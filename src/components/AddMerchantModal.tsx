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
import { addMerchant, getAllMerchants } from '../store/slices/merchantSlice';

interface Props {
    open: boolean;
    onClose: () => void;
}

const AddMerchant: React.FC<Props> = ({ open, onClose }: Props) => {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const userState = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();
    const formik = useFormik({
        initialValues: {
            id: 0,
            name: '',
            phone: '',
            address: '',
            outstandingBalance: 0,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().required('Phone number is required'),
            address: Yup.string().required('Address is required'),
            outstandingBalance: Yup.number(),
        }),
        onSubmit: (values) => {
            setSuccessMessage('Merchant added successfully!');
            dispatch(addMerchant({ token: userState.token, body: values })).then(() => {
                dispatch(getAllMerchants({ token: userState.token }))
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
            <DialogTitle>Add New Merchant</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the merchant’s name, phone number, and address.
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
                                label="Address"
                                name="address"
                                variant="outlined"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Outstanding Balance"
                                name="outstandingBalance"
                                variant="outlined"
                                value={formik.values.outstandingBalance}
                                onChange={formik.handleChange}
                                error={formik.touched.outstandingBalance && Boolean(formik.errors.outstandingBalance)}
                                helperText={formik.touched.outstandingBalance && formik.errors.outstandingBalance}
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
                    onClick={formik.handleSubmit as never}
                    variant="contained"
                    color="primary"
                    sx={{
                        boxShadow: "none",
                        ":hover": {
                            boxShadow: "none"
                        }
                    }}>
                    Add Merchant
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

export default AddMerchant;
