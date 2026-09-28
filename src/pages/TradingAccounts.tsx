import React, { useState, useEffect } from "react";
import { http, getApiErrorMessage } from "@/shared/api/http";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  RefreshCcw,
  Shield,
  Copy,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  fetchMt5Provisioning,
  type Mt5Provisioning,
} from "@/shared/mt5Provisioning";

interface Mt5Account {
  id: string;
  login: number;
  type: string;
  balance?: number;
  equity?: number;
  userId: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string | null;
  openTrades?: number;
  group?: string;
  leverage?: string | number;
}

interface TradingPlan {
  id: string;
  planName: string;
  groupName: string;
  leverage: string;
  minDeposit: number;
  active: boolean;
}

export default function TradingAccounts() {
  const [accounts, setAccounts] = useState<Mt5Account[]>([]);
  const [plans, setPlans] = useState<TradingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mt5Provisioning, setMt5Provisioning] =
    useState<Mt5Provisioning | null>(null);
  const provisioningReady = mt5Provisioning !== null;
  const manualMt5 = provisioningReady && !mt5Provisioning.automationEnabled;

  const [newAccount, setNewAccount] = useState({
    type: "live",
    accountType: "",
    leverage: "100",
    group: "",
  });

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await http.get("/mt5-accounts/mine");
      setAccounts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await http.get("/mt5-accounts/plans");
      const fetchedPlans = res.data.data;
      setPlans(fetchedPlans);
      if (fetchedPlans.length > 0) {
        setNewAccount((prev) => ({
          ...prev,
          accountType: fetchedPlans[0].id,
          group: fetchedPlans[0].groupName,
          leverage: fetchedPlans[0].leverage.replace("1:", ""),
        }));
      }
    } catch (err) {
      console.error("Failed to fetch plans", err);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchMt5Provisioning()
      .then(setMt5Provisioning)
      .catch(() =>
        setMt5Provisioning({ automationEnabled: true, supportEmail: null }),
      );
  }, []);

  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleCreateAccount = async () => {
    setSubmitting(true);
    try {
      const res = await http.post("/mt5-accounts/mine", {
        type: newAccount.type,
        leverage: parseInt(newAccount.leverage),
        group: newAccount.group,
      });
      const data = res.data.data as { pending?: boolean };
      toast.success(
        res.data.message ||
          (data?.pending
            ? "Check your email — your account will be created shortly."
            : "New MT5 account created successfully!"),
      );
      setIsModalOpen(false);
      if (!data?.pending) {
        fetchAccounts();
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Account number copied!");
  };

  if (loading && accounts.length === 0)
    return <div className="p-4 sm:p-6">Loading trading accounts...</div>;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 w-full min-w-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
        <div className="flex flex-col gap-2 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Trading Accounts
          </h1>
          <p className="text-muted-foreground">
            Manage your MT5 accounts, leverage, and balances.
          </p>
          {manualMt5 && (
            <p className="text-sm text-muted-foreground max-w-2xl">
              After you submit a request, we email you from our desk to confirm.
              Your MT5 login is created by our team and you will receive another
              message when it is ready.
            </p>
          )}
        </div>
        {!provisioningReady ? (
          <Button disabled className="h-11 px-6 gap-2 w-full md:w-auto">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </Button>
        ) : (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gradient-primary shadow-lg shadow-primary/20 gap-2 h-11 px-6 w-full md:w-auto shrink-0"
          >
            <Plus size={18} /> Open Live Account
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {accounts.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/20 py-12">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Users size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold">No accounts found</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {manualMt5
                    ? "Submit a live account request — you will get a confirmation email right away, then your login once we finish setup."
                    : "You haven't opened any trading accounts yet. Get started by creating one now."}
                </p>
              </div>
              {!provisioningReady ? (
                <Button disabled variant="outline">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
                </Button>
              ) : (
                <Button onClick={() => setIsModalOpen(true)} variant="outline">
                  Create My First Account
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          accounts.map((acc) => (
            <Card
              key={acc.login}
              className="glass-card border-none shadow-lg overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="uppercase text-[10px] tracking-widest font-bold"
                      >
                        {acc.type} Account
                      </Badge>
                      <button
                        onClick={() => copyToClipboard(String(acc.login))}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold font-mono tracking-tight">
                        {acc.login}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {acc.group}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-500">
                      <Shield size={12} /> MT5 Secure Server
                    </div>
                  </div>

                  <div className="p-6 bg-muted/30">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                          Total Balance
                        </p>
                        <p className="text-2xl font-bold">
                          {typeof acc.balance === "number"
                            ? `$${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : "—"}
                        </p>
                        {manualMt5 && (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {typeof acc.balance === "number"
                              ? "Portal balance from your account profile; live totals may differ in MT5."
                              : "Live totals are shown in your MT5 terminal."}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                            Equity
                          </p>
                          <p className="text-sm font-semibold">
                            {typeof acc.equity === "number"
                              ? `$${acc.equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                            Leverage
                          </p>
                          <p className="text-sm font-semibold">
                            1:{acc.leverage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[425px] max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Open Live Account</DialogTitle>
            <DialogDescription>
              {manualMt5
                ? "Submit your preferences. We will email you to confirm and send your MT5 login when the account is ready."
                : "Configure your new MT5 trading account below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>Platform</Label>
              <Input value="MetaTrader 5 (MT5)" disabled className="bg-muted" />
            </div>
            <div className="grid gap-2">
              <Label>Account Type</Label>
              <Select
                value={newAccount.accountType}
                onValueChange={(v) => {
                  const plan = plans.find((p) => p.id === v);
                  if (plan) {
                    setNewAccount({
                      ...newAccount,
                      accountType: v,
                      group: plan.groupName,
                      leverage: plan.leverage.replace("1:", ""),
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.planName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Leverage</Label>
              <Select
                value={newAccount.leverage}
                onValueChange={(v) =>
                  setNewAccount({ ...newAccount, leverage: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">1:100</SelectItem>
                  <SelectItem value="200">1:200</SelectItem>
                  <SelectItem value="400">1:400</SelectItem>
                  <SelectItem value="500">1:500</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateAccount}
              disabled={submitting}
              className="w-full gradient-primary"
            >
              {submitting ? (
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Create Live Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
