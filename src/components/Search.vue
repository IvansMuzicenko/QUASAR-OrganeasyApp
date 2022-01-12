<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-input v-model="searchQuery" outlined type="search" label="Search">
        <template #prepend>
          <q-icon name="search"></q-icon>
        </template>
      </q-input>
      <q-card-section v-if="searchQuery.trim()" class="no-padding">
        <q-list
          v-if="searchType == 'all' || searchType == 'tasks'"
          bordered
          separator
        >
          <p class="text-body1 text-center">Tasks:</p>
          <q-separator></q-separator>
          <q-item
            v-for="(task, index) in tasks"
            :key="index"
            class="row"
            clickable
            :to="`/${task['time'].slice(0, task['time'].indexOf(' '))}/${
              task['id']
            }`"
          >
            <q-item-section class="col-3">{{ task['time'] }}</q-item-section>
            <q-item-section class="col">
              <p v-html="highlightSearch(task['title'])"></p>
            </q-item-section>
          </q-item>
        </q-list>

        <q-list
          v-if="searchType == 'all' || searchType == 'free-tasks'"
          bordered
          separator
        >
          <p class="text-body1 text-center">Free-tasks:</p>
          <q-separator></q-separator>
          <q-item
            v-for="(freeTask, index) in freeTasks"
            :key="index"
            clickable
            :to="`/free-tasks/${freeTask['id']}`"
          >
            <p v-html="highlightSearch(freeTask['title'])"></p>
          </q-item>
        </q-list>

        <q-list
          v-if="searchType == 'all' || searchType == 'notes'"
          bordered
          separator
        >
          <p class="text-body1 text-center">Notes:</p>
          <q-separator></q-separator>
          <q-item
            v-for="(note, index) of notes"
            :key="index"
            clickable
            :to="`/notes/${note['id']}`"
          >
            <p v-html="highlightSearch(note['title'])"></p>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    searchType: {
      type: String,
      required: false,
      default: 'all'
    }
  },
  emits: ['hide'],
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    tasks() {
      const vuexTasks = this.$store.getters['users/tasks']
      const tasks = []

      if (this.searchQuery.trim().length) {
        for (const dateTasks of Object.values(vuexTasks)) {
          for (const task of dateTasks) {
            tasks.push(task)
          }
        }
        return tasks.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(' ')
            .every((v) => item.title.toLowerCase().includes(v))
        })
      } else {
        return tasks
      }
    },
    freeTasks() {
      const vuexFreeTasks = this.$store.getters['users/freeTasks']
      const freeTasks = []

      if (this.searchQuery.trim().length) {
        for (const task in vuexFreeTasks) {
          freeTasks.push(vuexFreeTasks[task])
        }
        return freeTasks.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(' ')
            .every((v) => item.title.toLowerCase().includes(v))
        })
      } else {
        return freeTasks
      }
    },
    notes() {
      const vuexNotes = this.$store.getters['users/notes']
      const notes = []

      if (this.searchQuery.trim().length) {
        for (const note in vuexNotes) {
          notes.push(vuexNotes[note])
        }
        return notes.filter((item) => {
          return this.searchQuery
            .toLowerCase()
            .split(' ')
            .every((v) => item.title.toLowerCase().includes(v))
        })
      } else {
        return notes
      }
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
    highlightSearch(text) {
      const searchArray = this.searchQuery.split(' ')
      let modifiedText = ''
      let textArr = []
      for (const search of searchArray) {
        if (search.length) {
          let n = 0
          while (text.indexOf(search, n) >= 0) {
            const searchIndex = text.indexOf(search, n)
            textArr.push(
              `${searchIndex - 20 <= 0 ? '' : '...'}${text.slice(
                searchIndex - 20 >= 0 ? searchIndex - 20 : 0,
                searchIndex +
                  search.length +
                  20 +
                  (text.indexOf(search, searchIndex + search.length) -
                    searchIndex +
                    search.length >
                  20
                    ? 0
                    : 20 + search.length)
              )}${searchIndex + search.length + 20 >= text.length ? '' : `...`}`
            )
            n = searchIndex + (searchIndex >= 0 ? search.length + 20 : 0)
          }
        }
      }
      for (const part of [...new Set(textArr)]) {
        modifiedText += part + ([...new Set(textArr)].length > 1 ? '<br>' : '')
      }
      for (const search of searchArray) {
        if (search.length) {
          modifiedText = modifiedText.replaceAll(
            search,
            `<mark>${search}</mark>`
          )
        }
      }
      return modifiedText
    }
  }
}
</script>
