<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <category-form @OKEvent="onOKClick" @cancelEvent="onCancelClick" />
  </q-dialog>
</template>

<script>
import { getDatabase, ref, set } from 'firebase/database'
import CategoryForm from 'src/components/CategoryForm.vue'
const db = getDatabase()

export default {
  components: {
    CategoryForm
  },
  emits: ['ok', 'hide'],
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    onDialogHide() {
      this.$emit('hide')
    },
    onOKClick(form) {
      set(
        ref(
          db,
          `${this.$store.getters['users/userId']}/categories/id-${form['id']}`
        ),
        form
      )
      this.$emit('ok')
      this.$emit('hide')
    },
    onCancelClick() {
      this.$emit('hide')
    }
  }
}
</script>

<style></style>
