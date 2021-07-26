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
                                    <div class="faq-slider">
                                        <FaqScreenshotItem
                                            :title="$t('faq_screenshot_title_dashboard_1')"
                                            :texts="[
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_dashboard_1').toString(),
                                                    description: $t('faq_screenshot_description_dashboard_1').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_dashboard_2').toString(),
                                                    description: $t('faq_screenshot_description_dashboard_2').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_dashboard_3').toString(),
                                                    description: $t('faq_screenshot_description_dashboard_3').toString(),
                                                },
                                            ]"
                                            right="50px"
                                            top="50%"
                                            transform="translateY(-50%)"
                                            width="50%"
                                            :index="0"
                                            :count="countScreenshots"
                                            :active="activeScreenshot === 0"
                                            @click="activeScreenshot = 0"
                                        >
                                            <template v-slot:image>
                                                <img src="@/views/resources/img/faq/dhealth-dashboard-address-balance.png" />
                                            </template>
                                        </FaqScreenshotItem>

                                        <FaqScreenshotItem
                                            :title="$t('faq_screenshot_title_dashboard_2')"
                                            :texts="[
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_dashboard_4').toString(),
                                                    description: $t('faq_screenshot_description_dashboard_4').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_dashboard_5').toString(),
                                                    description: $t('faq_screenshot_description_dashboard_5').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_dashboard_6').toString(),
                                                    description: $t('faq_screenshot_description_dashboard_6').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_dashboard_7').toString(),
                                                    description: $t('faq_screenshot_description_dashboard_7').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_dashboard_8').toString(),
                                                    description: $t('faq_screenshot_description_dashboard_8').toString(),
                                                },
                                            ]"
                                            left="50px"
                                            top="50%"
                                            transform="translateY(-50%)"
                                            width="30%"
                                            :index="1"
                                            :count="countScreenshots"
                                            :active="activeScreenshot === 1"
                                            @click="activeScreenshot = 1"
                                        >
                                            <template v-slot:image>
                                                <img src="@/views/resources/img/faq/dhealth-dashboard-send-transaction.png" />
                                            </template>
                                        </FaqScreenshotItem>

                                        <FaqScreenshotItem
                                            :title="$t('faq_screenshot_title_identities_1')"
                                            :texts="[
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_identities_1').toString(),
                                                    description: $t('faq_screenshot_description_identities_1').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_identities_2').toString(),
                                                    description: $t('faq_screenshot_description_identities_2').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_identities_3').toString(),
                                                    description: $t('faq_screenshot_description_identities_3').toString(),
                                                },
                                            ]"
                                            right="50px"
                                            top="50%"
                                            transform="translateY(-50%)"
                                            width="50%"
                                            :index="2"
                                            :count="countScreenshots"
                                            :active="activeScreenshot === 2"
                                            @click="activeScreenshot = 2"
                                        >
                                            <template v-slot:image>
                                                <img src="@/views/resources/img/faq/dhealth-identities-add-account.png" />
                                            </template>
                                        </FaqScreenshotItem>

                                        <FaqScreenshotItem
                                            :title="$t('faq_screenshot_title_identities_2')"
                                            :texts="[
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_identities_4').toString(),
                                                    description: $t('faq_screenshot_description_identities_4').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_identities_5').toString(),
                                                    description: $t('faq_screenshot_description_identities_5').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_identities_6').toString(),
                                                    description: $t('faq_screenshot_description_identities_6').toString(),
                                                },
                                            ]"
                                            right="50px"
                                            top="50%"
                                            transform="translateY(-50%)"
                                            width="50%"
                                            :index="3"
                                            :count="countScreenshots"
                                            :active="activeScreenshot === 3"
                                            @click="activeScreenshot = 3"
                                        >
                                            <template v-slot:image>
                                                <img src="@/views/resources/img/faq/dhealth-identities-backup.png" />
                                            </template>
                                        </FaqScreenshotItem>

                                        <FaqScreenshotItem
                                            :title="$t('faq_screenshot_title_harvesting_1')"
                                            :texts="[
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_harvesting_1').toString(),
                                                    description: $t('faq_screenshot_description_harvesting_1').toString(),
                                                },
                                            ]"
                                            right="0px"
                                            left="0px"
                                            margin="auto"
                                            width="90%"
                                            :index="4"
                                            :count="countScreenshots"
                                            :active="activeScreenshot === 4"
                                            @click="activeScreenshot = 4"
                                        >
                                            <template v-slot:image>
                                                <img src="@/views/resources/img/faq/dhealth-harvesting-info.png" />
                                            </template>
                                        </FaqScreenshotItem>

                                        <FaqScreenshotItem
                                            :title="$t('faq_screenshot_title_harvesting_2')"
                                            :texts="[
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_harvesting_2').toString(),
                                                    description: $t('faq_screenshot_description_harvesting_2').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_harvesting_3').toString(),
                                                    description: $t('faq_screenshot_description_harvesting_3').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_harvesting_4').toString(),
                                                    description: $t('faq_screenshot_description_harvesting_4').toString(),
                                                },
                                                {
                                                    subtitle: $t('faq_screenshot_subtitle_harvesting_5').toString(),
                                                    description: $t('faq_screenshot_description_harvesting_5').toString(),
                                                },
                                            ]"
                                            left="50px"
                                            top="60%"
                                            transform="translateY(-60%)"
                                            width="67%"
                                            :index="5"
                                            :count="countScreenshots"
                                            :active="activeScreenshot === 5"
                                            @click="activeScreenshot = 5"
                                        >
                                            <template v-slot:image>
                                                <img src="@/views/resources/img/faq/dhealth-harvesting-active-harvesting.png" />
                                            </template>
                                        </FaqScreenshotItem>
                                    </div>
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
import FaqScreenshotItem from '@/components/FaqPage/FaqScreenshotItem/FaqScreenshotItem.vue';

@Component({ components: { NavigationTabs, FaqPage, FaqPageItem, FaqScreenshotItem } })
export default class Dashboard extends Vue {
    @Prop({ default: 'faq' }) parentRouteName: string;
    @Prop({ default: '' }) term: string;

    public topic: string = 'general';

    public searchResults: { question: string; answer: string; group: string }[] = [];
    public displayedAnswers: number[] = [0];
    public indexScreenshot: number = 0;

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

    public get activeScreenshot(): number {
        return this.indexScreenshot;
    }

    public set activeScreenshot(index: number) {
        if (index < 0 || index >= this.countScreenshots) {
            index = 0;
        }

        this.indexScreenshot = index;
    }

    public get countScreenshots(): number {
        return 6;
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
