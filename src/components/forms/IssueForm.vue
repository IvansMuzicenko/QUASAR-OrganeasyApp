<template>
  <q-card class="q-dialog-plugin">
    <p class="text-center text-subtitle1 no-margin">
      {{ editIssue ? 'Edit issue' : 'New issue' }}
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
    </q-card-section>
    <q-card-actions align="right">
      <save-button v-if="editIssue" :error="error" @save-event="onSaveClick" />
      <q-btn
        v-if="!editIssue"
        color="positive"
        :disable="error"
        label="OK"
        @click="onOKClick"
      />
      <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      <item-remove
        v-if="editIssue"
        :item="editIssue"
        type="issue"
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
    editIssue: {
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
      return !this.form.title
    }
  },
  mounted() {
    this.updateData()
  },
  methods: {
    updateData() {
      //   if (this.editIssue) {
      //     this.form.id = this.editIssue.id
      //     this.form.title = this.editIssue.title
      //     this.form.time = this.editIssue.time
      //   }
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
