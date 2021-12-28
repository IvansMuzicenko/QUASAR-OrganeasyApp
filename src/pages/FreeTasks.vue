<template>
  <q-page>
    <q-card class="flex">
      <q-btn
        icon="arrow_back"
        flat
        class="absolute"
        @click="$router.push('/')"
      />

      <p class="text-center text-h6 full-width">Free Tasks</p>
    </q-card>
    <p class="text-center text-body1">Uncompleted tasks</p>
    <q-list separator bordered>
      <q-item
        v-for="(task, index) in freeTasks"
        v-show="!task['progress']"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => holdSuccess(event, index)"
        :style="task['progress'] ? ' background: lightgrey' : ''"
        clickable
        :to="`/free-tasks/id-${task['id']}`"
        class="q-pa-none"
      >
        <q-item-section>
          <q-item-section class="q-px-md">
            <q-item-section class="text-weight-bolder">{{
              task['title']
            }}</q-item-section>
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

            <q-popup-proxy
              :ref="`taskHold-${index}`"
              cover
              :breakpoint="10000"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-card>
                <q-card-section class="text-center">
                  <q-btn
                    color="primary"
                    icon="visibility"
                    @click="openTask(task)"
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
          </q-item-section>
          <q-separator size="5px"></q-separator>
        </q-item-section>
      </q-item>
    </q-list>
    <q-separator></q-separator>
    <p class="text-center text-body1">Completed tasks</p>
    <q-separator></q-separator>
    <q-list separator bordered>
      <q-item
        v-for="(task, index) in freeTasks"
        v-show="task['progress']"
        :key="index"
        v-touch-hold:400:12:15.mouse="(event) => holdSuccess(event, index)"
        :style="task['progress'] ? ' background: lightgrey' : ''"
        clickable
        :to="`/free-tasks/id-${task['id']}`"
      >
        <q-item-section>
          <q-item-section class="text-weight-bolder">{{
            task['title']
          }}</q-item-section>

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
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { getDatabase, ref, update } from 'firebase/database'
const db = getDatabase()

export default {
  computed: {
    freeTasks() {
      return this.$store.getters['users/freeTasks']
    }
  },
  methods: {
    openTask(task, edit) {
      if (!edit) {
        this.$router.push(`/free-tasks/id-${task.id}`)
      } else {
        this.$router.push(`/free-tasks/id-${task.id}?edit=true`)
      }
    },

    changeProgress(task) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}`
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
          `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}/subtasks/${index}`
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
