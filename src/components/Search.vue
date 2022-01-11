<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-input
        v-model="searchQuery"
        outlined
        type="search"
        label="Search"
      ></q-input>
      <q-card-section v-if="searchQuery" class="no-padding">
        <q-list bordered separator>
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
              {{ task['title'] }}
            </q-item-section>
          </q-item>
        </q-list>

        <q-list bordered separator>
          <p class="text-body1 text-center">Free-tasks:</p>
          <q-separator></q-separator>
          <q-item
            v-for="(freeTask, index) in freeTasks"
            :key="index"
            clickable
            :to="`/free-tasks/${freeTask['id']}`"
            >{{ freeTask['title'] }}</q-item
          >
        </q-list>

        <q-list bordered separator>
          <p class="text-body1 text-center">Notes:</p>
          <q-separator></q-separator>
          <q-item
            v-for="(note, index) of notes"
            :key="index"
            clickable
            :to="`/notes/${note['id']}`"
            >{{ note['title'] }}</q-item
          >
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
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

      for (const dateTasks of Object.values(vuexTasks)) {
        for (const task of dateTasks) {
          tasks.push(task)
        }
      }
      if (this.searchQuery) {
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
      for (const task in vuexFreeTasks) {
        freeTasks.push(vuexFreeTasks[task])
      }

      if (this.searchQuery) {
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
      for (const note in vuexNotes) {
        notes.push(vuexNotes[note])
      }

      if (this.searchQuery) {
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
    }
  }
}
</script>
