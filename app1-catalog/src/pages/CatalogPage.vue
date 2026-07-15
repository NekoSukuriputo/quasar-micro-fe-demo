<template>
  <q-page padding class="bg-white">
    <div class="text-h5 q-mb-md text-weight-bold">Katalog Produk Terpopuler</div>
    <div class="row q-col-gutter-md">
      <div v-for="product in products" :key="product.id" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="my-card full-height column">
          <q-img :src="product.image" height="200px" fit="cover">
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3 text-grey-8">
                No Image
              </div>
            </template>
          </q-img>
          <q-card-section class="col-grow">
            <div class="text-h6 ellipsis">{{ product.name }}</div>
            <div class="text-subtitle1 text-weight-bold text-primary">Rp {{ product.price.toLocaleString('id-ID') }}</div>
          </q-card-section>
          <q-card-actions align="between" class="q-px-md q-pb-md">
            <q-btn outline color="primary" icon="add_shopping_cart" label="Beli" @click="buy(product)" class="full-width" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'CatalogPage',
  data() {
    return {
      products: [
        { id: 1, name: 'Laptop Quasar Pro', price: 15000000, image: 'https://cdn.quasar.dev/img/mountains.jpg' },
        { id: 2, name: 'Mouse Rspack Wireless', price: 500000, image: 'https://cdn.quasar.dev/img/parallax2.jpg' },
        { id: 3, name: 'Keyboard Vue 3 Mechanical', price: 1200000, image: 'https://cdn.quasar.dev/img/quasar.jpg' },
        { id: 4, name: 'Monitor Micro FE 4K', price: 4500000, image: 'https://cdn.quasar.dev/img/parallax1.jpg' }
      ]
    }
  },
  methods: {
    buy(product) {
      try {
        const cartStr = localStorage.getItem('cart');
        let cart = [];
        if (cartStr) {
          cart = JSON.parse(cartStr);
        }
        
        // Cek apakah item sudah ada di keranjang
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
          existing.qty = (existing.qty || 1) + 1;
        } else {
          cart.push({ ...product, qty: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Beritahu shell dan micro frontend lainnya
        window.dispatchEvent(new CustomEvent('cart-updated'));
        
        this.$q.notify({
          type: 'positive',
          message: `${product.name} berhasil ditambahkan ke keranjang!`,
          position: 'top',
          timeout: 2000
        });
      } catch (e) {
        console.error('Gagal menyimpan ke keranjang', e);
      }
    }
  }
}
</script>

<style scoped>
.my-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.my-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
}
</style>
