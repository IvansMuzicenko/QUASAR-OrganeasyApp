<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-input
          v-model="noteTitle"
          bottom-slots
          label="Title"
          lazy-rules
          :dense="false"
        />
        <q-checkbox v-model="favorite" label="Favorite" />

        <q-card-section>
          Category:
          <q-btn flat dense>
            <q-icon
              :name="category ? category.icon : ''"
              :color="category ? category.color : ''"
            />
            {{ category?.title || 'Uncategorized' }}
            <q-icon name="expand_more" />
            <q-menu anchor="bottom left" self="top left">
              <p class="text-center text-subtitle1 no-margin">Categories</p>
              <q-list separator>
                <q-separator />
                <q-item
                  clickable
                  class="full-width text-subtitle1"
                  @click="category = null"
                >
                  <div>
                    <q-icon />
                    None
                  </div>
                </q-item>
                <q-item
                  v-for="(listCategory, categoryIndex) of categories"
                  :key="categoryIndex"
                  clickable
                  class="full-width text-subtitle1"
                  @click="category = listCategory"
                >
                  <div class="full-width">
                    <q-icon
                      :name="listCategory['icon']"
                      :color="listCategory['color']"
                      size="sm"
                    />
                    {{ listCategory['title'] }}
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
        </q-card-section>
        <q-editor
          v-model="noteText"
          dense
          :toolbar="[
            [
              {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                list: 'only-icons',
                options: ['left', 'center', 'right', 'justify']
              },
              {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                options: ['left', 'center', 'right', 'justify']
              }
            ],
            [
              'bold',
              'italic',
              'strike',
              'underline',
              'subscript',
              'superscript'
            ],
            ['token', 'hr', 'link', 'custom_btn'],
            ['print', 'fullscreen'],
            [
              {
                label: $q.lang.editor.formatting,
                icon: $q.iconSet.editor.formatting,
                list: 'no-icons',
                options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
              },
              {
                label: $q.lang.editor.fontSize,
                icon: $q.iconSet.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'size-1',
                  'size-2',
                  'size-3',
                  'size-4',
                  'size-5',
                  'size-6',
                  'size-7'
                ]
              },
              {
                label: $q.lang.editor.defaultFont,
                icon: $q.iconSet.editor.font,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'default_font',
                  'arial',
                  'arial_black',
                  'comic_sans',
                  'courier_new',
                  'impact',
                  'lucida_grande',
                  'times_new_roman',
                  'verdana'
                ]
              },
              'removeFormat'
            ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

            ['undo', 'redo']
          ]"
          :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana'
          }"
        />
      </q-card-section>
      <q-card-section v-if="error">
        <p class="text-negative">Title or text is required</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          :disable="error"
          label="Add"
          @click="onOKClick"
        />
        <q-btn color="negative" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { getDatabase, ref, set } from 'firebase/database'
import AddCategoryForm from 'src/components/AddCategoryForm.vue'

export default {
  emits: ['ok', 'hide'],
  data() {
    return {
      noteTitle: '',
      noteText: '',
      favorite: false,
      category: null
    }
  },
  computed: {
    error() {
      return (
        !this.noteText.replace('<br>', '') &&
        !this.noteTitle.replace('<br>', '')
      )
    },
    categories() {
      const vuexCategories = this.$store.getters['users/categories']
      let categories = []
      for (const category in vuexCategories) {
        categories.push(vuexCategories[category])
      }
      return categories
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },

    hide() {
      this.$refs.dialog.hide()
    },

    onDialogHide() {
      this.$emit('hide')
    },

    onOKClick() {
      let noteId = this.noteTitle
      if (!this.noteTitle) {
        let titleText = this.noteText
          .replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '')
          .slice(0, 31)

        noteId = titleText.trim()
        if (this.noteText.length > 30) titleText += '...'

        this.noteTitle = titleText
      }

      const newNote = {
        id: noteId.replaceAll(' ', '-'),
        title: this.noteTitle,
        text: this.noteText,
        favorite: this.favorite,
        category: this.category,
        dateModified: Date.now()
      }

      const db = getDatabase()
      set(
        ref(
          db,
          `${this.$store.getters['users/userId']}/notes/id-${newNote.id}`
        ),
        newNote
      )

      this.$emit('ok')

      this.hide()
      this.$q.notify({
        position: 'top',
        message: 'Note added',
        color: 'green',
        timeout: 1000
      })
    },

    onCancelClick() {
      this.hide()
    },
    addCategory() {
      this.$q.dialog({
        component: AddCategoryForm
      })
    }
  }
}
</script>
