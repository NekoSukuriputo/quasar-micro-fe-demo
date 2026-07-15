# Quasar Micro Frontend (Module Federation) 🚀

This repository demonstrates a **Micro Frontend** architecture built with **Rsbuild**, **Module Federation**, and the **Quasar Framework**. It showcases how to seamlessly integrate Vue 2 and Vue 3 applications within a single ecosystem while sharing global states and styles.

**Demo:** [http://quasar-micro-fe.nekosukuriputo.dev](http://quasar-micro-fe.nekosukuriputo.dev)

> 🇮🇩 Untuk Bahasa Indonesia, silakan lihat [README-id.md](README-id.md).

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Pros and Cons](#pros-and-cons)
4. [Getting Started](#getting-started)
5. [Configuration Details](#configuration-details)
6. [Deployment (Kubernetes)](#deployment-kubernetes)

---

## Architecture Overview

The system consists of three independent micro frontends:

1. **Host Shell (Vue 2 + Quasar v1)**
   - Acts as the main container and orchestrator.
   - Manages the global layout (Navbar, Sidebar) and global authentication state using **Vuex**.
   - Loads other micro frontends dynamically based on routes.
2. **App 1: Catalog (Vue 2 + Quasar v1)**
   - Responsible for displaying the product catalog.
   - Shares the same Vue instance and ecosystem as the Host Shell, making integration seamless.
3. **App 2: Cart (Vue 3 + Pinia + Quasar v2)**
   - Manages the shopping cart using **Pinia**.
   - Demonstrates how to bridge Vue 3 reactivity with Vue 2 global states (Vuex) using Custom Events and isolated mounting.

---

## Technology Stack
- **Bundler:** Rsbuild (Powered by Rspack, extremely fast)
- **Micro Frontend Strategy:** Webpack/Rspack Module Federation
- **Frameworks:** Vue.js 2.7 (Host, App 1) & Vue.js 3 (App 2)
- **UI Library:** Quasar Framework
- **State Management:** Vuex (Vue 2) & Pinia (Vue 3)
- **Routing:** Vue Router
- **CI/CD:** Jenkins & ArgoCD
- **Infrastructure:** Kubernetes & Nginx Ingress

---

## Pros and Cons

### Pros
- **Independent Deployments:** Each app can be deployed independently without affecting the others.
- **Framework Agnostic (Partially):** Demonstrated by running Vue 2 and Vue 3 side-by-side.
- **Fast Build Times:** Powered by Rsbuild and Rust-based Rspack.
- **Shared Dependencies:** Module Federation shares libraries like Vue and Vuex, reducing bundle sizes.

### Cons
- **Reactivity Complexity:** Bridging state between Vue 2 and Vue 3 requires manual synchronization (e.g., using `watch` or `subscribe`).
- **CSS Conflicts:** Care must be taken to ensure global CSS from the host doesn't clash with Vue 3 scoped styles.
- **Initial Setup Overhead:** Requires configuring Rsbuild, routing, and Docker for each app.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Running Locally

1. **Host Shell**
   ```bash
   cd host-shell
   npm install
   npm run rsbuild:dev
   ```
   Runs on `http://localhost:3000`

2. **App 1 (Catalog)**
   ```bash
   cd app1-catalog
   npm install
   npm run rsbuild:dev
   ```
   Runs on `http://localhost:3001`

3. **App 2 (Cart)**
   ```bash
   cd app2-cart
   npm install
   npm run rsbuild:dev
   ```
   Runs on `http://localhost:3002`

---

## Configuration Details

### Module Federation Setup
In Rsbuild, the configuration is defined in `rsbuild.config.js`.

For **Production**, the Host Shell conditionally points to relative paths (`/app1-catalog/remoteEntry.js`) because Kubernetes Ingress handles the routing. For **Development**, it points to `http://localhost:300X`.

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

### Vue 3 to Vue 2 Integration
App 2 (Vue 3) mounts itself into a DOM element provided by the Host Shell. It manually injects the Host's Vuex store and observes changes to update its Pinia store or local refs.

---

## Deployment (Kubernetes)

Each app contains a multi-stage `Dockerfile` that builds the Vue app and serves it using Nginx.

### CI/CD Pipeline
- **Jenkins:** Triggers on push to `main`. Builds Docker images for Host, App1, and App2, pushes them to the private registry, and updates the image tags in the infra repository.
- **ArgoCD:** Monitors the infra repository and automatically applies the new manifests to the Kubernetes cluster.

### Ingress Routing
The Nginx Ingress Controller routes traffic based on URL paths:
- `/app1-catalog/.*` -> `app1-catalog-svc`
- `/app2-cart/.*` -> `app2-cart-svc`
- `/.*` -> `host-shell-svc` (Fallback)
