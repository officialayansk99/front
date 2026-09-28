import { http } from "@/shared/api/http";

export type Mt5Provisioning = {
  automationEnabled: boolean;
  supportEmail: string | null;
};

export async function fetchMt5Provisioning(): Promise<Mt5Provisioning> {
  const res = await http.get("/mt5-accounts/provisioning");
  return res.data.data;
}

export function mt5SupportMailto(
  supportEmail: string | null | undefined,
  subject: string,
  body?: string,
): string {
  const to = supportEmail?.trim();
  if (!to) return "#";
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${to}?${params}`;
}
