import { AppState } from './state';

export class UI {
    static renderLogin(state: AppState): string {
        return `
        <div class="login-container">
            <div class="login-header">
                <h2><span style="color: var(--primary-color);">📦</span> Skladový systém</h2>
                <p>${state.isRegistering ? 'Vytvořte si nový účet' : 'Přihlaste se ke svému účtu'}</p>
            </div>
            
            <form id="loginForm">
                <div>
                    <label for="username">Uživatelské jméno</label>
                    <input type="text" id="username" required autocomplete="username" placeholder="Zadejte jméno...">
                </div>
                <div>
                    <label for="password">Heslo</label>
                    <input type="password" id="password" required autocomplete="${state.isRegistering ? 'new-password' : 'current-password'}" placeholder="Zadejte heslo...">
                </div>
                <div id="loginError" class="error-message" style="display: none; margin-top: 0.5rem; text-align: center; color: var(--danger-color); font-size: 0.85rem;"></div>
                <button type="submit" class="btn-primary" style="margin-top: 1rem; width: 100%;">
                    ${state.isRegistering ? `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                        Registrovat účet
                    ` : `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                        Přihlásit
                    `}
                </button>
            </form>
            
            <div class="login-footer" style="margin-top: 20px; text-align: center; font-size: 0.9rem; color: var(--text-secondary);">
                ${state.isRegistering ? `
                    Již máte účet? <a href="#" id="toggleRegister" style="color: var(--primary-color); text-decoration: none; font-weight: 500;">Přihlaste se</a>
                ` : `
                    Nemáte účet? <a href="#" id="toggleRegister" style="color: var(--primary-color); text-decoration: none; font-weight: 500;">Zaregistrujte se</a>
                `}
            </div>
            
            <div id="test-connection-result" style="margin-top:24px; font-size: 0.85em; text-align: center;">Testuji připojení k backendu...</div>
        </div>
        `;
    }

    static renderAppLayout(state: AppState): string {
        let warehousesHtml = '';
        
        if (state.warehouses.length > 0) {
            warehousesHtml = state.warehouses.map(w => `
                <button class="tab-btn ${state.currentWarehouseId === w.id && !state.showLowStockOnly ? 'active' : ''}" data-id="${w.id}" data-name="${w.nazev_skladu || w.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    ${w.nazev_skladu || w.id}
                </button>
            `).join('');
        } else {
            warehousesHtml = `<p style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">Žádné sklady k dispozici.</p>`;
        }

        const lowStockCount = state.items.filter(item => item.jePodLimit || (item.minLimit !== undefined && item.mnozstvi < item.minLimit)).length;

        return `
            <div class="app-container">
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <h2>📦 Přehled</h2>
                        <div class="user-info">
                            <div class="user-avatar">
                                ${state.currentUsername?.charAt(0).toUpperCase()}
                            </div>
                            <div class="user-details">
                                <div class="user-name">${state.currentUsername}</div>
                                <span class="role-badge ${state.userRole === 'ROLE_ADMIN' ? 'role-admin' : 'role-user'}">${state.userRole === 'ROLE_ADMIN' ? 'Administrátor' : 'Skladník (Čtení)'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="warehouses-list">
                        <div class="list-group-title">OBECNÉ</div>
                        <button class="tab-btn ${state.currentWarehouseId === null && !state.showLowStockOnly ? 'active' : ''}" data-id="all" data-name="Všechny položky">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            Všechny položky
                        </button>
                        
                        <button class="tab-btn warning-tab ${state.showLowStockOnly ? 'active' : ''}" data-id="low-stock" data-name="Kritické zásoby">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            Docházející položky
                            ${lowStockCount > 0 ? `<span class="badge-count">${lowStockCount}</span>` : ''}
                        </button>

                        <div class="list-group-title" style="margin-top: 1rem;">MOJE SKLADY</div>
                        ${warehousesHtml}
                    </div>
                    
                    <div class="sidebar-footer">
                        <button id="logoutBtn" class="logout-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            Odhlásit
                        </button>
                    </div>
                </aside>
                <main class="main-content">
                    ${this.renderWarehouseContent(state)}
                </main>
            </div>
        `;
    }

