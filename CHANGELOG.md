# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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

[1.1.4]: https://github.com/dhealthproject/dhealth-wallet/compare/v1.0.0...v1.1.4
[1.0.0]: https://github.com/dhealthproject/dhealth-wallet/releases/tag/v1.0.0

