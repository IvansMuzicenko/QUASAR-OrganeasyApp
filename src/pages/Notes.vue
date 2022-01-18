<template>
  <q-page>
    <q-card class="flex justify-between q-py-sm">
      <q-card-section class="no-padding">
        <q-btn
          icon="arrow_back"
          flat
          class="absolute zindex-high"
          @click="$router.push('/')"
        />
      </q-card-section>

      <q-card-section class="no-padding">
        <q-btn
          icon="search"
          flat
          rounded
          class="zindex-high"
          @click="openSearch"
        ></q-btn>
        <q-btn icon="tune" flat class="zindex-high">
          <q-popup-proxy>
            <q-card>
              <q-card-section class="text-subtitle1 text-center">
                <q-icon name="filter_alt" /> Filter
              </q-card-section>
              <q-card-section>
                Priority:
                <q-radio
                  v-model="filtering.priority"
                  val="all"
                  label="All"
                  class="full-width"
                >
                </q-radio>
                <q-radio
                  v-model="filtering.priority"
                  val="favorites"
                  label="Favorites"
                  class="full-width"
                >
                </q-radio>
                <q-radio
                  v-model="filtering.priority"
                  val="common"
                  label="Common"
                  class="full-width"
                >
                </q-radio>
              </q-card-section>

              <q-separator></q-separator>

              <q-card-section class="text-subtitle1 text-center"
                ><q-icon name="sort" /> Sort
              </q-card-section>
              <q-card-section>
                <q-btn
                  :icon="
                    sorting.title == 'none'
                      ? 'last_page'
                      : sorting.title == 'asc'
                      ? 'vertical_align_bottom'
                      : 'vertical_align_top'
                  "
                  class="full-width"
                  @click="sortByTitle"
                >
                  Title
                </q-btn>
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </q-btn>
      </q-card-section>

      <p class="text-center text-h6 full-width">Notes</p>
    </q-card>

    <q-list separator bordered>
      <q-item
        v-for="(note, index) of notes"
        v-show="note['favorite']"
        :key="index"
        clickable
        :to="`/notes/${note['id']}`"
      >
        <q-item-section>
          {{ note['title'] }}
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            round
            :icon="note['favorite'] ? 'star' : 'star_outline'"
            :text-color="note['favorite'] ? 'yellow' : ''"
            @click.prevent="favoriteNote(note['favorite'], note['id'])"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <q-list separator bordered>
      <q-item
        v-for="(note, index) in notes"
        v-show="!note['favorite']"
        :key="index"
        clickable
        :to="`/notes/${note['id']}`"
      >
        <q-item-section>
          {{ note['title'] }}
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            round
            :icon="note['favorite'] ? 'star' : 'star_outline'"
            :text-color="note['favorite'] ? 'yellow' : ''"
            @click.prevent="favoriteNote(note['favorite'], note['id'])"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <div class="text-center q-my-md">
      <p v-if="!Object.keys(notes).length">You have not notes!</p>
      <q-btn color="secondary" @click="addNote()">Add note</q-btn>
    </div>
  </q-page>
</template>

<script>
import { getDatabase, ref, update } from 'firebase/database'
import addNoteForm from 'src/components/AddNoteForm.vue'
import Search from 'src/components/Search.vue'

const db = getDatabase()

export default {
  data() {
    return {
      sorting: {
        title: 'none',
        creationDate: 'desc'
      },
      filtering: {
        priority: 'all',
        group: ''
      }
    }
  },
  computed: {
    notes() {
      const vuexNotes = this.$store.getters['users/notes']
      let notes = []

      if (vuexNotes) {
        for (const vuexNote in vuexNotes) {
          notes.push(vuexNotes[vuexNote])
        }
        notes.sort((a, b) => {
          if (this.sorting.title != 'none') {
            if (this.sorting.title == 'asc') {
              if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
              if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
              return 0
            } else {
              if (a.title.toLowerCase() < b.title.toLowerCase()) return 1
              if (a.title.toLowerCase() > b.title.toLowerCase()) return -1
              return 0
            }
          }
        })
      }
      return notes
    }
  },
  methods: {
    addNote() {
      this.$q.dialog({
        component: addNoteForm
      })
    },
    openSearch() {
      this.$q.dialog({
        component: Search,
        componentProps: {
          searchType: 'notes'
        }
      })
    },
    sortByTitle() {
      this.sorting.title = this.sorting.title == 'asc' ? 'desc' : 'asc'
    },
    favoriteNote(favorite, id) {
      update(ref(db, `${this.$store.getters['users/userId']}/notes/id-${id}`), {
        favorite: !favorite
      })
    }
  }
}
</script>

<style></style>
