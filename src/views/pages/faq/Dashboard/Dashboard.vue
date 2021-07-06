<template>
    <div class="dashboard-outer-container">
        <div class="dashboard-inner-container">
            <div class="left-container">
                <div class="header-container">
                    <NavigationTabs direction="horizontal" :parent-route-name="parentRouteName" />
                    <div class="search-container">
                        <div class="search-bar">
                            <input
                                v-model="searchTerm"
                                type="text"
                                :placeholder="$t('faq-search-placeholder')"
                                name="search"
                                @input="onInputSearch"
                            />
                            <div class="search-button"><img src="@/views/resources/img/icons/Search.svg" /></div>
                        </div>
                    </div>
                </div>
                <div class="bottom-container">
                    <div class="faq-main-container">
                        <div class="faq-container">
                            <FaqPage v-if="topic === 'search'" :key="'search'" :topic="'search'">
                                <template v-slot:body>
                                    <FaqPageItem
                                        v-for="({ question, answer }, index) in searchResults"
                                        :key="index"
                                        :question="question"
                                        :answer="answer"
                                        :open="displayedAnswers.includes(index)"
                                        @click="toggleAnswer(index)"
                                    />
                                </template>
                            </FaqPage>

                            <FaqPage v-if="topic === 'general'" :key="'general'" :topic="'general'">
                                <template v-slot:body>
                                    <FaqPageItem
                                        v-for="({ question, answer }, index) in searchResults"
                                        :key="index"
                                        :question="question"
                                        :answer="answer"
                                        :open="displayedAnswers.includes(index)"
                                        @click="toggleAnswer(index)"
                                    />
                                </template>
                            </FaqPage>

                            <FaqPage v-if="topic === 'tokenomics'" :key="'tokenomics'" :topic="'tokenomics'">
                                <template v-slot:body>
                                    <FaqPageItem
                                        v-for="({ question, answer }, index) in searchResults"
                                        :key="index"
                                        :question="question"
                                        :answer="answer"
                                        :open="displayedAnswers.includes(index)"
                                        @click="toggleAnswer(index)"
                                    />
                                </template>
                            </FaqPage>

                            <FaqPage v-if="topic === 'develop'" :key="'develop'" :topic="'develop'">
                                <template v-slot:body>
                                    <FaqPageItem
                                        v-for="({ question, answer }, index) in searchResults"
                                        :key="index"
                                        :question="question"
                                        :answer="answer"
                                        :open="displayedAnswers.includes(index)"
                                        @click="toggleAnswer(index)"
                                    />
                                </template>
                            </FaqPage>

                            <FaqPage v-if="topic === 'wallet'" :key="'wallet'" :topic="'wallet'">
                                <template v-slot:body>
                                    <FaqPageItem
                                        v-for="({ question, answer }, index) in searchResults"
                                        :key="index"
                                        :question="question"
                                        :answer="answer"
                                        :open="displayedAnswers.includes(index)"
                                        @click="toggleAnswer(index)"
                                    />
                                </template>
                            </FaqPage>

                            <div class="faq-contact-item">
                                <div class="faq-contact-title">{{ $t('faq_contact_title') }}</div>
                                <div class="faq-contact-content" v-html="$t('faq_contact_content')"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="right-container">
                <div class="header-container">
                    <div class="faq-category-title">{{ $t('faq_category_title') }}</div>
                </div>
                <div class="bottom-container">
                    <div class="faq-category-main-container">
                        <div class="faq-category-container">
                            <div
                                class="faq-category-item"
                                :class="{
                                    active: topic === 'general',
                                }"
                                @click="setTopic('general')"
                            >
                                <div class="faq-category-head grow">
                                    <img class="faq-category-img" src="@/views/resources/img/icons/metadata.png" />
                                    <div class="faq-category-text">{{ $t('faq_category_first') }}</div>
                                </div>
                                <div class="faq-category-subtext">{{ $t('faq_category_sub_first') }}</div>
                            </div>

                            <div
                                class="faq-category-item"
                                :class="{
                                    active: topic === 'tokenomics',
                                }"
                                @click="setTopic('tokenomics')"
                            >
                                <div class="faq-category-head grow">
                                    <img class="faq-category-img" src="@/views/resources/img/icons/mosaic.png" />
                                    <div class="faq-category-text">{{ $t('faq_category_second') }}</div>
                                </div>
                                <div class="faq-category-subtext">{{ $t('faq_category_sub_second') }}</div>
                            </div>

                            <div
                                class="faq-category-item"
                                :class="{
                                    active: topic === 'develop',
                                }"
                                @click="setTopic('develop')"
                            >
                                <div class="faq-category-head grow">
                                    <img class="faq-category-img" src="@/views/resources/img/icons/blocks.png" />
                                    <div class="faq-category-text">{{ $t('faq_category_third') }}</div>
                                </div>
                                <div class="faq-category-subtext">{{ $t('faq_category_sub_third') }}</div>
                            </div>

                            <div
                                class="faq-category-item"
                                :class="{
                                    active: topic === 'wallet',
                                }"
                                @click="setTopic('wallet')"
                            >
                                <div class="faq-category-head grow">
                                    <img class="faq-category-img" src="@/views/resources/img/icons/wallet.png" />
                                    <div class="faq-category-text">{{ $t('faq_category_fourth') }}</div>
                                </div>
                                <div class="faq-category-subtext">{{ $t('faq_category_sub_fourth') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';
// child components
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue';
import FaqPage from '@/components/FaqPage/FaqPage.vue';
import FaqPageItem from '@/components/FaqPage/FaqPageItem/FaqPageItem.vue';

@Component({ components: { NavigationTabs, FaqPage, FaqPageItem } })
export default class Dashboard extends Vue {
    @Prop({ default: 'faq' }) parentRouteName: string;
    @Prop({ default: '' }) term: string;

    public topic: string = 'general';

    public searchResults: { question: string; answer: string; group: string }[] = [];
    public displayedAnswers: number[] = [0];

    public get searchTerm(): string {
        return this.term;
    }

    public set searchTerm(t: string) {
        if (t.length) {
            this.executeSearch(t, 'search');
        } else {
            this.executeSearch(undefined, 'general');
        }
    }
    public created() {
        this.executeSearch(undefined, this.topic);
    }

    public executeSearch(t?: string, g?: string) {
        this.topic = !!g && g.length ? g : 'search';
        const exTerm = !!t && t.length ? t : this.searchTerm;
        const exGroup = !t && !!g && g.length ? g : undefined;
        this.searchResults = [
            { question: this.$t('faq_question_general_1'), answer: this.$t('faq_answer_general_1'), group: 'general' },
            { question: this.$t('faq_question_general_2'), answer: this.$t('faq_answer_general_2'), group: 'general' },
            { question: this.$t('faq_question_general_3'), answer: this.$t('faq_answer_general_3'), group: 'general' },
            { question: this.$t('faq_question_general_4'), answer: this.$t('faq_answer_general_4'), group: 'general' },
            { question: this.$t('faq_question_general_5'), answer: this.$t('faq_answer_general_5'), group: 'general' },
            { question: this.$t('faq_question_general_6'), answer: this.$t('faq_answer_general_6'), group: 'general' },
            { question: this.$t('faq_question_general_7'), answer: this.$t('faq_answer_general_7'), group: 'general' },
            { question: this.$t('faq_question_general_8'), answer: this.$t('faq_answer_general_8'), group: 'general' },
            { question: this.$t('faq_question_general_9'), answer: this.$t('faq_answer_general_9'), group: 'general' },
            { question: this.$t('faq_question_general_10'), answer: this.$t('faq_answer_general_10'), group: 'general' },
            { question: this.$t('faq_question_general_11'), answer: this.$t('faq_answer_general_11'), group: 'general' },
            { question: this.$t('faq_question_tokenomics_1'), answer: this.$t('faq_answer_tokenomics_1'), group: 'tokenomics' },
            { question: this.$t('faq_question_tokenomics_2'), answer: this.$t('faq_answer_tokenomics_2'), group: 'tokenomics' },
            { question: this.$t('faq_question_develop_1'), answer: this.$t('faq_answer_develop_1'), group: 'develop' },
            { question: this.$t('faq_question_wallet_1'), answer: this.$t('faq_answer_wallet_1'), group: 'wallet' },
        ]
            .filter((item) =>
                !!exGroup
                    ? item.group.toLowerCase() === exGroup.toLowerCase()
                    : -1 !== item.question.toString().toLowerCase().search(exTerm.toLowerCase()) ||
                      -1 !== item.answer.toString().toLowerCase().search(exTerm.toLowerCase()),
            )
            .map((i) => ({
                question: i.question.toString(),
                answer: i.answer.toString(),
                group: i.group,
            }));
    }

    public setTopic(g: string) {
        this.topic = g;
        this.displayedAnswers = [0];
        this.executeSearch(undefined, g);
    }

    public toggleAnswer(i: number) {
        if (this.displayedAnswers.includes(i)) {
            this.displayedAnswers = this.displayedAnswers.filter((j) => j !== i);
        } else {
            this.displayedAnswers.push(i);
        }
    }

    public onInputSearch(e) {
        const value = e.target.value;
        this.$emit('input', value);
    }
}
</script>

<style lang="less" scoped>
@import './Dashboard.less';
</style>
