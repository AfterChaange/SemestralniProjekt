import type { Warehouse, Item } from './types';

export class ApiClient {
    private getAuthHeaders(credentials: any): Headers {
        const headers = new Headers();
        if (credentials && credentials.username && credentials.password) {
            headers.append('Authorization', 'Basic ' + btoa(credentials.username + ":" + credentials.password));
        }
        return headers;
    }

    async getWarehouses(credentials: any): Promise<Warehouse[]> {
        const response = await fetch('/sklad/seznam', { headers: this.getAuthHeaders(credentials) });
        if (response.ok) {
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        }
        return [];
    }

    async getItems(credentials: any): Promise<Item[]> {
        const response = await fetch(`/sklad/polozky`, { headers: this.getAuthHeaders(credentials) });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        if (data && data.content && Array.isArray(data.content)) return data.content;
        if (data && data._embedded && data._embedded.skladovaPolozkas) return data._embedded.skladovaPolozkas;
        return Array.isArray(data) ? data : (Object.values(data) as Item[]); 
    }

    async vyskladnit(credentials: any, polozkaId: string): Promise<boolean> {
        const params = new URLSearchParams();
        params.append('polozkaId', polozkaId);
        params.append('mnozstvi', '1');
        const headers = this.getAuthHeaders(credentials);
        headers.set('Content-Type', 'application/x-www-form-urlencoded');

        const response = await fetch('/sklad/vyskladnit', { method: 'POST', headers, body: params });
        return response.ok;
    }

    async smazat(credentials: any, polozkaId: string): Promise<boolean> {
        const headers = this.getAuthHeaders(credentials);
        const response = await fetch(`/sklad/smazat?polozkaId=${encodeURIComponent(polozkaId)}`, { method: 'DELETE', headers });
        return response.ok;
    }

    async naskladnit(credentials: any, nazev: string, mnozstvi: string, limit: string, skladId: string | null): Promise<boolean> {
        const params = new URLSearchParams();
        params.append('nazev', nazev);
        params.append('mnozstvi', mnozstvi);
        params.append('limit', limit);
        if (skladId) params.append('skladId', skladId);
        
        const headers = this.getAuthHeaders(credentials);
        headers.set('Content-Type', 'application/x-www-form-urlencoded');

        const response = await fetch('/sklad/naskladnit', { method: 'POST', headers, body: params });
        return response.ok;
    }

    async testConnection(): Promise<boolean> {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: "test", password: "test"})
            });
            return response.status === 401 || response.ok || response.status === 403;
        } catch {
            return false;
        }
    }
}