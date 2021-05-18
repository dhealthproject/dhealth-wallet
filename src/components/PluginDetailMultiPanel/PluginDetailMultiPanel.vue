<template>
    <div class="plugin-details-container">
        <NavigationLinks
            :direction="'horizontal'"
            :items="['summary', 'routes', 'components', 'database', 'settings']"
            :current-item-index="activeSubpage"
            translation-prefix="tab_plugin_details_"
            @selected="(i) => (activeSubpage = i)"
        />
        <div class="plugin-details-inner-container">
            <div v-if="activeSubpage === subpageIndexes['summary']"
                 class="subpage plugin-details-summary">
                <div class="subpage-field">
                    <label>{{$t('plugin_details_summary_last_update')}}</label>
                    <span>{{updatedDate}}</span>
                </div>
                <div class="subpage-field">
                    <label>{{$t('plugin_details_summary_readme')}}</label>
                    <IconButton
                        class="button-add align-right" 
                        size="18"
                        icon="ios-document"
                        :title="$t('plugin_details_summary_view_readme')"
                        @click="$emit('on-clicked-readme')" />
                </div>
                <div class="subpage-field">
                    <label>{{$t('plugin_details_summary_install_path')}}</label>
                    <span>{{selectedPlugin.installPath}}</span>
                </div>

                <hr class="separator" />
            </div>
            <div v-else-if="activeSubpage === subpageIndexes['routes']"
                 class="subpage plugin-details-routes">
                <div class="subpage-table">
                    <GenericTableDisplay
                        class="table-section"
                        :items="selectedPlugin.routes"
                        :fields="[
                            { name: 'name', label: 'plugin_table_header_route_name' },
                            { name: 'path', label: 'plugin_table_header_route_path' },
                            { name: 'children', label: 'plugin_table_header_route_children' },
                        ]"
                        :page-size="20"
                        @on-clicked-row="handleRouteClick"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_routes') }}
                            </h1>
                        </template>
                    </GenericTableDisplay>
                </div>
            </div>
            <div v-else-if="activeSubpage === subpageIndexes['components']"
                 class="subpage plugin-details-components">
                <div class="subpage-table">
                    <GenericTableDisplay
                        class="table-section"
                        :items="selectedPlugin.components"
                        :fields="[
                            { name: 'name', label: 'plugin_table_header_component_name' },
                            { name: 'props', label: 'plugin_table_header_component_props' },
                            { name: 'methods', label: 'plugin_table_header_component_methods' },
                        ]"
                        :page-size="20"
                        @on-clicked-row="handleComponentClick"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_components') }}
                            </h1>
                        </template>
                    </GenericTableDisplay>
                </div>
            </div>
            <div v-else-if="activeSubpage === subpageIndexes['storages']"
                 class="subpage plugin-details-storages">
                <div class="subpage-table">
                    <GenericTableDisplay
                        class="table-section"
                        :items="selectedPlugin.storages"
                        :fields="[
                            { name: 'table', label: 'plugin_table_header_storage_name' },
                            { name: 'entries', label: 'plugin_table_header_storage_entries' },
                        ]"
                        :page-size="20"
                        @on-clicked-row="handleStorageClick"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_storages') }}
                            </h1>
                        </template>
                    </GenericTableDisplay>
                </div>
            </div>
            <div v-else-if="activeSubpage === subpageIndexes['settings']"
                 class="subpage plugin-details-settings">
                <div class="subpage-table">
                    <GenericTableDisplay
                        class="table-section"
                        :items="selectedPlugin.settings"
                        :fields="[
                            { name: 'name', label: 'plugin_table_header_setting_name' },
                            { name: 'props', label: 'plugin_table_header_setting_value' },
                        ]"
                        :page-size="20"
                        @on-clicked-row="handleSettingClick"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_settings') }}
                            </h1>
                        </template>
                    </GenericTableDisplay>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PluginDetailMultiPanelTs } from './PluginDetailMultiPanelTs';
export default class PluginDetailMultiPanel extends PluginDetailMultiPanelTs {}
</script>

<style lang="less" scoped>
@import './PluginDetailMultiPanel.less';
</style>
