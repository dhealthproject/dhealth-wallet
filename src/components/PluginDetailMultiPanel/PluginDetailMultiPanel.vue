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
                    <a :href="plugin.homepage" target="_blank">{{ $t('plugin_details_summary_view_readme') }}</a>
                </div>
                <div class="subpage-field">
                    <label>{{ $t('plugin_details_summary_install_path') }}</label>
                    <span>{{ plugin.installPath }}</span>
                </div>

                <hr class="separator break" />

                <div class="subpage-field w50">
                    <label>{{ $t('plugin_details_summary_dependencies') }}</label>
                    <GenericTableDisplay
                        :key="dataTimestamp"
                        class="table-section"
                        :items="pluginDependencies"
                        :fields="[{ name: 'name', label: $t('plugin_table_header_dependency_name') }]"
                        :page-size="5"
                        :disable-headers="true"
                        :disable-single-page-links="true"
                        :disable-rows-grid="true"
                        :disable-placeholder-grid="true"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_dependencies') }}
                            </h1>
                        </template>
                        <template v-slot:empty>
                            <h2 class="empty-list">No dependencies found.</h2>
                        </template>
                        <template v-slot:rows="props">
                            <GenericTableRow
                                v-for="(rowValues, index) in props.items"
                                :key="index"
                                :row-values="rowValues"
                                @click="handleDependencyClick(rowValues.name)"
                            />
                        </template>
                    </GenericTableDisplay>
                </div>

                <div class="subpage-field w50">
                    <label>{{ $t('plugin_details_summary_components') }}</label>
                    <GenericTableDisplay
                        :key="dataTimestamp"
                        class="table-section"
                        :items="pluginComponents"
                        :fields="[{ name: 'name', label: $t('plugin_table_header_component_name') }]"
                        :page-size="5"
                        :disable-headers="true"
                        :disable-single-page-links="true"
                        :disable-rows-grid="true"
                        :disable-placeholder-grid="true"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_components') }}
                            </h1>
                        </template>
                        <template v-slot:empty>
                            <h2 class="empty-list">No components found.</h2>
                        </template>
                        <template v-slot:rows="props">
                            <GenericTableRow
                                v-for="(rowValues, index) in props.items"
                                :key="index"
                                :row-values="rowValues"
                                @click="handleComponentClick(rowValues.name)"
                            />
                        </template>
                    </GenericTableDisplay>
                </div>
            </div>
            <div v-else-if="activeSubpage === subpageIndexes['routes']" class="subpage plugin-details-routes">
                <div class="subpage-table">
                    <GenericTableDisplay
                        :key="dataTimestamp"
                        class="table-section"
                        :items="pluginRoutes"
                        :fields="[
                            { name: 'name', label: $t('plugin_table_header_route_name') },
                            { name: 'path', label: $t('plugin_table_header_route_path') },
                            { name: 'children', label: $t('plugin_table_header_route_children') },
                        ]"
                        :page-size="20"
                        :disable-single-page-links="true"
                        :disable-rows-grid="true"
                        :disable-placeholder-grid="true"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_routes') }}
                            </h1>
                        </template>
                        <template v-slot:empty>
                            <h2 class="empty-list">No routes found.</h2>
                        </template>
                        <template v-slot:rows="props">
                            <GenericTableRow
                                v-for="(rowValues, index) in props.items"
                                :key="index"
                                :row-values="rowValues"
                                @click="handleRouteClick(rowValues.name)"
                            />
                        </template>
                    </GenericTableDisplay>
                </div>
            </div>
            <div v-else-if="activeSubpage === subpageIndexes['storages']" class="subpage plugin-details-storages">
                <div class="subpage-table">
                    <GenericTableDisplay
                        :key="dataTimestamp"
                        class="table-section"
                        :items="pluginStorages"
                        :fields="[
                            { name: 'storageKey', label: $t('plugin_table_header_storage_name') },
                            { name: 'entries', label: $t('plugin_table_header_storage_entries') },
                            { name: 'description', label: $t('plugin_table_header_storage_description') },
                        ]"
                        :page-size="20"
                        :disable-single-page-links="true"
                        :disable-rows-grid="true"
                        :disable-placeholder-grid="true"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_storages') }}
                            </h1>
                        </template>
                        <template v-slot:empty>
                            <h2 class="empty-list">No tables found.</h2>
                        </template>
                        <template v-slot:rows="props">
                            <GenericTableRow
                                v-for="(rowValues, index) in props.items"
                                :key="index"
                                :row-values="rowValues"
                                @click="handleStorageClick(rowValues.storageKey)"
                            />
                        </template>
                    </GenericTableDisplay>
                </div>
            </div>
            <div v-else-if="activeSubpage === subpageIndexes['settings']" class="subpage plugin-details-settings">
                <div class="subpage-table">
                    <GenericTableDisplay
                        :key="dataTimestamp"
                        class="table-section"
                        :items="pluginSettings"
                        :fields="[
                            { name: 'name', label: $t('plugin_table_header_setting_name') },
                            { name: 'value', label: $t('plugin_table_header_setting_value') },
                        ]"
                        :page-size="20"
                        :disable-single-page-links="true"
                        :disable-rows-grid="true"
                        :disable-placeholder-grid="true"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_settings') }}
                            </h1>
                        </template>
                        <template v-slot:empty>
                            <h2 class="empty-list">No settings found.</h2>
                        </template>
                        <template v-slot:rows="props">
                            <GenericTableRow
                                v-for="(rowValues, index) in props.items"
                                :key="index"
                                :row-values="rowValues"
                                @click="handleSettingClick(rowValues.name)"
                            />
                        </template>
                    </GenericTableDisplay>
                </div>
            </div>
            <div v-else-if="activeSubpage === subpageIndexes['permissions']" class="subpage plugin-details-permissions">
                <div class="subpage-table">
                    <GenericTableDisplay
                        :key="dataTimestamp"
                        class="table-section"
                        :items="pluginPermissions"
                        :fields="[
                            { name: 'name', label: $t('plugin_table_header_permission_name') },
                            { name: 'type', label: $t('plugin_table_header_permission_type') },
                            { name: 'target', label: $t('plugin_table_header_permission_target') },
                            { name: 'description', label: $t('plugin_table_header_permission_description') },
                        ]"
                        :page-size="20"
                        :disable-single-page-links="true"
                        :disable-rows-grid="true"
                        :disable-placeholder-grid="true"
                    >
                        <template v-slot:table-title>
                            <h1 class="section-title">
                                {{ $t('title_plugin_permissions') }}
                            </h1>
                        </template>
                        <template v-slot:empty>
                            <h2 class="empty-list">No permissions found.</h2>
                        </template>
                        <template v-slot:rows="props">
                            <GenericTableRow
                                v-for="(rowValues, index) in props.items"
                                :key="index"
                                :row-values="rowValues"
                                @click="handlePermissionClick(rowValues.name)"
                            />
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
