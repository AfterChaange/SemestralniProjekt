export interface Warehouse {
    id: string;
    nazev_skladu: string;
    lokalita?: string;
}

export interface Item {
    id: string;
    nazev: string;
    mnozstvi: number;
    minLimit?: number;
    jePodLimit?: boolean;
    sklad?: Warehouse;
}

export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER' | null;