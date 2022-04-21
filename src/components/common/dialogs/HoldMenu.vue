<template>
  <q-dialog ref="holdMenuDialog" @hide="hide">
    <q-card>
      <q-card-section class="text-center text-subtitle1">
        <p class="no-margin">
          {{ type[0].toUpperCase() + type.slice(1) }}
        </p>
        <p v-if="item['title']" class="no-margin">
          {{
            `${item['title'].slice(0, 10)}${
              item['title'].length > 10 ? '...' : ''
            }`
          }}
        </p>
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn color="primary" icon="visibility" :to="url">View</q-btn>
      </q-card-section>
      <q-card-section class="text-center">
        <edit-button :path="url" />
      </q-card-section>
      <q-card-section
        v-if="type == 'task' || type == 'free-task'"
        class="text-center"
      >
        <progress-change :item="item" :type="type" />
      </q-card-section>
      <q-card-section
        v-if="type == 'task' || type == 'free-task'"
        class="text-center"
      >
        <copy-button :task="item" :type="type" />
      </q-card-section>
      <q-card-section
        v-if="
          (type == 'task' || type == 'free-task') &&
          item['continuous'] &&
          !item['continuousStarted']
        "
        class="text-center"
      >
        <start-continuous-button
          :path="`${convertedType}s${
            type == 'task'
              ? `/date-${item.time.slice(0, item.time.indexOf(' '))}`
              : ''
          }/id-${item.id}`"
        />
      </q-card-section>
      <q-card-section
        v-if="
          (type == 'task' || type == 'free-task') &&
          item['continuous'] &&
          item['continuousStarted'] &&
          !item['continuousEnded']
        "
        class="text-center"
      >
        <stop-continuous-button
          :path="`${convertedType}s${
            type == 'task'
              ? `/date-${item.time.slice(0, item.time.indexOf(' '))}`
              : ''
          }/id-${item.id}`"
        />
      </q-card-section>
      <q-card-section v-if="type == 'free-task'" class="text-center border">
        <p class="text-center no-margin">Priority</p>
        <q-btn flat dense>
          <q-icon
            name="fiber_manual_record"
            :color="
              item.priority === 1
                ? 'green'
                : item.priority === 2
                ? 'yellow'
                : 'red-11'
            "
          />
          {{
            item['priority'] == 1
              ? 'High'
              : item['priority'] == 2
              ? 'Medium'
              : 'Low'
          }}
          <q-icon name="expand_more" />
          <q-menu anchor="bottom left" self="top left" auto-close>
            <q-list separator>
              <q-item clickable @click="changePriority(item, 1)">
                <div class="full-width">
                  <q-icon name="fiber_manual_record" color="green" />
                  High
                </div>
              </q-item>
              <q-item clickable @click="changePriority(item, 2)">
                <div class="full-width">
                  <q-icon name="fiber_manual_record" color="yellow" />
                  Medium
                </div>
              </q-item>
              <q-item clickable @click="changePriority(item, 3)">
                <div class="full-width">
                  <q-icon name="fiber_manual_record" color="red" />
                  Low
                </div>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-card-section>
      <q-card-section v-if="type == 'note'" class="text-center">
        <q-btn
          :color="item['favorite'] ? 'grey-6' : 'warning'"
          :icon="item['favorite'] ? 'star_outline' : 'star'"
          @click="favoriteNote(item['favorite'], item['id'])"
        >
          {{ item['favorite'] ? 'Unfavorite' : 'Favorite' }}
        </q-btn>
      </q-card-section>
      <q-card-section
        v-if="type == 'free-task' || type == 'note'"
        class="text-center"
      >
        <p class="text-center no-margin">Category</p>
        <category-select
          :item-category="item.category || ''"
          rewrite
          :item-path="`${convertedType}s/id-${item.id}`"
        />
      </q-card-section>
      <q-card-section class="text-center">
        <item-remove :item="item" :type="type" @deleteEvent="hide()" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { getDatabase, ref, update } from 'firebase/database'

import ProgressChange from 'src/components/common/groups/ProgressChange.vue'
import ItemRemove from 'src/components/common/groups/ItemRemove.vue'
import EditButton from 'src/components/common/elements/buttons/EditButton.vue'
import CopyButton from 'src/components/common/elements/buttons/CopyButton.vue'

import StartContinuousButton from 'src/components/common/elements/buttons/StartContinuousButton.vue'
import StopContinuousButton from 'src/components/common/elements/buttons/StopContinuousButton.vue'
import CategorySelect from 'src/components/common/groups/CategorySelect.vue'

const db = getDatabase()

export default {
  components: {
    ProgressChange,
    ItemRemove,
    EditButton,
    CopyButton,
    StartContinuousButton,
    StopContinuousButton,
    CategorySelect
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    convertedType() {
      let type = JSON.parse(JSON.stringify(this.type))
      return type.replace(/-./g, (x) => x[1].toUpperCase())
    },
    url() {
      const url = `/${
        this.type == 'task'
          ? this.item.time.slice(0, this.item.time.indexOf(' '))
          : this.type + 's'
      }/${this.item['id']}`
      return url
    }
  },
  methods: {
    show() {
      this.$refs['holdMenuDialog'].show()
    },
    hide() {
      this.$refs['holdMenuDialog'].hide()
    },
    changePriority(task, priority) {
      update(
        ref(
          db,
          `${this.$store.getters['users/userId']}/freeTasks/id-${task.id}`
        ),
        { priority: priority }
      )
    },
    favoriteNote(favorite, id) {
      update(ref(db, `${this.$store.getters['users/userId']}/notes/id-${id}`), {
        favorite: !favorite
      })
    }
  }
}
</script>
