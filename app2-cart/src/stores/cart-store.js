import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => {
    let initialItems = [];
    try {
      const cartStr = localStorage.getItem('cart');
      if (cartStr) {
        initialItems = JSON.parse(cartStr);
      }
    } catch (e) {
      console.error('Failed to parse cart', e);
    }
    return {
      items: initialItems
    }
  },
  actions: {
    // Dipanggil ketika app lain memicu event 'cart-updated'
    syncFromStorage() {
      try {
        const cartStr = localStorage.getItem('cart');
        if (cartStr) {
          this.items = JSON.parse(cartStr);
        } else {
          this.items = [];
        }
      } catch (e) {
        console.error('Failed to parse cart on sync', e);
      }
    },
    saveToStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items));
      window.dispatchEvent(new CustomEvent('cart-updated'));
    },
    removeItem(id) {
      this.items = this.items.filter(i => i.id !== id)
      this.saveToStorage();
    },
    clearCart() {
      this.items = [];
      this.saveToStorage();
    }
  }
})
