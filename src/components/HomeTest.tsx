// HomePage.js
import { Grid, Paper, Typography } from '@mui/material';
import { FaDollarSign, FaChartLine, FaShoppingCart } from 'react-icons/fa';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const HomePage = () => {
    // Static Data
    const baseChartOptions: ApexOptions = {
        chart: {
            type: 'area',
            height: 350,
            sparkline: {
                enabled: false
            },
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: false
            },
            offsetX: 0
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
            style: 'hollow',
        },
        annotations: {
            yaxis: [{
                y: 0,
                borderColor: '#999',
                label: {
                    show: true,
                    style: {
                        color: "#fff",
                        background: '#00E396'
                    }
                }
            }],
            xaxis: [{
                x: 0,
                borderColor: '#999',
                yAxisIndex: 0,
                label: {
                    show: true,
                    style: {
                        color: "#fff",
                        background: '#775DD0'
                    }
                }
            }]
        },
        stroke: {
            curve: "smooth",
            width: 2  // Set default line thickness
        },
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: true
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100]
            }
        },
    };

    const revenueChartOptions = {
        ...baseChartOptions,
        colors: ["#2e7d32"],
    };

    const expensesChartOptions = {
        ...baseChartOptions,
        colors: ["#ed6c02"],
    };
    const revenueSeries = [{ name: 'Revenue', data: [3000, 4000, 5000, 12000] }];
    const expensesSeries = [{ name: 'Expenses', data: [2000, 3000, 2500, 8000] }];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Paper elevation={3} style={{ padding: 20, display: 'flex', alignItems: 'center' }}>
                    <FaDollarSign size={30} style={{ marginRight: 10 }} />
                    <div>
                        <Typography variant="h6">Total Sales</Typography>
                        <Typography variant="h4">$12,000</Typography>
                    </div>
                </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
                <Paper elevation={3} style={{ padding: 20, display: 'flex', alignItems: 'center' }}>
                    <FaChartLine size={30} style={{ marginRight: 10 }} />
                    <div>
                        <Typography variant="h6">Total Expenses</Typography>
                        <Typography variant="h4">$3,500</Typography>
                    </div>
                </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
                <Paper elevation={3} style={{ padding: 20, display: 'flex', alignItems: 'center' }}>
                    <FaShoppingCart size={30} style={{ marginRight: 10 }} />
                    <div>
                        <Typography variant="h6">Total Orders</Typography>
                        <Typography variant="h4">300</Typography>
                    </div>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                {/* <Grid item xs={12} lg={6}>
                    <Card sx={{ boxShadow: "none", border: "1px solid #eee" }}>
                        <CardContent>
                            <Typography variant="h6">Revenue Chart</Typography>
                            <Chart options={revenueChartOptions} series={revenueSeries} type="area" height={350} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Card sx={{ boxShadow: "none", border: "1px solid #eee" }}>
                        <CardContent>
                            <Typography variant="h6">Expenses Chart</Typography>
                            <Chart options={expensesChartOptions} series={expensesSeries} type="area" height={350} />
                        </CardContent>
                    </Card>
                </Grid> */}
            </Grid>
        </Grid>
    );
};

export default HomePage;
