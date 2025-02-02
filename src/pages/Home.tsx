import { Card, CardContent, Typography, Grid, Box, Stack } from '@mui/material';
import { AiOutlineDollarCircle, AiOutlineShoppingCart, AiOutlineLineChart } from 'react-icons/ai';
// import Chart from 'react-apexcharts';
// import { ApexOptions } from 'apexcharts';
import TodayOrdersTable from '../components/TodayOrdersTable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { useEffect } from 'react';
import { getAllOrders, getTodayOrders, getTotalRevenue } from '../store/slices/orderSlice';
import { getAllExpenses, getTotalExpenses } from '../store/slices/expenseSlice';
import { groupDataByMonth } from '../services/groupDataByMonth';
import ChartComponent from '../components/Chart';

const Home = () => {
    const userState = useSelector((state: RootState) => state.users);
    const orderState = useSelector((state: RootState) => state.orders);
    const expenseState = useSelector((state: RootState) => state.expenses);
    const totalOrders = orderState.metaData.totalCount;
    const totalRevenue = orderState.total_revenue;
    const totalExpenses = expenseState.total_expenses;
    const orderItems: [] = orderState.orders
    const expensesItems: [] = expenseState.expenses
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(getAllOrders({ token: userState.token }));
        dispatch(getAllExpenses({ token: userState.token }));
        dispatch(getTotalExpenses({ token: userState.token }));
        dispatch(getTotalRevenue({ token: userState.token }));
        dispatch(getTodayOrders({ token: userState.token }));
    }, [dispatch, userState.token])

    const ordersByMonth = groupDataByMonth(orderItems, 'orderDate', 'finalAmount');

    const expensesByMonth = groupDataByMonth(expensesItems, 'date', 'amount');

    // const baseChartOptions: ApexOptions = {
    //     chart: {
    //         type: 'area',
    //         height: 350,
    //         sparkline: {
    //             enabled: false
    //         },
    //         toolbar: {
    //             show: true,
    //         },
    //         zoom: {
    //             enabled: false
    //         },
    //         offsetX: 0
    //     },
    //     dataLabels: {
    //         enabled: false
    //     },
    //     markers: {
    //         size: 0,
    //     },
    //     annotations: {
    //         yaxis: [{
    //             y: 0,
    //             borderColor: '#999',
    //             label: {
    //                 style: {
    //                     color: "#fff",
    //                     background: '#00E396'
    //                 }
    //             }
    //         }],
    //         xaxis: [{
    //             x: 0,
    //             borderColor: '#999',
    //             label: {
    //                 style: {
    //                     color: "#fff",
    //                     background: '#775DD0'
    //                 }
    //             }
    //         }]
    //     },
    //     stroke: {
    //         curve: "smooth",
    //         width: 2
    //     },
    //     tooltip: {
    //         fixed: {
    //             enabled: false
    //         },
    //         x: {
    //             show: true
    //         }
    //     },
    //     fill: {
    //         type: 'gradient',
    //         gradient: {
    //             shadeIntensity: 1,
    //             opacityFrom: 0.7,
    //             opacityTo: 0.9,
    //             stops: [0, 100]
    //         }
    //     },
    // };

    // const expensesAndSalesChartOptions = {
    //     ...baseChartOptions,
    //     xaxis: {
    //         ...baseChartOptions.xaxis,
    //         categories: [
    //             'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    //             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    //         ],
    //     },
    //     colors: ['#4CAF50', '#F44336', "#1976d2"],
    // };

    // // Static Data for Monthly Sales and Expenses
    // const salesData = [12000, 14000, 11000, 16000, 13000, 9000, 18000, 22000, 21000, 25000, 23000, 24000];
    // const expensesData = [8000, 6000, 7000, 7500, 9000, 6500, 7000, 8000, 9000, 11000, 10500, 12000];
    // const ordersData = [1000, 1200, 900, 1400, 1300, 800, 1500, 1700, 1600, 2000, 1800, 1900];

    // const series = [
    //     {
    //         name: 'Sales',
    //         data: salesData,
    //     },
    //     {
    //         name: 'Expenses',
    //         data: expensesData,
    //     },
    //     {
    //         name: 'Orders',
    //         data: ordersData,
    //     },
    // ]
    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} md={4} >
                    <Card sx={{ boxShadow: "none", border: "1px solid #ddd" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography color='success'>
                                    <AiOutlineDollarCircle size={60} />
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Total Revenue
                                    </Typography>
                                    <Typography variant="h6" color='success'>EGP {totalRevenue}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4} >
                    <Card sx={{ boxShadow: "none", border: "1px solid #ddd" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography color='error'>
                                    <AiOutlineLineChart size={60} />
                                </Typography>
                                <Stack gap={0} sx={{ ml: 2 }}>
                                    <Typography variant="h6">
                                        Total Expenses
                                    </Typography>
                                    <Typography variant="h6" color='error'>EGP {totalExpenses}</Typography>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4} >
                    <Card sx={{ boxShadow: "none", border: "1px solid #ddd" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography color='primary'>
                                    <AiOutlineShoppingCart size={60} />
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Total Orders
                                    </Typography>
                                    <Typography variant="h6" color='primary'>{totalOrders}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid >
            <Grid container spacing={3} style={{ marginTop: '0px' }}>
                <Grid item xs={12} lg={12}>
                    <Card sx={{ boxShadow: "none", border: "1px solid #ddd" }}>
                        <CardContent>
                            <Typography variant="h6">Sales and Expenses Trend</Typography>
                            <ChartComponent expensesByMonth={expensesByMonth} ordersByMonth={ordersByMonth} />
                            {/* <Chart options={expensesAndSalesChartOptions} series={series} type="area" height={350} /> */}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <TodayOrdersTable />
        </Box >
    );
};

export default Home;
