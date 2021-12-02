<template>
  <q-page>
    {{ task.title }}
    {{ task.time }}
    {{ task.endingTime }}
    {{ task.location }}
    {{ task.notifications }}
    {{ task.continuous }}
    {{ task.processes }}
    {{ task.subtasks }}
    {{ task.repeat }}
    <q-btn @click="editState = true"> Edit </q-btn>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      task: {
        id: '',
        title: '',
        time: '',
        endingTime: '',
        location: '',
        notifications: '',
        continuous: false,
        processes: [],
        subtasks: '',
        repeat: {}
      },
      editState: false
    }
  },
  mounted() {
    const path = this.$route.path
    const taskDate = path.slice(path.indexOf('/') + 1, path.lastIndexOf('/'))
    const taskId = path.slice(path.lastIndexOf('/') + 1)
    const task = this.$store.getters['users/tasks'][`date-${taskDate}`].find(
      (element) => Object.values(element).indexOf(`${taskId}`) >= 0
    )
    this.task = JSON.parse(JSON.stringify(task))
  }
}
</script>

<style></style>
