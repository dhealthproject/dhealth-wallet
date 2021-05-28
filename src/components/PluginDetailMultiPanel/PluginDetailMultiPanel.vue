<template>
    <div class="plugin-details-container">
        <NavigationLinks
            :direction="'horizontal'"
            :items="['summary', 'routes', 'database', 'settings', 'permissions']"
            :current-item-index="activeSubpage"
            translation-prefix="tab_plugin_details_"
            @selected="(i) => (activeSubpage = i)"
        />
        <div class="plugin-details-inner-container">
            <div v-if="activeSubpage === subpageIndexes['summary']" class="subpage plugin-details-summary">
                <div class="subpage-field">
                    <label>{{ $t('plugin_details_summary_last_update') }}</label>
                    <span>{{ updatedDate }}</span>
                </div>
                <div class="subpage-field">
                    <label>{{ $t('plugin_details_summary_readme') }}</label>
                    <a :href="selectedPlugin.homepage" target="_blank">{{ $t('plugin_details_summary_view_readme') }}</a>
                </div>
                <div class="subpage-field">
                    <label>{{ $t('plugin_details_summary_install_path') }}</label>
                    <span>{{ selectedPlugin.installPath }}</span>
                </div>

                <hr class="separator break" />

                <div class="subpage-field w50">
                    <label>{{ $t('plugin_details_summary_dependencies') }}</label>
                    <GenericTableDisplay
                        class="table-section"
                        :items="getFormattedDependencies()"
                        :fields="[{ name: 'name', label: 'plugin_table_header_dependency_name' }]"
                        :page-size="5"
                        :disable-headers="true"
                        :disable-single-page-links="true"
                        @on-clicked-row="handleDependencyClick"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_components') }}
                            </h1>
                        </template>
                    </GenericTableDisplay>
                </div>

                <div class="subpage-field w50">
                    <label>{{ $t('plugin_details_summary_components') }}</label>
                    <GenericTableDisplay
                        class="table-section"
                        :items="getFormattedComponents()"
                        :fields="[{ name: 'name', label: 'plugin_table_header_component_name' }]"
                        :page-size="5"
                        :disable-headers="true"
                        :disable-single-page-links="true"
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
            <div v-else-if="activeSubpage === subpageIndexes['routes']" class="subpage plugin-details-routes">
                <div class="subpage-table">
                    <GenericTableDisplay
                        class="table-section"
                        :items="getFormattedRoutes()"
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
            <div v-else-if="activeSubpage === subpageIndexes['storages']" class="subpage plugin-details-storages">
                <div class="subpage-table">
                    <GenericTableDisplay
                        class="table-section"
                        :items="getFormattedStorages()"
                        :fields="[
                            { name: 'storageKey', label: 'plugin_table_header_storage_name' },
                            { name: 'entries', label: 'plugin_table_header_storage_entries' },
                            { name: 'description', label: 'plugin_table_header_storage_description' },
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
            <div v-else-if="activeSubpage === subpageIndexes['settings']" class="subpage plugin-details-settings">
                <div class="subpage-table">
                    <GenericTableDisplay
                        class="table-section"
                        :items="getFormattedSettings()"
                        :fields="[
                            { name: 'name', label: 'plugin_table_header_setting_name' },
                            { name: 'value', label: 'plugin_table_header_setting_value' },
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
            <div v-else-if="activeSubpage === subpageIndexes['permissions']" class="subpage plugin-details-permissions">
                <div class="subpage-table">
                    <GenericTableDisplay
                        class="table-section"
                        :items="selectedPlugin.permissions"
                        :fields="[
                            { name: 'name', label: 'plugin_table_header_permission_name' },
                            { name: 'type', label: 'plugin_table_header_permission_type' },
                            { name: 'target', label: 'plugin_table_header_permission_target' },
                            { name: 'description', label: 'plugin_table_header_permission_description' },
                        ]"
                        :page-size="20"
                        @on-clicked-row="handlePermissionClick"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_permissions') }}
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
