<template>
    <div class="table-container">
        <div class="table-component">
            <label>{{ $t('plugin_info_npm_module') }}</label>
            <span>{{ plugin.npmModule }}@v{{ plugin.version }}</span>

            <label>{{ $t('plugin_info_description') }}</label>
            <span>{{ plugin.description }}</span>

            <label>{{ $t('plugin_info_repository') }}</label>
            <a :href="plugin.repository.url" target="_blank">{{ $t('plugin_info_view_repository') }}</a>

            <label>{{ $t('plugin_info_homepage') }}</label>
            <a :href="plugin.homepage" target="_blank">{{ $t('plugin_info_view_homepage') }}</a>

            <label>{{ $t('plugin_info_author') }}</label>
            <a v-if="!!plugin.author.url" :href="plugin.author.url" target="_blank">{{ plugin.author.name }}</a>
            <span v-else>{{ plugin.author.name }}</span>
            <br />
            <a v-if="!!plugin.author.email" :href="mailtoAuthor" target="_blank">{{ $t('plugin_info_email_author') }}</a>
        </div>
    </div>
</template>

<script lang="ts">
import PluginInformationSidebarTs from './PluginInformationSidebarTs';
export default class PluginInformationSidebar extends PluginInformationSidebarTs {}
</script>

<style lang="less" scoped>
@import './PluginInformationSidebar.less';
</style>
