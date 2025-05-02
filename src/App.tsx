import React, { useState } from 'react';
import Header from './components/Header';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import { CartProvider, useCart } from './context/CartContext';
import { menuItems } from './data/menuItems';

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="container mx-auto pb-20">
        <div className="pb-6 px-4 sm:px-6 lg:px-8">
          {/* <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900">University Catering Service</h1>
            <p className="mt-2 text-gray-600">Order delicious meals from our campus catering service</p>
          </div> */}
        </div>
        <MenuList items={menuItems} onAddToCart={addItem} />
      </main>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;