    static renderWarehouseContent(state: AppState): string {
        if (state.isLoading) {
            return `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <br>Načítám data...
                </div>
            `;
        }

        let itemsHtml = '';
        let filteredItems = state.items;
        
        if (state.showLowStockOnly) {
            filteredItems = state.items.filter(item => item.jePodLimit || (item.minLimit !== undefined && item.mnozstvi < item.minLimit));
        } else if (state.currentWarehouseId) {
            filteredItems = state.items.filter(item => item.sklad && item.sklad.id === state.currentWarehouseId);
        }
        
        if (Array.isArray(filteredItems) && filteredItems.length > 0) {
            itemsHtml = filteredItems.map(item => {
                const jePod = item.jePodLimit || (item.minLimit !== undefined && item.mnozstvi < item.minLimit);
                return `
                <tr class="${jePod ? 'warning-row' : ''}">
                    <td style="font-weight: 500;">
                        ${item.nazev}
                        ${jePod ? '<div style="font-size: 0.75rem; color: var(--danger-color); font-weight: normal; margin-top: 0.2rem;">Zásoby jsou pod minimálním limitem (' + (item.minLimit || 0) + ')</div>' : ''}
                    </td>
                    <td>
                        <span class="stock-badge ${jePod ? 'stock-danger' : 'stock-normal'}">
                            ${item.mnozstvi} ks
                        </span>
                    </td>
                    ${state.currentWarehouseId === null || state.showLowStockOnly ? `<td style="color: var(--text-secondary);">${item.sklad ? (item.sklad.nazev_skladu || item.sklad.id) : '<span style="opacity: 0.5;">Nepřiřazeno</span>'}</td>` : ''}
                    
                    ${state.userRole === 'ROLE_ADMIN' ? `
                    <td>
                        <div class="action-buttons-group">
                            <button class="action-btn" onclick="window.app.vyskladnit('${item.id}')" title="Vyskladnit 1 kus">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                                -1 ks
                            </button>
                            <button class="action-btn delete-btn" onclick="window.app.smazat('${item.id}')" title="Smazat celou položku">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                            </button>
                        </div>
                    </td>
                    ` : ''}
                </tr>
                `;
            }).join('');
        }

        return `
            <header class="main-header">
                <div>
                    <div class="breadcrumb">PŘEHLED / ${state.showLowStockOnly ? 'UPOZORNĚNÍ' : (state.currentWarehouseId ? 'SKLADY' : 'VŠE')}</div>
                    <h2>${state.showLowStockOnly ? 'Položky pod limitem (Kritické)' : (state.currentWarehouseName || 'Všechny položky')}</h2>
                    ${state.showLowStockOnly ? '<p style="margin:0; color: var(--danger-color); font-size: 0.9rem; margin-top: 0.5rem;">Seznam položek, u kterých klesly zásoby pod nastavené minimum a je třeba je doobjednat.</p>' : ''}
                </div>
            </header>
            
            ${state.userRole === 'ROLE_ADMIN' && !state.showLowStockOnly ? `
            <div class="actions-panel">
                <div class="panel-header">
                    <h3><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Nové naskladnění</h3>
                </div>
                <form id="naskladnitForm">
                    <div class="form-row">
                        <div class="form-group flex-2">
                            <label for="novyNazev">Název položky</label>
                            <input type="text" id="novyNazev" placeholder="Např. Kancelářský papír A4" required>
                        </div>
                        <div class="form-group flex-1">
                            <label for="noveMnozstvi">Množství (ks)</label>
                            <input type="number" id="noveMnozstvi" min="1" value="1" required>
                        </div>
                        <div class="form-group flex-1">
                            <label for="novyLimit">Minimální limit (ks)</label>
                            <input type="number" id="novyLimit" min="0" value="5" required>
                        </div>
                        ${state.currentWarehouseId === null ? `
                        <div class="form-group flex-1">
                            <label for="vyberSklad">Do skladu</label>
                            <select id="vyberSklad">
                                <option value="" selected>Bez skladu</option>
                                ${state.warehouses.map(w => `<option value="${w.id}">${w.nazev_skladu || w.id}</option>`).join('')}
                            </select>
                        </div>
                        ` : ''}
                        <div class="form-group" style="align-self: flex-end;">
                            <button type="submit" class="btn-primary">Přidat</button>
                        </div>
                    </div>
                </form>
            </div>
            ` : ''}

            ${state.userRole === 'ROLE_USER' ? `
            <div class="info-banner">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Jste přihlášen v režimu pro čtení. Pro úpravy skladu nebo naskladňování se přihlaste jako Administrátor.
            </div>
            ` : ''}

            <div class="table-container">
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Název položky</th>
                            <th>Stav na skladě</th>
                            ${state.currentWarehouseId === null || state.showLowStockOnly ? '<th>Umístění (Sklad)</th>' : ''}
                            ${state.userRole === 'ROLE_ADMIN' ? '<th style="text-align: right;">Akce</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml.length > 0 ? itemsHtml : `
                            <tr>
                                <td colspan="${state.userRole === 'ROLE_ADMIN' ? (state.currentWarehouseId === null || state.showLowStockOnly ? '4' : '3') : (state.currentWarehouseId === null || state.showLowStockOnly ? '3' : '2')}" style="text-align: center; padding: 4rem; color: var(--text-muted);">
                                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.6;">
                                        <svg style="margin-bottom: 1rem;" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                        ${state.showLowStockOnly ? 'Všechny položky jsou nad minimálním limitem. Skvělá práce! 🎉' : 'Žádné položky k zobrazení.'}
                                    </div>
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
        `;
    }
}