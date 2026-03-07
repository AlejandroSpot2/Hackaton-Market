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
      {combinedError ? <p className="alert">{combinedError}</p> : null}
    </>
  );
}
