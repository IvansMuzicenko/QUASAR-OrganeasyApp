<template>
  <q-page>
    <q-card class="flex justify-between q-py-sm">
      <q-card-section class="no-padding">
        <q-btn
          icon="arrow_back"
          flat
          class="absolute"
          @click="$router.push('/')"
        />
      </q-card-section>

      <q-card-section class="no-padding">
        <q-btn icon="tune" flat>
          <q-popup-proxy>
            <q-card>
              <q-card-section class="text-subtitle1">
                <q-icon name="filter_alt"></q-icon> Filter
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
            </q-card>
            <q-card>
              <q-card-section class="text-subtitle1"
                ><q-icon name="sort"></q-icon> Sort
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
        v-for="(note, index) in notes"
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
      return this.$store.getters['users/notes']
    }
  },
  methods: {
    addNote() {
      this.$q.dialog({
        component: addNoteForm
      })
    },
    sortByTitle() {
      this.sorting.title = this.sorting.title == 'asc' ? 'desc' : 'asc'
      this.$store.dispatch('users/sortNotesByTitle', this.sorting.title)
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
