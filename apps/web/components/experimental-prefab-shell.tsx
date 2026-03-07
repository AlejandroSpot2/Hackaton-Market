"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

import { createPrefabShellPayload, PrefabShellSection } from "@/lib/prefab-shell";
import { RunViewModel } from "@/lib/types";

interface PrefabMountHandle {
  unmount?: () => void;
  setDark?: (value: boolean) => void;
}

interface PrefabMountPreview {
  (element: HTMLElement, json: string, options?: { dark?: boolean }): PrefabMountHandle;
}

interface ExperimentalPrefabShellProps {
  section: PrefabShellSection;
  view: RunViewModel;
  error?: string | null;
  fallback: ReactNode;
}

export function ExperimentalPrefabShell({ section, view, error = null, fallback }: ExperimentalPrefabShellProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [renderState, setRenderState] = useState<"idle" | "mounted" | "failed">("idle");
  const shouldUsePrefab = process.env.NEXT_PUBLIC_ENABLE_PREFAB_SHELL === "true";

  useEffect(() => {
    if (!shouldUsePrefab || !hostRef.current) {
      return;
    }

    const mountRoot = hostRef.current;
    const mountNode = document.createElement("div");
    mountNode.className = "prefab-shell-host";
    mountRoot.replaceChildren(mountNode);

    let isMounted = true;
    let mountHandle: PrefabMountHandle | null = null;

    void import("@prefecthq/prefab-ui/dist/_renderer/embed-DEzwqwWv.mjs")
      .then((module) => {
        if (!isMounted) {
          return;
        }

        const mountPreview = (module.m ?? module.mountPreview) as PrefabMountPreview | undefined;

        if (!mountPreview) {
          throw new Error("Prefab renderer mountPreview API is unavailable.");
        }

        const payload = createPrefabShellPayload(section, view, error);
        mountHandle = mountPreview(mountNode, JSON.stringify(payload), { dark: true });
        setRenderState("mounted");
      })
      .catch((mountError) => {
        console.warn("Prefab shell falling back to local components.", mountError);
        if (isMounted) {
          mountRoot.replaceChildren();
          setRenderState("failed");
        }
      });

    return () => {
      isMounted = false;
      mountHandle?.unmount?.();
      mountRoot.replaceChildren();
    };
  }, [error, section, shouldUsePrefab, view]);

  if (!shouldUsePrefab) {
    return <>{fallback}</>;
  }

  return (
    <div className="prefab-shell-region">
      <div
        ref={hostRef}
        className={`prefab-shell-mount ${renderState === "mounted" ? "is-visible" : "is-hidden"}`}
      />
      {renderState !== "mounted" ? fallback : null}
    </div>
  );
}
