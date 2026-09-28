import React, { useEffect, useState, useCallback, useRef } from "react";
import { http, getApiErrorMessage } from "@/shared/api/http";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save, Landmark, Upload, Trash2 } from "lucide-react";
import { DepositQrImage } from "@/shared/components/DepositQrImage";

export default function DepositInstructionsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrBusy, setQrBusy] = useState(false);
  const [qrCodeImagePath, setQrCodeImagePath] = useState<string | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    beneficiaryName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    qrCodeUrl: "",
    qrHelpText: "",
  });

  const load = useCallback(async () => {
    const res = await http.get("/admin/deposit-settings");
    const d = res.data?.data;
    if (d) {
      setForm({
        beneficiaryName: d.beneficiaryName ?? "",
        bankName: d.bankName ?? "",
        accountNumber: d.accountNumber ?? "",
        ifscCode: d.ifscCode ?? "",
        qrCodeUrl: d.qrCodeUrl ?? "",
        qrHelpText: d.qrHelpText ?? "",
      });
      setQrCodeImagePath(d.qrCodeImagePath ?? null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await load();
      } catch (err) {
        console.error(err);
        toast.error(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await http.patch("/admin/deposit-settings", form);
      toast.success("Deposit bank details and QR settings saved");
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onQrFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setQrBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await http.post("/admin/deposit-settings/qr", fd);
      toast.success(
        "QR image stored (GridFS). Clients will see it on Deposit.",
      );
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setQrBusy(false);
    }
  };

  const removeStoredQr = async () => {
    setQrBusy(true);
    try {
      await http.delete("/admin/deposit-settings/qr");
      toast.success("Stored QR image removed");
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setQrBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full min-w-0">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 flex-wrap">
          <Landmark className="h-8 w-8 text-primary" />
          Deposit instructions
        </h1>
        <p className="text-muted-foreground">
          Bank details and QR for the client Deposit page. Upload a QR image
          (stored in MongoDB GridFS) or paste a public HTTPS image URL—uploaded
          file takes priority for clients.
        </p>
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Client-facing payment details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="beneficiaryName">Beneficiary name</Label>
                <Input
                  id="beneficiaryName"
                  value={form.beneficiaryName}
                  onChange={(e) =>
                    setForm({ ...form, beneficiaryName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank name</Label>
                <Input
                  id="bankName"
                  value={form.bankName}
                  onChange={(e) =>
                    setForm({ ...form, bankName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC code</Label>
                <Input
                  id="ifscCode"
                  value={form.ifscCode}
                  onChange={(e) =>
                    setForm({ ...form, ifscCode: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="accountNumber">Account number</Label>
                <Input
                  id="accountNumber"
                  className="font-mono"
                  value={form.accountNumber}
                  onChange={(e) =>
                    setForm({ ...form, accountNumber: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3 md:col-span-2 rounded-lg border bg-muted/20 p-4">
                <Label>QR code image (GridFS)</Label>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, or WebP — max 2 MB. Replaces any previous uploaded
                  QR and clears the URL field for display priority.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={qrBusy}
                    className="gap-2"
                    onClick={() => qrInputRef.current?.click()}
                  >
                    {qrBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload QR
                  </Button>
                  <input
                    ref={qrInputRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onQrFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={qrBusy || !qrCodeImagePath}
                    onClick={() => void removeStoredQr()}
                    className="gap-2 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove stored QR
                  </Button>
                </div>
                <div className="rounded-lg border bg-background/50 p-4 inline-block mt-2">
                  {qrCodeImagePath ||
                  form.qrCodeUrl?.trim().startsWith("http") ? (
                    <DepositQrImage
                      gridPath={qrCodeImagePath}
                      fallbackUrl={form.qrCodeUrl}
                      className="max-h-40 w-auto object-contain mx-auto"
                      alt="QR preview"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No QR preview yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="qrCodeUrl">
                  QR image URL (optional fallback)
                </Label>
                <Input
                  id="qrCodeUrl"
                  type="url"
                  placeholder="https://…"
                  value={form.qrCodeUrl}
                  onChange={(e) =>
                    setForm({ ...form, qrCodeUrl: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="qrHelpText">QR / UPI help text</Label>
                <Textarea
                  id="qrHelpText"
                  rows={3}
                  value={form.qrHelpText}
                  onChange={(e) =>
                    setForm({ ...form, qrHelpText: e.target.value })
                  }
                />
              </div>
            </div>
            <Button type="submit" disabled={saving} className="min-w-[140px]">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
