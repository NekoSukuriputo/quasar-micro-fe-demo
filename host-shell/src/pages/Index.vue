<template>
  <q-page padding class="flex flex-center bg-grey-2">
    <div class="column items-center q-pa-xl bg-white shadow-2 rounded-borders text-center" style="max-width: 800px; width: 100%">
      <q-icon name="storefront" size="100px" color="primary" class="q-mb-md" />
      <h2 class="text-h3 text-weight-bold text-primary q-mt-none q-mb-md">Welcome to Micro FE Market</h2>
      
      <p class="text-h6 text-grey-8 q-mb-md">
        A demonstration of a Micro Frontend Architecture built with Module Federation, Rsbuild, and Quasar Framework.
      </p>
      <div class="row q-col-gutter-md q-mt-md text-left full-width">
        <div class="col-12 col-md-4">
          <q-card class="bg-blue-1 shadow-0 border-primary full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold text-primary"><q-icon name="dns" size="sm" class="q-mr-xs"/> Host Shell (Vue 2)</div>
              <q-badge color="primary" outline class="q-mt-sm q-mb-xs">Quasar v{{ $q.version }}</q-badge>
              <div class="text-body2 q-mt-sm">Orchestrates the layout, authentication state (Vuex), and shared styles across the entire ecosystem.</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-4">
          <q-card class="bg-green-1 shadow-0 border-positive full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold text-positive"><q-icon name="store" size="sm" class="q-mr-xs"/> App 1 (Vue 2)</div>
              <q-badge color="positive" outline class="q-mt-sm q-mb-xs">Quasar v1.x (Shared)</q-badge>
              <div class="text-body2 q-mt-sm">Handles the Product Catalog. Integrates seamlessly with the host's Vue 2 ecosystem and styling.</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-4">
          <q-card class="bg-purple-1 shadow-0 border-accent full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold text-accent"><q-icon name="shopping_cart" size="sm" class="q-mr-xs"/> App 2 (Vue 3)</div>
              <q-badge color="accent" outline class="q-mt-sm q-mb-xs">Quasar v2.21.1</q-badge>
              <div class="text-body2 q-mt-sm">Manages the Shopping Cart via Pinia. Demonstrates bridging Vue 3 reactivity with Vue 2 global states.</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      
      <div class="q-mt-xl">
        <q-btn color="primary" size="lg" label="Start Shopping" to="/catalog" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
};
</script>

<style scoped>
.border-primary { border: 1px solid var(--q-color-primary); }
.border-positive { border: 1px solid var(--q-color-positive); }
.border-accent { border: 1px solid var(--q-color-accent); }
</style>
