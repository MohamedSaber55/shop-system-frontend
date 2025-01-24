import { Fragment, useEffect, useState } from "react";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Card, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Collapse, Divider} from '@mui/material';
import { getTodayOrders } from "../store/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";

interface OrderItem {
    productId: number;
    productName: number;
    quantity: number;
    discount: number;
    subtotal: number;
}

interface Order {
    id?: string;
    orderDate?: string;
    userId?: string;
    notes?: string;
    user?: {
        id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
    };
    totalDiscount?: number;
    totalAmount?: number;
    customer: {
        id: number;
        name: string;
        phone: string;
    };
    orderItems: OrderItem[];
}


const TodayOrdersTable = () => {
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const userState = useSelector((state: RootState) => state.users);
    const orderState = useSelector((state: RootState) => state.orders);
    const todayOrders: Order[] = orderState.today_orders;
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(getTodayOrders({ token: userState.token }));
    }, [dispatch, userState.token])
    const handleExpandClick = (orderId: string) => {
        setOpen((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    };


    return (
        <>
            <TableContainer variant='outlined' component={Card} style={{ marginTop: '20px' }}>
                <Typography variant="h6" component="div" p={2}>
                    Today Orders
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer ID</TableCell>
                            <TableCell>Order Date</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Discount</TableCell>
                            <TableCell>Cashier ID</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell>Products</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {todayOrders.map((order) => (
                            <Fragment key={order.id}>
                                <TableRow>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.customer.name}</TableCell>
                                    <TableCell>{order.orderDate}</TableCell>
                                    <TableCell>EGP {order?.totalAmount?.toFixed(2)}</TableCell>
                                    <TableCell>EGP {order.totalDiscount}</TableCell>
                                    <TableCell>{order.user?.firstName}</TableCell>
                                    <TableCell>{order.notes}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => order.id && handleExpandClick(order.id)} aria-label="expand row">
                                            {order.id && open[order.id] ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                {order.id && open[order.id] && <TableRow>
                                    <TableCell sx={{ padding: 4 }} colSpan={10}>
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
                                                            <TableCell>SubTotal</TableCell>
                                                            <TableCell>Discount</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {order.orderItems.map((product) => (
                                                            <TableRow key={product.productId}>
                                                                <TableCell>{product.productId}</TableCell>
                                                                <TableCell>{product.productName}</TableCell>
                                                                <TableCell>{product.quantity}</TableCell>
                                                                <TableCell>{product.subtotal}</TableCell>
                                                                <TableCell>{product.discount}</TableCell>
                                                                {/* <TableCell>${product.price_per_unit.toFixed(2)}</TableCell> */}
                                                                {/* <TableCell>${product.total_price.toFixed(2)}</TableCell> */}
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>}
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default TodayOrdersTable