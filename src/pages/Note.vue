<template>
  <q-page>
    <q-card class="flex justify-between no-padding">
      <back-button />

      <save-button
        v-if="editState"
        top-bar
        :error="error"
        @saveEvent="$refs.noteForm.onSaveClick()"
      />

      <edit-button v-if="!editState" ref="editButton" top-bar />

      <item-remove v-if="editState" :item="note" type="note" top-bar />
    </q-card>
    <q-card :bordered="!editState">
      <q-separator color="black" />

      <q-card-section
        :class="editState ? 'no-padding' : 'text-h6'"
        @dblclick="$refs.editButton ? $refs.editButton.toggleEdit() : null"
      >
        <q-item v-if="!editState" class="no-padding">
          <q-item-section thumbnail class="q-pr-none">
            <category-select
              :item-category="note.category || ''"
              rewrite
              :item-path="`notes/id-${note.id}`"
              icon-only
              @categorySelected="updateNoteData()"
            />
          </q-item-section>
          <q-item-section>
            {{ note.title }}
          </q-item-section>
          <q-item-section side class="q-pl-none">
            <favorite-button
              :item-favorite="note.favorite"
              :item-id="note.id"
              icon-only
              @favoriteChanged="updateNoteData()"
            />
          </q-item-section>
        </q-item>

        <q-separator v-if="!editState" color="black" />

        <p v-if="!editState" v-html="note.text" />

        <note-form
          v-if="editState"
          ref="noteForm"
          :edit-note="note"
          @saveEvent="onSaveClick"
          @cancelEvent="onCancelClick"
          @error="errorCheck"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { getDatabase, ref, update, remove } from 'firebase/database'

import NoteForm from 'src/components/forms/NoteForm.vue'

import ItemRemove from 'src/components/common/groups/ItemRemove.vue'

import BackButton from 'src/components/common/elements/buttons/BackButton.vue'
import EditButton from 'src/components/common/elements/buttons/EditButton.vue'
import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'
import CategorySelect from 'src/components/common/groups/CategorySelect.vue'
import FavoriteButton from 'src/components/common/elements/buttons/FavoriteButton.vue'

const db = getDatabase()

export default {
  components: {
    NoteForm,
    ItemRemove,
    BackButton,
    EditButton,
    SaveButton,
    CategorySelect,
    FavoriteButton
  },
  emits: ['hide'],
  data() {
    return {
      note: {
        id: '',
        title: '',
        text: '',
        favorite: false,
        category: null,
        dateModified: Date.now()
      },
      error: false
    }
  },
  computed: {
    path() {
      return this.$route.path
    },
    noteId() {
      return this.$route.params.id
    },
    editState() {
      return this.$route.query.edit ? true : false
    }
  },
  watch: {
    path: {
      handler: function () {
        this.updateNoteData()
      },
      immediate: true,
      flush: 'post'
    }
  },

  methods: {
    updateNoteData() {
      const note = this.$store.getters['users/notes'][`id-${this.noteId}`]
      if (!note) {
        return this.$router.push('/notes')
      }
      this.note = JSON.parse(JSON.stringify(note))
    },
    onSaveClick(form) {
      if (!form.title) {
        let titleText = form.text
          .replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '')
          .slice(0, 31)

        if (form.text.length > 30) titleText += '...'

        form.title = titleText
      }
      form.dateModified = Date.now()
      update(
        ref(db, `${this.$store.getters['users/userId']}/notes/id-${form.id}`),
        form
      )

      this.$router.push(this.path)

      this.updateNoteData()

      this.$q.notify({
        position: 'top',
        message: 'Note edited',
        color: 'blue',
        timeout: 1000
      })
    },
    onCancelClick() {
      this.$router.push(this.path)
    },
    errorCheck(errorState) {
      this.error = errorState
    }
  }
}
</script>

<style></style>
