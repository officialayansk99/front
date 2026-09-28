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
import { Plus, Loader2, Trash2, Edit, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface Plan {
  id: string;
  planName: string;
  groupName: string;
  leverage: string;
  minDeposit: number;
  active: boolean;
  createdAt: string | null;
}

export default function PlansList() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);

  const [formData, setFormData] = useState({
    planName: "",
    groupName: "",
    leverage: "1:100",
    minDeposit: 100,
    active: true,
  });

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await http.get(
        `/admin/plans?page=${page}&limit=20&search=${search}`,
      );
      const items = Array.isArray(res.data.data)
        ? res.data.data
        : res.data.data?.items || [];
      setPlans(items);
      setTotal(res.data.meta?.total || items.length);
    } catch (err) {
      console.error("Failed to fetch plans", err);
      toast.error("Could not load plans");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editPlan) {
        await http.patch(`/admin/plans/${editPlan.id}`, formData);
        toast.success("Plan updated successfully");
      } else {
        await http.post("/admin/plans", formData);
        toast.success("Plan created successfully");
      }
      setOpen(false);
      setEditPlan(null);
      setFormData({
        planName: "",
        groupName: "",
        leverage: "1:100",
        minDeposit: 100,
        active: true,
      });
      fetchPlans();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditPlan(plan);
    setFormData({
      planName: plan.planName,
      groupName: plan.groupName,
      leverage: plan.leverage,
      minDeposit: plan.minDeposit,
      active: plan.active,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await http.delete(`/admin/plans/${id}`);
      toast.success("Plan deleted successfully");
      fetchPlans();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <div className="w-full min-w-0 p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Trading Plans
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your MT5 groups and trading conditions.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full min-w-0 lg:w-auto lg:max-w-xl">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plan or group..."
              className="pl-9 h-9 w-full bg-background/50 border-border/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              if (!val) {
                setEditPlan(null);
                setFormData({
                  planName: "",
                  groupName: "",
                  leverage: "1:100",
                  minDeposit: 100,
                  active: true,
                });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gradient-primary w-full sm:w-auto" size="sm">
                <Plus className="mr-2 h-4 w-4" /> New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editPlan ? "Edit Trading Plan" : "Create Trading Plan"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="planName">Plan Display Name</Label>
                    <Input
                      id="planName"
                      value={formData.planName}
                      onChange={(e) =>
                        setFormData({ ...formData, planName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="groupName">MT5 Group Name</Label>
                    <Input
                      id="groupName"
                      value={formData.groupName}
                      onChange={(e) =>
                        setFormData({ ...formData, groupName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="leverage">Leverage</Label>
                      <Input
                        id="leverage"
                        value={formData.leverage}
                        onChange={(e) =>
                          setFormData({ ...formData, leverage: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="minDeposit">Min Deposit ($)</Label>
                      <Input
                        id="minDeposit"
                        type="number"
                        value={formData.minDeposit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minDeposit: parseInt(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, active: checked as boolean })
                      }
                    />
                    <Label htmlFor="active">Active Plan</Label>
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
                    ) : editPlan ? (
                      "Update Plan"
                    ) : (
                      "Create Plan"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-xl overflow-x-auto bg-card/50 backdrop-blur-sm shadow-lg">
        <Table className="min-w-[44rem]">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Plan Name</TableHead>
              <TableHead className="font-bold">MT5 Group</TableHead>
              <TableHead className="font-bold">Leverage</TableHead>
              <TableHead className="font-bold">Min Deposit</TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading plans...
                </TableCell>
              </TableRow>
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  No trading plans defined yet.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow
                  key={plan.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-semibold text-primary">
                    {plan.planName}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {plan.groupName}
                  </TableCell>
                  <TableCell>{plan.leverage}</TableCell>
                  <TableCell className="font-medium">
                    ${plan.minDeposit}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${plan.active ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
                    >
                      {plan.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-6 bg-card/30 p-4 rounded-lg border border-border/50 min-w-0">
        <p className="text-xs text-muted-foreground min-w-0">
          Showing{" "}
          <span className="font-bold text-foreground">{plans.length}</span> of{" "}
          <span className="font-bold text-foreground">{total}</span> plans
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
            disabled={plans.length < 20}
            className="h-8 px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
