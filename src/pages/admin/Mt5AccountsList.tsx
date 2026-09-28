import React, { useCallback, useEffect, useState } from "react";
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
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Loader2,
  Link2,
  MoreVertical,
  Pencil,
  Wallet,
  Trash2,
} from "lucide-react";

interface Mt5Account {
  id: string;
  login: number;
  type: string;
  server: string;
  leverage: number;
  group: string;
  balance: number;
  equity: number;
  userId: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string | null;
}

interface ClientOption {
  id: string;
  name: string;
  email: string;
}

const emptyEditForm = {
  type: "demo" as "demo" | "live",
  server: "",
  leverage: "100",
  group: "",
  balance: "",
  equity: "",
};

export default function Mt5AccountsList() {
  const [accounts, setAccounts] = useState<Mt5Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Mt5Account | null>(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editSaving, setEditSaving] = useState(false);

  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState<Mt5Account | null>(null);
  const [crmBalanceInput, setCrmBalanceInput] = useState("");
  const [adjustSaving, setAdjustSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Mt5Account | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    login: "",
    type: "demo" as "demo" | "live",
    server: "",
    leverage: "100",
    group: "",
    masterPassword: "",
    investorPassword: "",
    sendCredentialsEmail: true,
  });

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await http.get("/admin/mt5-accounts?limit=100&page=1");
      setAccounts(res.data.data ?? []);
    } catch (err) {
      console.error("Failed to fetch MT5 accounts", err);
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const loadClients = useCallback(async () => {
    setLoadingClients(true);
    try {
      const res = await http.get("/admin/clients?limit=100&page=1");
      const rows = (res.data.data ?? []) as ClientOption[];
      setClients(
        rows.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
        })),
      );
    } catch (err) {
      console.error("Failed to load clients", err);
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoadingClients(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (dialogOpen) {
      void loadClients();
    }
  }, [dialogOpen, loadClients]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const resetForm = () => {
    setForm({
      userId: "",
      login: "",
      type: "demo",
      server: "",
      leverage: "100",
      group: "",
      masterPassword: "",
      investorPassword: "",
      sendCredentialsEmail: true,
    });
  };

  const openEdit = (acc: Mt5Account) => {
    setEditing(acc);
    setEditForm({
      type: acc.type === "live" ? "live" : "demo",
      server: acc.server || "",
      leverage: String(acc.leverage ?? 100),
      group: acc.group || "",
      balance: String(acc.balance ?? 0),
      equity: String(acc.equity ?? 0),
    });
    setEditOpen(true);
  };

  const openAdjust = (acc: Mt5Account) => {
    setAdjustTarget(acc);
    setCrmBalanceInput(String(acc.balance ?? 0));
    setAdjustOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const lev = parseInt(editForm.leverage, 10);
    if (!Number.isFinite(lev) || lev < 1) {
      toast.error("Enter valid leverage.");
      return;
    }
    const bal = parseFloat(editForm.balance);
    const eq = parseFloat(editForm.equity);
    if (!Number.isFinite(bal) || bal < 0 || !Number.isFinite(eq) || eq < 0) {
      toast.error("Balance and equity must be valid non‑negative numbers.");
      return;
    }

    setEditSaving(true);
    try {
      await http.patch(`/admin/mt5-accounts/${editing.id}`, {
        type: editForm.type,
        server: editForm.server.trim(),
        leverage: lev,
        group: editForm.group.trim(),
        balance: bal,
        equity: eq,
      });
      toast.success("MT5 account updated.");
      setEditOpen(false);
      setEditing(null);
      await fetchAccounts();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setEditSaving(false);
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTarget) return;
    const amt = parseFloat(crmBalanceInput);
    if (!Number.isFinite(amt) || amt < 0) {
      toast.error("Enter a valid balance (0 or greater).");
      return;
    }

    setAdjustSaving(true);
    try {
      await http.patch(`/admin/mt5-accounts/${adjustTarget.id}`, {
        balance: amt,
        equity: amt,
      });
      toast.success("CRM balance set.");
      setAdjustOpen(false);
      setAdjustTarget(null);
      await fetchAccounts();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setAdjustSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await http.delete(`/admin/mt5-accounts/${deleteTarget.id}`);
      toast.success("MT5 account removed.");
      setDeleteTarget(null);
      await fetchAccounts();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userId) {
      toast.error("Select a client.");
      return;
    }
    const loginNum = Number(form.login);
    if (!Number.isFinite(loginNum) || loginNum <= 0) {
      toast.error("Enter a valid MT5 login (number).");
      return;
    }
    const lev = parseInt(form.leverage, 10);
    if (!Number.isFinite(lev) || lev < 1) {
      toast.error("Enter valid leverage.");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        userId: form.userId,
        login: loginNum,
        type: form.type,
        server: form.server.trim(),
        leverage: lev,
        group: form.group.trim(),
        sendCredentialsEmail: form.sendCredentialsEmail,
      };
      if (form.sendCredentialsEmail) {
        body.masterPassword = form.masterPassword;
      }
      if (form.investorPassword.trim()) {
        body.investorPassword = form.investorPassword.trim();
      }

      const res = await http.post("/admin/mt5-accounts", body);
      toast.success(res.data?.message ?? "MT5 account linked.");
      setDialogOpen(false);
      resetForm();
      await fetchAccounts();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-w-0 p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold">MT5 Accounts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Balance and equity here are stored in the CRM for display and admin
            adjustments; they do not sync automatically with MetaTrader.
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Link2 className="h-4 w-4 mr-2" />
              Link manual MT5 account
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Link MT5 account to client</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Use this after you create the login in MT5 Manager. The master
                password is emailed only; it is not stored in the database.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Client</Label>
                {loadingClients ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading clients…
                  </div>
                ) : (
                  <Select
                    value={form.userId || undefined}
                    onValueChange={(v) => setForm((f) => ({ ...f, userId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose client" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto">
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="mt5-login">Login</Label>
                  <Input
                    id="mt5-login"
                    inputMode="numeric"
                    value={form.login}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, login: e.target.value }))
                    }
                    placeholder="e.g. 12345678"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v: "demo" | "live") =>
                      setForm((f) => ({ ...f, type: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demo">demo</SelectItem>
                      <SelectItem value="live">live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mt5-server">Server</Label>
                <Input
                  id="mt5-server"
                  value={form.server}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, server: e.target.value }))
                  }
                  placeholder="BrokerServer-Demo"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="mt5-lev">Leverage (1:)</Label>
                  <Input
                    id="mt5-lev"
                    inputMode="numeric"
                    value={form.leverage}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, leverage: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mt5-group">Group</Label>
                  <Input
                    id="mt5-group"
                    value={form.group}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, group: e.target.value }))
                    }
                    placeholder="group\\demoforex"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mt5-inv">Investor password (optional)</Label>
                <PasswordInput
                  id="mt5-inv"
                  autoComplete="new-password"
                  value={form.investorPassword}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      investorPassword: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Stored on the account record for admin reference only.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-email"
                  checked={form.sendCredentialsEmail}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({
                      ...f,
                      sendCredentialsEmail: checked === true,
                      ...(checked !== true ? { masterPassword: "" } : {}),
                    }))
                  }
                />
                <Label htmlFor="send-email" className="font-normal">
                  Email client master password and server
                </Label>
              </div>

              {form.sendCredentialsEmail && (
                <div className="space-y-2">
                  <Label htmlFor="mt5-master">Master password</Label>
                  <PasswordInput
                    id="mt5-master"
                    autoComplete="new-password"
                    value={form.masterPassword}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        masterPassword: e.target.value,
                      }))
                    }
                    required={form.sendCredentialsEmail}
                    minLength={6}
                  />
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving || loadingClients}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save & link"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit MT5 account</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Login ID and linked client cannot be changed here. Use{" "}
              <strong>Set balance</strong> for a single CRM total, or set
              balance and equity separately below.
            </p>
          </DialogHeader>
          {editing && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                Login {editing.login}
                {editing.userId ? ` · ${editing.userId.email}` : null}
              </p>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={editForm.type}
                  onValueChange={(v: "demo" | "live") =>
                    setEditForm((f) => ({ ...f, type: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">demo</SelectItem>
                    <SelectItem value="live">live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ed-server">Server</Label>
                <Input
                  id="ed-server"
                  value={editForm.server}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, server: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="ed-lev">Leverage</Label>
                  <Input
                    id="ed-lev"
                    inputMode="numeric"
                    value={editForm.leverage}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, leverage: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ed-group">Group</Label>
                  <Input
                    id="ed-group"
                    value={editForm.group}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, group: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="ed-bal">CRM balance</Label>
                  <Input
                    id="ed-bal"
                    inputMode="decimal"
                    value={editForm.balance}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, balance: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ed-eq">CRM equity</Label>
                  <Input
                    id="ed-eq"
                    inputMode="decimal"
                    value={editForm.equity}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, equity: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={editSaving}>
                  {editSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Set CRM balance</DialogTitle>
            <DialogDescription className="text-left">
              {adjustTarget ? (
                <>
                  The value you enter becomes the stored{" "}
                  <strong>balance</strong> and <strong>equity</strong> (it does{" "}
                  <strong>not</strong> add to the current total). Previously: $
                  {adjustTarget.balance?.toFixed(2) ?? "0.00"}.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="set-bal">Balance & equity (USD)</Label>
              <Input
                id="set-bal"
                inputMode="decimal"
                value={crmBalanceInput}
                onChange={(e) => setCrmBalanceInput(e.target.value)}
                placeholder="e.g. 5000"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdjustOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={adjustSaving}>
                {adjustSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove MT5 account?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes the CRM record and unlinks it from the client. It
              does not delete the login in MetaTrader.
              {deleteTarget ? (
                <span className="block mt-2 font-mono">
                  Login {deleteTarget.login}
                </span>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="border rounded-md overflow-x-auto min-w-0">
        {loading ? (
          <div className="flex justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table className="min-w-[52rem]">
            <TableHeader>
              <TableRow>
                <TableHead>Login ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Server</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Equity</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[52px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((acc) => (
                <TableRow key={acc.id}>
                  <TableCell className="font-medium">{acc.login}</TableCell>
                  <TableCell className="min-w-0">
                    {acc.userId ? (
                      <div className="min-w-0">
                        <div className="font-medium break-words">
                          {acc.userId.name}
                        </div>
                        <div className="text-xs text-muted-foreground break-all">
                          {acc.userId.email}
                        </div>
                      </div>
                    ) : (
                      "Unknown"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={acc.type === "live" ? "default" : "secondary"}
                    >
                      {acc.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[140px] truncate text-sm">
                    {acc.server || "—"}
                  </TableCell>
                  <TableCell>${acc.balance?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>${acc.equity?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>
                    {acc.createdAt
                      ? new Date(acc.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(acc)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openAdjust(acc)}>
                          <Wallet className="h-4 w-4 mr-2" />
                          Set balance
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(acc)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove from CRM
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {accounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No MT5 accounts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
