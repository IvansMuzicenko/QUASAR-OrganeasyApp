<template>
  <q-editor
    :model-value="modelValue"
    :class="{ 'full-width': fullWidth }"
    :toolbar="[
      ['undo', 'redo'],
      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
      ['hr', 'link', 'code'],
      ['unordered', 'ordered', 'outdent', 'indent'],
      [
        {
          label: $q.lang.editor.fontSize,
          icon: $q.iconSet.editor.fontSize,
          fixedLabel: true,
          fixedIcon: true,
          list: 'no-icons',
          options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5']
        },
        {
          label: $q.lang.editor.align,
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          list: 'only-icons',
          options: ['left', 'center', 'right', 'justify']
        }
      ]
    ]"
    @update:modelValue="(newValue) => $emit('update:modelValue', newValue)"
  />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: false,
      default: ''
    },
    fullWidth: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update:modelValue']
}
</script>
