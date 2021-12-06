<template>
  <q-page>
    <q-markup-table separator="cell">
      <thead>
        <tr>
          <th class="text-left text-weight-bolder no-padding">
            <span
              ><q-btn flat class="q-pr-xs" @click="previousDay()"
                >&lt;</q-btn
              ></span
            >
            <span class="cursor-pointer">
              <q-icon name="event"> </q-icon>
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
                >
                  <div class="items-center justify-end row">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </span>
            <span
              ><q-btn flat class="q-pl-xs" @click="nextDay()">&gt;</q-btn></span
            >
          </th>
          <th class="text-center text-weight-bolder" style="width: 100%">
            Tasks
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(task, index) in dayTasks"
          :key="index"
          v-touch-hold:400:12:15.mouse="holdSuccess"
          :style="task['progress'] ? ' background: lightgrey' : ''"
          @click="openTask(task)"
        >
          <td>
            {{ task['time'].slice(task['time'].indexOf(' ')) }}
          </td>

          <td>{{ task['title'] }}</td>
          <q-popup-proxy
            ref="taskHold"
            cover
            :breakpoint="10000"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-card>
              <q-btn @click="openTask(task)">View</q-btn>
              <q-btn @click="openTask(task, true)">Edit</q-btn>
              <q-btn @click="doneTask">Done</q-btn>
            </q-card>
          </q-popup-proxy>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script>
import { date } from 'quasar'

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
  methods: {
    nextDay() {
      this.timeStamp += 86400000
      this.formattedDate = date.formatDate(this.timeStamp, 'dddd, DD-MM-YYYY')
    },
    previousDay() {
      this.timeStamp -= 86400000
      this.formattedDate = date.formatDate(this.timeStamp, 'dddd, DD-MM-YYYY')
    },
    openTask(task, edit) {
      const taskDate = task.time.slice(0, task.time.indexOf(' '))
      if (!edit) {
        this.$router.push(`/${taskDate}/${task.id}`)
      } else {
        this.$router.push(`/${taskDate}/${task.id}?edit=true`)
      }
    },

    doneTask() {},

    holdSuccess() {
      this.$refs.taskHold.show()
    }
  }
}
</script>
