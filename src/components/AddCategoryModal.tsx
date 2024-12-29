import React from 'react';
import { useFormik, FormikHelpers } from 'formik';
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
import { addCategory, getAllCategories } from '../store/slices/categorySlice';

// Define the types for the component props
interface AddCategoryModalProps {
    open: boolean;
    handleClose: () => void;
}

// Define the type for the form values
interface CategoryValues {
    name: string;
}

// Validation schema using Yup
const validationSchema = Yup.object({
    name: Yup.string()
        .required('Category name is required')
        .min(3, 'Must be at least 3 characters'),
});

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ open, handleClose }) => {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const userState = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();

    const formik = useFormik<CategoryValues>({
        initialValues: {
            name: '',
        },
        validationSchema,
        onSubmit: (values: CategoryValues, { resetForm }: FormikHelpers<CategoryValues>) => {
            dispatch(addCategory({ token: userState.token, body: values })).then(() => {
                setSuccessMessage('Category added successfully!');
                setSnackbarOpen(true);
                resetForm();
            }).then(() => {
                dispatch(getAllCategories({ token: userState.token }))
            })
            handleClose();
        },
    });

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    Add New Category
                    {/* <IconButton onClick={handleClose}>
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
                <Button onClick={handleClose} color="error" variant="outlined">
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
                            boxShadow: "none",
                        },
                    }}
                >
                    Add Category
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

export default AddCategoryModal;
