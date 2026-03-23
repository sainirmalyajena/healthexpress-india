'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    LineChart,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Line,
    AreaChart,
    Area
} from 'recharts';

interface AnalyticsChartsProps {
    revenueData: Array<{
        name: string;
        revenue: number;
    }>;
    statusData: Array<{
        name: string;
        value: number;
    }>;
    conversionData?: Array<{
        date: string;
        leads: number;
        qualified: number;
    }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function AnalyticsCharts({ revenueData, statusData, conversionData }: AnalyticsChartsProps) {
    return (
        <div className="space-y-8 mb-8">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <span>💰</span> Revenue by Surgery
                    </h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={revenueData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#64748b', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#64748b', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill="#0d9488"
                                    radius={[6, 6, 0, 0]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <span>📊</span> Lead Distribution
                    </h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="40%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Conversion Trend */}
            {conversionData && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <span>📈</span> 30-Day Conversion Trend
                    </h2>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={conversionData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorQual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={2}
                                />
                                <YAxis
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} iconType="circle" />
                                <Area
                                    type="monotone"
                                    dataKey="leads"
                                    name="Total Inquiries"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorLeads)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="qualified"
                                    name="Qualified Cases"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorQual)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
