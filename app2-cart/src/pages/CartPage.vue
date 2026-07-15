<template>
  <div class="q-pa-md bg-white">
    <div class="text-h5 q-mb-md text-weight-bold">Keranjang Belanja</div>
    <div class="q-pa-md">
      <q-list bordered separator class="rounded-borders">
        <q-item v-for="item in cartStore.items" :key="item.id" class="q-py-md">
          <q-item-section avatar v-if="item.image">
            <q-avatar rounded size="80px">
              <img :src="item.image" style="object-fit: cover;">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">{{ item.name }}</q-item-label>
            <q-item-label caption class="text-primary text-weight-bold">
              Rp {{ item.price.toLocaleString('id-ID') }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row items-center">
              <span class="q-mr-md text-subtitle1">Qty: {{ item.qty }}</span>
              <q-btn flat round color="negative" icon="delete" @click="cartStore.removeItem(item.id)" />
            </div>
          </q-item-section>
        </q-item>
        
        <q-item v-if="cartStore.items.length === 0" class="q-pa-xl text-center">
          <q-item-section>
            <q-icon name="remove_shopping_cart" size="64px" color="grey-4" class="q-mx-auto q-mb-md" />
            <div class="text-h6 text-grey-6">Keranjang Anda masih kosong</div>
            <q-btn outline color="primary" label="Belanja Sekarang" class="q-mt-md q-mx-auto" style="width: 200px" @click="goToCatalog" />
          </q-item-section>
        </q-item>
      </q-list>

      <div class="row justify-end q-mt-md" v-if="cartStore.items.length > 0">
        <div class="text-h6 q-mr-xl self-center">
          Total: <span class="text-primary">Rp {{ totalPrice.toLocaleString('id-ID') }}</span>
        </div>
        <q-btn color="primary" size="lg" label="Checkout" @click="checkout" />
      </div>
      
      <!-- Testing Vuex Integration -->
      <div class="q-mt-xl bg-grey-1 q-pa-md rounded-borders border-primary" style="border: 1px solid #1976D2">
        <div class="text-subtitle2 text-primary q-mb-sm">
          <q-icon name="info" size="20px" class="q-mr-xs"/> Sistem Micro Frontend
        </div>
        <div class="text-body2">Komponen ini berasal dari <strong>App 2 (Vue 3 + Pinia)</strong>.</div>
        <div class="text-body2">Status autentikasi di bawah disinkronkan secara real-time dari <strong>Host Shell (Vue 2 + Vuex)</strong>:</div>
        <div class="q-mt-sm">Status Auth: 
          <q-badge :color="isHostAuthenticated ? 'positive' : 'negative'" class="text-subtitle2">
            {{ isHostAuthenticated ? 'Login' : 'Belum Login' }}
          </q-badge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '../stores/cart-store'

const cartStore = useCartStore()

// Total price calculation
const totalPrice = computed(() => {
  return cartStore.items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0)
})

// Go to catalog
const goToCatalog = () => {
  // We can just route via window or emit event since App 2 router might be isolated
  window.location.hash = '#/catalog'
}

// Inject host store (Vuex from Quasar v1)
const hostStore = inject('hostStore', null)

// Gunakan ref untuk melacak state reaktif dari Vue 2 ke Vue 3
const isHostAuthenticated = ref(false)
let unsubscribeVuex = null

const syncCart = () => {
  cartStore.syncFromStorage();
}

onMounted(() => {
  // Listen for cart updates from other micro frontends
  window.addEventListener('cart-updated', syncCart)

  if (hostStore) {
    // Inisialisasi nilai awal
    isHostAuthenticated.value = hostStore.state.auth?.isAuthenticated || false
    
    // Subscribe ke Vuex mutation untuk mengupdate ref di Vue 3
    unsubscribeVuex = hostStore.subscribe((mutation, state) => {
      // Perbarui jika state auth berubah
      isHostAuthenticated.value = state.auth?.isAuthenticated || false
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('cart-updated', syncCart)
  if (unsubscribeVuex) {
    unsubscribeVuex() // Hentikan listener Vuex saat komponen dibongkar
  }
})

const checkout = () => {
  if (!isHostAuthenticated.value) {
    alert('Silakan login menggunakan tombol "Login" di Header terlebih dahulu!')
    return
  }
  
  const total = totalPrice.value.toLocaleString('id-ID');
  alert(`Berhasil Checkout via Pinia!\nTotal Pembayaran: Rp ${total}`);
  cartStore.clearCart();
}
</script>
