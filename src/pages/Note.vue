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
            <q-btn flat dense>
              <q-icon
                :name="note.category ? selectedCategory['icon'] : ''"
                :color="note.category ? selectedCategory['color'] : ''"
              />
              <q-icon name="expand_more" />
              <q-menu anchor="bottom left" self="top left" auto-close>
                <p class="text-center text-subtitle1 no-margin">Categories</p>
                <q-list separator>
                  <q-separator />
                  <q-item
                    clickable
                    class="full-width text-subtitle1"
                    @click="changeCategory(null)"
                  >
                    <div>
                      <q-icon />
                      None
                    </div>
                  </q-item>
                  <q-item
                    v-for="(category, categoryIndex) of categories"
                    :key="categoryIndex"
                    clickable
                    class="full-width text-subtitle1"
                    @click="changeCategory(category['id'])"
                  >
                    <div class="full-width">
                      <q-icon
                        :name="category['icon']"
                        :color="category['color']"
                        size="sm"
                      />
                      {{ category['title'] }}
                    </div>
                  </q-item>

                  <q-item
                    clickable
                    class="full-width text-subtitle1"
                    @click="addCategory"
                  >
                    <div>
                      <q-icon name="add" />
                      Add new
                    </div>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
          <q-item-section>
            {{ note.title }}
          </q-item-section>
          <q-item-section side class="q-pl-none">
            <q-btn
              flat
              round
              :icon="note['favorite'] ? 'star' : 'star_outline'"
              :text-color="note['favorite'] ? 'yellow' : ''"
              @click.prevent.stop="favoriteNote()"
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
import AddCategory from 'src/components/common/dialogs/AddCategory.vue'

import ItemRemove from 'src/components/common/groups/ItemRemove.vue'

import BackButton from 'src/components/common/elements/buttons/BackButton.vue'
import EditButton from 'src/components/common/elements/buttons/EditButton.vue'
import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'

const db = getDatabase()

export default {
  components: { NoteForm, ItemRemove, BackButton, EditButton, SaveButton },
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
    },
    categories() {
      const vuexCategories = this.$store.getters['users/categories']
      let categories = []
      for (const category in vuexCategories) {
        categories.push(vuexCategories[category])
      }
      return categories
    },
    selectedCategory() {
      const vuexCategories = this.$store.getters['users/categories']
      if (this.note.category) {
        return vuexCategories[`id-${this.note.category}`] || {}
      } else {
        return {}
      }
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
    changeCategory(category) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/notes/id-${this.noteId}`
        ),
        { category: category }
      )
      this.updateNoteData()
    },
    favoriteNote() {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/notes/id-${this.note.id}`
        ),
        {
          favorite: !this.note.favorite
        }
      )
      this.updateNoteData()
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
    addCategory() {
      this.$q.dialog({
        component: AddCategory
      })
    },
    errorCheck(errorState) {
      this.error = errorState
    }
  }
}
</script>

<style></style>
