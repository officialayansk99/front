import React, { useCallback, useEffect, useState } from "react";
import { http } from "@/shared/api/http";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, History, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AuditLog {
  _id: string;
  id: string;
  action: string;
  userId?: string;
  userEmail?: string;
  details?: string;
  timestamp: string;
  createdAt: string;
  userType?: string;
  log?: string;
  metadata?: Record<string, unknown>;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await http.get(
        `/admin/logs?page=${page}&limit=20&search=${search}`,
      );
      setLogs(res.data.data);
      setTotal(res.data.meta?.total || 0);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div className="w-full min-w-0 p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-2 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Audit Logs
        </h1>
        <p className="text-muted-foreground">
          Monitor all system events and administrator actions.
        </p>
      </div>

      <Card className="glass-card shadow-lg border-none bg-card/50 backdrop-blur-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5 text-amber-500" />
              System Activity
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by action or email (e.g. user@example.com)..."
                  className="pl-9 h-10 bg-background/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="min-w-0">
          <div className="rounded-lg border border-sidebar-border/30 overflow-x-auto">
            <Table className="min-w-[38rem]">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[180px]">Date & Time</TableHead>
                  <TableHead className="w-[120px]">Actor</TableHead>
                  <TableHead>Event Description</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No matching activity logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow
                      key={log._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="text-xs font-medium text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-bold uppercase tracking-wider"
                        >
                          {log.userType || "System"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="font-semibold text-foreground">
                          {log.log}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-primary hover:text-primary"
                          onClick={() => setSelectedLog(log)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-6 min-w-0">
            <p className="text-xs text-muted-foreground min-w-0">
              Showing{" "}
              <span className="font-bold text-foreground">{logs.length}</span>{" "}
              of <span className="font-bold text-foreground">{total}</span>{" "}
              events
            </p>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={logs.length < 20}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      <Dialog
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl glass-card border-sidebar-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Event Details
            </DialogTitle>
            <DialogDescription>
              Detailed technical information for this system event.
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    Timestamp
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(selectedLog.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    Actor Type
                  </p>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold"
                  >
                    {selectedLog.userType || "System"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  Event Message
                </p>
                <div className="p-3 rounded-lg bg-muted/50 border border-sidebar-border/30 text-sm">
                  {selectedLog.log}
                </div>
              </div>

              {selectedLog.metadata &&
                Object.keys(selectedLog.metadata).length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      Metadata / Payload
                    </p>
                    <pre className="p-3 rounded-lg bg-black/40 border border-sidebar-border/30 text-[11px] font-mono text-primary overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  Log ID
                </p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {selectedLog._id}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
