import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import App from './App'
import User from './User'
import ShoppingCart from './ShoppingCart'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/user" element={<User />} />
                <Route path="/shopping-cart/:userId" element={<ShoppingCart />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)