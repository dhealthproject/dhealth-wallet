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

import { VersionedObjectStorage } from '@/core/database/backends/VersionedObjectStorage';
import { AccountModel } from '@/core/database/entities/AccountModel';

export class AccountModelStorage extends VersionedObjectStorage<Record<string, AccountModel>> {
    /**
     * Singleton instance as we want to run the migration just once
     */
    public static INSTANCE = new AccountModelStorage();

    private constructor() {
        super({
            storageKey: 'accounts',
            migrations: [
                {
                    description: 'dHealth Wallet Table Reset for accounts',
                    migrate: () => undefined,
                },
                // {
                //     description: 'Update accounts for 0.9.6.3 network (address changes)',
                //     migrate: (from: any) => {
                //         // update all pre-0.9.6.x profiles
                //         const profiles = Object.keys(from);

                //         const modified: any = from;
                //         profiles.map((name: string) => {
                //             modified[name] = {
                //                 ...modified[name],
                //                 // re-generating address from public key (0.9.6.x changes in addresses format)
                //                 address: Address.createFromPublicKey(modified[name].publicKey, modified[name].networkType).plain(),
                //             };
                //         });

                //         return modified;
                //     },
                // },
            ],
        });
    }
}
