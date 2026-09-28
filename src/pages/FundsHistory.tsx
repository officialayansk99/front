import React, { useEffect, useState } from "react";
import { http } from "@/shared/api/http";
import { useAppSelector } from "@/app/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  History,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string | null;
  note?: string;
  method?: string;
  /** Server returns a relative path; we resolve it through the API origin
   *  with an Authorization-aware blob fetch when the user clicks the link. */
  proofUrl?: string | null;
  mt5Login?: number | null;
}

const PAGE_LIMIT = 20;

function formatUsd(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function prettyMethod(method?: string) {
  if (!method) return "—";
  return method.replace(/_/g, " ");
}

export default function FundsHistory() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "deposit" | "withdraw">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search so we don't hammer the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when filters change.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    let cancelled = false;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await http.get("/transactions/mine", {
          params: {
            page,
            limit: PAGE_LIMIT,
            type: filter,
            search: debouncedSearch,
          },
        });
        if (cancelled) return;
        setTransactions(res.data.data ?? []);
        setTotal(res.data.meta?.total ?? 0);
      } catch (err) {
        if (!cancelled)
          console.error("Failed to fetch transaction history", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetchHistory();
    return () => {
      cancelled = true;
    };
  }, [page, filter, debouncedSearch]);

  /**
   * Proof files live in GridFS behind an authenticated route. Open them in a
   * new tab via a one-shot blob URL so the Authorization header is included.
   */
  const openProof = async (relPath: string) => {
    try {
      const res = await http.get(relPath, { responseType: "blob" });
      const blob = new Blob([res.data], {
        type: String(res.headers["content-type"] || "application/octet-stream"),
      });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank", "noopener,noreferrer");
      // Revoke after a short delay to give the new tab time to read the blob.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      if (!win) {
        URL.revokeObjectURL(url);
        console.warn("Popup blocked while opening proof file");
      }
    } catch (err) {
      console.error("Failed to open proof", err);
    }
  };
  void accessToken; // ensure component re-evaluates if auth changes

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6 w-full min-w-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between min-w-0">
        <div className="flex flex-col gap-2 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <History className="h-7 w-7 sm:h-8 sm:w-8 text-primary shrink-0" />
            Transaction History
          </h1>
          <p className="text-muted-foreground">
            Keep track of all your deposits, withdrawals and transfers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto min-w-0">
          <div className="relative w-full sm:flex-1 md:w-64 min-w-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by note..."
              className="pl-9 bg-background/50 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as typeof filter)}
          >
            <SelectTrigger className="w-full sm:w-32 bg-background/50 shrink-0">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdraw">Withdrawals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="glass-card border-none shadow-xl overflow-x-auto">
        <CardContent className="p-0 min-w-0">
          <Table className="min-w-[44rem]">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px]">Reference ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-40 text-center text-muted-foreground"
                  >
                    Loading transactions…
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-40 text-center text-muted-foreground"
                  >
                    No transactions found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono text-[10px] text-muted-foreground">
                      {tx.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tx.type === "deposit" ? (
                          <ArrowDownToLine className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ArrowUpFromLine className="h-4 w-4 text-rose-500" />
                        )}
                        <span className="capitalize font-medium">
                          {tx.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold tabular-nums">
                      {tx.type === "deposit" ? "+" : "-"}${formatUsd(tx.amount)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="uppercase text-[10px]"
                      >
                        {prettyMethod(tx.method)}
                      </Badge>
                      {tx.mt5Login ? (
                        <span className="ml-2 text-[10px] text-muted-foreground">
                          MT5 {tx.mt5Login}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.status === "completed"
                            ? "default"
                            : tx.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          tx.status === "completed"
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : ""
                        }
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.proofUrl ? (
                        <button
                          type="button"
                          onClick={() => void openProof(tx.proofUrl!)}
                          className="text-primary hover:underline text-xs font-medium"
                        >
                          View Receipt
                        </button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card/30 p-4 rounded-lg border border-border/50">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-bold text-foreground">
            {transactions.length}
          </span>{" "}
          of <span className="font-bold text-foreground">{total}</span>{" "}
          transactions
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="h-8 px-3"
          >
            Previous
          </Button>
          <div className="flex items-center justify-center px-3 h-8 rounded-md bg-primary/10 text-primary text-xs font-bold">
            Page {page} / {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages || loading}
            className="h-8 px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
