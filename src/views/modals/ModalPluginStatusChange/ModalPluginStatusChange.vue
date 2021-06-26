<template>
    <div class="modal-plugin-status-change-wrapper">
        <Modal v-model="show" :title="`${$t(title)}`" :transfer="false" :footer-hide="true">
            <div class="container">
                <div class="body-text">
                    <p>{{ $t('modal_plugin_status_change_explain_' + status) }}</p>
                </div>
                <hr v-if="status === 'enabled' && selectedPlugin.permissions && selectedPlugin.permissions.length > 0" class="separator" />
                <div v-if="status === 'enabled' && selectedPlugin.permissions && selectedPlugin.permissions.length > 0" class="body-text">
                    <label>Permissions requested: </label>

                    <table>
                        <thead style="display: none;">
                            <tr>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(perm, index) in selectedPlugin.permissions" :key="index">
                                <td class="emphasized">{{ perm.name }}</td>
                                <td class="optional">{{ perm.description }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <hr class="separator" />
                <div class="body-text">
                    <p>{{ $t('modal_plugin_status_change_explain2_' + status) }}</p>
                </div>
            </div>
            <div class="footer">
                <button class="ivu-btn secondary-outline-button button-style button" @click="cancel">
                    {{ $t('cancel') }}
                </button>
                <Button
                    class="ivu-btn centered-button button-style button"
                    :class="{ 'danger-button': status === 'disabled', 'success-button': status === 'enabled' }"
                    :loading="performingUpdate"
                    html-type="submit"
                    @click.stop="confirm"
                >
                    {{ $t('button_plugin_status_' + status) }}
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalPluginStatusChangeTs } from './ModalPluginStatusChangeTs';

export default class ModalPluginStatusChange extends ModalPluginStatusChangeTs {}
</script>
<style lang="less" scoped>
@import './ModalPluginStatusChange.less';
</style>
