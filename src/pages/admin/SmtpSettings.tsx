import React, { useEffect, useState } from "react";
import { http, getApiErrorMessage } from "@/shared/api/http";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export default function SmtpSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    server: "",
    port: 587,
    username: "",
    password: "",
    ssl: true,
    imapHost: "",
    imapPort: 993,
    imapSecure: true,
    imapUsername: "",
    imapPassword: "",
    sentMailbox: "",
  });

  useEffect(() => {
    const fetchSmtp = async () => {
      try {
        const res = await http.get("/admin/smtp");
        if (res.data.data) {
          setFormData({
            server: res.data.data.server || "",
            port: res.data.data.port || 587,
            username: res.data.data.username || "",
            password: res.data.data.password || "",
            ssl: res.data.data.ssl ?? true,
            imapHost: res.data.data.imapHost || "",
            imapPort: res.data.data.imapPort || 993,
            imapSecure: res.data.data.imapSecure ?? true,
            imapUsername: res.data.data.imapUsername || "",
            imapPassword: res.data.data.imapPassword || "",
            sentMailbox: res.data.data.sentMailbox || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch SMTP settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSmtp();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Strip empty optional IMAP fields so the backend treats them as
      // "not configured" rather than blank strings.
      const payload: Record<string, unknown> = {
        server: formData.server,
        port: formData.port,
        username: formData.username,
        password: formData.password,
        ssl: formData.ssl,
      };
      if (formData.imapHost.trim()) {
        payload.imapHost = formData.imapHost.trim();
        payload.imapPort = formData.imapPort;
        payload.imapSecure = formData.imapSecure;
        if (formData.imapUsername.trim())
          payload.imapUsername = formData.imapUsername.trim();
        if (formData.imapPassword) payload.imapPassword = formData.imapPassword;
        if (formData.sentMailbox.trim())
          payload.sentMailbox = formData.sentMailbox.trim();
      }

      await http.put("/admin/smtp", payload);
      toast.success("SMTP settings updated successfully");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          SMTP Configuration
        </h1>
        <p className="text-muted-foreground">
          Configure your outgoing mail server settings for system notifications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Server Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="server">SMTP Server</Label>
                  <Input
                    id="server"
                    placeholder="smtp.example.com"
                    value={formData.server}
                    onChange={(e) =>
                      setFormData({ ...formData, server: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    placeholder="587"
                    value={formData.port}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        port: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username / Email</Label>
                  <Input
                    id="username"
                    placeholder="admin@equiticapitals.com"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
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

              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="ssl"
                  checked={formData.ssl}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, ssl: checked })
                  }
                />
                <Label htmlFor="ssl">Enable SSL/TLS Security</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>IMAP / Sent Folder Archiving (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                When configured, every outgoing email is also copied to your
                IMAP <span className="font-medium">Sent</span> folder so it
                appears in webmail (Hostinger, Outlook, etc.) alongside
                manually-sent mail. Leave blank to disable.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="imapHost">IMAP Host</Label>
                  <Input
                    id="imapHost"
                    placeholder="imap.hostinger.com"
                    value={formData.imapHost}
                    onChange={(e) =>
                      setFormData({ ...formData, imapHost: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imapPort">IMAP Port</Label>
                  <Input
                    id="imapPort"
                    type="number"
                    placeholder="993"
                    value={formData.imapPort}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        imapPort: parseInt(e.target.value) || 993,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imapUsername">
                    IMAP Username{" "}
                    <span className="text-xs text-muted-foreground">
                      (defaults to SMTP username)
                    </span>
                  </Label>
                  <Input
                    id="imapUsername"
                    placeholder="leave blank to reuse SMTP username"
                    value={formData.imapUsername}
                    onChange={(e) =>
                      setFormData({ ...formData, imapUsername: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imapPassword">
                    IMAP Password{" "}
                    <span className="text-xs text-muted-foreground">
                      (defaults to SMTP password)
                    </span>
                  </Label>
                  <PasswordInput
                    id="imapPassword"
                    placeholder="leave blank to reuse SMTP password"
                    value={formData.imapPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, imapPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="sentMailbox">
                    Sent Folder Path{" "}
                    <span className="text-xs text-muted-foreground">
                      (leave blank to auto-detect)
                    </span>
                  </Label>
                  <Input
                    id="sentMailbox"
                    placeholder="Sent"
                    value={formData.sentMailbox}
                    onChange={(e) =>
                      setFormData({ ...formData, sentMailbox: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="imapSecure"
                  checked={formData.imapSecure}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, imapSecure: checked })
                  }
                />
                <Label htmlFor="imapSecure">
                  Use SSL/TLS for IMAP (port 993)
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={saving} className="gradient-primary">
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
