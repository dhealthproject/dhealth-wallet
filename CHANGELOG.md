# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.3.1][1.3.1] - 01-Mar-2022

#### Added

- feat/ui: Adds secret lock & secret proof transaction views 
- feat/ui: Adds warning message on co-signature modal
- fix: Fixes transaction contact mismatch (fixes #18)
- fix: Fixes issues with swaps amounts in plugins

#### Changed

- deps: Updates dependencies to remove warnings (fixes #13)
- ui: Changes theme colors and fixes static colors to use theme
- ui: Updates colorway to changed colors for dHealth

## [1.3.0][1.3.0] - 01-Feb-2022

#### Added

- plugins: Adds @dhealthdapps/bridge in version `v1.0.0`.
- plugins: Improves plugins list with human-friendly names

#### Changed

- deps: Updates @dhealthdapps/bridge to version v1.0.0.

## [1.2.2][1.2.2] - 08-Dec-2021

#### Added

- plugins: Adds compatibility with aggregate transactions in health-to-earn.
- plugins: Adds referral code implementation for health-to-earn.

#### Changed

- deps: Updates @dhealthdapps/health-to-earn to version `v1.1.0`.

## [1.2.1][1.2.1] - 24-Nov-2021

#### Added

- deps: Installs new plugin @dhealth/plugin-node-monitory
- deps: Installs new plugin @dhealthdapps/health-to-earn
- fix: Fixes plugin manager navigation controls
- system: Removes many unused resources (images)
- plugins: Adds latest plugin injecter (plugins:install)
- plugins: Adds plugin support for Windows, Linux & MacOS
- i18n: Adds french translations from team
- i18n: Adds german translations from team

#### Changed

- feat: Disables Ledger import strategy
- deps: Updates @dhealth/wallet-api-bridge
- deps: Updates @dhealth/wallet-components
- deps: Uses @dhealth/sdk
- deps: Plugins are now built with --formats umd-min
- i18n: Updates language files for chinese and japanese

## [1.1.4][1.1.4] - 08-Oct-2021

#### Added
- i18n: Adds correct namespace suggestion (gh#5)
- feat/plugins: Adds IPC communication channel for onPluginsReady
- feat/plugins: Adds PluginInjecter and dynamic PageWrapper
- feat/ui: Updates GenericTableDisplay and PageLayout
- deps: Adds dependencies @dhealth/wallet-api-bridge & @dhealth/wallet-components
- system: Adds pre-installed plugins: @yourdlt/plugin-dummy, @yourdlt/plugin-librarian, @yourdlt/plugin-ninjazzz
- feat/faq: Adds FAQ module with wallet instructions

#### Changed

- system: Upgrades dependencies, fixes wording and more
- bugfix: Fixes minHarvesterBalance (#4)
- bugfix: Fixes article publishers (#7)
- bugfix: Fixes network store with name from config
- bugfix: Fixes profile import process (#11, #6)
- bugfix: Fixes language and build process (#8)
- bugfix: Fixes Remote/VRF/Node key links removal (#10)

## [1.0.0][1.0.0] - 03-May-2021

#### Changed

- Changed default testnet network to dHealth Test Network
- Changed default mainnet network to dHealth Public Network

#### Known Issues

- Some missing re-branding items for dHealth logos.

[1.3.1]: https://github.com/dhealthproject/dhealth-wallet/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/dhealthproject/dhealth-wallet/compare/v1.2.2...v1.3.0
[1.2.2]: https://github.com/dhealthproject/dhealth-wallet/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/dhealthproject/dhealth-wallet/compare/v1.1.4...v1.2.1
[1.1.4]: https://github.com/dhealthproject/dhealth-wallet/compare/v1.0.0...v1.1.4
[1.0.0]: https://github.com/dhealthproject/dhealth-wallet/releases/tag/v1.0.0

