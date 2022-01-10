<template>
  <q-page>
    <q-card class="flex justify-between no-padding">
      <q-btn icon="arrow_back" flat @click="routerBack()"></q-btn>

      <q-btn
        v-if="!editState && task['continuous'] && !task['taskStarted']"
        icon="play_arrow"
        color="green"
        flat
        @click="continuousStart"
      >
        Start
      </q-btn>
      <q-btn
        v-if="
          !editState &&
          task['continuous'] &&
          task['taskStarted'] &&
          !task['taskEnded']
        "
        icon="stop"
        color="red"
        flat
        @click="continuousStop"
      >
        Stop
      </q-btn>
      <q-btn
        v-if="!editState"
        :icon="task['progress'] ? 'close' : 'check'"
        :color="task['progress'] ? 'red' : 'positive'"
        flat
        @click="changeProgress"
      >
        {{ task['progress'] ? 'Undone' : 'Done' }}
      </q-btn>
      <q-btn
        v-if="!editState"
        icon="edit"
        color="secondary"
        flat
        @click="toggleEdit()"
      >
        Edit
      </q-btn>

      <q-btn
        v-if="editState"
        icon="save"
        color="positive"
        flat
        @click="callEditClick"
      >
        Save
      </q-btn>
      <q-btn
        v-if="editState"
        icon="delete"
        color="negative"
        flat
        @click="onDeleteClick"
      >
        Delete
      </q-btn>
    </q-card>
    <q-list v-if="!editState" separator bordered>
      <q-item>
        <q-item-section avatar class="taskInfo">Title</q-item-section>
        <q-separator vertical spaced="md" />
        {{ task.title }}
      </q-item>
      <q-item>
        <q-item-section avatar class="taskInfo">Progress</q-item-section>
        <q-separator vertical spaced="md" />
        {{ task.progress ? 'Done' : 'Undone' }}
      </q-item>

      <q-item v-if="task.continuous">
        <q-item-section avatar class="taskInfo">Action</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section>
            {{ task.continuous ? 'Continuous' : 'Common' }}
          </q-item-section>
          <q-separator></q-separator>
          <q-item-section v-if="task.taskStarted && task.taskEnded"
            >Spent time : {{ timeSpent }} minutes</q-item-section
          >
          <q-separator></q-separator>
          <q-item-section v-if="task.taskStarted"
            >Started : {{ date(task.taskStarted) }}</q-item-section
          >
          <q-separator></q-separator>
          <q-item-section v-if="task.taskEnded"
            >Ended : {{ date(task.taskEnded) }}</q-item-section
          >
        </q-item-section>
      </q-item>

      <q-item
        v-if="
          task.notes && (task.notes.text || task.notes.attachedNotes.length)
        "
      >
        <q-item-section avatar class="taskInfo">Notes</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section v-if="task.notes.attachedNotes.length">
            <p class="text-center">Attached notes:</p>
            <q-list separator bordered>
              <q-item
                v-for="note of task.notes.attachedNotes"
                :key="note"
                :to="`/notes/${findNoteId(note)}`"
              >
                {{ note }}
              </q-item>
            </q-list>
            <q-separator spaced="sm" />
          </q-item-section>
          <q-item-section v-if="task.notes.text" class="no-margin">
            <p class="text-center">Note:</p>
            <q-card class="q-pa-sm">
              <p v-html="task.notes.text"></p>
            </q-card>
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item v-if="task.subtasks">
        <q-item-section avatar class="taskInfo">Subtasks</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section
            v-for="(subtask, index) in task.subtasks"
            :key="subtask"
            class="cursor-pointer"
            :class="subtask['progress'] ? 'text-strike' : ''"
            @click="changeSubtaskProgress(task.id, index, subtask['progress'])"
          >
            <q-separator v-if="index > 0" spaced="sm" />
            {{ subtask['title'] }}
          </q-item-section>
        </q-item-section>
      </q-item>
    </q-list>

    <free-task-form
      v-if="editState"
      ref="freeTaskForm"
      :edit-task="task"
      @editEvent="onEditClick"
      @cancelEvent="onCancelClick"
      @subtaskEvent="changeSubtaskProgress"
    />
    <q-dialog ref="confirmDialog" @hide="onConfirmDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          Are you sure to premanently remove '{{ task.title }}' task?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Cancel" @click="onConfirmCancelClick" />
          <q-btn
            color="negative"
            label="Delete"
            @click="onConfirmDeleteClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { getDatabase, ref, set, update, remove } from 'firebase/database'
