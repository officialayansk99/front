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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  Landmark,
  QrCode,
  Upload,
  Info,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchMt5Provisioning,
  type Mt5Provisioning,
} from "@/shared/mt5Provisioning";
import { DepositQrImage } from "@/shared/components/DepositQrImage";

export interface DepositInstructions {
  beneficiaryName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  qrCodeUrl: string;
  qrHelpText: string;
  qrCodeImagePath: string | null;
}

const DEPOSIT_INSTRUCTIONS_FALLBACK: DepositInstructions = {
  beneficiaryName: "SNAP CINE DIGITAL",
  bankName: "ICICI BANK LTD",
  accountNumber: "000705051065",
  ifscCode: "ICIC0000007",
  qrCodeUrl: "",
  qrHelpText: "Scan the QR code above to pay via UPI, PhonePe, or Google Pay.",
  qrCodeImagePath: null,
};

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

interface Mt5Account {
  id: string;
  login: number;
  type: string;
  group?: string;
}

export default function Deposit() {
  const [accounts, setAccounts] = useState<Mt5Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mt5Provisioning, setMt5Provisioning] =
    useState<Mt5Provisioning | null>(null);

  const [formData, setFormData] = useState({
    accountId: "",
    amount: "",
    method: "bank_transfer",
    note: "",
  });
  const [proofFile, setProofFile] = useState<File | null>(null);

  const [depositInstructions, setDepositInstructions] =
    useState<DepositInstructions>(DEPOSIT_INSTRUCTIONS_FALLBACK);

  const [usdInr, setUsdInr] = useState<{
    rate: number | null;
    asOfDate: string | null;
    unavailable?: boolean;
  } | null>(null);

  const presetAmounts = [100, 200, 300, 500, 1000, 2000];

  useEffect(() => {
    fetchMt5Provisioning()
      .then(setMt5Provisioning)
      .catch(() =>
        setMt5Provisioning({ automationEnabled: true, supportEmail: null }),
      );
  }, []);

  useEffect(() => {
    const loadInstructions = async () => {
      try {
        const res = await http.get("/transactions/deposit-instructions");
        const d = res.data?.data;
        if (d) {
          setDepositInstructions({
            ...DEPOSIT_INSTRUCTIONS_FALLBACK,
            ...d,
          });
        }
      } catch {
        /* keep fallback */
      }
    };
    void loadInstructions();
  }, []);

  useEffect(() => {
    const loadFx = async () => {
      try {
        const res = await http.get("/transactions/fx/usd-inr");
        const d = res.data?.data;
        if (d) {
          setUsdInr({
            rate: typeof d.rate === "number" ? d.rate : null,
            asOfDate: d.asOfDate ?? null,
            unavailable: Boolean(d.unavailable),
          });
        }
      } catch {
        setUsdInr({
          rate: null,
          asOfDate: null,
          unavailable: true,
        });
      }
    };
    void loadFx();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await http.get("/mt5-accounts/mine");
        setAccounts(res.data.data);
        if (res.data.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            accountId: String(res.data.data[0].login),
          }));
        }
      } catch (err) {
        console.error("Failed to fetch accounts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(formData.amount) < 100) {
      toast.error("Minimum deposit is $100");
      return;
    }
    if (!formData.accountId) {
      toast.error("Please select a trading account");
      return;
    }
    if (!proofFile) {
      toast.error("Please attach your payment proof");
      return;
    }

    setSubmitting(true);
    try {
      // Real multipart upload — server stores the proof in GridFS and ties it
      // to the transaction. No more dummy URLs.
      const fd = new FormData();
      fd.append("amount", String(parseFloat(formData.amount)));
      fd.append("method", formData.method);
      fd.append("mt5Login", formData.accountId);
      fd.append("note", formData.note);
      fd.append("file", proofFile);

      await http.post("/transactions/deposit", fd);
      toast.success(
        "Deposit request submitted successfully! Our team will review your payment slip.",
      );
      setFormData((prev) => ({ ...prev, amount: "", note: "" }));
      setProofFile(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("File must be 4MB or smaller");
      return;
    }
    const okTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!okTypes.includes(file.type)) {
      toast.error("Upload a JPG, PNG, WebP image or a PDF");
      return;
    }
    setProofFile(file);
  };

  if (loading)
    return <div className="p-4 sm:p-6">Loading deposit interface...</div>;

  const manualMt5 =
    mt5Provisioning !== null && !mt5Provisioning.automationEnabled;

  const usdAmountNum = parseFloat(formData.amount);
  const hasPositiveUsd =
    formData.amount !== "" && Number.isFinite(usdAmountNum) && usdAmountNum > 0;
  const inrEstimate =
    usdInr?.rate != null && hasPositiveUsd ? usdAmountNum * usdInr.rate : null;
  const fxPending = usdInr === null;
  const fxMissingRate =
    usdInr != null && (usdInr.rate == null || usdInr.unavailable);

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 w-full min-w-0">
      <div className="flex flex-col gap-2 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Deposit Funds
        </h1>
        <p className="text-muted-foreground">
          Fund your trading account instantly using our secure payment methods.
        </p>
        {manualMt5 && accounts.length === 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            Open <strong>Trading Accounts</strong> and use{" "}
            <strong>Open Live Account</strong>
            to submit a request. You will receive a confirmation email; your MT5
            login is added once our team finishes setup.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-w-0">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <Card className="glass-card border-none shadow-xl">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Enter the amount and select your preferred method.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Select Trading Account</Label>
                    <Select
                      value={formData.accountId}
                      onValueChange={(val) =>
                        setFormData({ ...formData, accountId: val })
                      }
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Choose MT5 Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.login} value={String(acc.login)}>
                            MT5 Account: {acc.login} ({acc.group})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Deposit Amount (USD)</Label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3">
                      <div className="relative flex-1 min-w-0">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-7 bg-background/50"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                          min={0}
                          step="any"
                        />
                      </div>
                      {inrEstimate != null ? (
                        <div
                          className="flex items-center justify-center rounded-lg border border-border/80 bg-muted/30 px-4 py-2.5 text-sm shrink-0 sm:min-w-[9.5rem]"
                          aria-live="polite"
                          title="Approximate INR using current USD/INR reference"
                        >
                          <span className="text-muted-foreground mr-1">≈</span>
                          <span className="font-semibold text-foreground tabular-nums">
                            {formatInr(inrEstimate)}
                          </span>
                        </div>
                      ) : hasPositiveUsd && fxPending ? (
                        <div className="flex items-center justify-center text-xs text-muted-foreground sm:min-w-[9.5rem] py-2">
                          Loading INR…
                        </div>
                      ) : hasPositiveUsd && fxMissingRate ? (
                        <div className="flex items-center justify-center text-xs text-muted-foreground sm:min-w-[9.5rem] py-2 text-center">
                          INR conversion unavailable
                        </div>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2 min-w-0">
                      {presetAmounts.map((amt) => (
                        <Button
                          key={amt}
                          type="button"
                          variant="outline"
                          size="sm"
                          className={
                            formData.amount === String(amt)
                              ? "border-primary text-primary bg-primary/5"
                              : ""
                          }
                          onClick={() =>
                            setFormData({ ...formData, amount: String(amt) })
                          }
                        >
                          ${amt}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Payment Method</Label>
                    <Tabs
                      defaultValue="bank_transfer"
                      onValueChange={(val) =>
                        setFormData({ ...formData, method: val })
                      }
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 bg-background/50 h-auto min-h-10">
                        <TabsTrigger
                          value="bank_transfer"
                          className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2.5 h-auto whitespace-normal text-center leading-tight"
                        >
                          <Landmark size={14} className="shrink-0" /> Bank
                          Transfer
                        </TabsTrigger>
                        <TabsTrigger
                          value="qr_code"
                          className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2.5 h-auto whitespace-normal text-center leading-tight"
                        >
                          <QrCode size={14} className="shrink-0" /> UPI / QR
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent
                        value="bank_transfer"
                        className="mt-4 p-4 border rounded-lg bg-muted/30 space-y-3"
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-baseline text-sm gap-x-4 min-w-0">
                          <span className="text-muted-foreground font-medium uppercase text-[10px] shrink-0">
                            Beneficiary Name
                          </span>
                          <span className="font-bold break-words text-right sm:text-right">
                            {depositInstructions.beneficiaryName || "—"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-baseline text-sm gap-x-4 min-w-0">
                          <span className="text-muted-foreground font-medium uppercase text-[10px] shrink-0">
                            Bank Name
                          </span>
                          <span className="font-bold break-words text-right">
                            {depositInstructions.bankName || "—"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-baseline text-sm gap-x-4 min-w-0">
                          <span className="text-muted-foreground font-medium uppercase text-[10px] shrink-0">
                            Account Number
                          </span>
                          <span className="font-bold font-mono tracking-wider break-all text-right">
                            {depositInstructions.accountNumber || "—"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-baseline text-sm gap-x-4 min-w-0">
                          <span className="text-muted-foreground font-medium uppercase text-[10px] shrink-0">
                            IFSC Code
                          </span>
                          <span className="font-bold font-mono break-all text-right">
                            {depositInstructions.ifscCode || "—"}
                          </span>
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="qr_code"
                        className="mt-4 flex flex-col items-center justify-center p-4 sm:p-6 border rounded-lg bg-muted/30 min-w-0"
                      >
                        <div className="bg-white p-3 rounded-xl shadow-inner mb-4 w-full max-w-[288px] mx-auto flex items-center justify-center">
                          {depositInstructions.qrCodeImagePath ||
                          depositInstructions.qrCodeUrl
                            ?.trim()
                            .startsWith("http") ? (
                            <DepositQrImage
                              gridPath={depositInstructions.qrCodeImagePath}
                              fallbackUrl={depositInstructions.qrCodeUrl}
                              className="w-[min(72vw,288px)] h-[min(72vw,288px)] sm:w-72 sm:h-72 object-contain rounded-lg"
                            />
                          ) : (
                            <div className="w-[min(72vw,288px)] h-[min(72vw,288px)] sm:w-72 sm:h-72 bg-muted flex items-center justify-center text-muted-foreground text-xs text-center px-3 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                              QR not configured. Admin can upload an image or
                              add a URL under Deposit bank / QR.
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-center text-muted-foreground max-w-sm px-2">
                          {depositInstructions.qrHelpText ||
                            DEPOSIT_INSTRUCTIONS_FALLBACK.qrHelpText}
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="grid gap-2">
                    <Label>Upload Payment Slip</Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-muted/50 transition-all border-border hover:border-primary/50 group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-3 text-center">
                          {proofFile ? (
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                          ) : (
                            <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                          )}
                          <p className="text-sm text-muted-foreground break-all">
                            {proofFile
                              ? proofFile.name
                              : "Click to upload your transaction screenshot"}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            JPG, PNG, WebP or PDF (max 4 MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="note">Optional Comment</Label>
                    <Input
                      id="note"
                      placeholder="e.g. Deposit for ECN account"
                      className="bg-background/50"
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !proofFile}
                  className="w-full h-12 text-lg font-bold gradient-primary shadow-lg shadow-primary/20"
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Wallet className="mr-2 h-5 w-5" />
                  )}
                  Submit Deposit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 min-w-0">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Deposit Info
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Processing Time:</strong>{" "}
                Deposits are typically credited within 30 minutes to 2 hours
                after verification.
              </p>
              <p>
                <strong className="text-foreground">Fees:</strong> Equiti Capitals
                does not charge any deposit fees. However, your bank or payment
                provider might apply their own transaction fees.
              </p>
              <p>
                <strong className="text-foreground">Support:</strong> If your
                funds are not credited within 24 hours, please contact us at
                support@equiticapitals.com with your reference ID.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm gap-4">
                <span className="text-muted-foreground">1 USD to INR</span>
                <span className="font-bold tabular-nums text-right shrink-0">
                  {usdInr?.rate != null
                    ? new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(usdInr.rate)
                    : usdInr?.unavailable
                      ? "—"
                      : "…"}
                </span>
              </div>
              {usdInr?.asOfDate && (
                <p className="text-xs text-muted-foreground">
                  Reference date: {usdInr.asOfDate}
                </p>
              )}
              <div className="flex justify-between items-center text-sm pt-2 border-t border-border/60">
                <span>Min Deposit</span>
                <span className="font-bold">$100</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
