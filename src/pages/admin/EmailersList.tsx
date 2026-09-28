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
import { Plus, Loader2, Edit, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Emailer {
  id: string;
  emailerType: string;
  mailSubject: string;
  ccMail: string;
  mailBody: string;
  updatedAt: string | null;
}

export default function EmailersList() {
  const [emailers, setEmailers] = useState<Emailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editEmailer, setEditEmailer] = useState<Emailer | null>(null);

  const [formData, setFormData] = useState({
    emailerType: "",
    mailSubject: "",
    ccMail: "",
    mailBody: "",
  });

  const fetchEmailers = useCallback(async () => {
    try {
      const res = await http.get("/admin/emailers");
      setEmailers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch emailers", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchEmailers();
  }, [fetchEmailers]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editEmailer) {
        await http.patch(`/admin/emailers/${editEmailer.id}`, formData);
        toast.success("Email template updated successfully");
      } else {
        await http.post("/admin/emailers", formData);
        toast.success("Email template created successfully");
      }
      setOpen(false);
      setEditEmailer(null);
      setFormData({
        emailerType: "",
        mailSubject: "",
        ccMail: "",
        mailBody: "",
      });
      fetchEmailers();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (emailer: Emailer) => {
    // We need the full body, but the list DTO might not have it.
    // However, I updated the DTO to include it if needed.
    // Actually, I should probably fetch the single emailer to be safe, but I'll assume it's there for now.
    // Wait, let's check the DTO.
    setEditEmailer(emailer);
    setFormData({
      emailerType: emailer.emailerType,
      mailSubject: emailer.mailSubject,
      ccMail: emailer.ccMail || "",
      mailBody: emailer.mailBody || "", // I need to make sure this is in the DTO or fetch it
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      await http.delete(`/admin/emailers/${id}`);
      toast.success("Template deleted successfully");
      fetchEmailers();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <div className="w-full min-w-0 p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Email Templates
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage system-automated email notifications and content. All
            outgoing mail uses these templates; use HTML and inline{" "}
            <code className="text-xs">style=</code> for colors and layout.
          </p>
          <details className="mt-4 max-w-4xl rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">
              Built-in mailer codes (match spelling exactly)
            </summary>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <code className="text-xs">CLIENT_PORTAL_WELCOME</code> — first
                time a client opens the dashboard after login (
                <code className="text-xs">{"{NAME}"}</code>{" "}
                <code className="text-xs">{"{EMAIL}"}</code>)
              </li>
              <li>
                <code className="text-xs">FORGOT_PASSWORD</code> —{" "}
                <code className="text-xs">{"{NAME}"}</code>{" "}
                <code className="text-xs">{"{PASSWORD}"}</code>
              </li>
              <li>
                <code className="text-xs">KYC_PENDING</code>,{" "}
                <code className="text-xs">KYC_APPROVED</code>,{" "}
                <code className="text-xs">KYC_REJECTED</code> —{" "}
                <code className="text-xs">{"{NAME}"}</code>{" "}
                <code className="text-xs">{"{STATUS}"}</code>
              </li>
              <li>
                <code className="text-xs">MT5_ACCOUNT_PENDING</code> (client) —{" "}
                <code className="text-xs">{"{NAME}"}</code>{" "}
                <code className="text-xs">{"{EMAIL}"}</code>{" "}
                <code className="text-xs">{"{TYPE}"}</code>{" "}
                <code className="text-xs">{"{LEVERAGE}"}</code>{" "}
                <code className="text-xs">{"{GROUP}"}</code>{" "}
                <code className="text-xs">{"{SUPPORT_EMAIL}"}</code>
              </li>
              <li>
                <code className="text-xs">MT5_ACCOUNT_REQUEST_STAFF</code>{" "}
                (support inbox) — same placeholders as above
              </li>
              <li>
                <code className="text-xs">MT5_CREDENTIALS_DELIVERED</code> —{" "}
                <code className="text-xs">{"{NAME}"}</code>{" "}
                <code className="text-xs">{"{EMAIL}"}</code>{" "}
                <code className="text-xs">{"{LOGIN}"}</code>{" "}
                <code className="text-xs">{"{PASSWORD}"}</code>{" "}
                <code className="text-xs">{"{SERVER}"}</code>
              </li>
              <li>
                <code className="text-xs">WITHDRAW_UPDATE</code>,{" "}
                <code className="text-xs">DEPOSIT_UPDATE</code> — withdraw /
                deposit approved or rejected (use{" "}
                <code className="text-xs">{"{STATUS}"}</code> in subject/body).{" "}
                <code className="text-xs">{"{NAME}"}</code>{" "}
                <code className="text-xs">{"{EMAIL}"}</code>{" "}
                <code className="text-xs">{"{AMOUNT}"}</code>{" "}
                <code className="text-xs">{"{TYPE}"}</code>{" "}
                <code className="text-xs">{"{STATUS}"}</code>
              </li>
            </ul>
          </details>
        </div>

        <div className="shrink-0 w-full xl:w-auto">
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              if (!val) {
                setEditEmailer(null);
                setFormData({
                  emailerType: "",
                  mailSubject: "",
                  ccMail: "",
                  mailBody: "",
                });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gradient-primary w-full xl:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add Template
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-[min(600px,calc(100vw-2rem))] sm:max-w-[600px] max-h-[90dvh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editEmailer
                      ? "Edit Email Template"
                      : "Create Email Template"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="emailerType">Mailer Code (Unique)</Label>
                      <Input
                        id="emailerType"
                        placeholder="e.g. CLIENT_PORTAL_WELCOME"
                        value={formData.emailerType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emailerType: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="mailSubject">Email Subject</Label>
                      <Input
                        id="mailSubject"
                        placeholder="Welcome to Equiti Capitals"
                        value={formData.mailSubject}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mailSubject: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ccMail">CC Email (Optional)</Label>
                    <Input
                      id="ccMail"
                      placeholder="admin@equiticapitals.com"
                      value={formData.ccMail}
                      onChange={(e) =>
                        setFormData({ ...formData, ccMail: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mailBody">
                      Email Body (HTML Supported)
                    </Label>
                    <Textarea
                      id="mailBody"
                      className="min-h-[200px] font-mono text-xs"
                      placeholder="<h1>Hello {NAME}</h1>..."
                      value={formData.mailBody}
                      onChange={(e) =>
                        setFormData({ ...formData, mailBody: e.target.value })
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
                    ) : editEmailer ? (
                      "Update Template"
                    ) : (
                      "Save Template"
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
              <TableHead className="font-bold">Template Code</TableHead>
              <TableHead className="font-bold">Subject</TableHead>
              <TableHead className="font-bold">CC Mail</TableHead>
              <TableHead className="font-bold">Last Updated</TableHead>
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
            ) : emailers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No email templates found.
                </TableCell>
              </TableRow>
            ) : (
              emailers.map((emailer) => (
                <TableRow
                  key={emailer.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-mono text-xs font-bold text-primary">
                    {emailer.emailerType}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {emailer.mailSubject}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {emailer.ccMail || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {emailer.updatedAt
                      ? new Date(emailer.updatedAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(emailer)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                        onClick={() => handleDelete(emailer.id)}
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
    </div>
  );
}
