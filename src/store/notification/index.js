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
  setCapacitor({ commit }, capacitor) {
    commit('SET_CAPACITOR', capacitor)
  },

  async addNotifications({ getters, rootGetters }) {
    const capacitor = getters.capacitor
    await capacitor.Plugins.LocalNotifications.requestPermissions()
    const tasks = rootGetters['users/tasks']
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
    const notifs = await capacitor.Plugins.LocalNotifications.schedule({
      notifications: notificationList
    })
    console.log(notifs)
    // console.log(
    //   await capacitor.Plugins.LocalNotifications.getPending()
    // )
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
