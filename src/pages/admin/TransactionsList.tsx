import React, { useCallback, useEffect, useMemo, useState } from "react";
import { http, getApiErrorMessage } from "@/shared/api/http";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  method?: string;
  note?: string;
  mt5Login?: number | null;
  /** Relative path to the authenticated proof stream (deposits only). */
  proofUrl?: string | null;
  userId: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string | null;
}

type FilterTab = "all" | "pending" | "withdraw" | "deposit";

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterTab>("pending");
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await http.get("/admin/transactions?limit=100&page=1");
      setTransactions(res.data.data ?? []);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filter === "pending") return tx.status === "pending";
      if (filter === "withdraw") return tx.type === "withdraw";
      if (filter === "deposit") return tx.type === "deposit";
      return true;
    });
  }, [transactions, filter]);

  const pendingCount = useMemo(
    () => transactions.filter((t) => t.status === "pending").length,
    [transactions],
  );

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await http.patch(`/admin/transactions/${id}/status`, { status });
      toast.success(
        status === "completed"
          ? "Marked completed — the client has been emailed."
          : "Marked rejected — the client has been emailed.",
      );
      void fetchTransactions();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  /**
   * Opens the deposit payment proof in a new tab. The endpoint requires
   * an Authorization header so we fetch as a blob and hand it off via a
   * one-shot blob URL — the same pattern used by the client funds history.
   */
  const handleViewProof = async (relPath: string) => {
    try {
      const res = await http.get(relPath, { responseType: "blob" });
      const blob = new Blob([res.data], {
        type: String(res.headers["content-type"] || "application/octet-stream"),
      });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank", "noopener,noreferrer");
      // Give the new tab a moment to read the blob, then revoke.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      if (!win) {
        URL.revokeObjectURL(url);
        toast.error("Please allow popups to view the proof file.");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const shortId = (id: string) => (id.length > 8 ? `${id.slice(0, 8)}…` : id);

  return (
    <div className="w-full min-w-0 p-4 sm:p-6 space-y-6">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl break-words">
          When a client requests a withdrawal or deposit, it appears here as{" "}
          <strong>pending</strong>. <strong>Approve</strong> sends the client an
          email using <code className="text-xs">WITHDRAW_UPDATE</code> or{" "}
          <code className="text-xs">DEPOSIT_UPDATE</code> from{" "}
          <strong>Admin → Email Templates</strong>. Placeholders:{" "}
          <code className="text-xs whitespace-nowrap">
            {"{NAME} {EMAIL} {AMOUNT} {TYPE} {STATUS}"}
          </code>
          .
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["pending", `Pending (${pendingCount})`],
            ["all", "All"],
            ["withdraw", "Withdrawals"],
            ["deposit", "Deposits"],
          ] as const
        ).map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={filter === key ? "default" : "outline"}
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="border rounded-md overflow-x-auto min-w-0">
        <Table className="min-w-[52rem]">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading…
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell
                    className="font-medium text-xs font-mono"
                    title={tx.id}
                  >
                    {shortId(tx.id)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {tx.userId ? (
                      <div>
                        <div className="font-medium">{tx.userId.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {tx.userId.email}
                        </div>
                      </div>
                    ) : (
                      "Unknown"
                    )}
                  </TableCell>
                  <TableCell className="capitalize">
                    {tx.type}
                    {tx.mt5Login ? (
                      <div className="text-[10px] text-muted-foreground font-mono">
                        MT5 {tx.mt5Login}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>${tx.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.status === "completed"
                          ? "default"
                          : tx.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {tx.proofUrl ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void handleViewProof(tx.proofUrl!)}
                        >
                          View Proof
                        </Button>
                      ) : null}
                      {tx.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() =>
                              void handleUpdateStatus(tx.id, "completed")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              void handleUpdateStatus(tx.id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No transactions in this view.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
