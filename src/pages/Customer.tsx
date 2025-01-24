import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCustomerInfo, getCustomerOrders, getCustomerPayments } from "../store/slices/customerSlice";
import { Box, Card, CardContent, Collapse, Divider, Grid, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

function Customer() {
    const { id } = useParams()
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const state = useSelector((state: RootState) => state.customers);
    const userState = useSelector((state: RootState) => state.users);
    const customer = state.customer;
    const customerPayments: Array<{ id: number; amount: number; date: string; info: string; notes?: string }> = state.customer_payments || [];
    const customerOrders: Array<{ id: number; orderDate: string; totalDiscount: number; finalAmount: number; notes: string; orderItems: Array<{ productId: number; productName: string; quantity: number; sellingPrice: number; discount: number; subtotal: number }> }> = state.customer_orders || [];
    useEffect(() => {
        dispatch(getCustomerInfo({ token: userState.token, customerId: id }));
        dispatch(getCustomerPayments({ token: userState.token, customerId: id }));
        dispatch(getCustomerOrders({ token: userState.token, customerId: id }));
    }, [dispatch, id, userState.token])
    const handleExpandClick = (orderId: number) => {
        setOpen((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    };
    return (
        <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Customer Details</Typography>
                <Stack direction="row" spacing={2}>
                    {/* <Button
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
                        onClick={handleEditClick}
                        startIcon={< EditIcon />}
                    >
                        Update customer
                    </Button > */}
                </Stack >
            </Stack >
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Customer Information</Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Customer ID: </strong>{customer?.id || "N/A"}</Typography>                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Customer Name:</strong> {customer?.name || "N/A"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Customer Phone:</strong> {customer?.phone || "N/A"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Money owed:</strong> {customer?.moneyOwed} EGP</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <TableContainer component={Card} sx={{ mb: 3 }} variant="outlined">
                <CardContent>
                    {/* Product Table */}
                    <Typography variant="h6" gutterBottom>
                        Orders
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Order Date</TableCell>
                                <TableCell>Total Discount (EGP)</TableCell>
                                <TableCell>Final Amount (EGP)</TableCell>
                                <TableCell>Notes</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customerOrders?.map((order) => {
                                return (
                                    <>
                                        <TableRow key={order?.id}>
                                            <TableCell>{order?.id}</TableCell>
                                            <TableCell>{order?.orderDate}</TableCell>
                                            <TableCell>{order?.totalDiscount}</TableCell>
                                            <TableCell>{order?.finalAmount}</TableCell>
                                            <TableCell>{order?.notes}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => handleExpandClick(order.id)}
                                                    aria-label="expand row"
                                                >
                                                    {open[order.id] ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        {open[order.id] && (
                                            <TableRow>
                                                <TableCell sx={{ padding: 4 }} colSpan={7}>
                                                    <Collapse in={open[order.id]} timeout="auto" unmountOnExit>
                                                        <Box margin={1}>
                                                            <Typography variant="subtitle1" gutterBottom component="div">
                                                                Product Details
                                                            </Typography>
                                                            <Divider sx={{ marginBottom: 1 }} />
                                                            <Table size="medium" aria-label="products">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Product ID</TableCell>
                                                                        <TableCell>Product Name</TableCell>
                                                                        <TableCell>Quantity</TableCell>
                                                                        <TableCell>Price per Unit (EGP)</TableCell>
                                                                        <TableCell>Discount (%)</TableCell>
                                                                        <TableCell>Total Price (EGP)</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {order.orderItems.map((product) => (
                                                                        <TableRow key={product.productId}>
                                                                            <TableCell>{product.productId}</TableCell>
                                                                            <TableCell>{product.productName}</TableCell>
                                                                            <TableCell>{product.quantity}</TableCell>
                                                                            <TableCell>{product.sellingPrice}</TableCell>
                                                                            <TableCell>{product.discount}</TableCell>
                                                                            <TableCell>{product.subtotal}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </TableContainer>
            <TableContainer component={Card} sx={{ mb: 3 }} variant="outlined">
                <CardContent>
                    {/* Product Table */}
                    <Typography variant="h6" gutterBottom>
                        Payments
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Payment ID</TableCell>
                                <TableCell>Amount (EGP)</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Info</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customerPayments?.map((payment) => {
                                return (
                                    <>
                                        <TableRow key={payment?.id}>
                                            <TableCell>{payment?.id}</TableCell>
                                            <TableCell>{payment?.amount}</TableCell>
                                            <TableCell>{payment?.date}</TableCell>
                                            <TableCell>{payment?.info}</TableCell>
                                            <TableCell>{payment?.notes}</TableCell>
                                        </TableRow>
                                    </>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </TableContainer>
        </div>
    )
}

export default Customer