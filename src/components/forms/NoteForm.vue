<template>
  <q-card :class="editNote ? '' : 'q-dialog-plugin'">
    <p v-if="!editNote" class="text-center text-subtitle1 no-margin">
      New note
      <q-btn
        icon="close"
        class="absolute-top-right"
        flat
        dense
        @click="onCancelClick"
      />
    </p>

    <q-card-section>
      <q-input
        v-model="form.title"
        bottom-slots
        label="Title"
        lazy-rules
        :dense="false"
      />
      <favorite-button
        :item-favorite="form.favorite || false"
        flat
        @favorite-changed="(favoriteState) => (form.favorite = favoriteState)"
      />

      <q-card-section class="q-pl-xs">
        Category:
        <category-select
          :item-category="form.category || ''"
          @category-selected="
            (selectedCategory) => (form.category = selectedCategory)
          "
        />
      </q-card-section>

      <editor v-model="form.text" />
    </q-card-section>
    <q-card-section v-if="error">
      <p class="text-negative">Title or text is required</p>
    </q-card-section>

    <q-card-actions align="right">
      <save-button v-if="editNote" :error="error" @save-event="onSaveClick" />
      <q-btn
        v-if="!editNote"
        color="primary"
        :disable="error"
        label="Add"
        @click="onOKClick"
      />
      <q-btn color="negative" label="Cancel" @click="onCancelClick" />
    </q-card-actions>
  </q-card>
</template>
<script>
import Editor from 'src/components/common/form/Editor.vue'

import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'
import CategorySelect from 'src/components/common/groups/CategorySelect.vue'
import FavoriteButton from 'src/components/common/elements/buttons/FavoriteButton.vue'

export default {
  components: { Editor, SaveButton, CategorySelect, FavoriteButton },
  props: {
    editNote: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['confirmEvent', 'cancelEvent', 'saveEvent', 'error'],
  data() {
    return {
      form: {
        id: '',
        title: '',
        text: '',
        favorite: false,
        category: null
      }
    }
  },
  computed: {
    error() {
      return (
        !this.form.text.replace('<br>', '') &&
        !this.form.title.replace('<br>', '')
      )
    }
  },
  watch: {
    error() {
      this.$emit('error', this.error)
    }
  },
  mounted() {
    this.updateData()
  },
  methods: {
    updateData() {
      if (this.editNote) {
        this.form.id = this.editNote.id
        this.form.title = this.editNote.title
        this.form.text = this.editNote.text
        this.form.favorite = this.editNote.favorite
        this.form.category = this.editNote.category || null
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
    }
  }
}
</script>
