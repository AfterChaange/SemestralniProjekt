import './style.css';
import { AppState } from './state';
import { ApiClient } from './api';
import { UI } from './ui';
import type { UserRole } from './types';

class App {
    state: AppState;
    api: ApiClient;

    constructor() {
        this.state = new AppState();
        this.api = new ApiClient();
        
        (window as any).app = this;
    }

    async init() {
        this.render();

        if (!this.state.isLoggedIn) {
            const resultDiv = document.getElementById('test-connection-result');
            if (resultDiv) {
                const isConnected = await this.api.testConnection();
                if (isConnected) {
                    resultDiv.innerHTML = `<span style="color: var(--success-color); font-weight: 500;">✓ Spojení se serverem navázáno (Zabezpečeno)</span>`;
                } else {
                    resultDiv.innerHTML = `<span style="color: var(--danger-color); font-weight: 500;">✗ Nelze se spojit se serverem (Běží Spring Boot na 8080?)</span>`;
                }
            }
        }
    }

    render() {
        const appContainer = document.querySelector<HTMLDivElement>('#app')!;
        
        if (!this.state.isLoggedIn) {
            appContainer.innerHTML = UI.renderLogin(this.state);
            this.setupLoginListeners();
        } else {
            appContainer.innerHTML = UI.renderAppLayout(this.state);
            this.setupAppListeners();
        }
    }

    async vyskladnit(polozkaId: string) {
        if (this.state.userRole !== 'ROLE_ADMIN') return;
        const success = await this.api.vyskladnit(this.state.credentials, polozkaId);
        if (success) {
            await this.refreshData();
        } else {
            alert('Chyba při vyskladnění (Ověřte svá práva)');
        }
    }

    async smazat(polozkaId: string) {
        if (this.state.userRole !== 'ROLE_ADMIN') return;
        if (!confirm('Opravdu chcete tuto položku trvale smazat?')) return;
        
        const success = await this.api.smazat(this.state.credentials, polozkaId);
        if (success) {
            await this.refreshData();
        } else {
            alert('Chyba při mazání (Ověřte svá práva)');
        }
    }

    async refreshData() {
        this.state.isLoading = true;
        this.render(); 
        
        try {
            this.state.items = await this.api.getItems(this.state.credentials);
            if (this.state.warehouses.length === 0 && this.state.items.length > 0) {
                const map = new Map();
                this.state.items.forEach(item => {
                    if (item.sklad && item.sklad.id) map.set(item.sklad.id, item.sklad);
                });
                this.state.warehouses = Array.from(map.values());
            }
        } catch (error) {
            console.error("Chyba při načítání položek:", error);
            this.state.items = [];
        } finally {
            this.state.isLoading = false;
            this.render(); 
        }
    }

    setupLoginListeners() {
        document.getElementById('toggleRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.state.isRegistering = !this.state.isRegistering;
            this.render();
        });

        const form = document.getElementById('loginForm');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const usernameInput = (document.getElementById('username') as HTMLInputElement).value;
            const passwordInput = (document.getElementById('password') as HTMLInputElement).value;
            const errorDiv = document.getElementById('loginError') as HTMLDivElement;
            const btn = form.querySelector('button') as HTMLButtonElement;
            
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = this.state.isRegistering ? 'Vytvářím účet...' : 'Ověřuji...';
            btn.disabled = true;
            errorDiv.style.display = 'none';

            try {
                const endpoint = this.state.isRegistering ? '/api/auth/register' : '/api/auth/login';
                
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: usernameInput, password: passwordInput })
                });

                if (response.ok) {
                    if (this.state.isRegistering) {
                        alert("Účet úspěšně vytvořen! Nyní se můžete přihlásit.");
                        this.state.isRegistering = false;
                        this.render();
                    } else {
                        const data = await response.json();
                        this.state.userRole = data.role as UserRole;
                        this.state.currentUsername = data.username;
                        this.state.credentials = { username: usernameInput, password: passwordInput };
                        
                        this.state.isLoggedIn = true;
                        this.state.currentWarehouseId = null; 
                        this.state.currentWarehouseName = "Všechny položky";
                        this.state.showLowStockOnly = false;

                        this.state.warehouses = await this.api.getWarehouses(this.state.credentials);
                        await this.refreshData(); 
                    }
                } else {
                    let errorText = this.state.isRegistering ? 'Nepodařilo se vytvořit účet. Možná již existuje.' : 'Nesprávné jméno nebo heslo.';
                    if (response.status === 400 || response.status === 401) {
                        try {
                            const text = await response.text();
                            if (text) errorText = text;
                        } catch(err) {}
                    }
                    
                    errorDiv.innerText = errorText;
                    errorDiv.style.display = 'block';
                    btn.innerHTML = originalBtnText;
                    btn.disabled = false;
                }
            } catch (error) {
                console.error(error);
                errorDiv.innerText = 'Chyba připojení k serveru.';
                errorDiv.style.display = 'block';
                btn.innerHTML = originalBtnText;
                btn.disabled = false;
            }
        });
    }

    setupAppListeners() {
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;

                this.state.searchQuery = target.value;

                this.render();

                const newInput = document.getElementById('searchInput') as HTMLInputElement;
                if (newInput) {
                    newInput.focus();
                    const len = newInput.value.length;
                    newInput.setSelectionRange(len, len);
                }
            });
        }

        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.state = new AppState();
            this.render();


        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const id = target.getAttribute('data-id');
                
                if (id === 'low-stock') {
                    this.state.showLowStockOnly = true;
                    this.state.currentWarehouseId = null;
                    this.state.currentWarehouseName = "Kritické zásoby";
                } else {
                    this.state.showLowStockOnly = false;
                    this.state.currentWarehouseId = id === 'all' ? null : id;
                    this.state.currentWarehouseName = target.getAttribute('data-name');
                }
                
                this.render(); 
            });
        });

        const form = document.getElementById('naskladnitForm');
        if (form && this.state.userRole === 'ROLE_ADMIN') {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const nazev = (document.getElementById('novyNazev') as HTMLInputElement).value;
                const mnozstvi = (document.getElementById('noveMnozstvi') as HTMLInputElement).value;
                const limit = (document.getElementById('novyLimit') as HTMLInputElement).value;
                
                let skladId = this.state.currentWarehouseId;
                
                if (this.state.currentWarehouseId === null) {
                    const selectEl = document.getElementById('vyberSklad') as HTMLSelectElement;
                    if (selectEl && selectEl.value !== "") skladId = selectEl.value;
                }

                const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                const originalContent = submitBtn.innerHTML;
                submitBtn.innerHTML = '<div class="spinner spinner-small"></div> Ukládám...';
                submitBtn.disabled = true;

                try {
                    const success = await this.api.naskladnit(this.state.credentials, nazev, mnozstvi, limit, skladId);
                    if (success) {
                        await this.refreshData(); 
                        (form as HTMLFormElement).reset(); 
                        document.getElementById('novyNazev')?.focus();
                    } else {
                        alert('Chyba při naskladnění. Odepřen přístup nebo chyba serveru.');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Nastala neočekávaná chyba.');
                } finally {
                    if (document.contains(submitBtn)) {
                        submitBtn.innerHTML = originalContent;
                        submitBtn.disabled = false;
                    }
                }
            });
        }
    }
}

const appInstance = new App();
appInstance.init().catch(console.error);