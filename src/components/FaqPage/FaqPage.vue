<template>

    <div class="faq-items-container">
        <slot name="body" />
    </div>

</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';
 
@Component
export default class FaqPage extends Vue {
    @Prop({ default: 'general' }) topic: string;
}
</script>