<template>
    <div id="app" class="mac">
        <span v-if="web" class="web-warning-panel">{{ $t('web_wallet_warning') }}</span>
        <div class="version-panel">
            {{ $t('version') }}: <b>{{ packageVersion }}</b>
        </div>
        <!--
        Even when routes use the same component, treat them
        as distinct and create the component again.
        -->
        <RouterView :key="$route.fullPath" />
        <DisabledUiOverlay />
        <SpinnerLoading v-if="hasLoadingOverlay" />
    </div>
</template>

<script lang="ts">
import 'animate.css';
import { AppTs } from '@/app/AppTs.ts';
export default class App extends AppTs {}
</script>

<style lang="less">
@import '../views/resources/css/common.less';
@import '../views/resources/css/forms.less';
@import '../views/resources/css/modals.less';
@import '../views/resources/css/text.less';
</style>
