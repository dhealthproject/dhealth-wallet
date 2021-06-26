<template>
    <div>
        <AssetListPageWrap class="plugin-list-container">
            <template v-slot:table-section>
                <TableDisplay
                    asset-type="plugin"
                    class="table-section"
                    :pagination-type="'scroll'"
                    :page-size="20"
                    @on-clicked-row="onRowClick"
                    @on-add-plugin="onAddPluginClick"
                >
                    <template v-slot:table-title>
                        <h1 class="section-title">
                            {{ $t('title_plugin_manager') }}
                        </h1>
                    </template>
                </TableDisplay>
            </template>
        </AssetListPageWrap>

        <ModalConfirm
            v-model="showConfirmInstallPluginModal"
            :title="$t('modal_title_confirm_plugin_install_manager')"
            :message="$t('modal_text_confirm_plugin_install_manager')"
            :use-bigger-font="true"
            @confirmed="showInstallPluginModal = true"
        />

        <ModalPluginInstallManager
            v-if="showInstallPluginModal"
            :visible="showInstallPluginModal"
            :title="$t('modal_title_plugin_install_manager')"
            @confirmed="onConfirmInstallPlugins"
            @cancelled="showInstallPluginModal = false"
        />

        <ModalPluginInstallDetails
            v-if="showInstallDetailsModal"
            :visible="showInstallDetailsModal"
            :title="$t('modal_title_plugin_install_details')"
        />
    </div>
</template>

<script lang="ts">
import { ListTs } from './ListTs';
export default class List extends ListTs {}
</script>

<style lang="less" scoped>
@import './List.less';

.table-section {
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    height: 100%;
}
</style>
