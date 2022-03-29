<template>
  <q-page>
    <q-card class="flex justify-between no-padding">
      <q-btn icon="arrow_back" class="zindex-high" flat @click="routerBack()" />
      <q-btn
        v-if="editState"
        icon="save"
        dense
        flat
        class="zindex-high"
        :disable="error"
        color="positive"
        @click="saveEdit()"
      >
        Save
      </q-btn>
      <q-btn
        v-if="!editState"
        icon="edit"
        class="zindex-high"
        color="secondary"
        flat
        @click="toggleEdit()"
      >
        Edit
      </q-btn>
      <q-btn
        v-if="editState"
        icon="delete"
        dense
        flat
        class="zindex-high"
        color="negative"
        @click="deleteNote()"
      >
        Delete
      </q-btn>
    </q-card>
    <q-card bordered>
      <q-separator color="black" />

      <q-card-section class="text-h6" @dblclick="toggleEdit()">
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
        <q-btn
          v-if="editState"
          dense
          flat
          @click="note.favorite = !note.favorite"
        >
          <q-icon
            :name="note['favorite'] ? 'star' : 'star_outline'"
            :color="note['favorite'] ? 'yellow' : ''"
          />
          Favorite
        </q-btn>
        <br />
        <q-btn v-if="editState" flat dense>
          <q-icon
            :name="note.category ? selectedCategory['icon'] : ''"
            :color="note.category ? selectedCategory['color'] : ''"
          />
          {{ selectedCategory['title'] || 'Uncategorized' }}
          <q-icon name="expand_more" />
          <q-menu anchor="bottom left" self="top left" auto-close>
            <p class="text-center text-subtitle1 no-margin">Categories</p>
            <q-list separator>
              <q-separator />
              <q-item
                clickable
                class="full-width text-subtitle1"
                @click="note.category = null"
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
                @click="note.category = category['id']"
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

        <q-input
          v-if="editState"
          v-model="note.title"
          outlined
          class="text-h6"
        />

        <q-separator v-if="!editState" color="black" />

        <p v-if="!editState" v-html="note.text" />

        <editor v-if="editState" v-model="note.text" />

        <q-card-section v-if="error">
          <p class="text-negative">Title or text is required</p>
        </q-card-section>

        <q-dialog ref="confirmDialog" @hide="onConfirmDialogHide">
          <q-card class="q-dialog-plugin">
            <q-card-section>
              Are you sure to premanently remove '{{ note.title }}' note?
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                label="Cancel"
                @click="onConfirmCancelClick"
              />
              <q-btn
                color="negative"
                label="Delete"
                @click="onConfirmDeleteClick"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { getDatabase, ref, update, remove } from 'firebase/database'

import Editor from 'src/components/common/form/Editor.vue'
import AddCategory from 'src/components/common/dialogs/AddCategory.vue'
const db = getDatabase()

export default {
  components: { Editor },
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
      }
    }
  },
  computed: {
    noteId() {
      return this.$route.params.id
    },
    error() {
      return (
        !this.note.text.replace('<br>', '') &&
        !this.note.title.replace('<br>', '')
      )
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
    noteId: {
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
    routerBack() {
      if (this.editState) {
        return this.$router.push(this.$route.path)
      }
      return this.$router.push('/notes')
    },
    toggleEdit() {
      this.$router.push(this.$route.path + '?edit=true')
    },
    deleteNote() {
      this.$refs.confirmDialog.show()
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

    saveEdit() {
      if (!this.note.title) {
        let titleText = this.note.text
          .replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '')
          .slice(0, 31)

        if (this.note.text.length > 30) titleText += '...'

        this.note.title = titleText
      }
      this.note.dateModified = Date.now()
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/notes/id-${this.noteId}`
        ),
        this.note
      )

      this.$router.push(this.$route.path)

      this.$q.notify({
        position: 'top',
        message: 'Note edited',
        color: 'blue',
        timeout: 1000
      })
    },

    onConfirmDialogHide() {
      this.$emit('hide')
    },
    onConfirmCancelClick() {
      this.$refs.confirmDialog.hide()
    },
    onConfirmDeleteClick() {
      remove(
        ref(
          db,
          `${this.$store.getters['users/userId']}/notes/id-${this.noteId}`
        )
      )
      this.deleteExists(this.noteId)
      this.$refs.confirmDialog.hide()
      this.$router.push('/notes')

      this.$q.notify({
        position: 'top',
        message: 'Note removed',
        color: 'red',
        timeout: 1000
      })
    },
    addCategory() {
      this.$q.dialog({
        component: AddCategory
      })
    },
    deleteExists(noteId) {
      const vuexTasks = this.$store.getters['users/tasks']
      for (const vuexDate in vuexTasks) {
        for (const vuexTask in vuexTasks[vuexDate]) {
          const task = vuexTasks[vuexDate][vuexTask]
          if (task.notes?.attachedNotes) {
            const attachedNotes = task.notes.attachedNotes
            if (attachedNotes.find((el) => el.id == noteId)) {
              let notesArray = []
              attachedNotes.forEach((el) => notesArray.push(el))

              notesArray.splice(
                notesArray.indexOf(attachedNotes.find((el) => el.id == noteId)),
                1
              )
              update(
                ref(
                  db,
                  `${
                    this.$store.getters['users/userId']
                  }/tasks/date-${task.time.slice(
                    0,
                    task.time.indexOf(' ')
                  )}/id-${task.id}/notes`
                ),
                {
                  attachedNotes: notesArray
                }
              )
            }
          }
        }
      }

      const vuexFreeTasks = this.$store.getters['users/freeTasks']
      for (const vuexFreeTask in vuexFreeTasks) {
        const freeTask = vuexFreeTasks[vuexFreeTask]
        if (freeTask.notes?.attachedNotes) {
          const attachedNotes = freeTask.notes.attachedNotes
          if (attachedNotes.find((el) => el.id == noteId)) {
            let notesArray = []
            attachedNotes.forEach((el) => notesArray.push(el))

            notesArray.splice(
              notesArray.indexOf(attachedNotes.find((el) => el.id == noteId)),
              1
            )
            update(
              ref(
                db,
                `${this.$store.getters['users/userId']}/freeTasks/id-${freeTask.id}/notes`
              ),
              {
                attachedNotes: notesArray
              }
            )
          }
        }
      }
    }
  }
}
</script>

<style></style>
