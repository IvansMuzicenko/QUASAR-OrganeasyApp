<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <category-form
      :edit-category="editCategory"
      @confirm-event="onOKClick"
      @save-event="onOKClick"
      @cancel-event="onCancelClick"
    />
  </q-dialog>
</template>

<script>
import { getDatabase, ref, set } from 'firebase/database'
import CategoryForm from 'src/components/forms/CategoryForm.vue'
const db = getDatabase()

export default {
  components: {
    CategoryForm
  },
  props: {
    logCategory: {
      type: Boolean,
      required: false,
      default: false
    },
    editCategory: {
      type: Object,
      required: false,
      default: null
    },
    selectOnSave: {
      type: Boolean,
      required: false,
      default: false
    }
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
          `${this.$store.getters['users/userId']}/${
            this.logCategory ? 'logCategories' : 'categories'
          }/id-${form['id']}`
        ),
        form
      )
      this.$emit('ok', this.selectOnSave ? form.id : false)
      this.$emit('hide')
    },
    onCancelClick() {
      this.$emit('hide')
    }
  }
}
</script>

<style></style>
