<template>

    <div class="dashboard-outer-container">
        <div class="dashboard-inner-container">

            <div class="left-container">
                <div class="header-container">
                    <NavigationTabs direction="horizontal" :parent-route-name="parentRouteName" />
                </div>
                <div class="bottom-container">
                    <div class="faq-main-container">
                        <div class="faq-container">
                            
                            <details open class="faq-item">
                                <summary class="faq-title">{{ $t('faq_question_first') }}</summary>
                                <div class="faq-content" v-html="$t('faq_answer_first')"></div>
                            </details>

                            <details class="faq-item">
                                <summary class="faq-title">{{ $t('faq_question_second') }}</summary>
                                <div class="faq-content" v-html="$t('faq_answer_second')"></div>
                            </details>

                            <details class="faq-item">
                                <summary class="faq-title">{{ $t('faq_question_third') }}</summary>
                                <div class="faq-content" v-html="$t('faq_answer_third')"></div>
                            </details>

                            <details class="faq-item">
                                <summary class="faq-title">{{ $t('faq_question_fourth') }}</summary>
                                <div class="faq-content" v-html="$t('faq_answer_fourth')"></div>
                            </details>

                            <details class="faq-item">
                                <summary class="faq-title">{{ $t('faq_question_fifth') }}</summary>
                                <div class="faq-content" v-html="$t('faq_answer_fifth')"></div>
                            </details>

                            <details class="faq-item">
                                <summary class="faq-title">{{ $t('faq_question_sixth') }}</summary>
                                <div class="faq-content" v-html="$t('faq_answer_sixth')"></div>
                            </details>

                            <details class="faq-item">
                                <summary class="faq-title">{{ $t('faq_question_seventh') }}</summary>
                                <div class="faq-content" v-html="$t('faq_answer_seventh')"></div>
                            </details>

                            <details class="faq-item">
                                <summary class="faq-title">{{ $t('faq_question_eighth') }}</summary>
                                <div class="faq-content" v-html="$t('faq_answer_eighth')"></div>
                            </details>

                            <details class="faq-item">
                                <summary class="faq-title">{{ $t('faq_question_ninth') }}</summary>
                                <div class="faq-content" v-html="$t('faq_answer_ninth')"></div>
                            </details>

                            <details class="faq-item">
                                <summary class="faq-title">{{ $t('faq_question_tenth') }}</summary>
                                <div class="faq-content" v-html="$t('faq_answer_tenth')"></div>
                            </details>

                            <details class="faq-item">
                                <summary class="faq-title">{{ $t('faq_question_eleventh') }}</summary>
                                <div class="faq-content" v-html="$t('faq_answer_eleventh')"></div>
                            </details>

                            <div class="faq-item faq-contact-item">
                                <div class="faq-title">{{ $t('faq_contact_title') }}</div>
                                <div class="faq-content" v-html="$t('faq_contact_content')"></div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="right-container">
                <div class="header-container">
                    <div class="faq-category-title">{{ $t('faq_category-title') }}</div>
                </div>
                <div class="bottom-container">
                    <div class="faq-category-main-container">
                        <div class="faq-category-container">
                            <div class="faq-category-item grow">
                                <img class="faq-category-img" src="@/views/resources/img/icons/metadata.png" />
                                <div class="faq-category-text">{{ $t('faq_category-first') }}</div>
                            </div>
                            <div class="faq-category-item grow">
                                <img class="faq-category-img" src="@/views/resources/img/icons/mosaic.png" />
                                <div class="faq-category-text">{{ $t('faq_category-second') }}</div>
                            </div>
                            <div class="faq-category-item grow">
                                <img class="faq-category-img" src="@/views/resources/img/icons/blocks.png" />
                                <div class="faq-category-text">{{ $t('faq_category-third') }}</div>
                            </div>
                            <div class="faq-category-item grow">
                                <img class="faq-category-img" src="@/views/resources/img/icons/wallet.png" />
                                <div class="faq-category-text">{{ $t('faq_category-fourth') }}</div>
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
 
@Component({ components: { NavigationTabs } })
export default class Dashboard extends Vue {
    @Prop({ default: 'faq' }) parentRouteName: string;
}
</script>

<style lang="less" scoped>
@import './Dashboard.less';
</style>