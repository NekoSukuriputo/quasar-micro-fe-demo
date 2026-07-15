<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Logo -->
        <q-btn flat no-caps to="/" class="q-mr-sm">
          <q-icon name="storefront" size="28px" class="q-mr-sm" />
          <q-toolbar-title class="text-weight-bold">Micro FE Market</q-toolbar-title>
        </q-btn>

        <q-space />

        <!-- Cart Button -->
        <q-btn flat round dense icon="shopping_cart" to="/cart" class="q-mr-md">
          <q-badge v-if="cartCount > 0" color="red" floating>{{ cartCount }}</q-badge>
        </q-btn>

        <!-- Auth Status & Button -->
        <div class="row items-center">
          <q-avatar size="32px" color="secondary" text-color="white" class="q-mr-sm">
            {{ isAuthenticated ? 'U' : 'G' }}
          </q-avatar>
          <div class="column q-mr-md">
            <span class="text-caption" style="line-height: 1;">Hello,</span>
            <span class="text-weight-bold text-body2" style="line-height: 1;">
              {{ isAuthenticated ? 'User' : 'Guest' }}
            </span>
          </div>
          <q-btn 
            outline rounded
            color="white" 
            :label="isAuthenticated ? 'Logout' : 'Login'" 
            @click="toggleAuth" 
          />
        </div>
      </q-toolbar>
      
      <!-- Sub Navbar for Navigation -->
      <q-toolbar inset class="bg-primary shadow-2 text-white" style="min-height: 40px;">
        <q-btn flat dense no-caps label="Home" to="/" />
        <q-btn flat dense no-caps label="Katalog Produk" to="/catalog" />
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MainLayout',
  data() {
    return {
      search: '',
      cartCount: 0
    }
  },
  computed: {
    ...mapState('auth', ['isAuthenticated'])
  },
  methods: {
    ...mapActions('auth', ['login', 'logout']),
    toggleAuth() {
      if (this.isAuthenticated) {
        this.logout();
      } else {
        this.login();
      }
    },
    updateCartCount() {
      try {
        const cartStr = localStorage.getItem('cart');
        if (cartStr) {
          const cartItems = JSON.parse(cartStr);
          this.cartCount = Array.isArray(cartItems) ? cartItems.length : 0;
        } else {
          this.cartCount = 0;
        }
      } catch (e) {
        this.cartCount = 0;
      }
    }
  },
  mounted() {
    // Initial fetch
    this.updateCartCount();
    // Listen for custom cross-app events
    window.addEventListener('cart-updated', this.updateCartCount);
  },
  beforeDestroy() {
    window.removeEventListener('cart-updated', this.updateCartCount);
  }
};
</script>

