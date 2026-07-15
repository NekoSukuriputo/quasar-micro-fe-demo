# Quasar Micro Frontend (Module Federation) 🚀

Repositori ini mendemonstrasikan arsitektur **Micro Frontend** yang dibangun dengan **Rsbuild**, **Module Federation**, dan **Quasar Framework**. Proyek ini menunjukkan bagaimana kita dapat mengintegrasikan aplikasi Vue 2 dan Vue 3 secara mulus dalam satu ekosistem sembari berbagi *global state* dan *style*.

**Demo:** [http://quasar-micro-fe.nekosukuriputo.dev](http://quasar-micro-fe.nekosukuriputo.dev)

> 🇬🇧 For English, please see [README.md](README.md).

## Daftar Isi
1. [Gambaran Arsitektur](#gambaran-arsitektur)
2. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
3. [Kelebihan dan Kekurangan](#kelebihan-dan-kekurangan)
4. [Cara Menjalankan](#cara-menjalankan)
5. [Detail Konfigurasi](#detail-konfigurasi)
6. [Deployment (Kubernetes)](#deployment-kubernetes)

---

## Gambaran Arsitektur

Sistem ini terdiri dari tiga micro frontend yang independen:

1. **Host Shell (Vue 2 + Quasar v1)**
   - Bertindak sebagai wadah utama (orkestrator).
   - Mengelola tata letak global (Navbar, Sidebar) dan status autentikasi global menggunakan **Vuex**.
   - Memuat micro frontend lain secara dinamis berdasarkan rute URL.
2. **App 1: Catalog (Vue 2 + Quasar v1)**
   - Bertanggung jawab untuk menampilkan katalog produk.
   - Berbagi instans Vue dan ekosistem yang sama dengan Host Shell, sehingga integrasi terasa sangat mulus.
3. **App 2: Cart (Vue 3 + Pinia + Quasar v2)**
   - Mengelola keranjang belanja menggunakan **Pinia**.
   - Menunjukkan cara menjembatani reaktivitas Vue 3 dengan state global Vue 2 (Vuex) melalui Custom Events dan teknik isolasi *mounting*.

---

## Teknologi yang Digunakan
- **Bundler:** Rsbuild (Ditenagai oleh Rspack, sangat cepat)
- **Strategi Micro Frontend:** Webpack/Rspack Module Federation
- **Framework:** Vue.js 2.7 (Host, App 1) & Vue.js 3 (App 2)
- **UI Library:** Quasar Framework
- **State Management:** Vuex (Vue 2) & Pinia (Vue 3)
- **Routing:** Vue Router
- **CI/CD:** Jenkins & ArgoCD
- **Infrastruktur:** Kubernetes & Nginx Ingress

---

## Kelebihan dan Kekurangan

### Kelebihan
- **Deployment Independen:** Setiap aplikasi dapat di-deploy secara terpisah tanpa memengaruhi yang lain.
- **Fleksibilitas Framework:** Terbukti dengan kemampuan menjalankan Vue 2 dan Vue 3 berdampingan.
- **Waktu Build Cepat:** Memanfaatkan Rsbuild dan Rspack (berbasis Rust).
- **Berbagi Dependensi:** Module Federation memungkinkan kita berbagi *library* seperti Vue dan Vuex, sehingga ukuran *bundle* lebih kecil.

### Kekurangan
- **Kompleksitas Reaktivitas:** Menjembatani *state* antara Vue 2 dan Vue 3 memerlukan sinkronisasi manual (misal dengan `watch` atau `subscribe`).
- **Konflik CSS:** Perlu perhatian khusus agar CSS global dari host tidak merusak komponen dengan *scoped styling* di Vue 3.
- **Konfigurasi Awal yang Sulit:** Membutuhkan waktu ekstra untuk mengatur Rsbuild, routing, dan Docker di masing-masing aplikasi.

---

## Cara Menjalankan

### Prasyarat
- Node.js (v18 atau lebih baru)
- npm atau yarn

### Instalasi & Menjalankan di Lokal

1. **Host Shell**
   ```bash
   cd host-shell
   npm install
   npm run rsbuild:dev
   ```
   Berjalan di `http://localhost:3000`

2. **App 1 (Catalog)**
   ```bash
   cd app1-catalog
   npm install
   npm run rsbuild:dev
   ```
   Berjalan di `http://localhost:3001`

3. **App 2 (Cart)**
   ```bash
   cd app2-cart
   npm install
   npm run rsbuild:dev
   ```
   Berjalan di `http://localhost:3002`

---

## Detail Konfigurasi

### Konfigurasi Module Federation
Di Rsbuild, pengaturan ini berada pada `rsbuild.config.js`.

Untuk tahap **Production**, Host Shell akan mengarahkan URL *remote* menggunakan *relative path* (`/app1-catalog/remoteEntry.js`) karena Kubernetes Ingress yang akan mengurus *routing*-nya. Untuk **Development**, URL menunjuk ke `http://localhost:300X`.

```javascript
// host-shell/rsbuild.config.js
moduleFederation: {
  options: {
    name: 'host',
    remotes: {
      app1: isProd ? 'app1@/app1-catalog/remoteEntry.js' : 'app1@http://localhost:3001/remoteEntry.js',
      app2: isProd ? 'app2@/app2-cart/remoteEntry.js' : 'app2@http://localhost:3002/remoteEntry.js',
    },
    shared: {
      'shared-vue': { singleton: true, eager: true },
      vuex: { singleton: true, eager: true }
    }
  }
}
```

### Integrasi Vue 3 ke Vue 2
App 2 (Vue 3) menyuntikkan (mount) dirinya sendiri ke dalam elemen DOM yang disediakan oleh Host Shell. Aplikasi ini secara manual menginjeksi *store* Vuex dari Host dan memantau perubahannya untuk memperbarui *store* Pinia atau *ref* lokalnya.

---

## Deployment (Kubernetes)

Setiap aplikasi memiliki `Dockerfile` dengan skema *multi-stage* yang membangun aplikasi Vue dan menyajikannya menggunakan Nginx.

### CI/CD Pipeline
- **Jenkins:** Memicu *pipeline* setiap ada perubahan (push) di branch `main`. Mem-build *image* Docker untuk Host, App1, dan App2, mendorong (push) ke *private registry*, lalu memperbarui versi tag pada repositori infrastruktur.
- **ArgoCD:** Memantau repositori infrastruktur dan secara otomatis menerapkan (*apply*) *manifest* terbaru ke cluster Kubernetes.

### Ingress Routing
Nginx Ingress Controller merutekan lalu lintas berdasarkan *path* URL:
- `/app1-catalog/.*` -> `app1-catalog-svc`
- `/app2-cart/.*` -> `app2-cart-svc`
- `/.*` -> `host-shell-svc` (Tujuan Default/Fallback)
