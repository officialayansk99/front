import React, { useState, useEffect } from "react";
import { http, getApiErrorMessage } from "@/shared/api/http";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Wallet,
  ArrowUpFromLine,
  AlertCircle,
  Loader2,
  Landmark,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bankDetails?: any;
}

function formatUsd(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function Withdrawal() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, balRes] = await Promise.all([
          http.get("/users/me"),
          http.get("/transactions/mine/available-balance"),
        ]);
        setUser(meRes.data.data);
        const available = balRes.data.data?.available;
        setTotalBalance(typeof available === "number" ? available : 0);
      } catch (err) {
        console.error("Failed to fetch withdrawal page data", err);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!amount || !Number.isFinite(value) || value <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (value < 10) {
      toast.error("Minimum withdrawal is $10.00");
      return;
    }
    if (totalBalance != null && value > totalBalance + 1e-6) {
      toast.error(
        `Amount exceeds your available balance of ${formatUsd(totalBalance)}.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      await http.post("/transactions/withdraw", { amount: value });
      toast.success(
        "Withdrawal request submitted! Our team will process it within 24 hours.",
      );
      setAmount("");
      // Refresh available balance to reflect the now-pending withdrawal.
      try {
        const refreshed = await http.get(
          "/transactions/mine/available-balance",
        );
        const next = refreshed.data.data?.available;
        if (typeof next === "number") setTotalBalance(next);
      } catch {
        /* non-fatal */
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="p-4 sm:p-6">Loading withdrawal interface...</div>;

  const hasBankDetails = user?.bankDetails && user.bankDetails.accountNumber;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8 w-full min-w-0">
      <div className="flex flex-col gap-2 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Withdraw Funds
        </h1>
        <p className="text-muted-foreground">
          Transfer your trading profits directly to your bank account.
        </p>
      </div>

      {!hasBankDetails && (
        <Alert
          variant="destructive"
          className="bg-rose-500/10 border-rose-500/20 text-rose-500"
        >
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-bold">Bank Details Missing</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-2">
            <span className="min-w-0">
              You must add your bank account information before you can request
              a withdrawal.
            </span>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-rose-500/50 hover:bg-rose-500/10 shrink-0 w-full sm:w-auto"
            >
              <Link to="/profile">
                Add Details <ArrowRight size={14} className="ml-2" />
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-w-0">
        <div className="space-y-6 min-w-0">
          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
              <CardDescription>
                Withdrawals are processed in USD and converted to your local
                currency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount to Withdraw (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-7 bg-background/50"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={!hasBankDetails}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                      Minimum Withdrawal: $10.00
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Wallet size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">
                          Available Balance
                        </p>
                        <p className="text-xl font-bold">
                          {totalBalance === null
                            ? "—"
                            : formatUsd(totalBalance)}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                          Matches your dashboard total balance (all MT5 accounts
                          in the portal).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={
                    submitting ||
                    !hasBankDetails ||
                    !amount ||
                    !Number.isFinite(parseFloat(amount)) ||
                    parseFloat(amount) <= 0 ||
                    (totalBalance != null &&
                      parseFloat(amount) > totalBalance + 1e-6)
                  }
                  className="w-full h-12 text-lg font-bold gradient-primary shadow-lg shadow-primary/20"
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <ArrowUpFromLine className="mr-2 h-5 w-5" />
                  )}
                  Confirm Withdrawal
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 min-w-0">
          <Card className="glass-card border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Landmark size={16} className="text-primary" />
                Receiving Bank Account
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {hasBankDetails ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">
                      Account Name
                    </p>
                    <p className="font-semibold break-words">
                      {user.bankDetails.accountName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">
                      Bank Name
                    </p>
                    <p className="font-semibold break-words">
                      {user.bankDetails.bankName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">
                      Account Number
                    </p>
                    <p className="font-mono text-sm tracking-widest">
                      {user.bankDetails.accountNumber.replace(
                        /.(?=.{4})/g,
                        "*",
                      )}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-primary p-0 h-auto hover:bg-transparent hover:underline"
                    >
                      <Link to="/profile">Edit Bank Details</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <Landmark size={24} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No bank account linked.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-emerald-500">
                    Secure Processing
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    All withdrawals are reviewed by our financial team for
                    security. Processing time is usually within 24 business
                    hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
