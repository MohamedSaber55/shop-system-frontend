import React, { useEffect } from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
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
    IconButton,
    Autocomplete,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllOrders, getOrderInfo, updateOrder } from '../store/slices/orderSlice';
import { getAllCustomers } from '../store/slices/customerSlice';
import { getAllProducts } from '../store/slices/productSlice';

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
interface Product {
    id?: number | string;
    name: string;
    quantity: number | string;
    isStock: boolean;
    purchasePrice: number | string;
    sellingPrice: number | string;
    categoryId: string;
    uniqueNumber: number | string;
    category: {
        id: number | string;
        name: string
    }
}
interface OrderItem {
    productId: number;
    quantity: number;
    discount: number;
    subTotal: number;
}
interface Order {
    id?: string;
    orderDate?: string;
    userId?: string;
    notes?: string;
    totalDiscount?: number;
    totalAmount?: number;
    customerId: number;
    orderItems: OrderItem[];

}
const UpdateOrder = () => {
    const [open, setOpen] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.users);
    const customersState = useSelector((state: RootState) => state.customers);
    const productsState = useSelector((state: RootState) => state.products);
    const orderState = useSelector((state: RootState) => state.orders);
    const customers: Customer[] = customersState?.customers;
    const products: Product[] = productsState?.products;
    const order: Order | null = orderState?.order;

    useEffect(() => {
        dispatch(getOrderInfo({ token: userState.token, orderId: id }))
    }, [dispatch, id, userState.token])

    const navigate = useNavigate()
    React.useEffect(() => {
        if (userState.token) {
            dispatch(getAllCustomers({ token: userState.token }));
            dispatch(getAllProducts({ token: userState.token }));
        }
    }, [dispatch, userState.token]);

    const formik = useFormik({
        initialValues: {
            customerId: order?.customerId || null,
            orderDate: order?.orderDate || '',
            notes: order?.notes || '',
            totalAmount: 0,
            orderItems: order?.orderItems?.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                discount: item.discount,
                subTotal: item.subTotal,
                pricePerUnit: 0
            })) || [
                    { productId: '', quantity: 0, discount: 0, pricePerUnit: 0, subTotal: 0 }
                ]
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            customerId: Yup.string().required('Customer ID is required'),
            orderDate: Yup.date().required('Order date is required'),
            notes: Yup.string(),
            orderItems: Yup.array().of(
                Yup.object({
                    productId: Yup.string().required('Product name is required'),
                    quantity: Yup.number()
                        .required('Quantity is required')
                        .integer("Must be an integer number")
                        .positive(),
                    discount: Yup.number().required('Discount is required'),
                    pricePerUnit: Yup.number()
                        .required('Price per unit is required')
                        .positive(),
                })
            ),
        }),
        onSubmit: (values) => {
            // Create the body structure to match UpdateOrderParams.body
            const sanitizedValues = {
                customerId: values.customerId ? String(values.customerId) : null,
                orderDate: values.orderDate,
                notes: values.notes,
                orderItems: values.orderItems.map(({ productId, quantity, discount, subTotal }) => ({
                    productId: String(productId),
                    quantity,
                    discount,
                    subTotal,
                })),
            };

            dispatch(updateOrder({ body: sanitizedValues, token: userState.token, orderId: id })).then(() => {
                dispatch(getAllOrders({ token: userState.token }))
                setSuccessMessage('Order updated successfully!');
                setOpen(true);
                formik.resetForm();
                navigate("/orders")
            })
        }
    });

    const handleCloseSnackbar = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        // Update orderItems with calculated subTotal
        const updatedOrderItems = formik.values.orderItems.map((item) => {
            const selectedProduct = products.find((p) => String(p.id) === String(item.productId));
            return {
                ...item,
                productId: String(item.productId),
                pricePerUnit: Number(selectedProduct?.sellingPrice) || 0,
                subTotal: (Number(selectedProduct?.sellingPrice) * item.quantity) || 0,
            };
        });

        // Calculate totalAmount by summing up all subTotal values
        const calculatedTotalAmount = updatedOrderItems.reduce(
            (acc, item) => acc + (item.subTotal || 0),
            0
        );

        // Update formik values only if there are changes
        if (
            JSON.stringify(updatedOrderItems) !== JSON.stringify(formik.values.orderItems) ||
            formik.values.totalAmount !== calculatedTotalAmount
        ) {
            formik.setValues(
                {
                    ...formik.values,
                    orderItems: updatedOrderItems,
                    totalAmount: calculatedTotalAmount,
                },
                false
            );
        }
    }, [formik.values.orderItems, products, formik]);


    return (
        <Box>
            <Typography variant="h5">Update Order</Typography>
            <Divider sx={{ marginY: 2 }} />
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            fullWidth
                            options={customers}
                            getOptionLabel={(option) => option.name}
                            value={customers.find((customer) => String(customer.id) === String(formik.values.customerId)) || null}
                            onChange={(_event, value) => {
                                formik.setFieldValue(`customerId`, value ? value.id : '');
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Customer"
                                    variant="outlined"
                                    error={formik.touched.customerId && Boolean(formik.errors.customerId)}
                                    helperText={formik.touched.customerId && Boolean(formik.errors.customerId)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Order Date"
                            name="orderDate"
                            type="date"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.orderDate ? new Date(formik.values.orderDate).toISOString().split('T')[0] : ''}
                            onChange={formik.handleChange}
                            error={formik.touched.orderDate && Boolean(formik.errors.orderDate)}
                            helperText={formik.touched.orderDate && formik.errors.orderDate}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Total Amount"
                            name="totalAmount"
                            type="number"
                            variant="outlined"
                            value={formik.values.totalAmount}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Notes"
                            name="notes"
                            type="string"
                            variant="outlined"
                            value={formik.values.notes}
                            onChange={formik.handleChange}
                            error={formik.touched.notes && Boolean(formik.errors.notes)}
                        />
                        {formik.touched.notes && formik.errors.notes && (
                            <Typography color="error">{formik.errors.notes}</Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <FormikProvider value={formik} >
                            <FieldArray name="orderItems">
                                {({ push, remove }) => (
                                    <>
                                        {formik.values.orderItems.map((product, index) => (
                                            <Grid container spacing={2} mb={2} key={index} alignItems="center">
                                                <Grid item xs={12} sm={3}>
                                                    <Autocomplete
                                                        fullWidth
                                                        options={products}
                                                        getOptionLabel={(option) => option.name}
                                                        value={products.find((p) => p.id === product.productId) || null}
                                                        onChange={(_event, value) => {
                                                            formik.setFieldValue(`orderItems[${index}].productId`, value?.id || "");
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Product"
                                                                variant="outlined"
                                                                error={
                                                                    formik.touched.orderItems?.[index]?.productId &&
                                                                    Boolean(
                                                                        (formik.errors.orderItems as OrderItem[] | undefined)?.[index]?.productId
                                                                    )
                                                                }
                                                                helperText={
                                                                    formik.touched.orderItems?.[index]?.productId &&
                                                                    (formik.errors.orderItems as OrderItem[] | undefined)?.[index]?.productId
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Quantity"
                                                        name={`orderItems[${index}].quantity`}
                                                        type="number"
                                                        variant="outlined"
                                                        value={product.quantity}
                                                        onChange={formik.handleChange}
                                                        error={
                                                            formik.touched.orderItems?.[index]?.quantity &&
                                                            Boolean(
                                                                (formik.errors.orderItems as OrderItem[] | undefined)?.[index]
                                                                    ?.quantity
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched.orderItems?.[index]?.quantity &&
                                                            (formik.errors.orderItems as OrderItem[] | undefined)?.[index]
                                                                ?.quantity
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Discount"
                                                        name={`orderItems[${index}].discount`}
                                                        type="number"
                                                        variant="outlined"
                                                        value={product.discount}
                                                        onChange={formik.handleChange}
                                                        error={
                                                            formik.touched.orderItems?.[index]?.discount &&
                                                            Boolean(
                                                                (formik.errors.orderItems as OrderItem[] | undefined)?.[index]
                                                                    ?.discount
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched.orderItems?.[index]?.discount &&
                                                            (formik.errors.orderItems as OrderItem[] | undefined)?.[index]
                                                                ?.discount
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Price per Unit"
                                                        name={`orderItems[${index}].pricePerUnit`}
                                                        type="number"
                                                        variant="outlined"
                                                        value={product.pricePerUnit}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Total Price"
                                                        name={`products[${index}].subTotal`}
                                                        type="number"
                                                        variant="outlined"
                                                        value={product.subTotal}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={1}>
                                                    <IconButton sx={{ border: "1px solid" }} color="primary" onClick={() => remove(index)}>
                                                        <Remove />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        ))}
                                        <Button
                                            color="primary"
                                            variant="outlined"
                                            onClick={() => push({ productName: '', quantity: 0, pricePerUnit: 0, subTotal: 0 })}
                                            startIcon={<Add />}
                                            sx={{ mt: 2 }}
                                        >
                                            Add Product
                                        </Button>
                                    </>
                                )}
                            </FieldArray>
                        </FormikProvider>
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary"
                    onClick={formik.handleSubmit as never}
                    sx={{
                        mt: 2,
                        p: 2,
                        px: 3,
                        boxShadow: "none",
                        ":hover": {
                            boxShadow: "none"
                        }
                    }}>
                    Add Purchase
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

export default UpdateOrder;
