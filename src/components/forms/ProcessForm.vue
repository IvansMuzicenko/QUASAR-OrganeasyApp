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

    <q-card-actions align="center">
      <save-button
        v-if="editProcess"
        :error="error"
        @save-event="onSaveClick"
      />
      <q-btn
        v-if="!editProcess"
        color="positive"
        :disable="error"
        label="OK"
        @click="onOKClick"
      />
    </q-card-actions>

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
      <save-button
        v-if="editProcess"
        :error="error"
        @save-event="onSaveClick"
      />
      <q-btn
        v-if="!editProcess"
        color="positive"
        :disable="error"
        label="OK"
        @click="onOKClick"
      />
      <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      <item-remove
        v-if="editProcess"
        :item="editProcess"
        type="process"
        @delete-event="deleteClick()"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'
import ItemRemove from 'src/components/common/groups/ItemRemove.vue'

export default {
  components: { SaveButton, ItemRemove },
  props: {
    editProcess: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['confirmEvent', 'cancelEvent', 'saveEvent', 'deleteEvent'],
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
      this.$emit('confirmEvent', this.form)
    },
    onSaveClick() {
      this.$emit('saveEvent', this.form)
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    },
    deleteClick() {
      this.$emit('deleteEvent')
    }
  }
}
</script>
