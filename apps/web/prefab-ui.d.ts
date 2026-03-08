declare module "@prefecthq/prefab-ui/dist/_renderer/embed-DEzwqwWv.mjs" {
  export interface PrefabMountHandle {
    unmount?: () => void;
  }

  export interface PrefabMountPreview {
    (element: HTMLElement, json: string, options?: { dark?: boolean }): PrefabMountHandle;
  }

  export const m: PrefabMountPreview;
  export const mountPreview: PrefabMountPreview;
}
