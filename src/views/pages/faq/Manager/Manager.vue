<template>
    <div class="dashboard-outer-container">
        <div class="dashboard-inner-container">

            <div class="left-container">
                <div class="header-container">

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
    </div>
</template>
 
<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';
// child components
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue';
 
@Component({ components: { NavigationTabs } })
export default class Manager extends Vue {
    @Prop({ default: 'faq' }) parentRouteName: string;
}
</script>
 
<style lang="less" scoped>
@import './Manager.less';
</style>