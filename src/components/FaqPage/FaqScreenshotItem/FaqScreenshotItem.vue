<template>
    <div class="faq-item-screenshot">
        <input :id="index" type="radio" name="test" :value="index" :checked="active" />
        <label :for="previousIndex" class="previous"><img src="@/views/resources/img/newicons/Arrowhead.svg" /></label>
        <label :for="nextIndex" class="next"><img src="@/views/resources/img/newicons/Arrowhead.svg" /></label>
        <div class="faq-slider-content">
            <div
                class="faq-slider-text"
                :style="{
                    right: right,
                    top: top,
                    left: left,
                    bottom: bottom,
                    '-ms-transform': transform,
                    transform: transform,
                    'max-width': width,
                    margin: margin,
                }"
            >
                <div class="faq-slider-heading">{{ title }}</div>
                <div class="faq-slider-description">
                    <p v-for="({ subtitle, description }, index) in texts" :key="index" class="faq-slider-description-wrapper">
                        <b class="faq-slider-description-subtitle"> {{ subtitle }}: </b>
                        <span>
                            {{ description }}
                        </span>
                    </p>
                </div>
            </div>
            <slot name="image" />
        </div>
    </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class FaqScreenshotItem extends Vue {
    @Prop({ default: '' }) title: string;
    @Prop({ default: [] }) texts: { subtitle: string; description: string }[];
    @Prop({ default: 0 }) index: number;
    @Prop({ default: 0 }) count: number;
    @Prop({ default: false }) active: boolean;
    @Prop({ default: 'unset' }) right: string;
    @Prop({ default: 'unset' }) top: string;
    @Prop({ default: 'unset' }) left: string;
    @Prop({ default: 'unset' }) bottom: string;
    @Prop({ default: 'unset' }) margin: string;
    @Prop({ default: 'unset' }) transform: string;
    @Prop({ default: 'unset' }) width: string;

    public get previousIndex(): number {
        return this.index === 0 ? this.count - 1 : this.index - 1;
    }

    public get nextIndex(): number {
        return this.index === this.count - 1 ? 0 : this.index + 1;
    }
}
</script>

<style lang="less" scoped>
@import './FaqScreenshotItem.less';
</style>
