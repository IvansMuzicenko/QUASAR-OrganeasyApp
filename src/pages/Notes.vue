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
                <q-card-section>
                  Category:
                  <q-radio
                    v-model="filtering.category"
                    val="all"
                    label="All"
                    class="full-width"
                  />
                  <q-radio
                    v-for="(category, index) of notesCategories"
                    :key="index"
                    v-model="filtering.category"
                    :val="category['id']"
                    class="full-width"
                  >
                    <q-icon
                      :name="category['icon']"
                      :color="category['color']"
                      size="xs"
                    />
                    {{ category['title'] }}
                  </q-radio>
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
              filtering.priority == 'favorites') &&
            (filtering.category == 'all' ||
              filtering.category == el['category'])
        )"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => taskHold(event, note['id'])"
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
        v-for="(note, index) in notes.filter(
          (el) =>
            !el['favorite'] &&
            (filtering.priority == 'all' || filtering.priority == 'common') &&
            (filtering.category == 'all' ||
              filtering.category == el['category'])
        )"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => taskHold(event, note['id'])"
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
          <q-card-section class="text-center">
            <p class="text-center no-margin">Category</p>
            <q-btn flat dense>
              <q-icon
                :name="
                  holdedNote.category
                    ? findCategory(holdedNote.category)['icon']
                    : ''
                "
                :color="
                  holdedNote.category
                    ? findCategory(holdedNote.category)['color']
                    : ''
                "
              />
              {{ findCategory(holdedNote.category)['title'] || 'None' }}
              <q-icon name="expand_more" />
              <q-menu anchor="bottom left" self="top left" auto-close>
                <p class="text-center text-subtitle1 no-margin">Categories</p>
                <q-list separator>
                  <q-separator />
                  <q-item
                    clickable
                    class="full-width text-subtitle1"
                    @click="changeCategory(null, holdedNote['id'])"
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
                    @click="changeCategory(category.id, holdedNote['id'])"
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
import AddNote from 'src/components/common/dialogs/AddNote.vue'
import AddCategory from 'src/components/common/dialogs/AddCategory.vue'
import Search from 'src/components/common/dialogs/Search.vue'

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
        priority: 'all',
        category: 'all'
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
    },
    categories() {
      const vuexCategories = this.$store.getters['users/categories']
      let categories = []
      for (const category in vuexCategories) {
        categories.push(vuexCategories[category])
      }
      return categories
    },
    notesCategories() {
      let notesCategories = []
      for (const note in this.notes) {
        const exactNote = this.notes[note]
        if (
          exactNote['category'] &&
          (!notesCategories.length ||
            !notesCategories.some(
              (element) => element['id'] == exactNote['category']
            ))
        ) {
          notesCategories.push(this.findCategory(exactNote['category']))
        }
      }
      return notesCategories
    }
  },

  methods: {
    addNote() {
      this.$q.dialog({
        component: AddNote
      })
    },
    taskHold(event, id) {
      this.holdedNoteId = id
      this.$refs[`noteHold`].show()
    },
    findCategory(id) {
      const vuexCategories = this.$store.getters['users/categories']
      if (id) {
        return vuexCategories[`id-${id}`] || {}
      } else {
        return {}
      }
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
    },
    changeCategory(category, id) {
      update(ref(db, `${this.$store.getters['users/userId']}/notes/id-${id}`), {
        category: category
      })
    },
    addCategory() {
      this.$q.dialog({
        component: AddCategory
      })
    }
  }
}
</script>

<style></style>
