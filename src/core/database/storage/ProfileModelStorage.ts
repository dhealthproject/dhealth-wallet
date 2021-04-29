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
import { ProfileModel } from '@/core/database/entities/ProfileModel';
import { SimpleObjectStorage } from '@/core/database/backends/SimpleObjectStorage';
import { VersionedModel } from '@/core/database/entities/VersionedModel';

export class ProfileModelStorage extends VersionedObjectStorage<Record<string, ProfileModel>> {
    /**
     * Singleton instance as we want to run the migration just once
     */
    public static INSTANCE = new ProfileModelStorage();

    public constructor(delegate = new SimpleObjectStorage<VersionedModel<Record<string, ProfileModel>>>('profiles')) {
        super({
            delegate: delegate,
            migrations: [
                {
                    description: 'dHealth Wallet Table Reset for profiles',
                    migrate: () => undefined,
                },
                // {
                //     description: 'Update profiles for 0.9.6.3 network (generation hash)',
                //     migrate: (from: any) => {
                //         // update all pre-0.9.6.x profiles
                //         const profiles = Object.keys(from);

                //         const modified: any = from;
                //         profiles.map((name: string) => {
                //             modified[name] = {
                //                 ...modified[name],
                //                 generationHash: '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B',
                //             };
                //         });

                //         return modified;
                //     },
                // },
            ],
        });
    }
}
