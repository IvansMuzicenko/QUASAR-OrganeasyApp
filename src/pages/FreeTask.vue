<template>
  <q-page>
    <q-card class="flex justify-between no-padding">
      <back-button />
      <start-continuous-button
        v-if="!editState && task['continuous'] && !task['continuousStarted']"
        top-bar
        :path="`freeTasks/id-${taskId}`"
        @update-data="updateTaskData()"
      />
      <stop-continuous-button
        v-if="
          !editState &&
          task['continuous'] &&
          task['continuousStarted'] &&
          !task['continuousEnded']
        "
        top-bar
        :path="`freeTasks/id-${taskId}`"
        @update-data="updateTaskData()"
      />
      <progress-change
        v-if="!editState"
        :item="task"
        type="free-task"
        top-bar
        @update-data="updateTaskData()"
      />
      <copy-button v-if="!editState" top-bar :task="task" type="free-task" />

      <edit-button v-if="!editState" top-bar />

      <save-button
        v-if="editState"
        top-bar
        :error="error"
        @save-event="$refs.freeTaskForm.onSaveClick()"
      />

      <item-remove v-if="editState" :item="task" type="free-task" top-bar />
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
        <priority-select
          :item-priority="task.priority"
          :item-id="task.id"
          @priority-selected="updateTaskData()"
        />
      </q-item>

      <q-item>
        <q-item-section avatar class="taskInfo">Category</q-item-section>
        <q-separator vertical spaced="md" />
        <category-select
          :item-category="task.category || ''"
          rewrite
          :item-path="`freeTasks/id-${task.id}`"
          @category-selected="updateTaskData()"
        />
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
                class="q-pl-xs"
                :to="`/notes/${note['id']}`"
              >
                <q-item-label>
                  <q-icon
                    :name="isNoteFavorite(note['id']) ? 'star' : 'star_outline'"
                    :color="isNoteFavorite(note['id']) ? 'yellow' : ''"
                    size="sm"
                  />
                  <q-icon
                    :name="
                      findNoteCategory(note['id'])
                        ? findNoteCategory(note['id'])['icon']
                        : ''
                    "
                    :color="
                      findNoteCategory(note['id'])
                        ? findNoteCategory(note['id'])['color']
                        : ''
                    "
                    size="sm"
                  />

                  {{ note['title'] }}
                </q-item-label>
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

      <q-item v-if="task.location && task.location.length">
        <q-item-section avatar class="taskInfo">Location</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section
            v-for="(location, index) of task.location"
            :key="index"
            class="q-ml-sm"
          >
            <a
              :href="`https://www.google.com/maps/search/${location[
                'address'
              ].replace(' ', '+')}`"
            >
              {{ location['description'] }}: {{ location['address'] }}
            </a>
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
            class="cursor-pointer q-ml-sm"
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
                  ~~ {{ subSubtask['title'] }}
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
      @save-event="onSaveClick"
      @cancel-event="onCancelClick"
      @error="errorCheck"
    />
  </q-page>
</template>

<script>
import { getDatabase, ref, set, update, remove } from 'firebase/database'
import { date } from 'quasar'

import FreeTaskForm from 'src/components/forms/FreeTaskForm.vue'

import ProgressChange from 'src/components/common/groups/ProgressChange.vue'
import ItemRemove from 'src/components/common/groups/ItemRemove.vue'

import BackButton from 'src/components/common/elements/buttons/BackButton.vue'
import EditButton from 'src/components/common/elements/buttons/EditButton.vue'
import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'
import CopyButton from 'src/components/common/elements/buttons/CopyButton.vue'
import StartContinuousButton from 'src/components/common/elements/buttons/StartContinuousButton.vue'
import StopContinuousButton from 'src/components/common/elements/buttons/StopContinuousButton.vue'
import CategorySelect from 'src/components/common/groups/CategorySelect.vue'
import PrioritySelect from 'src/components/common/groups/PrioritySelect.vue'

const db = getDatabase()

export default {
  components: {
    FreeTaskForm,
    ProgressChange,
    ItemRemove,
    BackButton,
    EditButton,
    SaveButton,
    CopyButton,
    PrioritySelect,
    StartContinuousButton,
    StopContinuousButton,
    CategorySelect
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
        category: null,
        continuous: false,
        continuousStarted: '',
        continuousEnded: '',

        notes: {
          text: '',
          attachedNotes: []
        },

        location: [],

        subtasks: []
      },
      error: false
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
    errorCheck(errorState) {
      this.error = errorState
    },
    isNoteFavorite(id) {
      const note = this.$store.getters['users/notes'][`id-${id}`]
      if (note) {
        return note['favorite']
      }
      return false
    },
    findNoteCategory(id) {
      const note = this.$store.getters['users/notes'][`id-${id}`]
      if (note) {
        const categoryId = note['category']
        if (categoryId) {
          const vuexCategories = this.$store.getters['users/categories']
          return vuexCategories[`id-${categoryId}`] || {}
        }
      }
      return {}
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
    onSaveClick(form) {
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
        location: form.toggleLocation ? form.eventLocation : null,
        category: form.category || null,
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
    onCancelClick() {
      this.$router.push(this.path)
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
