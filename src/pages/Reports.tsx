
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Reports() {
  const [agentInteractions, setAgentInteractions] = useState<any[]>([]);
  const [ticketProcessingTimes, setTicketProcessingTimes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("interactions");

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        // Fetch interactions by agent
        const { data: interactionData, error: interactionError } = await supabase
          .from("Interaction")
          .select("agentID")
          .order("agentID");

        if (interactionError) throw interactionError;

        // Count interactions by agent
        const agentCounts = interactionData.reduce((acc: Record<string, number>, item) => {
          acc[item.agentID] = (acc[item.agentID] || 0) + 1;
          return acc;
        }, {});

        const formattedAgentData = Object.entries(agentCounts).map(([agentID, count]) => ({
          agent: agentID,
          interactions: count
        }));

        setAgentInteractions(formattedAgentData);

        // Fetch ticket processing times
        const { data: ticketData, error: ticketError } = await supabase
          .from("Ticket")
          .select("agent, timeStart, timeEnd")
          .order("agent");

        if (ticketError) throw ticketError;

        // Calculate average processing time by agent (in minutes)
        const processingTimes: Record<string, { totalTime: number; count: number }> = {};
        
        ticketData.forEach(ticket => {
          const startTime = new Date(ticket.timeStart).getTime();
          const endTime = new Date(ticket.timeEnd).getTime();
          const processingTime = (endTime - startTime) / (1000 * 60); // Convert to minutes
          
          if (!processingTimes[ticket.agent]) {
            processingTimes[ticket.agent] = { totalTime: 0, count: 0 };
          }
          
          processingTimes[ticket.agent].totalTime += processingTime;
          processingTimes[ticket.agent].count += 1;
        });

        const formattedProcessingData = Object.entries(processingTimes).map(([agent, data]) => ({
          agent,
          averageTime: Math.round(data.totalTime / data.count)
        })).filter(item => !isNaN(item.averageTime)); // Filter out NaN values

        setTicketProcessingTimes(formattedProcessingData);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Báo Cáo Hoạt Động</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none">
          <TabsTrigger value="interactions">Tương Tác Theo Nhân Viên</TabsTrigger>
          <TabsTrigger value="processing">Thời Gian Xử Lý Ticket</TabsTrigger>
        </TabsList>

        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Số Lượng Tương Tác Theo Nhân Viên</CardTitle>
              <CardDescription>
                Tổng số tương tác được xử lý bởi mỗi nhân viên trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={agentInteractions}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="agent" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="interactions" fill="#8884d8" name="Số tương tác" />
                    </BarChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={agentInteractions}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="interactions"
                        nameKey="agent"
                        label={({ agent, interactions }) => `${agent}: ${interactions}`}
                      >
                        {agentInteractions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thời Gian Xử Lý Ticket Trung Bình</CardTitle>
              <CardDescription>
                Thời gian xử lý trung bình (phút) cho mỗi ticket theo nhân viên
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={ticketProcessingTimes}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="agent" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="averageTime" fill="#82ca9d" name="Thời gian trung bình (phút)" />
                    </BarChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ticketProcessingTimes}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#82ca9d"
                        dataKey="averageTime"
                        nameKey="agent"
                        label={({ agent, averageTime }) => `${agent}: ${averageTime} phút`}
                      >
                        {ticketProcessingTimes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
