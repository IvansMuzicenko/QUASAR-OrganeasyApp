<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <note-form @OKEvent="onOKClick" @cancelEvent="onCancelClick" />
  </q-dialog>
</template>

<script>
import { getDatabase, ref, set } from 'firebase/database'

import NoteForm from 'src/components/forms/NoteForm.vue'
import generateId from 'src/idGenerator.js'

export default {
  components: { NoteForm },
  emits: ['ok', 'hide'],
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

    onOKClick(form) {
      if (!form.title) {
        let titleText = form.text
          .replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '')
          .slice(0, 31)

        if (form.text.length > 30) titleText += '...'

        form.title = titleText
      }

      const newNote = {
        id: generateId(),
        title: form.title,
        text: form.text,
        favorite: form.favorite,
        category: form.category,
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
