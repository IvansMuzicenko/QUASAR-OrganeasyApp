<template>
  <q-page v-touch-swipe:3e-2:10:100.mouse.horizontal="handleSwipe">
    <q-card class="flex justify-between q-py-sm">
      <q-card-section class="no-padding zindex-high">
        <span>
          <q-btn flat @click="previousDay()">&lt;</q-btn>
        </span>
        <span class="cursor-pointer wrap">
          {{ displayDate }}

          <q-popup-proxy
            ref="datePicked"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="date"
              first-day-of-week="1"
              :events="calendarEvents"
              event-color="teal"
              mask="DD-MM-YYYY"
              today-btn
            >
              <div class="items-center justify-end row">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </span>
        <span>
          <q-btn flat @click="nextDay()">&gt;</q-btn>
        </span>
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
          :color="filtering.progress != 'all' ? 'green' : ''"
          class="zindex-high"
          flat
        >
          <q-popup-proxy>
            <q-card>
              <q-card-section class="text-subtitle1 text-center">
                <q-icon name="filter_alt" />
                Filter
              </q-card-section>
              <q-card-section>
                Progress:
                <q-radio
                  v-model="filtering.progress"
                  val="all"
                  label="All"
                  class="full-width"
                />
                <q-radio
                  v-model="filtering.progress"
                  val="done"
                  label="Done"
                  class="full-width"
                />
                <q-radio
                  v-model="filtering.progress"
                  val="undone"
                  label="Undone"
                  class="full-width"
                />
              </q-card-section>

              <q-separator />

              <q-card-section class="text-subtitle1 text-center">
                <q-icon name="sort" />
                Sort
              </q-card-section>
              <q-card-section>
                <q-btn
                  :icon="
                    sorting.time == 'none'
                      ? 'last_page'
                      : sorting.time == 'asc'
                      ? 'vertical_align_bottom'
                      : 'vertical_align_top'
                  "
                  class="full-width"
                  @click="sortByTime"
                >
                  Time
                </q-btn>
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
    </q-card>

    <q-markup-table wrap-cells separator="cell">
      <tbody>
        <tr
          v-for="(task, index) of dayTasks.filter(
            (el) =>
              filtering.progress == 'all' ||
              (filtering.progress == 'done' && el['progress']) ||
              (filtering.progress == 'undone' && !el['progress'])
          )"
          :key="index"
          v-touch-hold:400:12:15.mouse="(event) => holdSuccess(event, index)"
          style="width: 60px"
          :class="task['progress'] ? 'bg-green-11' : ''"
          @click="openTask(task)"
        >
          <td
            style="width: 60px"
            class="text-center text-weight-bolder no-padding"
          >
            <q-icon
              v-if="task['notificationsId']"
              name="notifications_active"
              size="xs"
            />
            <br v-if="task['notificationsId']" />
            <span v-if="task['processesTime']">
              ({{ calcPrepTime(task['time'], task['processesTime']) }})
            </span>
            {{ task['time'].slice(task['time'].indexOf(' ')) }}
            <span v-if="task['endingTime']">
              <div>-</div>
              {{ task['endingTime'].slice(task['endingTime'].indexOf(' ')) }}
            </span>
          </td>

          <td class="text-left text-weight-bolder">
            <q-item-section avatar>
              {{ task['title'] }}
            </q-item-section>

            <q-separator
              v-if="task['subtasks'] && subtasksState(task['subtasks'])"
              spaced="sm"
              size="7px"
            />

            <q-list separator dense class="q-pl-sm">
              <q-item
                v-for="(subtask, subIndex) in task['subtasks']"
                v-show="!subtask['progress']"
                :key="subtask"
                v-touch-hold:400:12:15.mouse.stop="
                  (event) => doneSubtask(task, subIndex)
                "
                dense
                class="no-padding"
                @touchstart.stop
                @mousedown.stop
              >
                <q-item-section>
                  <q-separator
                    v-if="subIndex > 0 && !subtask['progress']"
                    size="3px"
                    spaced="sm"
                  />
                  <q-item-label>- {{ subtask['title'] }}</q-item-label>
                  <q-separator
                    v-if="subtask['subtasks'] && subtask['subtasks'].length"
                    spaced="sm"
                  />
                  <q-list separator>
                    <q-item
                      v-for="(subSubtask, subSubIndex) of subtask['subtasks']"
                      v-show="!subSubtask['progress']"
                      :key="subSubIndex"
                      v-touch-hold:400:12:15.mouse.stop="
                        (event) => doneSubSubtask(task, subIndex, subSubIndex)
                      "
                      dense
                      @touchstart.stop
                      @mousedown.stop
                    >
                      ~~ {{ subSubtask['title'] }}
                    </q-item>
                  </q-list>
                </q-item-section>
              </q-item>
            </q-list>
          </td>
          <q-popup-proxy
            :ref="`taskHold-${index}`"
            cover
            :breakpoint="10000"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-card>
              <q-card-section class="text-center text-subtitle1">
                <p class="no-margin">Task</p>
                <p class="no-margin">
                  {{
                    `${task['title'].slice(0, 10)}${
                      task['title'].length > 10 ? '...' : ''
                    }`
                  }}
                </p>
              </q-card-section>
              <q-card-section class="text-center">
                <q-btn
                  color="primary"
                  icon="visibility"
                  @click="openTask(task)"
                >
                  View
                </q-btn>
              </q-card-section>
              <q-card-section class="text-center">
                <edit-button
                  :path="`/${task.time.slice(0, task.time.indexOf(' '))}/${
                    task.id
                  }`"
                />
              </q-card-section>
              <q-card-section class="text-center">
                <progress-change :item="task" type="task" />
              </q-card-section>
              <q-card-section class="text-center">
                <copy-button :task="task" type="task" />
              </q-card-section>
              <q-card-section
                v-if="task['continuous'] && !task['continuousStarted']"
                class="text-center"
              >
                <start-continuous-button
                  :path="`tasks/date-${task.time.slice(
                    0,
                    task.time.indexOf(' ')
                  )}/id-${task.id}`"
                />
              </q-card-section>
              <q-card-section
                v-if="
                  task['continuous'] &&
                  task['continuousStarted'] &&
                  !task['continuousEnded']
                "
                class="text-center"
              >
                <stop-continuous-button
                  :path="`tasks/date-${task.time.slice(
                    0,
                    task.time.indexOf(' ')
                  )}/id-${task.id}`"
                />
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </tr>
      </tbody>
    </q-markup-table>
    <div class="text-center q-my-md">
      <p v-if="!dayTasks">You have not tasks for this day</p>
      <q-btn color="secondary" @click="addTask()">Add task</q-btn>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, update } from 'firebase/database'

import AddTask from 'src/components/common/dialogs/AddTask.vue'
import Search from 'src/components/common/dialogs/Search.vue'

import ProgressChange from 'src/components/common/groups/ProgressChange.vue'

import EditButton from 'src/components/common/elements/buttons/EditButton.vue'
import CopyButton from 'src/components/common/elements/buttons/CopyButton.vue'
import StartContinuousButton from 'src/components/common/elements/buttons/StartContinuousButton.vue'
import StopContinuousButton from 'src/components/common/elements/buttons/StopContinuousButton.vue'

const db = getDatabase()

export default {
  components: {
    ProgressChange,
    EditButton,
    CopyButton,
    StartContinuousButton,
    StopContinuousButton
  },
  data() {
    return {
      timeStamp: Date.now(),
      date: date.formatDate(Date.now(), 'DD-MM-YYYY'),
      sorting: {
        title: 'none',
        time: 'asc',
        dateModified: 'none'
      },
      filtering: {
        progress: 'all'
      }
    }
  },
  computed: {
    queryDate() {
      return this.$route.query.date
    },
    displayDate() {
      return date.formatDate(this.timeStamp, 'ddd, DD-MM-YYYY')
    },
    tasks() {
      return this.$store.getters['users/tasks']
    },
    calendarEvents() {
      if (!this.tasks) return []

      return Object.keys(this.tasks).map((event) =>
        date.formatDate(
          date.extractDate(event.replace('date-', ''), 'DD-MM-YYYY'),
          'YYYY/MM/DD'
        )
      )
    },
    dayTasks() {
      if (!this.tasks) return []
      const vuexDayTasks = this.tasks[`date-${this.queryDate}`]
      let dayTasks = []
      if (vuexDayTasks) {
        for (const vuexDayTask in vuexDayTasks) {
          dayTasks.push(vuexDayTasks[vuexDayTask])
        }

        dayTasks.sort((a, b) => {
          if (this.sorting.time != 'none') {
            const first = a.time.slice(a.time.indexOf(' ')).replace(':', '.')
            const second = b.time.slice(b.time.indexOf(' ')).replace(':', '.')
            if (this.sorting.time == 'asc') {
              return first - second
            } else {
              return second - first
            }
          } else if (this.sorting.title != 'none') {
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
      return dayTasks
    }
  },
  watch: {
    date: {
      handler: function () {
        this.$router.push(`?date=${this.date}`)

        this.$refs['datePicked']?.hide()
      },
      immediate: true,
      flush: 'post'
    },
    queryDate: {
      handler: function () {
        if (!this.queryDate) {
          this.$router.push(`?date=${this.date}`)
        }

        if (this.queryDate) {
          this.timeStamp = Number(
            date.formatDate(date.extractDate(this.queryDate, 'DD-MM-YYYY'), 'x')
          )
          this.date = date.formatDate(this.timeStamp, 'DD-MM-YYYY')
        }
      },
      immediate: true,
      flush: 'post'
    }
  },
  methods: {
    addTask() {
      this.$q.dialog({
        component: AddTask,
        componentProps: {
          exactDate: this.queryDate
        }
      })
    },
    calcPrepTime(taskTime, taskPrep) {
      return date.formatDate(
        date.subtractFromDate(date.extractDate(taskTime, 'DD-MM-YYYY HH:mm'), {
          minutes: taskPrep
        }),
        'HH:mm'
      )
    },
    handleSwipe(evt) {
      if (evt.direction && evt.direction == 'right') {
        this.previousDay()
      } else if (evt.direction && evt.direction == 'left') {
        this.nextDay()
      }
    },
    nextDay() {
      this.timeStamp += 86400000
      this.date = date.formatDate(this.timeStamp, 'DD-MM-YYYY')
      this.$router.push(`?date=${this.date}`)
    },
    previousDay() {
      this.timeStamp -= 86400000
      this.date = date.formatDate(this.timeStamp, 'DD-MM-YYYY')
      this.$router.push(`?date=${this.date}`)
    },
    openSearch() {
      this.$q.dialog({
        component: Search,
        componentProps: {
          searchType: 'tasks'
        }
      })
    },
    sortByTime() {
      this.sorting.title = 'none'
      this.sorting.dateModified = 'none'
      this.sorting.time = this.sorting.time == 'asc' ? 'desc' : 'asc'
    },
    sortByTitle() {
      this.sorting.time = 'none'
      this.sorting.dateModified = 'none'
      this.sorting.title = this.sorting.title == 'asc' ? 'desc' : 'asc'
    },
    sortByDateModified() {
      this.sorting.time = 'none'
      this.sorting.title = 'none'
      this.sorting.dateModified =
        this.sorting.dateModified == 'asc' ? 'desc' : 'asc'
    },
    openTask(task) {
      const taskDate = task.time.slice(0, task.time.indexOf(' '))

      this.$router.push(`/${taskDate}/${task.id}`)
    },
    subtasksState(subtasks) {
      for (const sub of subtasks) {
        if (!sub['progress']) return true
      }
      return false
    },
    doneSubtask(task, index) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/tasks/date-${task.time.slice(
            0,
            task.time.indexOf(' ')
          )}/id-${task.id}/subtasks/${index}`
        ),
        { progress: true }
      )
    },
    doneSubSubtask(task, index, subIndex) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/tasks/date-${task.time.slice(
            0,
            task.time.indexOf(' ')
          )}/id-${task.id}/subtasks/${index}/subtasks/${subIndex}`
        ),
        { progress: true }
      )
    },

    holdSuccess(event, index) {
      this.$refs[`taskHold-${index}`].show()
    }
  }
}
</script>
