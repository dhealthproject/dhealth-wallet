<template>
    <div class="modal-plugin-manager-wrapper">
        <Modal v-model="show" :title="`${$t(title)}`" :transfer="false" :footer-hide="true">
            <div class="container">
                <div class="body-text">
                    <p>{{ $t('modal_plugin_install_manager_explain') }}</p>
                </div>
                <hr class="separator" />

                <div class="scrolly">
                    <table>
                        <thead>
                            <tr>
                                <th><input type="checkbox" @change="toggleAll()" /></th>
                                <th style="text-align: center">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(plugin, index) in registryPlugins"
                                :class="{
                                    'plugin-row': true,
                                    'installed': isInstalled(plugin.npmModule),
                                    'selected': isSelected(plugin.npmModule),
                                }"
                                @click="togglePlugin(plugin.npmModule)"
                            >
                                <td class="vcenter">
                                    <input
                                        type="checkbox"
                                        :checked="isSelected(plugin.npmModule)"
                                        @change="togglePlugin(plugin.npmModule)"
                                    />
                                </td>
                                <td>
                                    <h3>{{ plugin.npmModule }}@{{ plugin.version }}</h3>
                                    <p>{{ plugin.description }}</p>
                                    <div class="badges-wrapper">
                                        <div class="label white" v-for="(badge, index) in plugin.badges" :style="{
                                            backgroundColor: badge.color
                                        }">
                                            <Icon :type="badge.icon" size="16" />
                                            <span>{{ badge.label }}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                    </table>
                </div>
            </div>
            <div class="footer">
                <Button
                    class="ivu-btn centered-button button-style button"
                    html-type="button"
                    @click.stop="onCancel"
                >{{ $t('cancel') }}</Button>

                <Button
                    class="ivu-btn centered-button button-style button"
                    html-type="button"
                    @click.stop="onSubmit"
                >{{ $t('continue') }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalPluginInstallManagerTs } from './ModalPluginInstallManagerTs';

export default class ModalPluginInstallManager extends ModalPluginInstallManagerTs {}
</script>
<style lang="less" scoped>
@import './ModalPluginInstallManager.less';
</style>
