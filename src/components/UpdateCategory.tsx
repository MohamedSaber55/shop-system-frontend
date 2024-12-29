import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Box,
    Snackbar,
    Alert,
    Grid,
} from '@mui/material';
import { AppDispatch, RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories, updateCategory } from '../store/slices/categorySlice';
// import { MdEdit } from 'react-icons/md';
// import { IoClose } from 'react-icons/io5';

// Define the type for the form values
interface Category {
    id?: number | string;
    name: string;
}


// Define the types for the component props
interface UpdateCategoryProps {
    open: boolean;
    onClose: () => void;
    categoryData: Category | null;
}

// Validation schema using Yup
const validationSchema = Yup.object({
    name: Yup.string()
        .required('Category name is required')
        .min(3, 'Must be at least 3 characters'),
});

const UpdateCategory: React.FC<UpdateCategoryProps> = ({ open, onClose, categoryData }) => {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const userState = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();
    const formik = useFormik({
        initialValues: {
            id: categoryData?.id,
            name: categoryData?.name || "",
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            setSuccessMessage('Category updated successfully!');
            dispatch(updateCategory({ token: userState.token, body: values, categoryId: categoryData?.id })).then(() => {
                dispatch(getAllCategories({ token: userState.token }))
            })
            setSnackbarOpen(true);
            resetForm();
            onClose();
        },
    });

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    Update Category
                    {/* <IconButton onClick={onClose}>
                        <IoClose />
                    </IconButton> */}
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Category Name"
                                variant="outlined"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
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
                    variant="contained"
                    color="primary"
                    onClick={formik.handleSubmit as never} // Type override for submit
                    // startIcon={<MdEdit />}
                    sx={{
                        boxShadow: "none",
                        ":hover": {
                            boxShadow: "none",
                        },
                    }}
                >
                    Update Category
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

export default UpdateCategory;
