<template>
  <q-card class="q-dialog-plugin">
    <p class="text-center text-subtitle1 no-margin">
      {{ editProcess ? 'Edit process' : 'New process' }}
      <q-btn
        icon="close"
        class="absolute-top-right"
        flat
        dense
        @click="onCancelClick"
      />
    </p>
    <q-card-section>
      <q-input v-model="form.title" bottom-slots label="Title" :dense="false" />
      <q-input
        v-model.number="form.time"
        bottom-slots
        type="number"
        label="Time"
        suffix="Minutes"
        min="1"
        :dense="false"
      />
    </q-card-section>
    <q-card-section v-if="error">
      <p class="text-negative">
        Title must not be empty and time must be greater than 0
      </p>
    </q-card-section>
    <q-card-actions align="right">
      <save-button v-if="editProcess" :error="error" @saveEvent="onSaveClick" />
      <q-btn
        v-if="!editProcess"
        color="positive"
        :disable="error"
        label="OK"
        @click="onOKClick"
      />
      <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      <q-btn
        v-if="editProcess"
        color="negative"
        label="Delete"
        @click="onDeleteClick"
      />
    </q-card-actions>

    <q-dialog ref="confirmDialog" @hide="onConfirmDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          Are you sure to premanently remove '{{ form.title }}' process?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Cancel" @click="onConfirmCancelClick" />
          <q-btn
            color="negative"
            icon="delete"
            label="Delete"
            @click="onConfirmDeleteClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'
export default {
  components: { SaveButton },
  props: {
    editProcess: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['OKEvent', 'cancelEvent', 'saveEvent', 'deleteEvent'],
  data() {
    return {
      form: {
        id: '',
        title: '',
        time: 0
      }
    }
  },
  computed: {
    error() {
      return !this.form.title || this.form.time <= 0
    }
  },
  mounted() {
    this.updateData()
  },
  methods: {
    updateData() {
      if (this.editProcess) {
        this.form.id = this.editProcess.id
        this.form.title = this.editProcess.title
        this.form.time = this.editProcess.time
      }
    },
    onOKClick() {
      this.$emit('OKEvent', this.form)
    },
    onSaveClick() {
      this.$emit('saveEvent', this.form)
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    },
    onDeleteClick() {
      this.$refs.confirmDialog.show()
    },
    onConfirmDialogHide() {
      this.$refs.confirmDialog.hide()
    },
    onConfirmCancelClick() {
      this.$refs.confirmDialog.hide()
    },
    onConfirmDeleteClick() {
      this.$emit('deleteEvent', this.form.id)
      this.onConfirmDialogHide()
      this.onCancelClick()
    }
  }
}
</script>
