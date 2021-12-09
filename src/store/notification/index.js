import { date } from 'quasar'

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
            {
              id: 'view',
              title: 'Show'
            },
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
    const tasks = rootGetters['users/tasks']
    let notificationList = []
    for (const tasksDate of Object.keys(tasks)) {
      for (const task of tasks[tasksDate]) {
        if (!task.progress) {
          if (task.notificationsId) {
            for (const notifId in task.notificationsId) {
              const notificationDate = new Date(
                Number(task.notificationsId[notifId]) * 1000
              )
              const pendetNotifs =
                await capacitor.Plugins.LocalNotifications.getPending()

              console.log(pendetNotifs)

              if (
                !pendetNotifs.notifications.some(
                  (element) =>
                    Number(element.id) === Number(task.notificationsId[notifId])
                )
              ) {
                notificationList.push({
                  title: task.title,
                  body: task.title,
                  id: Number(task.notificationsId[notifId]),
                  schedule: { at: notificationDate },
                  allowWhileIdle: true,
                  autoCancel: false,
                  actionTypeId: task.continuous
                    ? 'CONTINUOUS_TASK_NOTIFICATION'
                    : 'TASK_NOTIFICATION',
                  sound: null,
                  attachments: null,
                  extra: null
                })
              }
            }
          }
        }
      }
    }
    const notifs = await capacitor.Plugins.LocalNotifications.schedule({
      notifications: notificationList
    })
    console.log(notifs)
    //dispatch('stopLocalPush')
  } //,
  // async stopLocalPush({ getters }) {
  //   try {
  //     getters.capacitor.Plugins.LocalNotifications.getPending().then(
  //       (res) => {
  //         //console.log(res, "elo");
  //         getters.capacitor.Plugins.LocalNotifications.cancel(res)
  //       },
  //       (error) => {
  //         console.log(error)
  //       }
  //     )
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
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
