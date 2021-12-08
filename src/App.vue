<template>
  <router-view v-if="!loading" />
  <q-inner-loading
    v-else
    :showing="loading"
    label="Please wait..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>

<script>
import { getDatabase, ref, onValue } from 'firebase/database'
import { date } from 'quasar'

export default {
  data() {
    return {
      loading: true
    }
  },
  computed: {
    user() {
      return this.$store.getters['users/userId']
    }
  },
  watch: {
    user() {
      const db = getDatabase()
      const dbRef = ref(db, this.user)
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val()
        this.$store.dispatch('users/setUserData', data)
        this.loading = false
        this.capacitor()
      })
    }
  },
  beforeMount() {
    const user = this.$q.localStorage.getItem('user')
    if (user) {
      this.$store.dispatch('users/setUser', user)
    } else {
      this.$router.push('/auth')
      this.loading = false
    }
  },
  methods: {
    async capacitor() {
      if (this.$q.platform.is.capacitor) {
        await this.$q.capacitor.Plugins.LocalNotifications.requestPermissions()
        const tasks = await this.$store.getters['users/tasks']
        let notificationList = []
        for (const tasksDate of Object.keys(tasks)) {
          for (const task of tasks[tasksDate]) {
            if (task.notifications) {
              for (const notification of task.notifications) {
                let time =
                  notification.notificationPointModel == 'start time'
                    ? task.time
                    : task.endingTime
                    ? task.endingTime
                    : task.time
                if (notification.notificationPeriodModel == 'before') {
                  time = date.subtractFromDate(
                    date.extractDate(time, 'DD-MM-YYYY HH:mm'),
                    {
                      months:
                        notification.notificationTimeTypeModel == 'months'
                          ? notification.notificationTimeValuesModel
                          : 0,
                      days:
                        notification.notificationTimeTypeModel == 'days'
                          ? notification.notificationTimeValuesModel
                          : 0,
                      hours:
                        notification.notificationTimeTypeModel == 'hours'
                          ? notification.notificationTimeValuesModel
                          : notification.notificationTimeTypeModel == 'weeks'
                          ? notification.notificationTimeValuesModel * 7
                          : 0,
                      minutes:
                        notification.notificationTimeTypeModel == 'minutes'
                          ? notification.notificationTimeValuesModel
                          : 0
                    }
                  )
                } else {
                  time = date.addToDate(
                    date.extractDate(time, 'DD-MM-YYYY HH:mm'),
                    {
                      months:
                        notification.notificationTimeTypeModel == 'months'
                          ? notification.notificationTimeValuesModel
                          : 0,
                      days:
                        notification.notificationTimeTypeModel == 'days'
                          ? notification.notificationTimeValuesModel
                          : 0,
                      hours:
                        notification.notificationTimeTypeModel == 'hours'
                          ? notification.notificationTimeValuesModel
                          : notification.notificationTimeTypeModel == 'weeks'
                          ? notification.notificationTimeValuesModel * 7
                          : 0,
                      minutes:
                        notification.notificationTimeTypeModel == 'minutes'
                          ? notification.notificationTimeValuesModel
                          : 0
                    }
                  )
                }
                console.log(time)

                if (
                  !notificationList.some(
                    (element) => element.id === date.formatDate(time, 'x')
                  )
                ) {
                  notificationList.push({
                    title: task.title,
                    body: task.title,
                    id: date.formatDate(time, 'x') / 1000,
                    schedule: { at: time },
                    allowWhileIdle: true,
                    sound: null,
                    attachments: null,
                    actionTypeId: '',
                    extra: null
                  })
                }
              }
            }
          }
        }

        const notifs =
          await this.$q.capacitor.Plugins.LocalNotifications.schedule({
            notifications: notificationList
          })
        console.log(notifs)

        // console.log(
        //   await this.$q.capacitor.Plugins.LocalNotifications.getPending()
        // )
      }
    }
  }
}
</script>
