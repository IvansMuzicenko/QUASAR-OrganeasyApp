<template>
  <q-page>
    <p class="text-center">Settings</p>
    <a href="https://organeasy.netlify.app/" class="text-h6">Organeasy Web</a>
    <br />
    <q-btn color="red-8" @click="logout()">Logout</q-btn>
    <q-btn @click="recreateAll">Recreate all id's</q-btn>
  </q-page>
</template>

<script>
import { getDatabase, ref, update, remove, set } from 'firebase/database'
const db = getDatabase()
import generateId from 'src/idGenerator.js'

export default {
  methods: {
    async logout() {
      await this.$store.dispatch('users/logout')
      this.$q.localStorage.remove('user')
      this.$q.notify({
        position: 'top',
        message: 'Logged out',
        color: 'red',
        timeout: 1000
      })
    },
    recreateAll() {
      // tasks
      const vuexTasks = this.$store.getters['users/tasks']

      let tasks = []

      for (const vuexDate in vuexTasks) {
        for (const vuexTask in vuexTasks[vuexDate]) {
          const task = vuexTasks[vuexDate][vuexTask]
          tasks.push(JSON.parse(JSON.stringify(task)))
        }
      }

      for (const task of tasks) {
        remove(
          ref(
            db,
            `${
              this.$store.getters['users/userId']
            }/tasks/date-${task.time.slice(0, task.time.indexOf(' '))}/id-${
              task.id
            }`
          )
        )
        task['id'] = generateId()
        set(
          ref(
            db,
            `${
              this.$store.getters['users/userId']
            }/tasks/date-${task.time.slice(0, task.time.indexOf(' '))}/id-${
              task.id
            }`
          ),
          task
        )
      }
      // free-tasks
      const vuexFreeTasks = this.$store.getters['users/freeTasks']

      let freeTasks = []
      for (const vuexFreeTask in vuexFreeTasks) {
        const freeTask = vuexFreeTasks[vuexFreeTask]
        freeTasks.push(JSON.parse(JSON.stringify(freeTask)))
      }

      for (const freeTask of freeTasks) {
        remove(
          ref(
            db,
            `${this.$store.getters['users/userId']}/freeTasks/id-${freeTask.id}`
          )
        )
        freeTask['id'] = generateId()
        set(
          ref(
            db,
            `${this.$store.getters['users/userId']}/freeTasks/id-${freeTask.id}`
          ),
          freeTask
        )
      }
      // notes
      const vuexNotes = this.$store.getters['users/notes']

      let notes = []
      for (const vuexNote in vuexNotes) {
        const note = vuexNotes[vuexNote]
        notes.push(JSON.parse(JSON.stringify(note)))
      }

      for (const note of notes) {
        remove(
          ref(db, `${this.$store.getters['users/userId']}/notes/id-${note.id}`)
        )
        note['id'] = generateId()
        set(
          ref(db, `${this.$store.getters['users/userId']}/notes/id-${note.id}`),
          note
        )
      }
      // processes

      const vuexProcesses = this.$store.getters['users/processes']

      let processes = []
      for (const vuexProcess in vuexProcesses) {
        const process = vuexProcesses[vuexProcess]
        processes.push(JSON.parse(JSON.stringify(process)))
      }

      for (const process of processes) {
        remove(
          ref(
            db,
            `${this.$store.getters['users/userId']}/processes/id-${process.id}`
          )
        )
        process['id'] = generateId()
        set(
          ref(
            db,
            `${this.$store.getters['users/userId']}/processes/id-${process.id}`
          ),
          process
        )
      }
      // categories

      const vuexCategories = this.$store.getters['users/categories']

      let categories = []
      for (const vuexCategory in vuexCategories) {
        const category = vuexCategories[vuexCategory]
        categories.push(JSON.parse(JSON.stringify(category)))
      }

      for (const category of categories) {
        let pathsToChange = []
        remove(
          ref(
            db,
            `${this.$store.getters['users/userId']}/categories/id-${category.id}`
          )
        )
        for (const note of notes) {
          if (note['category'] && note['category']['id'] == category['id']) {
            pathsToChange.push(
              `${this.$store.getters['users/userId']}/notes/id-${note.id}`
            )
          }
        }
        for (const freeTask of freeTasks) {
          if (
            freeTask['category'] &&
            freeTask['category']['id'] == category['id']
          ) {
            pathsToChange.push(
              `${this.$store.getters['users/userId']}/freeTasks/id-${freeTask.id}`
            )
          }
        }

        category['id'] = generateId()
        for (const path of pathsToChange) {
          update(ref(db, path), { category: category.id })
        }
        set(
          ref(
            db,
            `${this.$store.getters['users/userId']}/categories/id-${category.id}`
          ),
          category
        )
      }
    }
  }
}
</script>
