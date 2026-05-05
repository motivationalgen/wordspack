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
  AreaChart,
  Area,
} from "recharts";
import { DAILY_STATS, TOOL_BREAKDOWN, LOCATION_DATA } from "@/data/stats";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, MousePointer2, TrendingUp, Clock, LogOut, Plus, Trash2, Globe } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { getStats, isSupabaseConfigured, clearLocalStats } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";
import { Database, AlertCircle, RefreshCw } from "lucide-react";
import { Logo } from "@/components/Logo";

const COLORS = ["#2F4F4F", "#3D6B6B", "#4A8787", "#5BA3A3", "#6BAEAE", "#7DBABA"];

const Admin = () => {
  const { user, admins, logout, addAdmin, removeAdmin } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [realStats, setRealStats] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured());

  const fetchRealData = async () => {
    setLoadingStats(true);
    const data = await getStats();
    setRealStats(data || []);
    setLoadingStats(false);
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  const handleResetLocal = () => {
    clearLocalStats();
    toast.success("Local demo stats cleared");
    fetchRealData();
  };

  // Process real data for charts
  const processedData = useMemo(() => {
    if (!realStats.length) {
      return {
        daily: DAILY_STATS,
        tools: TOOL_BREAKDOWN,
        locations: LOCATION_DATA,
        summary: {
          mostViewed: "Word Scrambler",
          totalUsersToday: 230,
          totalUsersAllTime: 1245,
          avgSessionTime: "2m",
          growth: "+12.5%",
        },
      };
    }

    // Distinct sessions/users
    const sessionSet = new Set(realStats.map(s => s.session_id).filter(Boolean));
    const totalUsersAllTime = sessionSet.size;

    // Tool Breakdown
    const toolMap: Record<string, { count: number; users: number }> = {};
    realStats.forEach((s) => {
      if (!toolMap[s.tool_name]) toolMap[s.tool_name] = { count: 0, users: 0 };
      toolMap[s.tool_name].count += 1;
      toolMap[s.tool_name].users += 1;
    });
    const tools = Object.entries(toolMap).map(([name, val]) => ({
      name,
      count: val.count,
      users: val.users,
    }));

    // Location Data
    const locMap: Record<string, number> = {};
    realStats.forEach((s) => {
      const country = s.country || "Unknown";
      locMap[country] = (locMap[country] || 0) + 1;
    });
    const locations = Object.entries(locMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Daily Stats & Growth
    const dailyMap: Record<string, number> = {};
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toLocaleDateString("en-US", { weekday: "short" });

    realStats.forEach((s) => {
      const day = new Date(s.timestamp).toLocaleDateString("en-US", { weekday: "short" });
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });

    const daily = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      users: dailyMap[day] || 0,
    }));

    const todayCount = dailyMap[today] || 0;
    const yesterdayCount = dailyMap[yesterday] || 0;
    let growth = "Stable";
    if (yesterdayCount > 0) {
      const diff = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
      growth = `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`;
    } else if (todayCount > 0) {
      growth = "+100%";
    }

    // Avg. Session Time
    let totalTime = 0;
    let sessionCount = 0;
    const toolSessions: Record<string, number[]> = {};
    
    realStats.forEach(s => {
      if (!toolSessions[s.tool_name]) toolSessions[s.tool_name] = [];
      toolSessions[s.tool_name].push(new Date(s.timestamp).getTime());
    });

    Object.values(toolSessions).forEach(times => {
      if (times.length > 1) {
        const span = Math.max(...times) - Math.min(...times);
        if (span > 0 && span < 1800000) {
          totalTime += span;
          sessionCount++;
        }
      }
    });

    const avgSessionMinutes = sessionCount > 0 
      ? Math.round(totalTime / sessionCount / 60000) 
      : 2;

    return {
      tools,
      locations,
      daily,
      summary: {
        mostViewed: tools[0]?.name || "None",
        totalUsersToday: todayCount,
        totalUsersAllTime,
        avgSessionTime: `${avgSessionMinutes}m`,
        growth: growth,
      },
    };
  }, [realStats]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPass) return;
    addAdmin({ email: newEmail, password: newPass });
    setNewEmail("");
    setNewPass("");
    toast.success("New administrator added successfully");
  };

  const handleRemove = (id: string) => {
    if (removeAdmin(id)) {
      toast.success("Administrator removed");
    } else {
      toast.error("Cannot remove the last administrator");
    }
  };

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <SEOHead
        title="Admin Dashboard | Wordspack"
        description="Internal analytics and statistics for Wordspack tool usage."
        path="/Elora"
      />

      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Real-time usage and user engagement metrics.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {isConfigured ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 gap-1.5 px-3 py-1">
                <Database className="h-3 w-3" /> Live: Supabase
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 gap-1.5 px-3 py-1">
                <AlertCircle className="h-3 w-3" /> Demo: Local Storage
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
          {!isConfigured && (
            <Button variant="ghost" size="xs" onClick={handleResetLocal} className="text-[10px] text-muted-foreground hover:text-destructive h-7 gap-1">
              <RefreshCw className="h-3 w-3" /> Reset Demo Data
            </Button>
          )}
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Most Viewed Today</CardTitle>
            <MousePointer2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{processedData.summary.mostViewed}</div>
            <p className="text-xs text-muted-foreground mt-1">Top performing tool</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users Today</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{processedData.summary.totalUsersToday}</div>
            <p className="text-xs text-green-600 font-medium mt-1">{processedData.summary.growth} from yesterday</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{processedData.summary.totalUsersAllTime}</div>
            <p className="text-xs text-muted-foreground mt-1">All time distinct sessions</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{processedData.summary.avgSessionTime}</div>
            <p className="text-xs text-muted-foreground mt-1">Time spent on site</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{processedData.summary.growth}</div>
            <p className="text-xs text-muted-foreground mt-1">User acquisition rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Active Users (Area Chart) */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Daily Active Users</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processedData.daily}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F4F4F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2F4F4F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#2F4F4F"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Usage per Tool (Bar Chart) */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Usage per Tool (Clicks)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData.tools} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Bar dataKey="count" fill="#2F4F4F" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Location Tracker (Pie Chart) */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">User Locations</CardTitle>
            <Globe className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedData.locations}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {processedData.locations.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground">Top</span>
              <span className="text-sm font-bold">Regions</span>
            </div>
          </CardContent>
        </Card>

        {/* Users per Tool (Bar Chart) */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Users per Tool</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData.tools}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6B7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip
                  cursor={{ fill: "#F3F4F6" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Bar dataKey="users" fill="#5BA3A3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Admin Management Section */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Admin Management</CardTitle>
          <CardDescription>Manage team access to the Elora dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end bg-secondary/30 p-4 rounded-lg border border-border/50">
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <Label htmlFor="new-email">New Admin Email</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="colleague@wordspack.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <Label htmlFor="new-pass">Temporary Password</Label>
              <Input
                id="new-pass"
                type="password"
                placeholder="••••••••"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>
            <Button type="submit" className="gap-2">
              <Plus className="h-4 w-4" /> Add Admin
            </Button>
          </form>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>Email Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.email} {a.id === "1" && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Owner</span>}</TableCell>
                    <TableCell className="capitalize">{a.role}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(a.id)}
                        disabled={admins.length <= 1 || a.id === "1"}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;

