/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { updatePurchase, getAllPurchases, getPurchaseInfo } from '../store/slices/purchaseSlice';
import { getAllMerchants } from '../store/slices/merchantSlice';
import { useNavigate, useParams } from 'react-router-dom';

interface Merchant {
  id?: number | string;
  name: string;
  phone: string;
  address: string;
  outstandingBalance: string | number;
}

interface PurchaseItem {
  productName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

const UpdatePurchase = () => {
  const [open, setOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.users);
  const merchantsState = useSelector((state: RootState) => state.merchants);
  const purchasesState = useSelector((state: RootState) => state.purchases);
  const merchants: Merchant[] = merchantsState?.merchants;
  const navigate = useNavigate();
  const params = useParams();
  const purchaseId = params.id
  const purchase = purchasesState.Purchase;

  React.useEffect(() => {
    if (userState.token) {
      dispatch(getPurchaseInfo({ token: userState.token, PurchaseId: purchaseId }));
      dispatch(getAllMerchants({ token: userState.token }));
    }
  }, [dispatch, userState.token, purchaseId]);

  const formik = useFormik({
    initialValues: {
      merchantId: purchase?.merchantId || '',
      notes: purchase?.notes || '',
      totalAmount: 0,
      orderDate: purchase?.orderDate || '',
      purchaseItems: purchase?.purchaseItems?.map(item => ({
        productName: item.productName || '',
        quantity: item.quantity || 0,
        pricePerUnit: item.pricePerUnit || 0,
        totalPrice: 0
      })) ||
        [
          { productName: '', quantity: 0, pricePerUnit: 0, totalPrice: 0 }
        ]
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      merchantId: Yup.string().required('Merchant ID is required'),
      notes: Yup.string(),
      orderDate: Yup.date().required('Order date is required'),
      purchaseItems: Yup.array().of(
        Yup.object({
          productName: Yup.string().required('Product name is required'),
          quantity: Yup.number().required('Quantity is required').positive(),
          pricePerUnit: Yup.number().required('Price per unit is required').positive(),
        })
      )
    }),
    onSubmit: (values) => {
      const { totalAmount, ...transformedValues } = values;
      const sanitizedValues = {
        ...transformedValues,
        purchaseItems: values.purchaseItems.map(({ totalPrice, ...item }) => ({ ...item })),
      };

      dispatch(updatePurchase({ PurchaseId: purchaseId!, body: sanitizedValues, token: userState.token })).then(() => {
        dispatch(getAllPurchases({ token: userState.token }));
        setSuccessMessage('Purchase updated successfully!');
        setOpen(true);
        navigate("/purchases");
      });
    }
  });

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  // Effect to automatically update total price for each product and total amount
  useEffect(() => {
    const updatedProducts = formik.values.purchaseItems.map((product) => ({
      ...product,
      totalPrice: product.quantity * product.pricePerUnit
    }));

    const totalAmount = updatedProducts.reduce(
      (sum, product) => sum + product.totalPrice,
      0
    );
    // Only update if values have actually changed
    if (
      JSON.stringify(updatedProducts) !== JSON.stringify(formik.values.purchaseItems) ||
      totalAmount !== formik.values.totalAmount
    ) {
      formik.setFieldValue('purchaseItems', updatedProducts, false);
      formik.setFieldValue('totalAmount', totalAmount, false);
    }
  }, [formik, formik.values.purchaseItems]);

  return (
    <Box>
      <Typography variant="h5">Update Purchase</Typography>
      <Divider sx={{ marginY: 2 }} />
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="merchant-label">Merchant</InputLabel>
              <Select
                labelId="merchant-label"
                label="Merchant"
                name="merchantId"
                value={formik.values.merchantId}
                onChange={formik.handleChange}
                error={formik.touched.merchantId && Boolean(formik.errors.merchantId)}
              >
                {merchants.map((merchant) => (
                  <MenuItem key={merchant.id} value={merchant.id}>{merchant.name}</MenuItem>
                ))}
              </Select>
              {formik.touched.merchantId && formik.errors.merchantId && (
                <Typography color="error">{formik.errors.merchantId}</Typography>
              )}
            </FormControl>
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
          <Grid item xs={6}>
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
              <FieldArray name="purchaseItems">
                {({ push, remove }) => (
                  <>
                    {formik.values.purchaseItems.map((product, index) => (
                      <Grid container spacing={2} mb={2} key={index} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Product Name"
                            name={`purchaseItems[${index}].productName`}
                            variant="outlined"
                            value={product.productName}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.purchaseItems?.[index]?.productName &&
                              Boolean(
                                (formik.errors.purchaseItems as PurchaseItem[] | undefined)?.[index]
                                  ?.productName
                              )
                            }
                            helperText={
                              formik.touched.purchaseItems?.[index]?.productName &&
                              (formik.errors.purchaseItems as PurchaseItem[] | undefined)?.[index]
                                ?.productName
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            fullWidth
                            label="Quantity"
                            name={`purchaseItems[${index}].quantity`}
                            type="number"
                            variant="outlined"
                            value={product.quantity}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.purchaseItems?.[index]?.quantity &&
                              Boolean(
                                (formik.errors.purchaseItems as PurchaseItem[] | undefined)?.[index]
                                  ?.quantity
                              )
                            }
                            helperText={
                              formik.touched.purchaseItems?.[index]?.quantity &&
                              (formik.errors.purchaseItems as PurchaseItem[] | undefined)?.[index]
                                ?.quantity
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Price per Unit"
                            name={`purchaseItems[${index}].pricePerUnit`}
                            type="number"
                            variant="outlined"
                            value={product.pricePerUnit}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.purchaseItems?.[index]?.pricePerUnit &&
                              Boolean(
                                (formik.errors.purchaseItems as PurchaseItem[] | undefined)?.[index]
                                  ?.pricePerUnit
                              )
                            }
                            helperText={
                              formik.touched.purchaseItems?.[index]?.pricePerUnit &&
                              (formik.errors.purchaseItems as PurchaseItem[] | undefined)?.[index]
                                ?.pricePerUnit
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Total Price"
                            name={`purchaseItems[${index}].totalPrice`}
                            type="number"
                            variant="outlined"
                            value={product.totalPrice}
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
                      onClick={() => push({ productName: '', quantity: 0, pricePerUnit: 0, totalPrice: 0 })}
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
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Update Purchase
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

export default UpdatePurchase;
