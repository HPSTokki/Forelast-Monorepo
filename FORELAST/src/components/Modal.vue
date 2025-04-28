<template>
    <div>
        <transition name = "modal">
            <div v-if = "isOpen" :class = "['modal-overlay', overlayClass]">
                <div :class = "['modal', modalClass]">
                    <div :class = "['modal-header', headerClass]" v-if = "$slots.header || title">
                        <slot name = "header">
                            <h2 v-if = "title">{{ title }}</h2>
                        </slot>
                        <button class = "close-button" @click = "close">✖</button>
                    </div>
                    <div :class = "['modal-image', imageClass]" v-if = "$slots.image || image">
                        <slot name="image">
                            <img :src = "imageSrc">
                        </slot>
                    </div>
                    <div :class = "['modal-body', bodyClass]" v-if = "$slots.body || body">
                        <slot name="body">
                            <p v-if="body">{{ body }}</p>
                        </slot>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps ({
    isOpen: Boolean,
    title: {
        type: String,
        default: 'Modal Title',
    },

    imageSrc: {
        type: String,
        required: true,
    },
    
    body: {
        type: String,
        default: 'Modal Body',
    },
    modalClass: String, 
    overlayClass: String, 
    headerClass: String, 
    imageClass: String, 
    bodyClass: String, 
    footerClass: String, 
})

const emit = defineEmits(['close'])

const close = () => {
    emit('close')
}

</script>

<style scoped lang = "scss">
@use '@/styles/_modal-mixin.scss' as modal;
@include modal.modal;
</style>