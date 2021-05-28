<template>
    <div class="table-container">
        <div class="table-component">
            <label>{{ $t('plugin_info_npm_module') }}</label>
            <span>{{ selectedPlugin.npmModule }}@v{{ selectedPlugin.version }}</span>

            <label>{{ $t('plugin_info_description') }}</label>
            <span>{{ selectedPlugin.description }}</span>

            <label>{{ $t('plugin_info_repository') }}</label>
            <a :href="selectedPlugin.repository.url" target="_blank">{{ $t('plugin_info_view_repository') }}</a>

            <label>{{ $t('plugin_info_homepage') }}</label>
            <a :href="selectedPlugin.homepage" target="_blank">{{ $t('plugin_info_view_homepage') }}</a>

            <label>{{ $t('plugin_info_author') }}</label>
            <a v-if="!!selectedPlugin.author.url" :href="selectedPlugin.author.url" target="_blank">{{ selectedPlugin.author.name }}</a>
            <span v-else>{{ selectedPlugin.author.name }}</span>
            <br />
            <a v-if="!!selectedPlugin.author.email" :href="mailtoAuthor" target="_blank">{{ $t('plugin_info_email_author') }}</a>
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
