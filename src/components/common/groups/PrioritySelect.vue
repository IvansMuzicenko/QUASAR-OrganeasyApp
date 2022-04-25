<template>
  <q-btn flat dense>
    <q-icon
      name="fiber_manual_record"
      :color="
        itemPriority === 1 ? 'green' : itemPriority === 2 ? 'yellow' : 'red-11'
      "
    />
    {{ itemPriority == 1 ? 'High' : itemPriority == 2 ? 'Medium' : 'Low' }}
    <q-icon name="expand_more" />
    <q-menu anchor="bottom left" self="top left" auto-close>
      <q-list separator>
        <q-item clickable @click="changePriority(1)">
          <div class="full-width">
            <q-icon name="fiber_manual_record" color="green" />
            High
          </div>
        </q-item>
        <q-item clickable @click="changePriority(2)">
          <div class="full-width">
            <q-icon name="fiber_manual_record" color="yellow" />
            Medium
          </div>
        </q-item>
        <q-item clickable @click="changePriority(3)">
          <div class="full-width">
            <q-icon name="fiber_manual_record" color="red" />
            Low
          </div>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { getDatabase, ref, update } from 'firebase/database'

const db = getDatabase()

export default {
  props: {
    itemPriority: {
      type: Number,
      required: false,
      default: 3
    },
    itemId: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['prioritySelected'],
  methods: {
    changePriority(priority) {
      if (this.itemId && priority != this.itemPriority) {
        update(
          ref(
            db,
            `${this.$store.getters['users/userId']}/freeTasks/id-${this.itemId}`
          ),
          { priority: priority }
        )
        return this.$emit('prioritySelected')
      }
      this.$emit('prioritySelected', priority)
    }
  }
}
</script>
