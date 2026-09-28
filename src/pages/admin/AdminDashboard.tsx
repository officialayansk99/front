import React, { useEffect, useState } from "react";
import { http } from "@/shared/api/http";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, TrendingUp, History } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalClients: number;
  totalMt5Accounts: number;
  pendingTransactions: number;
  totalDeposits: number;
  approvedKyc?: number;
}

interface DashboardCharts {
  registrations?: Array<{ month: string; count: number }>;
  [key: string]: unknown;
}

interface LogEntry {
  id: string;
  action: string;
  timestamp: string;
  createdAt?: string;
  log?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes, logsRes] = await Promise.all([
          http.get("/admin/analytics"),
          http.get("/admin/analytics/charts"),
          http.get("/admin/logs?limit=10"),
        ]);
        setStats(statsRes.data.data);
        setCharts(chartsRes.data.data);
        setLogs(logsRes.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="relative p-4 sm:p-6 space-y-6 w-full min-w-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Executive Overview
        </h1>
        <p className="text-muted-foreground">
          Real-time system health and business growth analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card shadow-lg border-none bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card shadow-lg border-none bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved KYC</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.approvedKyc}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalClients
                ? ((stats?.approvedKyc / stats?.totalClients) * 100).toFixed(1)
                : 0}
              % conversion rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrations Chart */}
        <Card className="glass-card shadow-lg border-none bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Month-Wise Open Account
            </CardTitle>
            <CardDescription>
              Number of new traders registered per month
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.registrations}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="label"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "hsl(var(--primary))" }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card className="glass-card shadow-lg border-none bg-card/50 backdrop-blur-md overflow-x-auto">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between min-w-0">
            <div className="space-y-1 min-w-0">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-amber-500" />
                Activity Logs
              </CardTitle>
              <CardDescription>Recent system events</CardDescription>
            </div>
            <Link to="/admin/logs" className="shrink-0">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="h-[350px] overflow-y-auto overflow-x-auto min-w-0">
            <Table className="min-w-[16rem]">
              <TableHeader>
                <TableRow className="border-sidebar-border/50">
                  <TableHead className="text-[10px] uppercase">Time</TableHead>
                  <TableHead className="text-[10px] uppercase">Log</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No recent activity.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, i) => (
                    <TableRow key={i} className="border-sidebar-border/30">
                      <TableCell className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-xs font-medium leading-relaxed">
                        {log.log}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
