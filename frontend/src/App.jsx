import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import EnquiryPage from './pages/EnquiryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './context/AuthContext';
import EcommerceProvider from './context/EcommerceContext';
import LanguageProvider from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <EcommerceProvider>
          <div className="d-flex flex-column min-vh-100 bg-warm-offwhite">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Catalog & Browsing Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/category/:categorySlug/:subSlug" element={<CategoryPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/enquiries" element={<EnquiryPage />} />

                {/* Protected Administrative Route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <div className="container py-5 text-center">
                      <h3 className="fw-bold">404 - Page Not Found</h3>
                      <p className="text-secondary">The requested section could not be found.</p>
                      <a href="/" className="btn btn-emerald">Return Home</a>
                    </div>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </EcommerceProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
