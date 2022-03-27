<template>
    <div class="faq-roadmap-image">
        <div class="roadmap-description">{{ $t('faq_roadmap_description') }}</div>
        <slot name="image" />
    </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class FaqImageItem extends Vue {}
</script>

<style lang="less" scoped>
@import './FaqImageItem.less';
</style>
