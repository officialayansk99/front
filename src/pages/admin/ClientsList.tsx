import React, { useEffect, useState } from "react";
import { http, getApiErrorMessage } from "@/shared/api/http";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Key,
  CreditCard,
  FileText,
  ExternalLink,
  UserCircle,
  Trash2,
  Loader2,
  UserPlus,
  Search,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { KycImagePreview } from "@/shared/components/KycImagePreview";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  kycStatus: string;
  idProofUrl?: string | null;
  addressProofUrl?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bankDetails?: any;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Client | null>(null);
  const [modalType, setModalType] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);

  // Form states
  const [passwordForm, setPasswordForm] = useState({ password: "" });
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    kycStatus: "",
  });
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("all");

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await http.get(
        `/admin/clients?page=${page}&limit=20&search=${search}&kycStatus=${kycFilter}`,
      );
      setClients(res.data.data);
      setTotal(res.data.meta?.total || 0);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, kycFilter]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleUpdateKycStatus = async (
    userId: string,
    newKycStatus: string,
  ) => {
    try {
      await http.patch(`/admin/users/${userId}`, { kycStatus: newKycStatus });
      toast.success("KYC Status updated successfully");
      fetchClients();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await http.put(`/admin/users/${selectedUser.id}/password`, passwordForm);
      toast.success("Password updated successfully");
      setModalType(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await http.patch(`/admin/users/${selectedUser.id}`, profileForm);
      toast.success("Profile updated successfully");
      setModalType(null);
      fetchClients();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await http.post("/admin/users", newUserForm);
      toast.success("User created successfully");
      setAddUserOpen(false);
      setNewUserForm({ name: "", email: "", password: "", phone: "" });
      fetchClients();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleImpersonate = async (userId: string) => {
    // Open the tab synchronously inside the click handler so popup blockers
    // don't trip on the post-await navigation. We aim it at a placeholder
    // route, then redirect once we have the one-time code.
    const child = window.open("about:blank", "_blank");
    if (!child) {
      toast.error("Please allow popups to use Auto-Login.");
      return;
    }
    try {
      const res = await http.post(`/admin/users/${userId}/impersonate`);
      const { code } = res.data.data ?? {};
      if (!code) throw new Error("Impersonation code missing in response");

      // The token is never put in the URL. The new tab will exchange this
      // single-use code for a real JWT and then route to the dashboard.
      child.location.replace(
        `/auth/impersonate?code=${encodeURIComponent(code)}`,
      );
      toast.success("Opening client portal in a new tab");
    } catch (err) {
      child.close();
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    )
      return;
    try {
      await http.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchClients();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.info("Preparing export...");
      // Fetch records for export (limited to 100 per backend validation)
      const res = await http.get(`/admin/clients?limit=100&search=${search}`);
      const allClients = res.data.data;

      if (allClients.length === 0) {
        toast.error("No data to export");
        return;
      }

      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "KYC Status",
        "Joined Date",
      ];
      const rows = allClients.map((c: Client) => [
        c.id,
        c.name,
        c.email,
        `"${c.phone || ""}"`,
        c.kycStatus,
        new Date(c.createdAt).toLocaleDateString(),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((r) => r.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `equiti-capitals-clients-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export successful!");
    } catch (err) {
      toast.error("Failed to export CSV");
      console.error(err);
    }
  };

  const openModal = (user: Client, type: string) => {
    setSelectedUser(user);
    setModalType(type);
    if (type === "profile") {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.status || "pending",
        kycStatus: user.kycStatus || "pending",
      });
    }
  };

  return (
    <div className="w-full min-w-0 p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between w-full min-w-0">
        <div className="min-w-0 shrink">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your clients and their account status.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full min-w-0 lg:w-auto lg:max-w-xl lg:shrink-0">
          <div className="relative w-full min-w-0 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email or phone..."
              className="pl-9 h-9 w-full bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="rounded-full border-primary/20 text-primary hover:bg-primary/10 transition-all font-bold px-4 sm:px-5 h-9 flex-1 min-w-[7rem] sm:flex-initial"
            >
              Export CSV
            </Button>
            <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="btn-brand h-9 flex-1 min-w-[7rem] sm:flex-initial">
                  <UserPlus className="mr-2 h-4 w-4 shrink-0" /> New User
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[calc(100vw-2rem)] max-w-lg">
                <form onSubmit={handleCreateUser}>
                  <DialogHeader>
                    <DialogTitle>Create New Client</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Full Name</Label>
                      <Input
                        required
                        value={newUserForm.name}
                        onChange={(e) =>
                          setNewUserForm({
                            ...newUserForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        required
                        value={newUserForm.email}
                        onChange={(e) =>
                          setNewUserForm({
                            ...newUserForm,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Phone</Label>
                      <Input
                        value={newUserForm.phone}
                        onChange={(e) =>
                          setNewUserForm({
                            ...newUserForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Password</Label>
                      <PasswordInput
                        required
                        value={newUserForm.password}
                        onChange={(e) =>
                          setNewUserForm({
                            ...newUserForm,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={updating}
                      className="w-full gradient-primary"
                    >
                      {updating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Account
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="border rounded-xl overflow-x-auto bg-card/50 backdrop-blur-sm shadow-lg">
        <Table className="min-w-[44rem]">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Client</TableHead>
              <TableHead className="font-bold text-center">
                <div className="flex items-center justify-center gap-2">
                  <span>KYC Status</span>
                  <Select value={kycFilter} onValueChange={setKycFilter}>
                    <SelectTrigger className="w-[24px] h-6 border-none bg-transparent hover:bg-muted p-0 flex items-center justify-center focus:ring-0 focus:ring-offset-0">
                      <Filter
                        className={cn(
                          "h-3 w-3",
                          kycFilter !== "all" && "text-primary fill-primary",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead className="font-bold">Joined</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow
                  key={client.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="max-w-[14rem] sm:max-w-none">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {client.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground break-words">
                          {client.name}
                        </div>
                        <div className="text-xs text-muted-foreground break-all">
                          {client.email}
                        </div>
                        {client.phone ? (
                          <div className="text-xs text-muted-foreground break-all">
                            {client.phone}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Select
                      defaultValue={client.kycStatus || "pending"}
                      onValueChange={(val) =>
                        handleUpdateKycStatus(client.id, val)
                      }
                    >
                      <SelectTrigger className="w-[120px] h-8 mx-auto text-[10px] font-bold uppercase">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>User Operations</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleImpersonate(client.id)}
                        >
                          <ExternalLink className="mr-2 h-4 w-4 text-blue-500" />
                          Auto-Login
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openModal(client, "profile")}
                        >
                          <UserCircle className="mr-2 h-4 w-4" />
                          Trader Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal(client, "password")}
                        >
                          <Key className="mr-2 h-4 w-4 text-amber-500" />
                          Change Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal(client, "bank")}
                        >
                          <CreditCard className="mr-2 h-4 w-4 text-emerald-500" />
                          Bank Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal(client, "kyc")}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          KYC Documents
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(client.id)}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-6 bg-card/30 p-4 rounded-lg border border-border/50 min-w-0">
        <p className="text-xs text-muted-foreground shrink min-w-0">
          Showing{" "}
          <span className="font-bold text-foreground">{clients.length}</span> of{" "}
          <span className="font-bold text-foreground">{total}</span> traders
        </p>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 px-3"
          >
            Previous
          </Button>
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary text-xs font-bold">
            {page}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={clients.length < 20}
            className="h-8 px-3"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Change Password Modal */}
      <Dialog
        open={modalType === "password"}
        onOpenChange={() => setModalType(null)}
      >
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[425px]">
          <form onSubmit={handlePasswordChange}>
            <DialogHeader>
              <DialogTitle>
                Change Password for {selectedUser?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-pass">New Password</Label>
                <PasswordInput
                  id="new-pass"
                  required
                  onChange={(e) =>
                    setPasswordForm({ password: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updating} className="w-full">
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Trader Profile Modal (Simplified) */}
      <Dialog
        open={modalType === "profile"}
        onOpenChange={() => setModalType(null)}
      >
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[min(550px,calc(100vw-2rem))] sm:max-w-[550px]">
          <form onSubmit={handleProfileUpdate}>
            <DialogHeader>
              <DialogTitle>Trader Profile: {selectedUser?.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input value={profileForm.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>KYC Status</Label>
                <Select
                  value={profileForm.kycStatus}
                  onValueChange={(val) =>
                    setProfileForm({ ...profileForm, kycStatus: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={updating}
                className="gradient-primary w-full"
              >
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bank Details Modal */}
      <Dialog
        open={modalType === "bank"}
        onOpenChange={() => setModalType(null)}
      >
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg">
          <DialogHeader>
            <DialogTitle>Bank Details: {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">
                  Account Name
                </p>
                <p className="font-semibold">
                  {selectedUser?.bankDetails?.accountName || "N/A"}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">
                  Bank Name
                </p>
                <p className="font-semibold">
                  {selectedUser?.bankDetails?.bankName || "N/A"}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">
                  Account Number
                </p>
                <p className="font-semibold">
                  {selectedUser?.bankDetails?.accountNumber || "N/A"}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">
                  IFSC / SWIFT
                </p>
                <p className="font-semibold">
                  {selectedUser?.bankDetails?.ifsc || "N/A"}
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Edit Bank Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* KYC documents */}
      <Dialog
        open={modalType === "kyc"}
        onOpenChange={() => setModalType(null)}
      >
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[min(48rem,calc(100vw-2rem))] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>KYC documents: {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">
                Identity proof
              </p>
              {selectedUser?.idProofUrl ? (
                <div className="rounded-xl border border-border/60 bg-muted/40 overflow-hidden">
                  <KycImagePreview
                    stored={selectedUser.idProofUrl}
                    alt={`Identity proof for ${selectedUser?.name ?? "client"}`}
                    className="w-full max-h-72 object-contain mx-auto block bg-black/10"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not uploaded yet
                </p>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">
                Address proof
              </p>
              {selectedUser?.addressProofUrl ? (
                <div className="rounded-xl border border-border/60 bg-muted/40 overflow-hidden">
                  <KycImagePreview
                    stored={selectedUser.addressProofUrl}
                    alt={`Address proof for ${selectedUser?.name ?? "client"}`}
                    className="w-full max-h-72 object-contain mx-auto block bg-black/10"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not uploaded yet
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              KYC review status:{" "}
              <span className="font-semibold text-foreground capitalize">
                {selectedUser?.kycStatus || "pending"}
              </span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
