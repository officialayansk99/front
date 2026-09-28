import { useEffect, useState } from "react";
import { http } from "@/shared/api/http";

type Props = {
  /** e.g. `transactions/deposit-qr/file` (axios base already /api/v1) */
  gridPath: string | null | undefined;
  fallbackUrl?: string | null;
  className?: string;
  alt?: string;
};

/**
 * Shows deposit QR from GridFS (authenticated blob) or a public URL fallback.
 */
export function DepositQrImage({
  gridPath,
  fallbackUrl,
  className,
  alt = "Payment QR",
}: Props) {
  const [src, setSrc] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    let blobObjectUrl: string | undefined;

    async function run() {
      const url = fallbackUrl?.trim();
      if (gridPath?.trim()) {
        try {
          const { data } = await http.get(gridPath.trim(), {
            responseType: "blob",
          });
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

      if (url?.startsWith("http")) {
        setSrc(url);
        return;
      }

      setSrc(undefined);
    }

    void run();
    return () => {
      cancelled = true;
      if (blobObjectUrl) URL.revokeObjectURL(blobObjectUrl);
    };
  }, [gridPath, fallbackUrl]);

  if (!src) return null;

  return <img src={src} alt={alt} className={className} />;
}
