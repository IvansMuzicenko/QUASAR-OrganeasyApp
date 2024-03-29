<template>
  <q-page>
    <q-card class="flex justify-between no-padding">
      <back-button />

      <start-continuous-button
        v-if="!editState && task['continuous'] && !task['continuousStarted']"
        top-bar
        :path="`tasks/date-${taskDate}/id-${taskId}`"
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
        :path="`tasks/date-${taskDate}/id-${taskId}`"
        @update-data="updateTaskData()"
      />

      <progress-change
        v-if="!editState"
        :item="task"
        type="task"
        top-bar
        @update-data="updateTaskData()"
      />
      <copy-button v-if="!editState" top-bar :task="task" type="task" />

      <edit-button v-if="!editState" top-bar />

      <save-button
        v-if="editState"
        top-bar
        :error="error"
        @save-event="$refs.taskForm.onSaveClick()"
      />
      <item-remove v-if="editState" :item="task" type="task" top-bar />
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
        <q-item-section avatar class="taskInfo">Date</q-item-section>
        <q-separator vertical spaced="md" />
        {{ task.time }}
      </q-item>

      <q-item v-if="task.endingTime">
        <q-item-section avatar class="taskInfo">Ending date</q-item-section>
        <q-separator vertical spaced="md" />
        {{ task.endingTime }}
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
                      findCategory(note['id'])
                        ? findCategory(note['id'])['icon']
                        : ''
                    "
                    :color="
                      findCategory(note['id'])
                        ? findCategory(note['id'])['color']
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
              :href="`https://www.google.com/maps/search/${location.address.replace(
                ' ',
                '+'
              )}`"
            >
              {{ location['description'] }}: {{ location['address'] }}
            </a>
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item v-if="task.notificationsId">
        <q-item-section avatar class="taskInfo">Notifications</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section v-if="task['toggleDefaultNotif']" class="q-ml-sm">
            On starting time
          </q-item-section>
          <q-item-section
            v-if="task['toggleDefaultNotif'] && task.endingTime"
            class="q-ml-sm"
          >
            On ending time
          </q-item-section>
          <q-item-section
            v-for="(notification, index) in task.notifications"
            :key="index"
            class="q-ml-sm"
          >
            <q-separator v-if="index > 0" spaced="sm" />
            {{ notification.notificationTimeValuesModel }}
            {{ notification.notificationTimeTypeModel }}
            {{ notification.notificationPeriodModel }}
            {{ notification.notificationPointModel }}
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item v-if="task.processes">
        <q-item-section avatar class="taskInfo">Processes</q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>
          <q-item-section
            v-for="(process, index) in task.processes"
            :key="process"
            class="q-ml-sm"
          >
            <q-separator v-if="index > 0" spaced="sm" />
            {{ process.title || process }}
          </q-item-section>
        </q-item-section>
      </q-item>
      <q-item v-if="task.processesTime">
        <q-item-section avatar class="taskInfo">
          Preparation time
        </q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>{{ task.processesTime }} minutes</q-item-section>
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
      <q-item v-if="relativeItems.length - 1 > 0">
        <q-item-section avatar class="taskInfo">
          Related tasks count
        </q-item-section>
        <q-separator vertical spaced="md" />
        <q-item-section>{{ relativeItems.length - 1 }}</q-item-section>
      </q-item>
    </q-list>

    <task-form
      v-if="editState"
      ref="taskForm"
      :edit-task="task"
      @save-event="onSaveClick"
      @cancel-event="$router.push(path)"
      @error="errorCheck"
    />
  </q-page>
</template>

<script>
import { getDatabase, ref, set, update, remove } from 'firebase/database'
import { date } from 'quasar'

import generateId from 'src/idGenerator.js'

import TaskForm from 'src/components/forms/TaskForm.vue'

import ProgressChange from 'src/components/common/groups/ProgressChange.vue'
import ItemRemove from 'src/components/common/groups/ItemRemove.vue'

import BackButton from 'src/components/common/elements/buttons/BackButton.vue'
import EditButton from 'src/components/common/elements/buttons/EditButton.vue'
import SaveButton from 'src/components/common/elements/buttons/SaveButton.vue'
import CopyButton from 'src/components/common/elements/buttons/CopyButton.vue'
import StartContinuousButton from 'src/components/common/elements/buttons/StartContinuousButton.vue'
import StopContinuousButton from 'src/components/common/elements/buttons/StopContinuousButton.vue'

const db = getDatabase()

export default {
  components: {
    TaskForm,
    ProgressChange,
    ItemRemove,
    BackButton,
    EditButton,
    SaveButton,
    CopyButton,
    StartContinuousButton,
    StopContinuousButton
  },
  emits: ['hide'],
  data() {
    return {
      task: {
        id: '',
        relationId: '',
        title: '',
        progress: false,
        finishedDate: '',
        time: '',
        endingTime: '',
        notes: {
          text: '',
          attachedNotes: []
        },
        location: [],
        notifications: [
          {
            notificationPeriodModel: '',
            notificationPointModel: '',
            notificationTimeTypeModel: '',
            notificationTimeValuesModel: 0
          }
        ],
        notificationsId: [],
        continuous: false,
        continuousStarted: '',
        continuousEnded: '',
        processes: [],
        processesTime: 0,
        subtasks: [],
        repeat: {
          repeatNumber: 0,
          months: 0,
          weeks: 0,
          days: 0,
          hours: 0,
          minutes: 0
        }
      },
      error: false
    }
  },
  computed: {
    path() {
      return this.$route.path
    },
    taskDate() {
      return this.$route.params.date
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
    },
    relativeItems() {
      const relationId = this.task.relationId
      let relationArray = []
      if (relationId) {
        const vuexTasks = this.$store.getters['users/tasks']
        for (const vuexDate in vuexTasks) {
          for (const vuexTask in vuexTasks[vuexDate]) {
            const task = vuexTasks[vuexDate][vuexTask]
            if (task && task.relationId && task.relationId == relationId) {
              relationArray.push(task)
            }
          }
        }
      }
      return relationArray
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
      const dayTasks =
        this.$store.getters['users/tasks'][`date-${this.taskDate}`]
      if (!dayTasks) {
        return this.$router.push('/')
      }
      const task = dayTasks[`id-${this.taskId}`]

      if (!task) {
        return this.$router.push(`/?date=${this.taskDate}`)
      }
      this.task = JSON.parse(JSON.stringify(task))
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
    findCategory(id) {
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
          `${this.$store.getters['users/userId']}/tasks/date-${this.taskDate}/id-${this.taskId}/subtasks/${index}`
        ),
        { progress: !progress }
      )
      this.updateTaskData()
    },
    changeSubSubtaskProgress(index, subIndex, progress) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/tasks/date-${this.taskDate}/id-${this.taskId}/subtasks/${index}/subtasks/${subIndex}`
        ),
        { progress: !progress }
      )
      this.updateTaskData()
    },
    onSaveClick(form) {
      let eventDate = form.eventDate
      let eventEndingDate = form.eventEndingDate
      const mainTaskDate = form.eventDate
      const taskTime = this.task.time

      if (
        taskTime.slice(0, taskTime.indexOf(' ')) !=
        eventDate.slice(0, eventDate.indexOf(' '))
      ) {
        remove(
          ref(
            db,
            `${
              this.$store.getters['users/userId']
            }/tasks/date-${this.task.time.slice(
              0,
              this.task.time.indexOf(' ')
            )}/id-${form.id}/`
          )
        )
      }
      for (
        let i = 0;
        i <= (form.toggleRepeat ? form.repeat.repeatNumber : 0);
        i++
      ) {
        if (i != 0) {
          eventDate = date.formatDate(
            date.addToDate(date.extractDate(eventDate, 'DD-MM-YYYY HH:mm'), {
              months: form.repeat.monthsModel,
              days: form.repeat.daysModel + form.repeat.weeksModel * 7,
              hours: form.repeat.hoursModel,
              minutes: form.repeat.minutesModel
            }),
            'DD-MM-YYYY HH:mm'
          )
          if (eventEndingDate) {
            eventEndingDate = date.formatDate(
              date.addToDate(
                date.extractDate(eventEndingDate, 'DD-MM-YYYY HH:mm'),
                {
                  months: form.repeat.monthsModel,
                  days: form.repeat.daysModel + form.repeat.weeksModel * 7,
                  hours: form.repeat.hoursModel,
                  minutes: form.repeat.minutesModel
                }
              ),
              'DD-MM-YYYY HH:mm'
            )
          }
        }
        const updateTodo = {
          id: i == 0 ? form.id : generateId(),
          relationId: this.task.relationId || generateId(),
          title: form.todoTitle,
          progress: form.progress,
          time: eventDate,
          endingTime: form.toggleEventEnd ? eventEndingDate : null,
          notes:
            form.toggleNotes &&
            form.notes &&
            (form.notes.text || form.notes.attachedNotes.length)
              ? form.notes
              : null,
          location: form.toggleLocation ? form.eventLocation : null,
          toggleDefaultNotif: form.toggleDefaultNotif,
          notifications: form.toggleNotifications
            ? form.notificationForm
            : null,
          notificationsId: form.notificationsId ? form.notificationsId : null,
          continuous: form.continuousState,
          continuousStarted:
            form.continuousState && this.task.continuousStarted
              ? this.task.continuousStarted
              : null,
          continuousEnded:
            form.continuousState && this.task.continuousEnded
              ? this.task.continuousEnded
              : null,
          processes: form.toggleProcesses ? form.processesModel : null,
          processesTime: form.toggleProcesses ? form.processesTime : null,
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
            `${
              this.$store.getters['users/userId']
            }/tasks/date-${eventDate.slice(0, eventDate.indexOf(' '))}/id-${
              updateTodo.id
            }/`
          ),
          updateTodo
        )
      }
      this.$router.push(
        `/${mainTaskDate.slice(0, mainTaskDate.indexOf(' '))}/${form.id}`
      )
      this.updateTaskData()

      this.$q.notify({
        position: 'top',
        message: 'Task edited',
        color: 'blue',
        timeout: 1000
      })
      if (form.toggleRepeat) {
        this.$q.notify({
          position: 'top',
          message: 'Related tasks created',
          color: 'green',
          timeout: 2000
        })
      }
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
