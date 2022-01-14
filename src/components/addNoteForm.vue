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
        >
        </q-input>
        <q-checkbox v-model="favorite" label="Favorite"></q-checkbox>
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

export default {
  emits: ['ok', 'hide'],
  data() {
    return {
      noteTitle: '',
      noteText: '',
      favorite: false
    }
  },
  computed: {
    error() {
      return (
        !this.noteText.replace('<br>', '') &&
        !this.noteTitle.replace('<br>', '')
      )
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
    }
  }
}
</script>
