/*
 * Copyright 2020 NEM (https://nem.io)
 * Copyright 2021-present [Using Blockchain Ltd](https://using-blockchain.org), All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';

// internal dependencies
import { TableAssetType } from '@/components/TableDisplay/TableAssetType';
import { officialIcons } from '@/views/resources/Images';
import { PluginBridge } from '@dhealth/wallet-api-bridge';

// child components
// @ts-ignore
import TableRow from '@/components/TableRow/TableRow.vue';
// @ts-ignore
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue';

@Component({
    components: {
        TableRow,
        AmountDisplay,
    },
})
export class TableRowTs extends Vue {
    /**
     * Type of assets shown in the table
     * @type {string}
     */
    @Prop({ default: 'mosaic' }) assetType: string;

    /**
     * Type of assets shown in the table
     * @type {any}
     */
    @Prop({ default: {} }) rowValues: any;

    /**
     * Owned assets hex ids
     * @type {string[]}
     */
    @Prop({ default: [] }) ownedAssetHexIds: string[];

    /**
     * Show remove button
     * @type {boolean}
     */
    @Prop({ default: false }) showRemove: boolean;

    /**
     * Whether the row is a namespace
     * @readonly
     * @protected
     * @type {boolean}
     */
    protected get isNamespace(): boolean {
        return Object.keys(this.rowValues).indexOf('aliasType') > -1;
    }

    /**
     * Whether the row is a root namespace
     * @readonly
     * @protected
     * @type {boolean}
     */
    protected get isRootNamespace(): boolean {
        if (!this.isNamespace) {
            return false;
        }
        return this.rowValues.name.indexOf('.') === -1;
    }

    /**
     * Whether the row is an asset that has available actions
     * @readonly
     * @protected
     * @type {boolean}
     */
    protected get hasAvailableActions(): boolean {
        if (this.assetType === TableAssetType.AccountRestrictions) {
            return false;
        }
        if (this.rowValues.expiration === 'expired') {
            return false;
        }
        return this.ownedAssetHexIds.findIndex((hexId) => hexId === this.rowValues.hexId) > -1;
    }

    /**
     * Whether the mosaic is active and supply mutable
     * @readonly
     * @protected
     * @type {boolean}
     */
    protected get isSupplyMutableMosaic(): boolean {
        if (Object.keys(this.rowValues).indexOf('supply') === -1) {
            return false;
        }
        if (!this.rowValues.supplyMutable) {
            return false;
        }
        return this.rowValues.expiration !== 'expired';
    }

    protected get hasMetadata(): boolean {
        return this.rowValues.metadataList && this.rowValues.metadataList.length;
    }

    /**
     * Whether link or unlink should be the alias form button label
     * @protected
     * @returns {string}
     */
    protected get aliasActionLabel(): string {
        if (this.isNamespace) {
            if (this.rowValues.aliasType === 'N/A') {
                return 'action_label_alias_link';
            }
            return 'action_label_alias_unlink';
        }
        if (this.rowValues.name === 'N/A') {
            return 'action_label_alias_link';
        }
        return 'action_label_alias_unlink';
    }

    /** Returns only visible values of a row */
    protected get visibleRowValues() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hiddenData, ...visible } = this.rowValues;
        if (this.$route.fullPath === '/mosaicList') {
            visible.supply = (visible.supply.replace(/\D/g, '') / Math.pow(10, visible.divisibility))
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return visible;
    }

    public get externalLinkIcon() {
        return officialIcons.voting;
    }

    public getStatusIndicator(status: string) {
        switch (status) {
            case PluginBridge.PluginInstallStatus.Installed:
                return { cls: 'status-indicator amber', text: this.$t('plugin_status_installed') };
            case PluginBridge.PluginInstallStatus.Enabled:
                return { cls: 'status-indicator green', text: this.$t('plugin_status_enabled') };
            case PluginBridge.PluginInstallStatus.Disabled:
                return { cls: 'status-indicator amber', text: this.$t('plugin_status_disabled') };
            case PluginBridge.PluginInstallStatus.Uninstalled:
                return { cls: 'status-indicator red', text: this.$t('plugin_status_uninstalled') };
        }

        return { cls: 'status-indicator red', text: this.$t('plugin_status_uninstalled') };
    }
}
