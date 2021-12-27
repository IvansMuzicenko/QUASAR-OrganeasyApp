<template>
  <q-page>
    <q-card class="flex justify-between no-padding">
      <q-btn icon="arrow_back" flat @click="routerBack()"></q-btn>
      <q-btn
        v-if="editState"
        icon="save"
        dense
        flat
        :disable="error"
        color="positive"
        @click="saveEdit()"
      >
        Save
      </q-btn>
      <q-btn v-if="!editState" icon="edit" dense flat @click="toggleEdit()">
        Edit
      </q-btn>
      <q-btn
        v-if="!editState"
        icon="delete"
        dense
        flat
        color="negative"
        @click="deleteNote()"
      >
        Delete
      </q-btn>
    </q-card>
    <q-card bordered>
      <q-separator color="black" />

      <q-card-section class="text-h6" @dblclick="toggleEdit()">
        <p v-if="!editState">
          {{ note.title }}
        </p>
        <q-input v-if="editState" v-model="note.title" class="text-h6" />

        <q-separator v-if="!editState" color="black" inset />

        <p v-if="!editState" v-html="note.text"></p>
        <q-editor
          v-if="editState"
          v-model="note.text"
          dense
          :toolbar="[
            ['undo', 'redo'],
            [
              'bold',
              'italic',
              'strike',
              'underline',
              'subscript',
              'superscript'
            ],
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
            ['quote', 'unordered', 'ordered', 'outdent', 'indent']
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
const db = getDatabase()
export default {
  emits: ['hide'],
  data() {
    return {
      note: {
        id: '',
        title: '',
        text: ''
      },
      editState: false
    }
  },
  computed: {
    error() {
      return (
        !this.note.text.replace('<br>', '') &&
        !this.note.title.replace('<br>', '')
      )
    }
  },
  mounted() {
    const id = this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1)
    const note = this.$store.getters['users/notes'][`id-${id}`]
    if (!note) {
      return this.$router.push('/notes')
    }
    this.note = JSON.parse(JSON.stringify(note))
  },

  methods: {
    routerBack() {
      return this.$router.push('/notes')
    },
    toggleEdit() {
      this.editState = true
    },
    deleteNote() {
      this.$refs.confirmDialog.show()
    },

    saveEdit() {
      if (!this.note.title) {
        let titleText = this.note.text
          .replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '')
          .slice(0, 31)

        if (this.note.text.length > 30) titleText += '...'

        this.note.title = titleText
      }
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/notes/id-${this.note.id}`
        ),
        this.note
      )
      this.editState = false

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
          `${this.$store.getters['users/userId']}/notes/id-${this.note.id}`
        )
      )
      this.$refs.confirmDialog.hide()
      this.$router.push('/notes')

      this.$q.notify({
        position: 'top',
        message: 'Note removed',
        color: 'red',
        timeout: 1000
      })
    }
  }
}
</script>

<style></style>
