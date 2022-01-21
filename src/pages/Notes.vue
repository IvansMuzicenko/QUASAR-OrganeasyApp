<template>
  <q-page>
    <q-card class="q-py-sm">
      <p class="text-center text-h6 full-width no-margin">Notes</p>
      <q-card-section class="flex justify-between no-padding">
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
          />
          <q-btn
            icon="tune"
            :color="filtering.priority != 'all' ? 'green' : ''"
            flat
            class="zindex-high"
          >
            <q-popup-proxy>
              <q-card>
                <q-card-section class="text-subtitle1 text-center">
                  <q-icon name="filter_alt" />
                  Filter
                </q-card-section>
                <q-card-section>
                  Priority:
                  <q-radio
                    v-model="filtering.priority"
                    val="all"
                    label="All"
                    class="full-width"
                  />
                  <q-radio
                    v-model="filtering.priority"
                    val="favorites"
                    label="Favorites"
                    class="full-width"
                  />
                  <q-radio
                    v-model="filtering.priority"
                    val="common"
                    label="Common"
                    class="full-width"
                  />
                </q-card-section>

                <q-separator />

                <q-card-section class="text-subtitle1 text-center">
                  <q-icon name="sort" />
                  Sort
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
                  <q-btn
                    :icon="
                      sorting.dateModified == 'none'
                        ? 'last_page'
                        : sorting.dateModified == 'asc'
                        ? 'vertical_align_bottom'
                        : 'vertical_align_top'
                    "
                    class="full-width"
                    @click="sortByDateModified"
                  >
                    Date modified
                  </q-btn>
                </q-card-section>
              </q-card>
            </q-popup-proxy>
          </q-btn>
        </q-card-section>
      </q-card-section>
    </q-card>

    <q-list separator bordered>
      <q-item
        v-for="(note, index) of notes.filter(
          (el) =>
            el['favorite'] &&
            (filtering.priority == 'all' ||
              (filtering.priority == 'favorites' && el['favorite']))
        )"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => taskHold(event, note['id'])"
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
            @click.prevent.stop="favoriteNote(note['favorite'], note['id'])"
          />
        </q-item-section>
      </q-item>

      <q-item
        v-for="(note, index) in notes.filter(
          (el) =>
            !el['favorite'] &&
            (filtering.priority == 'all' ||
              (filtering.priority == 'common' && !el['favorite']))
        )"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => taskHold(event, note['id'])"
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
            @click.prevent.stop="favoriteNote(note['favorite'], note['id'])"
          />
        </q-item-section>
      </q-item>
      <q-popup-proxy
        v-if="holdedNote"
        :ref="`noteHold`"
        cover
        :breakpoint="10000"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card>
          <q-card-section class="text-center text-subtitle1">
            <p class="no-margin">Note</p>
            <p v-if="holdedNote['title']" class="no-margin">
              {{
                `${holdedNote['title'].slice(0, 10)}${
                  holdedNote['title'].length > 10 ? '...' : ''
                }`
              }}
            </p>
          </q-card-section>
          <q-card-section class="text-center">
            <q-btn
              color="primary"
              icon="visibility"
              :to="`/notes/${holdedNote['id']}`"
            >
              View
            </q-btn>
          </q-card-section>
          <q-card-section class="text-center">
            <q-btn
              color="secondary"
              icon="edit"
              :to="`/notes/${holdedNote['id']}?edit=true`"
            >
              Edit
            </q-btn>
          </q-card-section>
          <q-card-section class="text-center">
            <q-btn
              :color="holdedNote['favorite'] ? 'grey-6' : 'warning'"
              :icon="holdedNote['favorite'] ? 'star_outline' : 'star'"
              @click="favoriteNote(holdedNote['favorite'], holdedNote['id'])"
            >
              {{ holdedNote['favorite'] ? 'Unfavorite' : 'Favorite' }}
            </q-btn>
          </q-card-section>
        </q-card>
      </q-popup-proxy>
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
      holdedNoteId: '',
      sorting: {
        title: 'none',
        dateModified: 'desc'
      },
      filtering: {
        priority: 'all'
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
          } else if (this.sorting.dateModified != 'none') {
            if (this.sorting.dateModified == 'asc') {
              return (
                (a.dateModified ? a.dateModified : 0) -
                (b.dateModified ? b.dateModified : 0)
              )
            } else {
              return (
                (b.dateModified ? b.dateModified : 0) -
                (a.dateModified ? a.dateModified : 0)
              )
            }
          }
        })
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
        component: addNoteForm
      })
    },
    taskHold(event, id) {
      this.holdedNoteId = id
      this.$refs[`noteHold`].show()
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
      this.sorting.dateModified = 'none'
      this.sorting.title = this.sorting.title == 'asc' ? 'desc' : 'asc'
    },
    sortByDateModified() {
      this.sorting.title = 'none'
      this.sorting.dateModified =
        this.sorting.dateModified == 'asc' ? 'desc' : 'asc'
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
