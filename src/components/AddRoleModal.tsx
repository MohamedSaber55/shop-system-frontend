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
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Chip,
} from '@mui/material';

// Define the types for the component props
interface AddRoleModalProps {
    open: boolean;
    handleClose: () => void;
    onAddRole: (role: RoleValues) => void;
}

// Define the type for the form values
interface RoleValues {
    role: string;
    permissions: string[];
}

// Sample permissions list (you may fetch this from an API in a real application)
const permissionsList = ['Read', 'Write', 'Edit', 'Delete', 'Manage Users', 'Manage Roles'];

// Validation schema using Yup
const validationSchema = Yup.object({
    role: Yup.string()
        .required('Role name is required')
        .min(3, 'Must be at least 3 characters'),
    permissions: Yup.array().min(1, 'At least one permission is required'),
});

const AddRoleModal: React.FC<AddRoleModalProps> = ({ open, handleClose, onAddRole }) => {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

    const formik = useFormik<RoleValues>({
        initialValues: {
            role: '',
            permissions: [],
        },
        validationSchema,
        onSubmit: (values: RoleValues, { resetForm }: FormikHelpers<RoleValues>) => {
            onAddRole(values);
            setSuccessMessage('Role added successfully!');
            setSnackbarOpen(true);
            resetForm();
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
                    Add New Role
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="role"
                                name="role"
                                label="Role Name"
                                variant="outlined"
                                value={formik.values.role}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.role && Boolean(formik.errors.role)}
                                helperText={formik.touched.role && formik.errors.role}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" error={formik.touched.permissions && Boolean(formik.errors.permissions)}>
                                <InputLabel>Permissions</InputLabel>
                                <Select
                                    label="Permissions"
                                    multiple
                                    value={formik.values.permissions}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="permissions"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(selected as string[]).map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {permissionsList.map((permission) => (
                                        <MenuItem key={permission} value={permission}>
                                            {permission}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.permissions && formik.errors.permissions && (
                                    <Box color="error.main" mt={0.5}>{formik.errors.permissions}</Box>
                                )}
                            </FormControl>
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
                    Add Role
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

export default AddRoleModal;
