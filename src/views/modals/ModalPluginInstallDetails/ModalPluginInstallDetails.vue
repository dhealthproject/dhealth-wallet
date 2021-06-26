<template>
    <div class="modal-plugin-install-details-wrapper">
        <Modal v-model="show" :title="`${$t(title)}`" :transfer="false" :footer-hide="true">
            <div class="container">
                <div class="body-text">
                    <p>{{ $t('modal_plugin_install_details_explain') }}</p>
                </div>
                <hr class="separator" />

                <FormRow>
                    <template v-slot:inputs>
                        <div v-if="hasPendingInstallation">
                            <p>{{ $t('modal_plugin_install_details_inprogress') }}</p>
                            <SpinnerDots />
                        </div>
                        <div v-else-if="hasCompletedInstallation" class="text-success">
                            <Icon type="md-checkbox-outline" size="22" />
                            <span>{{ $t('modal_plugin_install_details_completed') }}</span>
                        </div>
                        <div v-else-if="hasError" class="text-danger">
                            <Icon type="ios-warning-outline" size="22" />
                            <span>{{ $t('modal_plugin_install_details_error') }}</span>
                        </div>
                    </template>
                </FormRow>

                <FormRow v-if="hasBundlerProcess">
                    <template v-slot:inputs>
                        <div v-if="hasPendingBundler">
                            <p>{{ $t('modal_plugin_install_details_packaging') }}</p>
                            <SpinnerDots />
                        </div>
                        <div v-else-if="hasCompletedBundler" class="text-success">
                            <Icon type="md-checkbox-outline" size="22" />
                            <span>{{ $t('modal_plugin_install_details_packaging_done') }}</span>
                            <a :href="currentRecipeArtifact" target="_blank">{{ currentRecipeArtifact }}</a>
                        </div>
                    </template>
                </FormRow>
            </div>
            <div v-if="canCloseModal" class="footer">
                <Button class="ivu-btn centered-button button-style button" html-type="button" @click.stop="show = false">{{
                    $t('modal_plugin_install_details_button_close')
                }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalPluginInstallDetailsTs } from './ModalPluginInstallDetailsTs';

export default class ModalPluginInstallDetails extends ModalPluginInstallDetailsTs {}
</script>
<style lang="less" scoped>
@import './ModalPluginInstallDetails.less';
</style>
