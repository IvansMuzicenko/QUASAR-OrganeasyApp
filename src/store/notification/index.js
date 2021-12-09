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
              const pendetNotifs =
                await capacitor.Plugins.LocalNotifications.getPending()

              console.log(pendetNotifs)

              if (
                !pendetNotifs.notifications.some(
                  (element) =>
                    Number(element.id) === date.formatDate(time, 'x') / 1000
                )
              ) {
                notificationList.push({
                  title: task.title,
                  body: task.title,
                  id:
                    date.formatDate(time, 'x') / 1000 -
                    (notification.notificationTimeValuesModel == 0 ? 1 : 0),
                  schedule: { at: time },
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
    // dispatch('stopLocalPush')
  }
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
