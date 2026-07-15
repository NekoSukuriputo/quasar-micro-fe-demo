import { createApp } from 'vue'
import { createPinia } from 'pinia'
import CartPage from './pages/CartPage.vue'
import * as QuasarAll from 'quasar'
import quasarIconSet from 'quasar/icon-set/material-icons'

// Karena Host menggunakan Quasar v1, dan App 2 menggunakan Quasar v2 (Vue 3),
// Ada beberapa CSS class yang mungkin berbeda. Kita bisa import quasar.css
// Namun untuk menghindari konflik besar, kita coba tanpa quasar.css terlebih dahulu.
// Komponen Vue 3 HARUS didaftarkan secara manual karena kita tidak menggunakan plugin auto-import.

export const mount = (el, { hostStore }) => {
  const app = createApp(CartPage)
  const pinia = createPinia()

  app.use(pinia)
  
  // Register all Quasar components and directives manually
  app.use(QuasarAll.Quasar, {
    components: QuasarAll,
    directives: QuasarAll,
    iconSet: quasarIconSet
  })
    
  // Inject Vuex store from Host
  if (hostStore) {
    app.provide('hostStore', hostStore)
  }

  app.mount(el)

  return {
    unmount: () => {
      app.unmount()
    }
  }
}
