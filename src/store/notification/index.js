import { date } from 'quasar'
import { getDatabase, ref, update, remove } from 'firebase/database'
import firebase from '../../firebase.js'

const db = getDatabase(firebase)

const state = () => {
  return {
    capacitor: null
  }
}

const mutations = {
  SET_CAPACITOR(state, capacitor) {
    state.capacitor = capacitor
  }
}

const actions = {
  async setCapacitor({ commit }, capacitor) {
    commit('SET_CAPACITOR', capacitor)
  },

  async addNotifications({ getters, rootGetters, dispatch }) {
    const capacitor = getters.capacitor
    await capacitor.Plugins.LocalNotifications.requestPermissions()
    capacitor.Plugins.LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'TASK_NOTIFICATION',
          actions: [
            {
              id: 'view',
              title: 'Show'
            },
            {
              id: 'progress',
              title: 'Done'
            },
            {
              id: 'dismiss',
              title: 'Dismiss',
              destructive: true
            }
          ]
        },
        {
          id: 'CONTINUOUS_TASK_NOTIFICATION',
          actions: [
            // {
            //   id: 'view',
            //   title: 'Show'
            // },
            {
              id: 'start',
              title: 'Start'
            },
            {
              id: 'progress',
              title: 'Done'
            },
            {
              id: 'dismiss',
              title: 'Dismiss',
              destructive: true
            }
          ]
        },
        {
          id: 'CONTINUOUS_TASK_NOTIFICATION_STOP',
          actions: [
            // {
            //   id: 'view',
            //   title: 'Show'
            // },
            {
              id: 'stop',
              title: 'Stop'
            },
            {
              id: 'dismiss',
              title: 'Dismiss',
              destructive: true
            }
          ]
        },
        {
          id: 'DAILY_CHECK',
          actions: [
            {
              id: 'view',
              title: 'Show'
            },
            {
              id: 'transfer',
              title: 'Transfer'
            },
            {
              id: 'dismiss',
              title: 'Dismiss',
              destructive: true
            }
          ]
        }
      ]
    })
    capacitor.Plugins.LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notification) => {
        const actionId = notification.actionId
        const notifData = notification.notification
        const taskPath = notifData.extra
          .replace('/', 'date-')
          .replace('/', '/id-')

        if (actionId === 'view' || actionId === 'tap') {
          this.$router.push(notifData.extra)
        } else if (actionId === 'progress') {
          update(ref(db, `${rootGetters['users/userId']}/tasks/${taskPath}`), {
            progress: true
          })
        } else if (actionId === 'start') {
          update(ref(db, `${rootGetters['users/userId']}/tasks/${taskPath}`), {
            continuousStarted: Date.now()
          })
          capacitor.Plugins.LocalNotifications.schedule({
            notifications: [
              {
                title: notifData.title,
                body: notifData.title,
                id: 334,
                allowWhileIdle: true,
                autoCancel: true,
                ongoing: true,
                sound: 'none',
                actionTypeId: 'CONTINUOUS_TASK_NOTIFICATION_STOP',
                extra: notifData.extra
              }
            ]
          })
        } else if (actionId === 'stop') {
          update(ref(db, `${rootGetters['users/userId']}/tasks/${taskPath}`), {
            continuousEnded: Date.now()
          })
        }
        location.reload()
      }
    )
    const tasks = rootGetters['users/tasks']
    const dateNow = new Date(Date.now())
    for (const tasksDate of Object.keys(tasks)) {
      for (const task in tasks[tasksDate]) {
        const exactTask = tasks[tasksDate][task]
        if (exactTask.notificationsId) {
          if (!exactTask.progress) {
            for (const notifId in exactTask.notificationsId) {
              const notificationId = exactTask.notificationsId[notifId].id
              const notificationDate = new Date(Number(notificationId) * 1000)

              const notificationTitle = `${
                exactTask.title
              } | ${exactTask.time.slice(
                0,
                exactTask.time.indexOf(' ')
              )} (${exactTask.time.slice(exactTask.time.indexOf(' ') + 1)} ${
                exactTask.endingTime
                  ? `- ${exactTask.endingTime.slice(
                      exactTask.endingTime.indexOf(' ') + 1
                    )}`
                  : ''
              })`

              let notificationText = ``
              const beforeStart = date.getDateDiff(
                date.extractDate(exactTask.time, 'DD-MM-YYYY HH:mm'),
                notificationDate,
                'minutes'
              )
              notificationText = `${
                beforeStart <= 0
                  ? 'started'
                  : `starts in ${beforeStart} minutes.`
              }`
              if (beforeStart < 0 && exactTask.endingTime) {
                const beforeEnd = date.getDateDiff(
                  date.extractDate(exactTask.endingTime, 'DD-MM-YYYY HH:mm'),
                  notificationDate,
                  'minutes'
                )
                notificationText = `${
                  beforeEnd <= 0 ? 'ended' : `ends in ${beforeEnd} minutes.`
                }`
              }

              if (
                exactTask.processes &&
                notificationId.toString()[
                  notificationId.toString().length - 1
                ] == '2'
              ) {
                let processesList = ''
                for (const process in exactTask.processes) {
                  processesList +=
                    (process > 0 ? ', ' : '') + exactTask.processes[process]
                }
                console.log(processesList)
                notificationText = `starts in ${beforeStart} minutes. Preparation processes: ${processesList}`
              }

              const pendetNotifs =
                await capacitor.Plugins.LocalNotifications.getPending()

              if (
                !pendetNotifs.notifications.some(
                  (element) => Number(element.id) === Number(notificationId)
                ) &&
                dateNow.getTime() <= notificationDate.getTime()
              ) {
                await capacitor.Plugins.LocalNotifications.schedule({
                  notifications: [
                    {
                      title: notificationTitle,
                      body: notificationText,
                      id: Number(notificationId),
                      schedule: { at: notificationDate },
                      allowWhileIdle: true,
                      autoCancel: true,
                      ongoing: true,
                      actionTypeId: exactTask.continuous
                        ? 'CONTINUOUS_TASK_NOTIFICATION'
                        : 'TASK_NOTIFICATION',
                      extra: `/${exactTask.time.slice(
                        0,
                        exactTask.time.indexOf(' ')
                      )}/${exactTask.id}`
                    }
                  ]
                }).then((res) => console.log('scheduled', res))
              }
            }
          } else {
            dispatch('removeNotifications', exactTask.notificationsId)
          }
        }
      }
    }
    console.log(
      'Pended',
      await capacitor.Plugins.LocalNotifications.getPending()
    )
    //dispatch('clearAllNotifs')
  },
  async removeNotifications({ getters }, notifsList) {
    getters.capacitor.Plugins.LocalNotifications.cancel({
      notifications: notifsList
    })
  },
  async clearAllNotifs({ getters }) {
    try {
      getters.capacitor.Plugins.LocalNotifications.getPending().then(
        (res) => {
          getters.capacitor.Plugins.LocalNotifications.cancel(res)
        },
        (error) => {
          console.log(error)
        }
      )
    } catch (error) {
      console.error(error)
    }
  }
}

const getters = {
  capacitor: (state) => state.capacitor
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
