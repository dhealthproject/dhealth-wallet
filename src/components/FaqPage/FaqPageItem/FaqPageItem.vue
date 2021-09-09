<template>
    <details :open="open === true" class="faq-item">
        <summary class="faq-title">{{ question }}</summary>
        <div class="faq-content" v-html="answer"></div>
    </details>
</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class FaqPageItem extends Vue {
    @Prop({ default: '' }) question: string;
    @Prop({ default: '' }) answer: string;
    @Prop({ default: false }) open: boolean;
}
</script>

<style lang="less" scoped>
@import './FaqPageItem.less';
</style>
