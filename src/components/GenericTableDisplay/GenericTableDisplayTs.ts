/*
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapGetters, mapState } from 'vuex';

// internal dependencies
import { AssetTableService, SortingDirections, TableField, TableSortingOptions } from '@/services/AssetTableService/AssetTableService';
import { GenericTableService, TableAction } from '@/services/AssetTableService/GenericTableService';

// child components
// @ts-ignore
import GenericTableRow from '@/components/GenericTableDisplay/GenericTableRow/GenericTableRow.vue';
// @ts-ignore
import IconButton from '@/components/IconButton/IconButton';
// @ts-ignore
import ButtonRefresh from '@/components/ButtonRefresh/ButtonRefresh';

@Component({
    components: {
        GenericTableRow,
        IconButton,
        ButtonRefresh,
    },
    computed: {
        ...mapGetters({
            currentHeight: 'network/currentHeight',
        }),
    },
})
export class GenericTableDisplayTs extends Vue {
    /**
     * Pagination page size
     * @type {number}
     */
    @Prop({ default: 20 }) public pageSize: number = 20; // no-use-before-init

    /**
     * Current table sorting state
     * @var {TableSortingOptions}
     */
    @Prop({
        default: {
            fieldName: undefined,
            direction: undefined,
        },
    })
    public sortedBy: TableSortingOptions;

    /**
     * Table action buttons.
     * @var {TableAction[]}
     */
    @Prop({ default: [] }) public actionButtons: TableAction[];

    /**
     * The *unfiltered* items that will be displayed (rows).
     * @type {string}
     */
    @Prop({ default: null }) public items: any[];

    /**
     * The table fields (columns)
     * @type {string}
     */
    @Prop({ default: [] }) public fields: TableField[];

    /**
     * Whether data is still loading
     * @type {boolean}
     */
    @Prop({ default: false }) public isLoading: boolean;

    /**
     * Whether data is still loading
     * @type {boolean}
     */
    @Prop({ default: undefined }) public refreshGetter: string;

    /**
     * Whether headers are disabled
     * @type {boolean}
     */
    @Prop({ default: false }) public disableHeaders: boolean;

    /**
     * Whether pagination is disabled if it has only one page.
     * @type {boolean}
     */
    @Prop({ default: false }) public disableSinglePageLinks: boolean;

    /**
     * avoid multiple clicks
     * @protected
     * @param {string}
     * @return {void}
     */
    protected isRefreshing: boolean = false;

    /**
     * The current blockchain height
     * @private
     * @type {number}
     */
    private currentHeight: number;

    /**
     * Pagination page number
     * @type {number}
     */
    public currentPage: number = 1;

    /**
     * And empty columns list with dynamic columns count. This
     * is used to display placeholder rows in the table.
     * @type {number[]}
     */
    public emptyColumns = [...new Array(this.pageSize).keys()];

    /// region getters and setters
    public get canRefresh(): boolean {
        return !!this.refreshGetter && !!this.refreshGetter.length;
    }

    /**
     * Non-filtered table data
     * @var {TableRowValues[]}
     */
    private get tableRows(): any[] {
        // first, check if we have direct "items"
        if (null !== this.items && this.items.length) {
            return this.items;
        }
        // second, check if we have an "items getter"
        // else if (!!this.itemsGetter && this.itemsGetter.length) {
        //     return this.$store.getters[this.itemsGetter];
        // }

        // Could not determine data source
        return [];
    }

    /**
     * Values displayed in the table
     * @readonly
     * @return {TableRowValues[]}
     */
    get displayedValues(): any[] {
        return this.getService().sort(this.tableRows, this.sortedBy);
    }

    /**
     * Header fields displayed in the table
     * @readonly
     * @return {TableField[]}
     */
    get tableFields(): TableField[] {
        return this.getService().getTableFields();
    }

    /**
     * Get current page rows
     * @readonly
     * @return {TableRowValues[]}
     */
    get currentPageRows(): any[] {
        return this.displayedValues.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
    /// end-region getters and setters

    /**
     * Hook called when the component is created
     * @return {void}
     */
    public async created(): Promise<void> {
        // refresh owned assets
        this.refresh();
        // await this.refresh()
        this.setDefaultSorting();
    }

    /**
     * Instantiate the table service around {assetType}
     * @return {AssetTableService}
     */
    protected getService(): AssetTableService {
        return new GenericTableService(this.currentHeight, this.items, this.fields);
    }

    /**
     * Refreshes the displayed data by calling the
     * store getter.
     * @returns {void}
     */
    private async refresh(): Promise<void> {
        if (!!this.refreshGetter) {
            await this.$store.dispatch(this.refreshGetter);
        }
    }

    /**
     * Sets the default sorting state and trigger it
     */
    public setDefaultSorting(): void {
        const defaultSort = 'asc';
        const defaultField = 'name';

        Vue.set(this, 'sortedBy', {
            fieldName: defaultField,
            direction: defaultSort,
        });

        this.setSortedBy(defaultField);
    }

    /**
     * Sorts the table data
     * @param {TableFieldNames} fieldName
     */
    public setSortedBy(fieldName: string): void {
        const sortedBy = { ...this.sortedBy };
        const direction: SortingDirections = sortedBy.fieldName === fieldName && sortedBy.direction === 'asc' ? 'desc' : 'asc';

        Vue.set(this, 'sortedBy', { fieldName, direction });
    }

    /**
     * Handle pagination page change
     * @param {number} page
     */
    public handlePageChange(page: number): void {
        this.currentPage = page;
    }

    protected async onRefresh() {
        if (this.isRefreshing || !this.canRefresh) {
            return;
        }

        this.isRefreshing = true;
        try {
            await this.refresh();
        } catch (e) {
            console.log('Cannot refresh', e);
        }
        this.isRefreshing = false;
    }
}
