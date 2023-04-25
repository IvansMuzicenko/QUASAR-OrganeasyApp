<template>
  <q-menu
    class="text-center"
    auto-close
    self="top middle"
    anchor="bottom middle"
  >
    <q-list style="min-width: 100px">
      <q-item clickable @click="addTask">
        <q-item-section avatar>
          <q-avatar icon="view_list" />
        </q-item-section>
        <q-item-section>Task</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable @click="addFreeTask">
        <q-item-section avatar>
          <q-avatar icon="alarm_off" />
        </q-item-section>
        <q-item-section>Free task</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable @click="addNote">
        <q-item-section avatar>
          <q-avatar icon="note" />
        </q-item-section>
        <q-item-section>Note</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable @click="addProcess">
        <q-item-section avatar>
          <q-icon name="update" />
        </q-item-section>
        <q-item-section>Process</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable @click="addCategory">
        <q-item-section avatar>
          <q-icon name="category" />
        </q-item-section>
        <q-item-section>Category</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable @click="addTimeLog">
        <q-item-section avatar>
          <q-icon name="pending_actions" />
        </q-item-section>
        <q-item-section>Log time</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable @click="addLogProcess">
        <q-item-section avatar>
          <q-icon name="account_tree" />
        </q-item-section>
        <q-item-section>Log Process</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable @click="addLogCategory">
        <q-item-section avatar>
          <q-icon name="hub" />
        </q-item-section>
        <q-item-section>Log Category</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
import AddTask from 'src/components/common/dialogs/AddTask.vue'
import AddFreeTask from 'src/components/common/dialogs/AddFreeTask.vue'
import AddProcess from 'src/components/common/dialogs/AddProcess.vue'
import AddNote from 'src/components/common/dialogs/AddNote.vue'
import AddCategory from 'src/components/common/dialogs/AddCategory.vue'
import AddTimeLog from 'src/components/common/dialogs/AddTimeLog.vue'
import AddLogProcess from 'src/components/common/dialogs/AddLogProcess.vue'
import { date } from 'quasar'

export default {
  methods: {
    addTask() {
      this.$q.dialog({
        component: AddTask
      })
    },
    addFreeTask() {
      this.$q.dialog({
        component: AddFreeTask
      })
    },
    addNote() {
      this.$q.dialog({
        component: AddNote
      })
    },
    addProcess() {
      this.$q.dialog({
        component: AddProcess
      })
    },
    addCategory() {
      this.$q.dialog({
        component: AddCategory
      })
    },
    addTimeLog() {
      this.$q.dialog({
        component: AddTimeLog,
        componentProps: {
          exactDate: date.formatDate(new Date(), 'DD-MM-YYYY')
        }
      })
    },
    addLogProcess() {
      this.$q.dialog({
        component: AddLogProcess
      })
    },
    addLogCategory() {
      this.$q.dialog({
        component: AddCategory,
        componentProps: {
          logCategory: true
        }
      })
    }
  }
}
</script>
