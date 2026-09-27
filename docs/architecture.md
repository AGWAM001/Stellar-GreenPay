# Architecture — Stellar GreenPay

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          User's Browser                             │
│  ┌────────────────────────────┐   ┌────────────────────────────┐   │
│  │  Next.js Frontend          │   │  Freighter Extension       │   │
│  │  (React + Tailwind)        │◄─►│  (Stellar Wallet)          │   │
│  └──────────┬─────────────────┘   └────────────────────────────┘   │
└─────────────┼───────────────────────────────────────────────────────┘
              │ REST API (non-critical path)
              ▼
┌─────────────────────────────┐
│  Node.js Backend (Express)  │
│                             │
│  • Project metadata         │
│  • Donation record keeping  │
│  • Leaderboard aggregation  │
│  • Profile management       │
│  • Project updates feed     │
└──────────────┬──────────────┘
               │ Horizon REST
               ▼
┌─────────────────────────────┐     ┌──────────────────────────────┐
│  Stellar Horizon API        │◄───►│  Stellar Network             │
│  (horizon-testnet           │     │  (Validators)                │
│   .stellar.org)             │     │                              │
└─────────────────────────────┘     └──────────────────────────────┘
                                               ▲
                                               │ Soroban
                                  ┌────────────────────────────────┐
                                  │  GreenPay Donation Contract    │
                                  │  (Rust/WASM)                   │
                                  │                                │
                                  │  register_project()            │
                                  │  donate()                      │
                                  │  get_donor_stats()             │
                                  │  get_badge()                   │
                                  │  get_global_total()            │
                                  │  get_global_co2()              │
                                  └────────────────────────────────┘
```

## Donation Flow

```
Donor selects amount ──► buildDonationTransaction()
                                    │
                                    ▼
                         Freighter signs tx
                                    │
                                    ▼
                    submitTransaction() → Horizon
                                    │
                                    ▼
                    XLM sent directly to project wallet
                                    │
                        ┌───────────┴───────────┐
                        ▼                       ▼
              recordDonation()           Soroban donate()
              (backend)                  (on-chain record)
                        │                       │
                        └───────────┬───────────┘
                                    ▼
                        Leaderboard + badge updated
```

## Key Design Decisions

### Direct-to-project payments
Donations go straight to the project wallet via a standard Stellar payment. The contract records the event but does not custody funds — this maximises trust and minimises attack surface.

### Backend as optional layer
The Node.js backend provides project metadata, the leaderboard, and the update feed. If the backend is unavailable, core donations still work — users just can't see the leaderboard or feed.

### Soroban as the source of truth
The contract is the immutable, auditable record of all donations. Anyone can verify total raised, donor stats, and CO₂ offsets without trusting the backend.

### Community features
The leaderboard and donation feed create social accountability — donors can see their rank and impact publicly, encouraging more giving.

### Redis cache key namespacing
Redis is optional and often shared with other applications (managed instance, sidecar, or a cluster with several databases). Every cache key this service writes is therefore qualified with the `greenpay:` namespace — `greenpay:project:abc123`, `greenpay:leaderboard:page:1`, `greenpay:projects:list:*`. The prefix is applied centrally by the cache services (`backend/src/services/redis.js` and `backend/src/services/cache.js`) using `backend/src/utils/cacheKeys.js`, so a new call site cannot forget it and `KEYS`-based invalidation can never delete another service's data. Rate-limit counters use their own `greenpay:rate-limit:` prefix.

## Security

| Concern | Mitigation |
|---------|-----------|
| Private key exposure | Freighter signs locally — keys never touch the app |
| Fake donation records | Backend deduplicates by tx hash; contract is ground truth |
| Project wallet spoofing | Admin must register projects on-chain via Soroban |
| Sybil donors | On-chain stats cannot be faked — all linked to real wallet |
| Backend downtime | Donations still work — backend is not on the critical path |
| Shared-Redis key collision | Every cache key is namespaced (`greenpay:…`) and invalidation is namespace-scoped |
