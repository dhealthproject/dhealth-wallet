/*
 * Copyright 2020 NEM (https://nem.io)
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
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { ProfileService } from '@/services/ProfileService';
import { AccountModel, AccountType } from '@/core/database/entities/AccountModel';
import { AccountService } from '@/services/AccountService';
import { DerivationPathLevels, DerivationService } from '@/services/DerivationService';
import { MnemonicPassPhrase } from 'symbol-hd-wallets';
import { Password, SimpleWallet, NetworkType } from 'symbol-sdk';
import { SimpleObjectStorage } from '@/core/database/backends/SimpleObjectStorage';
import { ProfileModel } from '@/core/database/entities/ProfileModel';

@Component({
    computed: {
        ...mapGetters({
            currentProfile: 'profile/currentProfile',
            networkType: 'network/networkType',
            networkMosaic: 'mosaic/networkMosaic',
            networkCurrency: 'mosaic/networkCurrency',
            currentPassword: 'temporary/password',
            currentMnemonic: 'temporary/mnemonic',
            selectedAccounts: 'account/selectedAddressesToInteract',
            selectedOptInAccounts: 'account/selectedAddressesOptInToInteract',
        }),
    },
})
export default class FinalizeTs extends Vue {
    /**
     * Form is being submitted
     */
    protected isLoading: boolean = false;

    /**
     * Currently active profile
     * @see {Store.Profile}
     * @var {string}
     */
    public currentProfile: ProfileModel;

    /**
     * Temporary stored password
     * @see {Store.Temporary}
     * @var {Password}
     */
    public currentPassword: Password;

    /**
     * Temporary stored mnemonic pass phrase
     * @see {Store.Temporary}
     * @var {MnemonicPassPhrase}
     */
    public currentMnemonic: string;

    /**
     * Derivation Service
     * @var {DerivationService}
     */
    public derivation: DerivationService;

    /**
     * Map of selected accounts
     * @var {number[]}
     */
    public selectedAccounts: number[];

    /**
     * Map of selected opt in accounts
     * @var {number[]}
     */
    public selectedOptInAccounts: number[];

    /**
     * Currently connected network type
     * @see {Store.Network}
     * @var {NetworkType}
     */
    public networkType: NetworkType;

    /**
     * Controls submit button for terms and conditions
     * @type {boolean}
     */
    private marked: boolean = false;

    /**
     * Modal forms visibility states
     * @protected
     * @type {{
     *     termsAndConditions: boolean
     *     privacyAndPolicy: boolean
     *   }}
     */
    protected modalVisibility: {
        termsAndConditions: boolean;
        privacyAndPolicy: boolean;
    } = {
        termsAndConditions: false,
        privacyAndPolicy: false,
    };

    /**
     * Account Service
     * @var {AccountService}
     */
    public accountService: AccountService = new AccountService();

    /**
     * Profile Service
     * @var {ProfileService}
     */
    public profileService: ProfileService = new ProfileService();

    public get indexesOfAccountsToImport(): number[] {
        return this.selectedAccounts;
    }

    /**
     * Hook called when the page is mounted
     * @return {void}
     */
    created() {
        this.derivation = new DerivationService(this.networkType);
    }

    /**
     * Closes a modal
     * @protected
     * @param {string} modalIdentifier
     * @return {void}
     */
    protected displayModal(modalIdentifier: string): void {
        Vue.set(this.modalVisibility, modalIdentifier, true);
    }

    /**
     * Closes a modal
     * @protected
     * @param {string} modalIdentifier
     * @return {void}
     */
    protected closeModal(modalIdentifier: string): void {
        Vue.set(this.modalVisibility, modalIdentifier, false);
    }

    /**
     * Create an account instance from mnemonic and path
     * @return {AccountModel}
     */
    protected createAccountsFromPathIndexes(): AccountModel[] {
        const accountPath = AccountService.getAccountPathByNetworkType(this.networkType);

        const paths = this.indexesOfAccountsToImport.map((index) => {
            if (index === 0) {
                return accountPath;
            }

            return this.derivation.incrementPathLevel(accountPath, DerivationPathLevels.Profile, index);
        });

        const accounts = this.accountService.generateAccountsFromPaths(
            new MnemonicPassPhrase(this.currentMnemonic),
            this.networkType,
            paths,
        );

        const simpleWallets = accounts.map((account, i) =>
            SimpleWallet.createFromPrivateKey(
                `Seed Account ${this.indexesOfAccountsToImport[i] + 1}`,
                this.currentPassword,
                account.privateKey,
                this.networkType,
            ),
        );

        return simpleWallets.map((simpleWallet, i) => {
            return {
                id: SimpleObjectStorage.generateIdentifier(),
                profileName: this.currentProfile.profileName,
                name: simpleWallet.name,
                node: '',
                type: AccountType.SEED,
                address: simpleWallet.address.plain(),
                publicKey: accounts[i].publicKey,
                encryptedPrivateKey: simpleWallet.encryptedPrivateKey,
                path: paths[i],
                isMultisig: false,
                isListedAccount: true,
            };
        });
    }

    public async finish() {
        this.isLoading = true;

        const accounts = this.createAccountsFromPathIndexes();

        let numOfAccounts = 0;
        const identifiers = [];
        while (accounts.length) {
            const account = accounts.shift();

            // store accounts using repository
            this.accountService.saveAccount(account);

            // add account to profile
            await this.$store.dispatch('profile/ADD_ACCOUNT', account);

            // set current account
            if (numOfAccounts === 0) {
                await this.$store.dispatch('account/SET_CURRENT_ACCOUNT', account);
            }

            identifiers.push(account.id);
            numOfAccounts++;
        }

        this.profileService.updateProfileTermsAndConditionsStatus(this.currentProfile, true);
        await this.$store.dispatch('account/SET_KNOWN_ACCOUNTS', identifiers);
        await this.$store.dispatch('temporary/RESET_STATE');

        return this.$router.push({ name: 'dashboard' });
    }
}
