<template>
    <div class="dashboard-outer-container">
        <div class="dashboard-inner-container">
            <div class="header-container">
                <NavigationTabs direction="horizontal" :parent-route-name="parentRouteName" />
            </div>
            <div class="bottom-container">
                <!--
                Even when routes use the same component, treat them
                as distinct and create the component again.
                -->
                <router-view :key="$route.fullPath" />
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
export default class Manager extends Vue {
    @Prop({ default: 'plugins' }) parentRouteName: string;
}
</script>

<style lang="less" scoped>
@import './Manager.less';
</style>
