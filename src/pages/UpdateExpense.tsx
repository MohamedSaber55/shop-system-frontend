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
    MenuItem,
    Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllExpenses, getExpenseInfo, updateExpense } from '../store/slices/expenseSlice';

const UpdateExpense = () => {
    const [open, setOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();
    const userState = useSelector((state: RootState) => state.users);
    const expensesState = useSelector((state: RootState) => state.expenses);
    const navigate = useNavigate();
    const expense = expensesState.expense;

    useEffect(() => {
        dispatch(getExpenseInfo({ expenseId: id, token: userState.token }));
    }, [dispatch, id, userState.token]);

    const formik = useFormik({
        initialValues: {
            id: expense?.id || 0,
            amount: expense?.amount || '',
            date: expense?.date || '',
            category: expense?.category || 0,
            info: expense?.info || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            amount: Yup.number()
                .required('Amount is required')
                .positive('Amount must be a positive number'),
            date: Yup.date()
                .required('Date is required')
                .max(new Date(), 'Date cannot be in the future'),
            category: Yup.number().required('Category is required'),
            info: Yup.string(),
        }),
        onSubmit: (values) => {
            const categoryAsNumber = Number(values.category);
            const updatedValues = { ...values, category: categoryAsNumber };

            setSuccessMessage('Expense updated successfully!');
            dispatch(updateExpense({ expenseId: id, body: updatedValues, token: userState.token })).then(() => {
                dispatch(getAllExpenses({ token: userState.token }));
                setOpen(true);
                formik.resetForm();
                navigate('/expenses');
            });
        },
    });

    const handleCloseSnackbar = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ padding: 0 }}>
            <Typography variant="h5">Update Expense</Typography>
            <Divider sx={{ marginY: 2 }} />
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Amount"
                            name="amount"
                            type="number"
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
                            value={formik.values.date ? new Date(formik.values.date).toISOString().split('T')[0] : ''}
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
                            label="Category"
                            name="category"
                            select
                            variant="outlined"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            helperText={formik.touched.category && formik.errors.category}
                        >
                            <MenuItem value="0">Rent</MenuItem>
                            <MenuItem value="1">Utilities</MenuItem>
                            <MenuItem value="2">Salaries</MenuItem>
                            <MenuItem value="3">Inventory</MenuItem>
                            <MenuItem value="4">Marketing</MenuItem>
                            <MenuItem value="5">Miscellaneous</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Additional Info"
                            name="info"
                            variant="outlined"
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
                        boxShadow: 'none',
                        ':hover': {
                            boxShadow: 'none',
                        },
                    }}
                >
                    Update Expense
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

export default UpdateExpense;
