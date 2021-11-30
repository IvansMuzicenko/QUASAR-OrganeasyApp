<template>
  <q-page>
    <q-card bordered>
      <q-btn
        v-if="editState"
        icon="save"
        dense
        flat
        class=""
        @click="saveEdit()"
      >
      </q-btn>
      <q-btn
        v-if="!editState"
        icon="edit"
        dense
        flat
        class=""
        @click="toggleEdit()"
      >
      </q-btn>

      <q-separator color="black" />

      <q-card-section class="text-h6">
        <p v-if="!editState" @click="toggleEdit()">
          {{ noteTitle }}
        </p>
        <q-input v-if="editState" v-model="noteTitle" class="text-h6" />
      </q-card-section>
      <q-separator v-if="!editState" color="black" inset />
      <q-card-section>
        <p v-if="!editState" @click="toggleEdit()" v-html="noteText"></p>
        <q-editor
          v-if="editState"
          v-model="noteText"
          dense
          :toolbar="[
            [
              {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                list: 'only-icons',
                options: ['left', 'center', 'right', 'justify'],
              },
              {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                options: ['left', 'center', 'right', 'justify'],
              },
            ],
            [
              'bold',
              'italic',
              'strike',
              'underline',
              'subscript',
              'superscript',
            ],
            ['token', 'hr', 'link', 'custom_btn'],
            ['print', 'fullscreen'],
            [
              {
                label: $q.lang.editor.formatting,
                icon: $q.iconSet.editor.formatting,
                list: 'no-icons',
                options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
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
                  'size-7',
                ],
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
                  'verdana',
                ],
              },
              'removeFormat',
            ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

            ['undo', 'redo'],
          ]"
          :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana',
          }"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { getDatabase, ref, update } from "firebase/database";
export default {
  mounted() {
    const id = this.$route.path.slice(this.$route.path.lastIndexOf("/") + 1);
    const note = this.$store.getters["users/notes"][`id-${id}`];
    if (!note) {
      return this.$router.push("/notes");
    }
    this.noteId = id;
    this.noteTitle = note.title;
    this.noteText = note.text;
  },
  data() {
    return {
      noteTitle: "",
      noteText: "",
      noteId: "",
      editState: false,
    };
  },

  methods: {
    toggleEdit() {
      this.editState = !this.editState;
    },
    saveEdit() {
      const db = getDatabase();
      const noteChanges = {
        id: this.noteId,
        title: this.noteTitle,
        text: this.noteText,
      };
      const updates = {};
      updates[
        `${this.$store.getters["users/userId"]}/notes/id-${this.noteId}`
      ] = noteChanges;
      update(ref(db), updates);
      this.toggleEdit();
    },
  },
};
</script>

<style></style>
