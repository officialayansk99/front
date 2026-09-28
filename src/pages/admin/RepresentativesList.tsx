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
import { Button } from "@/components/ui/button";
import {
  Loader2,
  UserPlus,
  Mail,
  ShieldCheck,
  Trash2,
  KeyRound,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Representative {
  id: string;
  name: string;
  email: string;
  createdAt: string | null;
}

export default function RepresentativesList() {
  const [reps, setReps] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedRep, setSelectedRep] = useState<Representative | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchReps = useCallback(async () => {
    try {
      const res = await http.get("/admin/representatives");
      setReps(res.data.data);
    } catch (err) {
      console.error("Failed to fetch representatives", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchReps();
  }, [fetchReps]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await http.post("/admin/representatives", formData);
      toast.success("Representative created successfully");
      setOpen(false);
      setFormData({ name: "", email: "", password: "" });
      fetchReps();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (repId: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this representative? This action cannot be undone.",
      )
    )
      return;
    try {
      await http.delete(`/admin/users/${repId}`);
      toast.success("Representative removed successfully");
      fetchReps();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRep) return;
    setUpdatingPassword(true);
    try {
      await http.put(`/admin/users/${selectedRep.id}/password`, {
        password: newPassword,
      });
      toast.success("Password updated successfully");
      setPasswordModalOpen(false);
      setNewPassword("");
      setSelectedRep(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="w-full min-w-0 p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            System Representatives
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage administrative executives and support representatives.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary w-full lg:w-auto shrink-0">
              <UserPlus className="mr-2 h-4 w-4" /> Add Representative
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add System Representative</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@equiticapitals.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Login Password</Label>
                  <PasswordInput
                    id="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full gradient-primary"
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Register Representative"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-xl overflow-x-auto bg-card/50 backdrop-blur-sm shadow-lg">
        <Table className="min-w-[40rem]">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Representative</TableHead>
              <TableHead className="font-bold">Contact</TableHead>
              <TableHead className="font-bold">Account Status</TableHead>
              <TableHead className="font-bold">Joining Date</TableHead>
              <TableHead className="font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading staff...
                </TableCell>
              </TableRow>
            ) : reps.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No representatives registered yet.
                </TableCell>
              </TableRow>
            ) : (
              reps.map((rep) => (
                <TableRow
                  key={rep.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {rep.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold">{rep.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[12rem] sm:max-w-none">
                    <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                      <Mail size={14} className="shrink-0" />
                      <span className="break-all">{rep.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-emerald-500 font-medium text-xs">
                      <ShieldCheck size={14} />
                      Verified Representative
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(rep.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="Change Password"
                        onClick={() => {
                          setSelectedRep(rep);
                          setPasswordModalOpen(true);
                        }}
                      >
                        <KeyRound size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Delete Representative"
                        onClick={() => handleDelete(rep.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[425px]">
          <form onSubmit={handlePasswordChange}>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <PasswordInput
                  id="new-password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={updatingPassword}
                className="w-full gradient-primary"
              >
                {updatingPassword ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