import { date } from 'quasar'
import FreeTaskForm from 'src/components/FreeTaskForm.vue'

const db = getDatabase()

export default {
  components: {
    FreeTaskForm
  },
  emits: ['hide'],
  data() {
    return {
      task: {
        id: '',
        title: '',
        progress: false,
        continuous: false,
        taskStarted: '',
        taskEnded: '',

        notes: {
          text: '',
          attachedNotes: []
        },

        subtasks: []
      }
    }
  },
  computed: {
    editState() {
      return this.$route.query.edit ? true : false
    },
    timeSpent() {
      if (this.task.taskEnded && this.task.taskStarted) {
        const timeSpent = date.getDateDiff(
          this.task.taskEnded,
          this.task.taskStarted,
          'minutes'
        )
        return timeSpent
      }
      return 0
    }
  },
  beforeMount() {
    this.updateTaskData()
  },
  methods: {
    findNoteId(title) {
      const notes = this.$store.getters['users/notes']

      for (const note in notes) {
        if (notes[note]['title'] == title) {
          return notes[note]['id']
        }
      }
    },
    date(ms) {
      return date.formatDate(ms, 'DD-MM-YYYY HH:mm')
    },

    updateTaskData() {
      const path = this.$route.path
      const taskId = path.slice(path.lastIndexOf('/') + 1)
      const freeTask = this.$store.getters['users/freeTasks'][`${taskId}`]
      if (!freeTask) {
        return this.$router.push('/free-tasks')
      }
      this.task = JSON.parse(JSON.stringify(freeTask))
    },
    routerBack() {
      return this.$router.push('/free-tasks')
    },
    toggleEdit() {
      this.$router.push(this.$route.path + '?edit=true')
    },
    callEditClick() {
      this.$refs.freeTaskForm.onEditClick()
    },
    changeSubtaskProgress(taskId, index, progress) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${taskId}/subtasks/${index}`
        ),
        { progress: !progress }
      )
      this.updateTaskData()
    },
    onEditClick(form) {
      const updateTodo = {
        id: form.id,
        title: form.todoTitle,
        progress: form.progress,
        notes: form.toggleNotes ? form.notes : null,
        continuous: form.continuousState,
        subtasks: form.toggleSubtasks ? form.subtasks : null
      }
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${updateTodo.id}/`
        ),
        updateTodo
      )
      this.updateTaskData()
      this.$router.push(this.$route.path)

      this.$q.notify({
        position: 'top',
        message: 'Task edited',
        color: 'blue',
        timeout: 1000
      })
    },
    continuousStart() {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.task.id}`
        ),
        {
          taskStarted: Date.now()
        }
      )
      this.updateTaskData()
    },
    continuousStop() {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.task.id}`
        ),
        {
          taskEnded: Date.now()
        }
      )
      this.updateTaskData()
    },
    changeProgress() {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.task.id}`
        ),
        { progress: !this.task.progress }
      )
      this.updateTaskData()
    },
    onDeleteClick() {
      this.$refs.confirmDialog.show()
    },
    onCancelClick() {
      this.$router.push(this.$route.path)
    },
    onConfirmDeleteClick() {
      remove(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.task.id}`
        )
      )
      this.$router.push('/')

      this.$q.notify({
        position: 'top',
        message: 'Task removed',
        color: 'red',
        timeout: 1000
      })
    },
    onConfirmDialogHide() {
      this.$emit('hide')
    },
    onConfirmCancelClick() {
      this.$refs.confirmDialog.hide()
    }
  }
}
</script>

<style>
.taskInfo {
  width: 5rem;
  overflow-wrap: anywhere;
  padding: 0;
}
</style>