import { useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProfitChartProps {
    totalRevenue: number;
    totalExpenses: number;
    totalPurchases: number;
    totalCommissions: number;
    totalSpend: number;
    netProfit: number;
    isProfit: boolean;
}

export function ProfitChart({
    totalRevenue, totalExpenses, totalPurchases,
    totalCommissions, totalSpend, netProfit, isProfit,
}: ProfitChartProps) {
    const chartRef = useRef<ChartJS<'bar'>>(null);

    const chartData = {
        labels: ['Revenue', 'Expenses', 'Purchases', 'Commissions', 'Total Spend', 'Net Profit / Loss'],
        datasets: [{
            label: 'Amount (USD)',
            data: [totalRevenue, totalExpenses, totalPurchases, totalCommissions, totalSpend, netProfit],
            backgroundColor: [
                'rgba(82, 196, 26, 0.75)',
                'rgba(255, 77, 79, 0.75)',
                'rgba(250, 173, 20, 0.75)',
                'rgba(114, 46, 209, 0.75)',
                'rgba(24, 144, 255, 0.75)',
                isProfit ? 'rgba(82, 196, 26, 0.9)' : 'rgba(255, 77, 79, 0.9)',
            ],
            borderColor: ['#52c41a', '#ff4d4f', '#faad14', '#722ed1', '#1890ff', isProfit ? '#52c41a' : '#ff4d4f'],
            borderWidth: 2,
            borderRadius: 6,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Profit Overview',
                font: { size: 16, weight: 'bold' as const },
                padding: { bottom: 16 },
            },
            tooltip: {
                callbacks: {
                    label: (ctx: any) => ` ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(ctx.raw as number)}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value),
                },
                grid: { color: 'rgba(0,0,0,0.05)' },
            },
            x: { grid: { display: false } },
        },
    };

    return (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', border: '1px solid #f0f0f0', marginBottom: '24px', height: '380px' }}>
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
        </div>
    );
}