<template>
  <q-page>
    <q-card class="q-py-sm">
      <p class="text-center text-h6 full-width no-margin">Notes</p>
      <q-card-section class="flex justify-between no-padding">
        <q-card-section class="no-padding">
          <back-button />
        </q-card-section>

        <q-card-section class="no-padding">
          <q-btn
            icon="search"
            flat
            rounded
            class="zindex-high"
            @click="openSearch"
          />
          <filter-sort
            :items="notesArray"
            type="notes"
            @updateData="(modifiedItems) => (notes = modifiedItems)"
          />
        </q-card-section>
      </q-card-section>
    </q-card>

    <q-list separator bordered>
      <q-item
        v-for="(note, index) of notes.filter((el) => el['favorite'])"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => noteHold(event, note['id'])"
        clickable
        :to="`/notes/${note['id']}`"
      >
        <q-item-section thumbnail class="q-px-sm">
          <q-icon
            :name="note.category ? findCategory(note.category)['icon'] : ''"
            :color="note.category ? findCategory(note.category)['color'] : ''"
          />
        </q-item-section>
        <q-item-section>
          {{ note['title'] }}
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            round
            :icon="note['favorite'] ? 'star' : 'star_outline'"
            :text-color="note['favorite'] ? 'yellow' : ''"
            @click.prevent.stop="favoriteNote(note['favorite'], note['id'])"
          />
        </q-item-section>
      </q-item>

      <q-separator size="5px" />

      <q-item
        v-for="(note, index) in notes.filter((el) => !el['favorite'])"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => noteHold(event, note['id'])"
        clickable
        :to="`/notes/${note['id']}`"
      >
        <q-item-section thumbnail class="q-px-sm">
          <q-icon
            :name="note.category ? findCategory(note.category)['icon'] : ''"
            :color="note.category ? findCategory(note.category)['color'] : ''"
          />
        </q-item-section>
        <q-item-section>
          {{ note['title'] }}
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            round
            :icon="note['favorite'] ? 'star' : 'star_outline'"
            :text-color="note['favorite'] ? 'yellow' : ''"
            @click.prevent.stop="favoriteNote(note['favorite'], note['id'])"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <hold-menu ref="holdMenu" :item="holdedNote" type="note" />
    <div class="text-center q-my-md">
      <p v-if="!Object.keys(notes).length">You have not notes!</p>
      <q-btn color="secondary" @click="addNote()">Add note</q-btn>
    </div>
  </q-page>
</template>

<script>
import { getDatabase, ref, update } from 'firebase/database'
import AddNote from 'src/components/common/dialogs/AddNote.vue'

import Search from 'src/components/common/dialogs/Search.vue'
import FilterSort from 'src/components/common/groups/FilterSort.vue'

import HoldMenu from 'src/components/common/dialogs/HoldMenu.vue'

import BackButton from 'src/components/common/elements/buttons/BackButton.vue'

const db = getDatabase()

export default {
  components: {
    FilterSort,
    HoldMenu,
    BackButton
  },
  data() {
    return {
      notes: [],
      holdedNoteId: ''
    }
  },
  computed: {
    notesArray() {
      const vuexNotes = this.$store.getters['users/notes']
      let notes = []

      if (vuexNotes) {
        for (const vuexNote in vuexNotes) {
          notes.push(vuexNotes[vuexNote])
        }
      }
      return notes
    },
    holdedNote() {
      return this.$store.getters['users/notes'][`id-${this.holdedNoteId}`] || {}
    }
  },

  methods: {
    addNote() {
      this.$q.dialog({
        component: AddNote
      })
    },
    noteHold(event, id) {
      this.holdedNoteId = id
      this.$refs['holdMenu'].show()
    },
    findCategory(id) {
      return this.$store.getters['users/categories'][`id-${id}`] || {}
    },
    openSearch() {
      this.$q.dialog({
        component: Search,
        componentProps: {
          searchType: 'notes'
        }
      })
    }
  }
}
</script>

<style></style>
