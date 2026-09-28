import React, { useCallback, useState, useEffect, useRef } from "react";
import { http, getApiErrorMessage } from "@/shared/api/http";
import { useAppSelector } from "@/app/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  ShieldCheck,
  Landmark,
  FileCheck,
  Upload,
  Loader2,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KycImagePreview } from "@/shared/components/KycImagePreview";
import { KYC_MAX_FILE_BYTES, KYC_MAX_LABEL } from "@/shared/kycUploadLimits";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bankDetails?: any;
  kycStatus?: string;
  kycDocuments?: unknown[];
  avatarUrl?: string;
  idProofUrl?: string;
  addressProofUrl?: string;
  role?: string;
}

export default function Profile() {
  const authUser = useAppSelector((s) => s.auth.user);
  const [user, setUser] = useState<UserProfile | null>(() =>
    authUser
      ? {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          role: authUser.role,
          kycStatus: authUser.kycStatus,
        }
      : null,
  );
  /** Avoid full-page wait while /users/me loads — Redux already has name/email from login. */
  const [awaitingInitialProfile, setAwaitingInitialProfile] = useState(
    () => authUser == null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [kycBusy, setKycBusy] = useState<null | "idProof" | "addressProof">(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idProofInputRef = useRef<HTMLInputElement>(null);
  const addressProofInputRef = useRef<HTMLInputElement>(null);

  // Forms states
  const [profileForm, setProfileForm] = useState(() => ({
    name: authUser?.name ?? "",
    phone: "",
    country: "",
  }));
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [bankForm, setBankForm] = useState({
    type: "BANK",
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",
    description: "",
  });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await http.get("/users/me");
      const userData = res.data.data;
      if (userData) {
        setUser(userData);
        setProfileForm({
          name: userData.name || "",
          phone: userData.phone || "",
          // Preserve "" when the user has no country saved instead of
          // silently defaulting to India and then writing it back on save.
          country: typeof userData.country === "string" ? userData.country : "",
        });
        if (userData.bankDetails) {
          setBankForm({
            type: userData.bankDetails.type || "BANK",
            bankName: userData.bankDetails.bankName || "",
            accountName: userData.bankDetails.accountName || "",
            accountNumber: userData.bankDetails.accountNumber || "",
            ifsc: userData.bankDetails.ifsc || "",
            description: userData.bankDetails.description || "",
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setAwaitingInitialProfile(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Strip empty fields so we don't blank-overwrite values the user
      // hasn't filled in yet (e.g. country select left untouched).
      const payload: Record<string, string> = {};
      (["name", "phone", "country"] as const).forEach((key) => {
        const value = profileForm[key]?.trim?.() ?? profileForm[key];
        if (value) payload[key] = value;
      });
      await http.patch("/users/profile", payload);
      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      // confirmPassword is a client-only check; the API rejects unknown keys.
      await http.post("/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleBankUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await http.patch("/users/bank-details", { bankDetails: bankForm });
      toast.success("Bank details updated successfully!");
      fetchProfile();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar must be 2MB or smaller");
      return;
    }
    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!okTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return;
    }

    try {
      toast.info("Uploading avatar…");
      const fd = new FormData();
      fd.append("file", file);
      await http.post("/users/avatar", fd);
      toast.success("Avatar updated");
      fetchProfile();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const submitKycFile = async (doc: "idProof" | "addressProof", file: File) => {
    if (file.size > KYC_MAX_FILE_BYTES) {
      toast.error(`File must be ${KYC_MAX_LABEL} or smaller`);
      return;
    }
    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!okTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return;
    }
    setKycBusy(doc);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const path =
        doc === "idProof" ? "/users/kyc/id-proof" : "/users/kyc/address-proof";
      await http.post(path, formData);
      toast.success(
        doc === "idProof"
          ? "Identity document uploaded for review"
          : "Address proof uploaded for review",
      );
      fetchProfile();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setKycBusy(null);
    }
  };

  const onKycFilePicked =
    (doc: "idProof" | "addressProof") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (file) void submitKycFile(doc, file);
    };

  if (awaitingInitialProfile && !user) {
    return <div className="p-4 sm:p-6">Loading profile...</div>;
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 w-full min-w-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center gap-4 sm:gap-6 min-w-0">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-xl overflow-hidden">
              {user?.avatarUrl ? (
                <KycImagePreview
                  stored={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              className="absolute -bottom-2 -right-2 p-2 rounded-full bg-background border border-border shadow-lg hover:text-primary transition-colors z-10"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
            />
          </div>
          <div className="space-y-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">
              {user?.name}
            </h1>
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="break-all">{user?.email}</span>
              <span className="hidden sm:inline">•</span>{" "}
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold"
              >
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <Card
            className={`border-none shadow-sm ${user?.kycStatus === "approved" ? "bg-emerald-500/10" : "bg-amber-500/10"}`}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <ShieldCheck
                className={`h-5 w-5 ${user?.kycStatus === "approved" ? "text-emerald-500" : "text-amber-500"}`}
              />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">
                  KYC Status
                </p>
                <p
                  className={`text-sm font-bold capitalize ${user?.kycStatus === "approved" ? "text-emerald-500" : "text-amber-500"}`}
                >
                  {user?.kycStatus || "Pending"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start rounded-none bg-transparent border-b p-0 h-auto min-h-14 mb-6 sm:mb-8 overflow-x-auto flex-nowrap scrollbar-hide gap-1">
          <TabsTrigger
            value="profile"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-8 py-3 h-auto shrink-0 gap-2 font-semibold whitespace-nowrap"
          >
            <User size={16} /> Profile Info
          </TabsTrigger>
          <TabsTrigger
            value="bank"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-8 py-3 h-auto shrink-0 gap-2 font-semibold whitespace-nowrap"
          >
            <Landmark size={16} /> Bank Details
          </TabsTrigger>
          <TabsTrigger
            value="kyc"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-8 py-3 h-auto shrink-0 gap-2 font-semibold whitespace-nowrap"
          >
            <FileCheck size={16} /> KYC Documents
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 sm:px-8 py-3 h-auto shrink-0 gap-2 font-semibold whitespace-nowrap"
          >
            <ShieldCheck size={16} /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-card border-none shadow-lg">
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                Update your basic contact information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleProfileUpdate}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Country</Label>
                  <Select
                    value={profileForm.country}
                    onValueChange={(val) =>
                      setProfileForm({ ...profileForm, country: val })
                    }
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="United Kingdom">
                        United Kingdom
                      </SelectItem>
                      <SelectItem value="United Arab Emirates">
                        United Arab Emirates
                      </SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="gradient-primary"
                  >
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="space-y-6">
          <Card className="glass-card border-none shadow-lg">
            <CardHeader>
              <CardTitle>Withdrawal Methods</CardTitle>
              <CardDescription>
                Add your bank or crypto wallet details for fast withdrawals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBankUpdate} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2 md:col-span-2">
                    <Label>Method Type</Label>
                    <Select
                      value={bankForm.type}
                      onValueChange={(val) =>
                        setBankForm({ ...bankForm, type: val })
                      }
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BANK">Bank Account</SelectItem>
                        <SelectItem value="CRYPTO">Crypto Wallet</SelectItem>
                        <SelectItem value="OTHER">Other Method</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {bankForm.type === "BANK" ? (
                    <>
                      <div className="grid gap-2">
                        <Label>Bank Name</Label>
                        <Input
                          value={bankForm.bankName}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              bankName: e.target.value,
                            })
                          }
                          className="bg-background/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Beneficiary Name</Label>
                        <Input
                          value={bankForm.accountName}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              accountName: e.target.value,
                            })
                          }
                          className="bg-background/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Account Number</Label>
                        <Input
                          value={bankForm.accountNumber}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              accountNumber: e.target.value,
                            })
                          }
                          className="bg-background/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>IFSC / SWIFT Code</Label>
                        <Input
                          value={bankForm.ifsc}
                          onChange={(e) =>
                            setBankForm({ ...bankForm, ifsc: e.target.value })
                          }
                          className="bg-background/50"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-2">
                        <Label>Wallet/Provider Name</Label>
                        <Input
                          value={bankForm.bankName}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              bankName: e.target.value,
                            })
                          }
                          placeholder="e.g. Binance / Tether"
                          className="bg-background/50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Wallet Address / ID</Label>
                        <Input
                          value={bankForm.accountNumber}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              accountNumber: e.target.value,
                            })
                          }
                          placeholder="Enter Address"
                          className="bg-background/50"
                        />
                      </div>
                    </>
                  )}

                  <div className="grid gap-2 md:col-span-2">
                    <Label>Additional Description</Label>
                    <Input
                      value={bankForm.description}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="e.g. Business Account"
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="gradient-primary"
                >
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Bank Details
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card border-none shadow-lg">
              <CardHeader>
                <CardTitle>Identity Proof</CardTitle>
                <CardDescription>
                  Upload Passport, Driver's License or National ID.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      idProofInputRef.current?.click();
                  }}
                  onClick={() => idProofInputRef.current?.click()}
                  className="border-2 border-dashed border-border/50 rounded-2xl p-6 sm:p-10 hover:border-primary/50 transition-all cursor-pointer group min-w-0"
                >
                  {user?.idProofUrl ? (
                    <KycImagePreview
                      stored={user.idProofUrl}
                      alt="Identity proof"
                      className="mx-auto max-h-40 rounded-lg object-contain mb-4"
                    />
                  ) : (
                    <Upload
                      size={32}
                      className="mx-auto text-muted-foreground group-hover:text-primary mb-4"
                    />
                  )}
                  <p className="text-sm font-medium">Click to upload file</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">
                    Maximum size {KYC_MAX_LABEL} (JPG, PNG, WebP)
                  </p>
                  <input
                    ref={idProofInputRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onKycFilePicked("idProof")}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={kycBusy === "idProof"}
                  onClick={() => idProofInputRef.current?.click()}
                >
                  {kycBusy === "idProof" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading…
                    </>
                  ) : user?.idProofUrl ? (
                    "Replace identity document"
                  ) : (
                    "Choose identity document"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-none shadow-lg">
              <CardHeader>
                <CardTitle>Address Proof</CardTitle>
                <CardDescription>
                  Utility bill, Bank statement issued in last 3 months.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      addressProofInputRef.current?.click();
                  }}
                  onClick={() => addressProofInputRef.current?.click()}
                  className="border-2 border-dashed border-border/50 rounded-2xl p-6 sm:p-10 hover:border-primary/50 transition-all cursor-pointer group min-w-0"
                >
                  {user?.addressProofUrl ? (
                    <KycImagePreview
                      stored={user.addressProofUrl}
                      alt="Address proof"
                      className="mx-auto max-h-40 rounded-lg object-contain mb-4"
                    />
                  ) : (
                    <Upload
                      size={32}
                      className="mx-auto text-muted-foreground group-hover:text-primary mb-4"
                    />
                  )}
                  <p className="text-sm font-medium">Click to upload file</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">
                    Maximum size {KYC_MAX_LABEL} (JPG, PNG, WebP)
                  </p>
                  <input
                    ref={addressProofInputRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onKycFilePicked("addressProof")}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={kycBusy === "addressProof"}
                  onClick={() => addressProofInputRef.current?.click()}
                >
                  {kycBusy === "addressProof" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading…
                    </>
                  ) : user?.addressProofUrl ? (
                    "Replace address proof"
                  ) : (
                    "Choose address proof"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 min-w-0">
          <Card className="glass-card border-none shadow-lg max-w-xl w-full">
            <CardHeader>
              <CardTitle>Change Login Password</CardTitle>
              <CardDescription>
                Update your portal access credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid gap-2">
                  <Label>Current Password</Label>
                  <PasswordInput
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>New Password</Label>
                  <PasswordInput
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Confirm New Password</Label>
                  <PasswordInput
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="bg-background/50"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="gradient-primary"
                >
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
