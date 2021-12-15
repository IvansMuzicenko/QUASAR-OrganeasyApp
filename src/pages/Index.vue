<template>
  <q-page v-touch-swipe:3e-2:10:100.mouse.horizontal="handleSwipe">
    <q-markup-table wrap-cells separator="cell">
      <thead>
        <tr>
          <th style="width: 64px"></th>
          <th class="text-left text-weight-bolder no-padding">
            <span><q-btn flat @click="previousDay()">&lt;</q-btn></span>
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
            <span><q-btn flat @click="nextDay()">&gt;</q-btn></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(task, index) in dayTasks"
          :key="index"
          v-touch-hold:400:12:15.mouse="(event) => holdSuccess(event, index)"
          :style="task['progress'] ? ' background: lightgrey' : ''"
          @click="openTask(task)"
        >
          <td class="text-center text-weight-bolder">
            {{ task['time'].slice(task['time'].indexOf(' ')) }}
            <span v-if="task['endingTime']">
              - {{ task['endingTime'].slice(task['time'].indexOf(' ')) }}
            </span>
          </td>

          <td>
            <q-item-section avatar class="text-weight-bolder">
              {{ task['title'] }}
            </q-item-section>

            <q-separator v-if="subtasksState(task['subtasks'])" spaced="sm" />
            <q-separator v-if="subtasksState(task['subtasks'])" spaced="sm" />

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
                <q-item-label>*</q-item-label>

                {{ subtask['title'] }}
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
              <q-card-section>
                <q-btn color="primary" icon="visibility" @click="openTask(task)"
                  >View</q-btn
                >
              </q-card-section>
              <q-card-section>
                <q-btn
                  color="secondary"
                  icon="edit"
                  @click="openTask(task, true)"
                  >Edit</q-btn
                >
              </q-card-section>
              <q-card-section>
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
    },
    holdSubtask(event, index) {
      console.log('holded subtask')
    }
  }
}
</script>
