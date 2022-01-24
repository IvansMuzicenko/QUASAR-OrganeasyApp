<template>
  <q-page>
    <q-card class="flex justify-between no-padding">
      <q-btn icon="arrow_back" flat class="zindex-high" @click="routerBack()" />

      <q-btn
        v-if="!editState && task['continuous'] && !task['continuousStarted']"
        icon="play_arrow"
        color="green"
        flat
        class="zindex-high"
        @click="continuousStart"
      >
        Start
      </q-btn>
      <q-btn
        v-if="
          !editState &&
          task['continuous'] &&
          task['continuousStarted'] &&
          !task['continuousEnded']
        "
        class="zindex-high"
        icon="stop"
        color="red"
        flat
        @click="continuousStop"
      >
        Stop
      </q-btn>
      <q-btn
        v-if="!editState"
        class="zindex-high"
        :icon="task['progress'] ? 'close' : 'check'"
        :color="task['progress'] ? 'red' : 'positive'"
        flat
        @click="changeProgress"
      >
        {{ task['progress'] ? 'Undone' : 'Done' }}
      </q-btn>
      <q-btn
        v-if="!editState"
        class="zindex-high"
        icon="edit"
        color="secondary"
        flat
        @click="toggleEdit()"
      >
        Edit
      </q-btn>

      <q-btn
        v-if="editState"
        class="zindex-high"
        icon="save"
        color="positive"
        flat
        @click="callEditClick"
      >
        Save
      </q-btn>
      <q-btn
        v-if="editState"
        class="zindex-high"
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
      <q-item v-if="task.progress && task.finishedDate">
        <q-item-section avatar class="taskInfo">Completion Date</q-item-section>
        <q-separator vertical spaced="md" />
        {{ formatUnix(task.finishedDate) }}
      </q-item>

      <q-item>
        <q-item-section avatar class="taskInfo">Priority</q-item-section>
        <q-separator vertical spaced="md" />
        <q-icon
          name="fiber_manual_record"
          :color="
            task.priority === 1
              ? 'green'
              : task.priority === 2
              ? 'yellow'
              : 'red-11'
          "
        />
        {{
          task.priority == 1 ? 'High' : task.priority == 2 ? 'Medium' : 'Low'
        }}
      </q-item>

      <q-item v-if="task.continuous">
        <q-item-section avatar class="taskInfo">Action</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section>
            {{ task.continuous ? 'Continuous' : 'Common' }}
          </q-item-section>
          <q-separator />
          <q-item-section v-if="task.continuousStarted && task.continuousEnded">
            Spent time : {{ timeSpent }} minutes
          </q-item-section>
          <q-separator />
          <q-item-section v-if="task.continuousStarted">
            Started : {{ formatUnix(task.continuousStarted) }}
          </q-item-section>
          <q-separator />
          <q-item-section v-if="task.continuousEnded">
            Ended : {{ formatUnix(task.continuousEnded) }}
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item
        v-if="task.notes && (task.notes.text || task.notes.attachedNotes)"
      >
        <q-item-section avatar class="taskInfo">Notes</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section v-if="task.notes.attachedNotes">
            <p class="text-center">Attached notes:</p>
            <q-list separator bordered>
              <q-item
                v-for="note of task.notes.attachedNotes"
                :key="note"
                :to="`/notes/${note['id']}`"
              >
                <q-icon
                  color="yellow"
                  :name="isNoteFavorite(note['id']) ? 'star' : ''"
                />
                {{ note['title'] }}
              </q-item>
            </q-list>
            <q-separator spaced="sm" />
          </q-item-section>
          <q-item-section v-if="task.notes.text" class="no-margin">
            <p class="text-center">Note:</p>
            <q-card class="q-pa-sm">
              <p v-html="task.notes.text" />
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
            @click="changeSubtaskProgress(index, subtask['progress'])"
          >
            <q-separator v-if="index > 0" size="5px" spaced="sm" />
            <q-item-label :class="subtask['progress'] ? 'text-strike' : ''">
              {{ subtask['title'] }}
            </q-item-label>
            <q-separator
              v-if="subtask['subtasks'] && subtask['subtasks'].length"
              spaced="sm"
            />
            <q-list separator>
              <q-item
                v-for="(subSubtask, subIndex) of subtask['subtasks']"
                :key="subIndex"
                dense
                clickable
                @click.prevent.stop="
                  changeSubSubtaskProgress(
                    index,
                    subIndex,
                    subSubtask['progress']
                  )
                "
              >
                <q-item-label
                  :class="subSubtask['progress'] ? 'text-strike' : ''"
                >
                  ~ {{ subSubtask['title'] }}
                </q-item-label>
              </q-item>
            </q-list>
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
        finishedDate: '',
        priority: 3,
        continuous: false,
        continuousStarted: '',
        continuousEnded: '',

        notes: {
          text: '',
          attachedNotes: []
        },

        subtasks: []
      }
    }
  },
  computed: {
    path() {
      return this.$route.path
    },
    taskId() {
      return this.$route.params.id
    },
    editState() {
      return this.$route.query.edit ? true : false
    },
    timeSpent() {
      if (this.task.continuousEnded && this.task.continuousStarted) {
        const timeSpent = date.getDateDiff(
          this.task.continuousEnded,
          this.task.continuousStarted,
          'minutes'
        )
        return timeSpent
      }
      return 0
    }
  },
  watch: {
    path: {
      handler: function () {
        this.updateTaskData()
      },
      immediate: true,
      flush: 'post'
    }
  },
  methods: {
    formatUnix(unix) {
      return date.formatDate(unix, 'DD-MM-YYYY HH:mm')
    },

    updateTaskData() {
      const freeTask =
        this.$store.getters['users/freeTasks'][`id-${this.taskId}`]
      if (!freeTask) {
        return this.$router.push('/free-tasks')
      }
      this.task = JSON.parse(JSON.stringify(freeTask))
    },
    isNoteFavorite(id) {
      return this.$store.getters['users/notes'][`id-${id}`]['favorite']
    },
    routerBack() {
      return this.$router.push('/free-tasks')
    },
    toggleEdit() {
      this.$router.push(this.path + '?edit=true')
    },
    callEditClick() {
      this.$refs.freeTaskForm.onEditClick()
    },
    changeSubtaskProgress(index, progress) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}/subtasks/${index}`
        ),
        { progress: !progress }
      )
      this.updateTaskData()
    },
    changeSubSubtaskProgress(index, subIndex, progress) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}/subtasks/${index}/subtasks/${subIndex}`
        ),
        { progress: !progress }
      )
      this.updateTaskData()
    },
    onEditClick(form) {
      const updateTodo = {
        id: form.id,
        title: form.todoTitle,
        priority: form.priority,
        progress: form.progress,
        notes:
          form.toggleNotes &&
          form.notes &&
          (form.notes.text || form.notes.attachedNotes.length)
            ? form.notes
            : null,
        continuous: form.continuousState,
        continuousStarted:
          form.continuousState && this.task.continuousStarted
            ? this.task.continuousStarted
            : null,
        continuousEnded:
          form.continuousState && this.task.continuousEnded
            ? this.task.continuousEnded
            : null,
        subtasks: form.toggleSubtasks ? form.subtasks : null,
        dateModified: Date.now(),
        finishedDate:
          form.progress &&
          (form.progress != this.task.progress || this.task.finishedDate)
            ? this.task.finishedDate
              ? this.task.finishedDate
              : Date.now()
            : null
      }
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}/`
        ),
        updateTodo
      )
      this.updateTaskData()
      this.$router.push(this.path)

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
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}`
        ),
        {
          continuousStarted: Date.now()
        }
      )
      this.updateTaskData()
    },
    continuousStop() {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}`
        ),
        {
          continuousEnded: Date.now()
        }
      )
      this.updateTaskData()
    },
    changeProgress() {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}`
        ),
        {
          progress: !this.task.progress,
          finishedDate: !this.task.progress ? Date.now() : null
        }
      )
      this.updateTaskData()
    },
    onDeleteClick() {
      this.$refs.confirmDialog.show()
    },
    onCancelClick() {
      this.$router.push(this.path)
    },
    onConfirmDeleteClick() {
      remove(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${this.taskId}`
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
