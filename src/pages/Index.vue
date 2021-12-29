<template>
  <q-page v-touch-swipe:3e-2:10:100.mouse.horizontal="handleSwipe">
    <q-card class="flex justify-between q-py-sm">
      <q-card-section class="no-padding">
        <span>
          <q-btn flat @click="previousDay()">&lt;</q-btn>
        </span>
        <span class="cursor-pointer wrap">
          {{ formattedDate }}

          <q-popup-proxy
            ref="datePicked"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="formattedDate"
              :events="calendarEvents"
              event-color="teal"
              mask="dddd, DD-MM-YYYY"
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
        <q-btn icon="sort" flat
          >Sort
          <q-popup-proxy>
            <q-card>
              <q-btn class="full-width"> Time </q-btn>
              <q-separator></q-separator>
              <q-btn class="full-width"> Title </q-btn>
            </q-card>
          </q-popup-proxy>
        </q-btn>
        <q-btn icon="filter_alt" flat
          >Filter
          <q-popup-proxy>
            <q-card>
              <q-card-section>
                Progress:
                <q-checkbox class="full-width"> All </q-checkbox>
                <q-checkbox class="full-width"> Done </q-checkbox>
                <q-checkbox class="full-width"> Undone </q-checkbox>
              </q-card-section>
              <q-separator></q-separator>
              <q-btn class="full-width"> Title </q-btn>
            </q-card>
          </q-popup-proxy>
        </q-btn>
      </q-card-section>
    </q-card>
    <q-markup-table wrap-cells separator="cell">
      <tbody>
        <tr
          v-for="(task, index) in dayTasks"
          :key="index"
          v-touch-hold:400:12:15.mouse="(event) => holdSuccess(event, index)"
          style="width: 60px"
          :style="task['progress'] ? ' background: lightgrey' : ''"
          @click="openTask(task)"
        >
          <td
            style="width: 60px"
            class="text-center text-weight-bolder no-padding"
          >
            <span v-if="task['processesTime']"
              >({{ calcPrepTime(task['time'], task['processesTime']) }})</span
            >
            {{ task['time'].slice(task['time'].indexOf(' ')) }}
            <span v-if="task['endingTime']">
              <div>-</div>
              {{ task['endingTime'].slice(task['endingTime'].indexOf(' ')) }}
            </span>
          </td>

          <td class="text-left text-weight-bolder">
            <q-item-section avatar class="text-weight-bolder">
              {{ task['title'] }}
            </q-item-section>

            <q-separator
              v-if="task['subtasks'] && subtasksState(task['subtasks'])"
              spaced="sm"
            />
            <q-separator
              v-if="task['subtasks'] && subtasksState(task['subtasks'])"
              spaced="sm"
            />

            <q-list separator dense>
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
                <q-item-label> ~ {{ subtask['title'] }}</q-item-label>
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
              <q-card-section class="text-center">
                <q-btn color="primary" icon="visibility" @click="openTask(task)"
                  >View</q-btn
                >
              </q-card-section>
              <q-card-section class="text-center">
                <q-btn
                  color="secondary"
                  icon="edit"
                  @click="openTask(task, true)"
                  >Edit</q-btn
                >
              </q-card-section>
              <q-card-section class="text-center">
                <q-btn
                  :icon="task['progress'] ? 'close' : 'check'"
                  :color="task['progress'] ? 'red' : 'positive'"
                  @click="changeProgress(task)"
                  >{{ task['progress'] ? 'Undone' : 'Done' }}</q-btn
                >
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, update } from 'firebase/database'
const db = getDatabase()

export default {
  data() {
    return {
      timeStamp: Date.now(),
      formattedDate: date.formatDate(Date.now(), 'dddd, DD-MM-YYYY')
    }
  },
  computed: {
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

      return this.tasks[
        'date-' + this.formattedDate.slice(this.formattedDate.indexOf(' ') + 1)
      ]
    }
  },
  watch: {
    formattedDate(newDate) {
      this.timeStamp = Number(
        date.formatDate(date.extractDate(newDate, 'dddd, DD-MM-YYYY'), 'x')
      )
      this.$refs.datePicked.hide()
    }
  },
  mounted() {
    const queryDate = this.$route.query.date
    if (queryDate) {
      this.timeStamp = Number(
        date.formatDate(date.extractDate(queryDate, 'DD-MM-YYYY'), 'x')
      )
      this.formattedDate = date.formatDate(this.timeStamp, 'dddd, DD-MM-YYYY')
    }
  },
  methods: {
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
      this.formattedDate = date.formatDate(this.timeStamp, 'dddd, DD-MM-YYYY')
      this.$router.push(
        '?date=' + this.formattedDate.slice(this.formattedDate.indexOf(' ') + 1)
      )
    },
    previousDay() {
      this.timeStamp -= 86400000
      this.formattedDate = date.formatDate(this.timeStamp, 'dddd, DD-MM-YYYY')
      this.$router.push(
        '?date=' + this.formattedDate.slice(this.formattedDate.indexOf(' ') + 1)
      )
    },
    openTask(task, edit) {
      const taskDate = task.time.slice(0, task.time.indexOf(' '))
      if (!edit) {
        this.$router.push(`/${taskDate}/${task.id}`)
      } else {
        this.$router.push(`/${taskDate}/${task.id}?edit=true`)
      }
    },

    changeProgress(task) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/tasks/date-${task.time.slice(
            0,
            task.time.indexOf(' ')
          )}/id-${task.id}`
        ),
        { progress: !task.progress }
      )
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

    holdSuccess(event, index) {
      this.$refs[`taskHold-${index}`].show()
    }
  }
}
</script>
