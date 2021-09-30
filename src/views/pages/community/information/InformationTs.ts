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
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// internal dependencies
import { ArticleEntry } from '@/services/CommunityService';

@Component({
    computed: mapGetters({
        latestArticles: 'community/latestArticles',
    }),
})
export class InformationTs extends Vue {
    /**
     * List of latest articles
     */
    protected latestArticles: ArticleEntry[];
    /**
     * Hook called when the component is mounted
     */
    public async mounted() {
        await this.$store.dispatch('community/initialize');
    }

    public getPublisher(article: ArticleEntry) {
        const r_web = new RegExp(/dhealth\.network/);
        const r_blog = new RegExp(/ubc\.digital/);

        if (r_web.test(article.link)) {
            return 'dHealth Network';
        } else if (r_blog.test(article.link)) {
            return 'dHealth Blog';
        }

        return 'Unknown';
    }
}
