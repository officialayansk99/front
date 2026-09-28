import { useEffect, useState } from "react";
import { getApiOrigin, http } from "@/shared/api/http";

type Props = {
  stored: string | undefined | null;
  alt: string;
  className?: string;
};

function needsAuthBlobFetch(stored: string): boolean {
  return (
    stored.startsWith("users/me/kyc/") ||
    stored.startsWith("users/me/avatar/") ||
    stored.startsWith("admin/users/")
  );
}

/**
 * KYC images: absolute http(s) URLs use img src; API-relative paths use an
 * authenticated axios blob fetch (Bearer cannot be sent via img src).
 */
export function KycImagePreview({ stored, alt, className }: Props) {
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let blobObjectUrl: string | undefined;

    async function run() {
      if (!stored?.trim()) {
        setSrc(undefined);
        return;
      }

      if (stored.startsWith("http")) {
        setSrc(stored);
        return;
      }

      if (needsAuthBlobFetch(stored)) {
        try {
          const { data } = await http.get(stored, { responseType: "blob" });
          if (cancelled) return;
          const u = URL.createObjectURL(data);
          if (cancelled) {
            URL.revokeObjectURL(u);
            return;
          }
          blobObjectUrl = u;
          setSrc(u);
        } catch {
          if (!cancelled) setSrc(undefined);
        }
        return;
      }

      setSrc(`${getApiOrigin()}${stored.startsWith("/") ? "" : "/"}${stored}`);
    }

    void run();
    return () => {
      cancelled = true;
      if (blobObjectUrl) URL.revokeObjectURL(blobObjectUrl);
    };
  }, [stored]);

  if (!src) return null;

  return <img src={src} alt={alt} className={className} />;
}
