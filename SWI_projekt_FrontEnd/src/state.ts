import type {Warehouse, Item, UserRole, SkladovyPohyb} from './types';

export class AppState {
    searchQuery: string = '';
    public isLoggedIn: boolean = false;
    public userRole: UserRole = null;
    public currentUsername: string | null = null;
    public currentWarehouseId: string | null = null;
    public currentWarehouseName: string | null = null;
    public showLowStockOnly: boolean = false;
    public isRegistering: boolean = false;

    public warehouses: Warehouse[] = [];
    public items: Item[] = [];
    public isLoading: boolean = false;
    pohyby: SkladovyPohyb[] = [];


    public credentials: { username: string; password: string } | null = null;
}