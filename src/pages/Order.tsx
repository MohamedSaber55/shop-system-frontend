import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Stack,
    Divider,
    Grid,
    TableContainer,
} from "@mui/material";
import { SaveAlt as ExportIcon, Print as PrintIcon, Edit as EditIcon } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { getOrderInfo, printInvoice } from "../store/slices/orderSlice";
import { getUserInfo } from "../store/slices/accountSlice";
import { getCustomerInfo } from "../store/slices/customerSlice";
// import { getProductInfo } from "../store/slices/productSlice";
interface OrderItem {
    productId: number;
    quantity: number;
    discount: number;
    subTotal: number;
}
interface Order {
    id?: string;
    orderDate?: string;
    notes?: string;
    userId?: string;
    totalDiscount?: number;
    totalAmount?: number;
    customerId: number;
    orderItems: OrderItem[];
}

const OrderPage: React.FC = () => {
    const { id } = useParams();
    const state = useSelector((state: RootState) => state.orders);
    const userState = useSelector((state: RootState) => state.users);
    const customersState = useSelector((state: RootState) => state.customers);
    const dispatch = useDispatch<AppDispatch>();
    const order: Order | null = state?.order;
    const customer = customersState?.customer;
    const cashier = userState?.user;
    React.useEffect(() => {
        dispatch(getOrderInfo({ token: userState.token, orderId: id }))
    }, [dispatch, id, userState.token])

    React.useEffect(() => {
        if (order?.customerId)
            dispatch(getCustomerInfo({ token: userState.token, customerId: String(order.customerId) }))
    }, [dispatch, order?.customerId, userState.token])

    React.useEffect(() => {
        if (order?.userId)
            dispatch(getUserInfo({ token: userState.token, userId: String(order.userId) }))
    }, [dispatch, order?.userId, userState.token])

    // const getProductData = async (productId: string) => {
    //     const dispatchData = await dispatch(getProductInfo({ token: userState.token, productId }))
    //     console.log(dispatchData?.payload);
    //     // return (dispatchData?.payload);
    // }

    const printInvoiceFunc = async (orderId: string) => {
        dispatch(printInvoice({ token: userState.token, orderId }))
    }

    // CSV Export Function
    const exportToCSV = () => {
        const csvRows = [];

        // Order details
        csvRows.push("Order Details");
        csvRows.push(`Order ID,${order?.id}`);
        csvRows.push(`Order Date,${order?.orderDate}`);
        csvRows.push(`Total Amount,${order?.totalAmount}`);
        csvRows.push(`Discount,${order?.totalDiscount}`);
        csvRows.push(`Notes,${order?.notes || ""}`);
        csvRows.push(""); // Blank line

        // Customer and Cashier
        csvRows.push("Customer and Cashier");
        csvRows.push(`Customer ID,${customer?.id}`);
        csvRows.push(`Customer Name,${customer?.name}`);
        csvRows.push(`Customer Phone,${customer?.phone}`);
        csvRows.push(`Cashier ID,${cashier?.id}`);
        csvRows.push(`Cashier Name,${cashier?.firstName} ${cashier?.lastName}`);
        csvRows.push(`Cashier Phone,${cashier?.phone}`);
        csvRows.push(""); // Blank line

        // Products Header
        csvRows.push("Products");
        csvRows.push("Product ID,Product Name,Quantity,Price per Unit,Total Price");

        // Product rows
        order?.orderItems.forEach((product) => {
            csvRows.push(
                `${product.productId},${product.productId},${product.quantity},${product.discount},${product.subTotal}`
            );
        });

        // Convert array to CSV string
        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        // Create a link and trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = `Order_${order?.id}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <Box p={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Order Details</Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                            boxShadow: "none",
                            textTransform: 'none',
                            fontWeight: 'bold',
                            "&:hover": {
                                boxShadow: "none",
                                backgroundColor: 'primary.light',
                                color: 'white',
                            },
                        }}
                        startIcon={<PrintIcon />}
                        onClick={() => printInvoiceFunc(String(order?.id))}
                    >
                        Print Invoice
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{
                            textTransform: 'none',
                            boxShadow: "none",
                            fontWeight: 'bold',
                            "&:hover": {
                                boxShadow: "none",
                                backgroundColor: 'success.dark',
                            },
                        }}
                        startIcon={<ExportIcon />}
                        onClick={exportToCSV}
                    >
                        Export as CSV
                    </Button>
                    <Button
                        component={Link}
                        to={`/orders/${id}/update`}
                        variant="contained"
                        color="warning"
                        sx={{
                            textTransform: 'none',
                            boxShadow: "none",
                            fontWeight: 'bold',
                            "&:hover": {
                                boxShadow: "none",
                                backgroundColor: 'warning.dark',
                                color: 'white',
                            },
                        }}
                        startIcon={<EditIcon />}
                    >
                        Update Order
                    </Button>
                </Stack>
            </Stack>

            <Divider sx={{ marginY: 2 }} />

            {/* Order and Customer Info */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Order Information</Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography><strong>Order ID:</strong> {order?.id}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Order Date:</strong> {new Date(order?.orderDate || "").toLocaleDateString()}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Total Amount:</strong> EGP {order?.totalAmount?.toFixed(2)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Discount:</strong> EGP {order?.totalDiscount?.toFixed(2)}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><strong>Notes:</strong> {order?.notes || "N/A"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={2}>
                <Grid xs={12} item md={6}>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Customer Information</Typography>
                            <Divider sx={{ marginY: 2 }} />
                            <Stack gap={2}>
                                <Typography><strong>Customer ID: </strong>{customer?.id}</Typography>
                                <Typography><strong>Customer Name:</strong> {customer?.name}</Typography>
                                <Typography><strong>Customer Phone:</strong> {customer?.phone}</Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} item md={6}>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Cashier Information</Typography>
                            <Divider sx={{ marginY: 2 }} />
                            <Stack gap={2}>
                                <Typography><strong>Cashier ID: </strong>{cashier?.id}</Typography>
                                <Typography><strong>Cashier Name:</strong> {cashier?.firstName} {cashier?.lastName}</Typography>
                                <Typography><strong>Cashier Phone:</strong> {cashier?.phone}</Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


            <TableContainer component={Card} variant="outlined">
                <CardContent>
                    {/* Product Table */}
                    <Typography variant="h6" gutterBottom>
                        Products
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product ID</TableCell>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                {/* <TableCell>Price per Unit</TableCell> */}
                                <TableCell>Discount</TableCell>
                                <TableCell>Total Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order?.orderItems.map((product) => {
                                // getProductData(String(product.productId))
                                return (
                                    <TableRow key={product.productId}>
                                        <TableCell>{product.productId}</TableCell>
                                        {/* <TableCell>{getProductData(String(product.productId))?.name}</TableCell> */}
                                        <TableCell>{product.productId}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>EGP {product.discount.toFixed(2)}</TableCell>
                                        <TableCell>EGP {product.subTotal.toFixed(2)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </TableContainer>
        </Box>
    );
};

export default OrderPage;
