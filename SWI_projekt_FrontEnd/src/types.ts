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

export interface SkladovyPohyb {
    id: string;
    datum: string;
    mnozstvi: number;
    typPohybu: string;
    polozka: {
        id: string;
        nazev: string;
    };
    zdrojSklad?: {
        id: string;
        nazev_skladu: string;
    };
    cilSklad?: {
        id: string;
        nazev_skladu: string;
    };
}

export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER' | null;