import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    Box,
    Grid,
    Typography,
    Divider,
} from '@mui/material';
import { addProduct, getAllProducts } from '../store/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../store/slices/categorySlice';

const AddProduct = () => {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.users);
    const categoriesState = useSelector((state: RootState) => state.categories);
    // const productsState = useSelector((state: RootState) => state.products);
    const categories = categoriesState.categories;
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getAllCategories({ token: userState.token }))
    }, [dispatch, userState.token]);

    const formik = useFormik({
        initialValues: {
            id: 0,
            name: '',
            quantity: '',
            isStock: true,
            purchasePrice: '',
            sellingPrice: '',
            categoryId: '',
            uniqueNumber: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Product name is required')
                .min(3, 'Product name must be at least 3 characters long')
                .max(50, 'Product name must not exceed 50 characters'),

            quantity: Yup.number()
                .required('Quantity is required')
                .min(1, 'Quantity must be at least 1')
                .integer('Quantity must be an integer'),

            isStock: Yup.boolean()
                .required('Stock status is required')
                .oneOf([true, false], 'Stock status must be true or false'),

            purchasePrice: Yup.number()
                .required('Purchase price is required')
                .min(0, 'Purchase price must be a positive number'),

            sellingPrice: Yup.number()
                .required('Selling price is required')
                .min(0, 'Selling price must be a positive number')
                .test(
                    'selling-greater-than-purchase',
                    'Selling price must be greater than or equal to purchase price',
                    function (value) {
                        return value >= this.parent.purchasePrice;
                    }
                ),

            categoryId: Yup.string()
                .required('Category is required'),
            // .uuid('Category ID must be a valid UUID'),

            uniqueNumber: Yup.string()
                .required('Unique number is required')
                .matches(/^[A-Z0-9]{8}$/, 'Unique number must be 8 alphanumeric characters in uppercase'),
        }),
        onSubmit: (values) => {
            dispatch(addProduct({ body: [values], token: userState.token })).then(() => {
                dispatch(getAllProducts({ token: userState.token }))
                setSuccessMessage('Product added successfully!');
                setSnackbarOpen(true);
                formik.resetForm();
                navigate("/products")
            })
        },
    });

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ padding: 0 }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Add New Product
            </Typography>
            <Divider sx={{ marginY: 2 }} />

            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            name="name"
                            variant="outlined"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="SKU"
                            name="uniqueNumber"
                            variant="outlined"
                            value={formik.values.uniqueNumber}
                            onChange={formik.handleChange}
                            error={formik.touched.uniqueNumber && Boolean(formik.errors.uniqueNumber)}
                            helperText={formik.touched.uniqueNumber && formik.errors.uniqueNumber}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Quantity"
                            name="quantity"
                            variant="outlined"
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                            helperText={formik.touched.quantity && formik.errors.quantity}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="SellingPrice"
                            name="sellingPrice"
                            variant="outlined"
                            value={formik.values.sellingPrice}
                            onChange={formik.handleChange}
                            error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                            helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="PurchasePrice"
                            name="purchasePrice"
                            variant="outlined"
                            value={formik.values.purchasePrice}
                            onChange={formik.handleChange}
                            error={formik.touched.purchasePrice && Boolean(formik.errors.purchasePrice)}
                            helperText={formik.touched.purchasePrice && formik.errors.purchasePrice}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="is-stock-label">In Stock</InputLabel>
                            <Select
                                labelId="is-stock-label"
                                label="In Stock"
                                name="isStock"
                                value={formik.values.isStock ? "true" : "false"}
                                onChange={(e) => formik.setFieldValue("isStock", e.target.value === "true")}
                            >
                                <MenuItem value="true">Yes</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                label="Category"
                                name="categoryId"
                                value={formik.values.categoryId}
                                onChange={formik.handleChange}
                                error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.categoryId && formik.errors.categoryId && (
                                <div style={{ color: 'red' }}>{formik.errors.categoryId}</div>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={formik.handleSubmit as never}
                    sx={{
                        mt: 2,
                        p: 2,
                        boxShadow: "none",
                        ":hover": {
                            boxShadow: "none"
                        }
                    }}>
                    Add Product
                </Button>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddProduct;
