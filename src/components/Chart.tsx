import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

interface Expense {
    month: string;
    total: number;
}

interface Order {
    month: string;
    total: number;
}

const ChartComponent = ({ expensesByMonth, ordersByMonth }: { expensesByMonth: Expense[], ordersByMonth: Order[] }) => {
    const categories = [...new Set([...ordersByMonth.map(o => o.month), ...expensesByMonth.map(e => e.month)])];

    const ordersSeries = categories.map((month) => {
        const order = ordersByMonth.find((o) => o.month === month);
        return order ? order.total : 0;
    });

    const expensesSeries = categories.map((month) => {
        const expense = expensesByMonth.find((e) => e.month === month);
        return expense ? expense.total : 0;
    });
    console.log({ ordersSeries, expensesSeries });
    const options: ApexOptions = {
        chart: {
            type: "line",
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
        },
        annotations: {
            yaxis: [{
                y: 0,
                borderColor: '#999',
                label: {
                    style: {
                        color: "#fff",
                        background: '#00E396'
                    }
                }
            }],
            xaxis: [{
                x: 0,
                borderColor: '#999',
                label: {
                    style: {
                        color: "#fff",
                        background: '#775DD0'
                    }
                }
            }]
        },
        stroke: {
            curve: "smooth",
            width: 1
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
                shadeIntensity: 0,
                opacityFrom: 0.5,
                opacityTo: 0.9,
                stops: [0, 100]
            }
        },
        series: [
            {
                name: 'Orders',
                data: ordersSeries,
            },
            {
                name: 'Expenses',
                data: expensesSeries,
            },
        ],
        xaxis: {
            categories,
        },
        yaxis: {
            title: {
                text: 'Amount ($)',
            },
        },
        colors: ['#4CAF50', '#F44336',],
        title: {
            text: 'Monthly Orders and Expenses',
            align: 'center',
        },
        legend: {
            position: 'top',
        },
    };
    const series = options.series;
    return (
        <div>
            <Chart options={options} series={series} type="bar" height={350} />
        </div>
    )
}

export default ChartComponent