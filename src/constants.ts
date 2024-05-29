type PortalDamp = { key: string; smoothOpen: number; smoothClose: number; damp: number; deltaMultiplier: number}
export type DampWithEase = PortalDamp & { stateRef: any, isOpen: boolean, delta: number}

export const PORTAL_HEIGHT = 540
export const PORTAL_WIDTH = 260

export const DAMP_SETTINGS: PortalDamp[] = [
    { key: "h", smoothOpen: 5, smoothClose: PORTAL_HEIGHT, damp: 1, deltaMultiplier: 1 },
    { key: "r", smoothOpen: 1, smoothClose: 50, damp: 0.1, deltaMultiplier: 0.1 },
    { key: "s", smoothOpen: 1, smoothClose: 5, damp: 0.01, deltaMultiplier: 0.01 },
    { key: "w", smoothOpen: 2.5, smoothClose: PORTAL_WIDTH, damp: 0.5, deltaMultiplier: 0.75 },
    { key: "d", smoothOpen: 0.25, smoothClose: 22.5, damp: 0.1, deltaMultiplier: 0.1 },
  ];
  
export const EASING_POWER = 4;