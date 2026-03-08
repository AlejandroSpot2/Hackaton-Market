import { AlertTriangle } from "lucide-react";

import { StatusStrip } from "@/components/status-strip";
import { RunViewModel } from "@/lib/types";

interface RunStatusShellProps {
  view: RunViewModel;
  error: string | null;
}

export function RunStatusShell({ view, error }: RunStatusShellProps) {
  const combinedError = error ?? view.errorMessage;

  return (
    <>
      <StatusStrip shell={view.statusShell} />
      {combinedError ? (
        <div className="glass-panel border-rose-200/80 bg-rose-50/80 p-4 text-sm text-rose-700">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{combinedError}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
