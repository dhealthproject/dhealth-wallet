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
import { Component, Prop, Vue } from 'vue-property-decorator';

// child components
// @ts-ignore
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue';
import { officialIcons } from '@/views/resources/Images';

@Component({
    components: {
        AmountDisplay,
    },
})
export class GenericTableRowTs extends Vue {
    /**
     * Type of assets shown in the table
     * @type {any}
     */
    @Prop({ default: {} }) rowValues: any;

    /**
     * Whether to show the "remove" button
     * @type {boolean}
     */
    @Prop({ default: false }) showRemove: boolean;

    /** Returns only visible values of a row */
    protected get visibleRowValues() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hiddenData, ...visible } = this.rowValues;
        return visible;
    }

    public get externalLinkIcon() {
        return officialIcons.voting;
    }

    public isAmountField(field: string) {
        return ['amount', 'balance'].includes(field);
    }

    public isLinkField(field: string) {
        return ['homepage', 'repository'].includes(field);
    }
}
