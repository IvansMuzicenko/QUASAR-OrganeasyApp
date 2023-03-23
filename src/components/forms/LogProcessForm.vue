<template>
  <q-card class="q-dialog-plugin">
    <p class="text-center text-subtitle1 no-margin">
      {{ editLogProcess ? 'Edit log-process' : 'New log-process' }}
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
    <q-card-section>
      Category:
      <category-select
        :item-category="form.category || ''"
        :log-category="true"
        :select-on-save="true"
        @category-selected="
          (selectedCategory) => (form.category = selectedCategory)
        "
      />
    </q-card-section>
    <q-card-section>
      <editor v-model="form.description" min-height="2rem" />
    </q-card-section>
    <q-card-actions align="right">
      <save-button
        v-if="editLogProcess"
        :error="error"
        @save-event="onSaveClick"
      />
      <q-btn
        v-if="!editLogProcess"
        color="positive"
        :disable="error"
        label="OK"
        @click="onOKClick"
      />
      <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      <item-remove
        v-if="editLogProcess"
        :item="editLogProcess"
        type="log-process"
        @delete-event="onCancelClick()"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'
import ItemRemove from 'src/components/common/groups/ItemRemove.vue'
import CategorySelect from 'src/components/common/groups/CategorySelect.vue'
import Editor from 'src/components/common/form/Editor.vue'

export default {
  components: { SaveButton, ItemRemove, Editor, CategorySelect },
  props: {
    editLogProcess: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['confirmEvent', 'cancelEvent', 'saveEvent', 'deleteEvent'],
  data() {
    return {
      form: {
        title: '',
        category: '',
        description: ''
      }
    }
  },
  computed: {
    error() {
      return !this.form.title
    }
  },
  mounted() {
    if (this.editLogProcess) {
      Object.assign(this.form, this.editLogProcess)
    }
  },
  methods: {
    onOKClick() {
      this.$emit('confirmEvent', this.form)
    },
    onSaveClick() {
      this.$emit('saveEvent', this.form)
    },
    onCancelClick() {
      this.$emit('cancelEvent')
    }
  }
}
</script>
