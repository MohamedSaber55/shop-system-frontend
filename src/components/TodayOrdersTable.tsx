/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useMemo, useState } from "react";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Card, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Collapse, Divider, TablePagination, TableFooter } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

const TodayOrdersTable = () => {
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleExpandClick = (orderId: string) => {
        setOpen((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    interface Product {
        product_id: string;
        product_name: string;
        quantity: number;
        price_per_unit: number;
        total_price: number;
    }

    interface Order {
        id: string;
        customer_id: string;
        order_date: string;
        total_amount: number;
        outstanding_balance: number;
        discount: number;
        cashier_id: string;
        notes: string;
        products: Product[];
    }

    const orders: Order[] = [
        {
            id: "order_001",
            customer_id: "customer_001",
            order_date: "10:00 AM",
            total_amount: 150.75,
            outstanding_balance: 50.00,
            discount: 2.00,
            cashier_id: "user_001",
            notes: "Regular customer",
            products: [
                { product_id: "product_001", product_name: "Product One", quantity: 2, price_per_unit: 25.00, total_price: 50.00 },
                { product_id: "product_002", product_name: "Product Two", quantity: 3, price_per_unit: 33.50, total_price: 100.50 },
            ],
        },
        {
            id: "order_002",
            customer_id: "customer_002",
            order_date: "11:15 AM",
            total_amount: 200.50,
            outstanding_balance: 0.00,
            discount: 5.00,
            cashier_id: "user_002",
            notes: "Loyalty discount applied",
            products: [
                { product_id: "product_003", product_name: "Product Three", quantity: 5, price_per_unit: 20.00, total_price: 100.00 },
                { product_id: "product_004", product_name: "Product Four", quantity: 2, price_per_unit: 50.25, total_price: 100.50 },
            ],
        },
        {
            id: "order_003",
            customer_id: "customer_003",
            order_date: "01:30 PM",
            total_amount: 85.00,
            outstanding_balance: 35.00,
            discount: 0.00,
            cashier_id: "user_003",
            notes: "Partial payment",
            products: [
                { product_id: "product_005", product_name: "Product Five", quantity: 1, price_per_unit: 85.00, total_price: 85.00 },
            ],
        },
        {
            id: "order_004",
            customer_id: "customer_004",
            order_date: "03:45 PM",
            total_amount: 300.00,
            outstanding_balance: 0.00,
            discount: 10.00,
            cashier_id: "user_004",
            notes: "Bulk purchase discount",
            products: [
                { product_id: "product_006", product_name: "Product Six", quantity: 10, price_per_unit: 30.00, total_price: 300.00 },
            ],
        },
        {
            id: "order_005",
            customer_id: "customer_005",
            order_date: "05:20 PM",
            total_amount: 45.50,
            outstanding_balance: 15.50,
            discount: 1.00,
            cashier_id: "user_005",
            notes: "Payment pending",
            products: [
                { product_id: "product_007", product_name: "Product Seven", quantity: 3, price_per_unit: 15.00, total_price: 45.00 },
            ],
        },
        {
            id: "order_006",
            customer_id: "customer_006",
            order_date: "08:30 AM",
            total_amount: 60.00,
            outstanding_balance: 0.00,
            discount: 0.00,
            cashier_id: "user_006",
            notes: "New customer",
            products: [
                { product_id: "product_008", product_name: "Product Eight", quantity: 4, price_per_unit: 15.00, total_price: 60.00 },
            ],
        },
        {
            id: "order_007",
            customer_id: "customer_007",
            order_date: "09:45 AM",
            total_amount: 400.00,
            outstanding_balance: 0.00,
            discount: 20.00,
            cashier_id: "user_007",
            notes: "Large order discount",
            products: [
                { product_id: "product_009", product_name: "Product Nine", quantity: 8, price_per_unit: 50.00, total_price: 400.00 },
            ],
        },
        {
            id: "order_008",
            customer_id: "customer_008",
            order_date: "12:00 PM",
            total_amount: 120.50,
            outstanding_balance: 20.50,
            discount: 0.00,
            cashier_id: "user_008",
            notes: "First-time customer",
            products: [
                { product_id: "product_010", product_name: "Product Ten", quantity: 6, price_per_unit: 20.00, total_price: 120.00 },
            ],
        },
        {
            id: "order_009",
            customer_id: "customer_009",
            order_date: "02:30 PM",
            total_amount: 250.00,
            outstanding_balance: 100.00,
            discount: 15.00,
            cashier_id: "user_009",
            notes: "Customer requested payment delay",
            products: [
                { product_id: "product_011", product_name: "Product Eleven", quantity: 5, price_per_unit: 50.00, total_price: 250.00 },
            ],
        },
        {
            id: "order_010",
            customer_id: "customer_010",
            order_date: "06:00 PM",
            total_amount: 75.00,
            outstanding_balance: 0.00,
            discount: 5.00,
            cashier_id: "user_010",
            notes: "Discount applied for member",
            products: [
                { product_id: "product_012", product_name: "Product Twelve", quantity: 3, price_per_unit: 25.00, total_price: 75.00 },
            ],
        },
    ];

    const visibleRows = useMemo(
        () =>
            [...orders].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage],
    );


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
                            <TableCell>Outstanding Balance</TableCell>
                            <TableCell>Discount</TableCell>
                            <TableCell>Cashier ID</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell>Products</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((order) => (
                            <Fragment key={order.id}>
                                <TableRow>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.customer_id}</TableCell>
                                    <TableCell>{order.order_date}</TableCell>
                                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                                    <TableCell>${order.outstanding_balance.toFixed(2)}</TableCell>
                                    <TableCell>${order.discount.toFixed(2)}</TableCell>
                                    <TableCell>{order.cashier_id}</TableCell>
                                    <TableCell>{order.notes}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleExpandClick(order.id)} aria-label="expand row">
                                            {open[order.id] ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                {open[order.id] && <TableRow>
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
                                                            <TableCell>Price per Unit</TableCell>
                                                            <TableCell>Total Price</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {order.products.map((product) => (
                                                            <TableRow key={product.product_id}>
                                                                <TableCell>{product.product_id}</TableCell>
                                                                <TableCell>{product.product_name}</TableCell>
                                                                <TableCell>{product.quantity}</TableCell>
                                                                <TableCell>${product.price_per_unit.toFixed(2)}</TableCell>
                                                                <TableCell>${product.total_price.toFixed(2)}</TableCell>
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
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { value: orders.length, label: 'All' }]}
                                count={orders.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    },
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    )
}

export default TodayOrdersTable