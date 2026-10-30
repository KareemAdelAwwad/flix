<div align="center">

<img src="public/logo.png" alt="Flix Logo" width="80" height="80" />

# Flix

**Production-grade streaming and media discovery platform engineered with Next.js 14, Clerk authentication, Stripe billing, and Firebase Firestore.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Subscriptions-008CDD?style=flat-square&logo=stripe)](https://stripe.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Sentry](https://img.shields.io/badge/Sentry-Monitoring-362D59?style=flat-square&logo=sentry)](https://sentry.io/)

> A bilingual (Arabic/English) streaming experience with real-time watchlists, subscription tiers, TMDB catalog synchronization, and edge performance monitoring.

[**Explore Live Demo (flix.kareemadel.com)**](https://flix.kareemadel.com)

</div>

---

![Flix App Preview](public/meta_bg.png)

---

## Features

- **Content Discovery Engine:** Direct integration with TMDB API delivering paginated trending, top-rated, and categorized movie/series metadata.
- **Enterprise Authentication:** Multi-provider OAuth (Google, Discord, Facebook) and session verification powered by Clerk with Arabic & English localizations.
- **Subscription Management:** Automated Stripe checkout pipelines, customer billing portal, and crash-resilient webhook reconciliation for active tiers.
- **Real-Time Watchlists:** Low-latency user watchlists, viewing history, and favorites backed by Firebase Firestore.
- **Bilingual & Responsive:** Full RTL (Right-to-Left) Arabic and LTR English layouts with GSAP micro-animations and Tailwind CSS design tokens.
- **Production Observability:** Client, server, and edge error monitoring and distributed performance tracing instrumented via Sentry.

---

## Architecture & Integration Flow

```mermaid
flowchart TD
    User([User Client]) -->|Next.js 14 App Router| App[Flix Web App]

    subgraph AuthLayer["Identity & Access"]
        App -->|Session Token| Clerk["Clerk Authentication"]
        Clerk -->|OAuth Handshake| Providers["Google / Discord / Email"]
    end

    subgraph MediaCatalog["Catalog Pipeline"]
        App -->|Server Actions| TMDB["The Movie Database (TMDB API)"]
        TMDB -->|Metadata / Posters / Trailers| App
    end

    subgraph Billing["Subscription Engine"]
        App -->|Checkout Session| Stripe["Stripe Billing"]
        Stripe -->|invoice.paid webhook| WebhookRoute["/api/webhooks/stripe"]
        WebhookRoute -->|Sync Tier Status| Firestore
    end

    subgraph DataStore["State & Preferences"]
        App -->|Sync Watchlists & History| Firestore[("Firebase Firestore")]
    end

    subgraph Observability["Monitoring"]
        App -.->|Telemetry & Errors| Sentry["Sentry Dashboard"]
    end
```

---

## Prerequisites

- **Node.js** v18.17.0 or higher
- **pnpm** (recommended) or npm
- **TMDB API Key** (from [themoviedb.org](https://www.themoviedb.org/documentation/api))
- **Clerk Application** (from [clerk.com](https://clerk.com))
- **Firebase Project** with Firestore enabled (from [firebase.google.com](https://firebase.google.com))
- **Stripe Account** for subscription webhooks (from [stripe.com](https://stripe.com))

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/KareemAdelAwwad/flix.git
cd flix
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and populate your API credentials:

```bash
cp .env.example .env.local
```

### 3. Start Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Purpose |
| :--- | :--- |
| `pnpm run dev` | Runs local development server on port 3000 |
| `pnpm run build` | Compiles production Next.js build |
| `pnpm run start` | Boots production server instance |
| `pnpm run lint` | Runs ESLint analysis across TypeScript & JSX files |

---

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/KareemAdelAwwad">
        <img src="https://github.com/KareemAdelAwwad.png" width="90px;" alt="Kareem Adel" /><br />
        <sub><b>Kareem Adel</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ibrahimwael951">
        <img src="https://github.com/ibrahimwael951.png" width="90px;" alt="Ibrahim Wael" /><br />
        <sub><b>Ibrahim Wael</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/HassanMo1390">
        <img src="https://github.com/HassanMo1390.png" width="90px;" alt="Hasan" /><br />
        <sub><b>Hasan</b></sub>
      </a>
    </td>
  </tr>
</table>
