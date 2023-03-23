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
        <priority-select :item-priority="item.priority" :item-id="item.id" />
      </q-card-section>
      <q-card-section v-if="type == 'note'" class="text-center">
        <favorite-button
          :item-favorite="item.favorite"
          :item-id="item.id"
          hold-menu
        />
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
        <item-remove :item="item" :type="type" @delete-event="hide()" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import ProgressChange from 'src/components/common/groups/ProgressChange.vue'
import ItemRemove from 'src/components/common/groups/ItemRemove.vue'
import EditButton from 'src/components/common/elements/buttons/EditButton.vue'
import CopyButton from 'src/components/common/elements/buttons/CopyButton.vue'

import StartContinuousButton from 'src/components/common/elements/buttons/StartContinuousButton.vue'
import StopContinuousButton from 'src/components/common/elements/buttons/StopContinuousButton.vue'
import CategorySelect from 'src/components/common/groups/CategorySelect.vue'
import PrioritySelect from 'src/components/common/groups/PrioritySelect.vue'
import FavoriteButton from 'src/components/common/elements/buttons/FavoriteButton.vue'

export default {
  components: {
    ProgressChange,
    ItemRemove,
    EditButton,
    CopyButton,
    StartContinuousButton,
    StopContinuousButton,
    CategorySelect,
    PrioritySelect,
    FavoriteButton
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
    }
  }
}
</script>
