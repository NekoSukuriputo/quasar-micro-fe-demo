<template>
  <q-page>
    <div ref="cartContainer"></div>
  </q-page>
</template>

<script>
export default {
  name: 'App2CartWrapper',
  data() {
    return {
      remoteApp: null
    }
  },
  async mounted() {
    try {
      // Import the exposed mount function from App 2
      const { mount } = await import('app2/CartMount');
      
      // Mount the Vue 3 app into our container, passing the Vuex store
      this.remoteApp = mount(this.$refs.cartContainer, {
        hostStore: this.$store
      });
    } catch (e) {
      console.error('Failed to load App 2 Cart', e);
      this.$refs.cartContainer.innerHTML = '<div class="text-negative q-pa-md">Gagal memuat modul keranjang. Pastikan App 2 berjalan.</div>';
    }
  },
  beforeDestroy() {
    if (this.remoteApp) {
      this.remoteApp.unmount();
    }
  }
}
</script>
