# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Social meta tags to compare pages for better sharing
- NSFW content scanning for project update images
- Donor history pagination with total count reporting
- Ranking results caching for leaderboard performance
- Second-factor authentication for admin routes
- Real growth data visualization with confirmed milestones
- Safari PDF fallback support
- Form draft persistence
- Monthly giving and stale ZAP rules test coverage

### Changed
- Monthly giving project fixtures stabilized for E2E tests
- Recurring donation schedules now sourced from backend
- AnimatedNumber component defers reset to animation frame
- Horizon and Soroban request timeouts are now bounded
- Escrow contract uses direct invoke_contract calls instead of contractclient macro
- Project update images undergo moderation checks
- Leaderboard exposes query latency metrics

### Fixed
- Backend handles client disconnection mid-donation gracefully (#1104)
- E2E tests stabilized for monthly giving projects
- Hydration mismatch in AnimatedNumber component avoided
- Mobile donation inputs kept above software keyboard (#1127)
- CI ESLint errors in pdf.js, DonateForm, and DonationGrowthChart resolved
- Verification tests now use adminTokenRequired middleware
- Backend coverage artifacts prevented from being committed (#1039)
- Mobile recurring donation schedule sourcing corrected
- Recurring-donations API properly mounted
- Projects pagination page size capped at MAX_PAGE_SIZE (#1151)
- Locale persistence and cover-image fallback implemented
- Donation feed reconnection issue resolved
- Escrow contract type conversions and unused variables in tests
- Contract client attribute import issues resolved

### Security
- Admin routes now require second-factor authentication
- NSFW content scanning prevents inappropriate image uploads
- AWS placeholders in moderation tests use non-secret values

## [1.0.0] - 2024-01-15

### Added
- Initial public release of Stellar GreenPay
- Climate donation platform with XLM payments
- Soroban smart contract for transparent donations
- Verification system for climate projects
- Freighter wallet integration
- Express backend API with SEP-0010 authentication
- Project browsing and filtering
- QR code donation functionality
- Real-time donation feed
- Leaderboard for top donors and projects
- Multi-signature escrow contracts for milestones
- Mobile app with React Native
- Browser extension for quick donations
- Dashboard for project creators
- Analytics and reporting
- Webhook system for external integrations
- Recurring donation scheduling
- CSV export for tax reporting

### Changed
- Migrated from Stellar Classic to Soroban smart contracts
- Updated wallet integration for Soroban compatibility
- Refactored frontend architecture for performance

### Fixed
- Initial bug fixes and stability improvements
- Transaction submission error handling
- Wallet connection reliability

### Security
- Implemented proper authorization checks in smart contracts
- Input validation for all user-facing forms
- Secure transaction signing with Freighter
- Rate limiting on backend API endpoints
- HTTPS enforcement for production traffic
- Project verification process to prevent fraud

---

## Version History

- **[Unreleased]** - Current development (main branch)
- **[1.0.0]** - 2024-01-15 - Initial public release

---

## How to Read This Changelog

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

## Contributing

When making changes, please update this changelog following the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format. Use conventional commit messages to enable automated changelog generation.

## Links

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Conventional Commits](https://www.conventionalcommits.org/)

[Unreleased]: https://github.com/muazumikail1915-create/Stellar-GreenPay/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/muazumikail1915-create/Stellar-GreenPay/releases/tag/v1.0.0
