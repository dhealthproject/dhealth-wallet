<template>
    <button
        type="button"
        class="icon-button button-style entered-button submit-button inverted-button normal"
        :disabled="disabled"
        @click="$emit('click')"
    >
        <Icon :type="icon" :size="size" />
        <span v-if="title" class="button-title">{{ title }}</span>
    </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class IconButton extends Vue {
    @Prop({ default: false }) disabled: boolean;
    @Prop({ default: undefined }) title: boolean;
    @Prop({ default: 'md-add-circle' }) icon: string;
    @Prop({ default: undefined }) size: string;
}
</script>

<style lang="less" scoped>
@import './IconButton.less';
</style>
