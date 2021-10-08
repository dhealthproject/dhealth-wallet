<template>
    <div class="step-2-wrapper">
        <img src="@/views/resources/dhealth-network-long.png" />
        <Progress stroke-color="#ff00ff" :percent="percent" />
    </div>
</template>

<script lang="ts">
import GenerateMnemonicTs from './GenerateMnemonicTs';
export default class GenerateMnemonic extends GenerateMnemonicTs {}
</script>
<style lang="less" scoped>
@import './GenerateMnemonic.less';
</style>
