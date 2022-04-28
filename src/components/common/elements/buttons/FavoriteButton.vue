<template>
  <q-btn
    :color="
      holdMenu
        ? itemFavorite
          ? 'grey-6'
          : 'warning'
        : itemFavorite
        ? 'warning'
        : 'grey-6'
    "
    :icon="
      holdMenu
        ? itemFavorite
          ? 'star_outline'
          : 'star'
        : itemFavorite
        ? 'star'
        : 'star_outline'
    "
    :flat="iconOnly || flat"
    :round="iconOnly"
    @click.prevent.stop="favoriteNote()"
  >
    {{
      iconOnly
        ? ''
        : holdMenu
        ? itemFavorite
          ? 'Unfavorite'
          : 'Favorite'
        : itemFavorite
        ? 'Favorite'
        : 'Unfavorite'
    }}
  </q-btn>
</template>

<script>
import { getDatabase, ref, update } from 'firebase/database'

const db = getDatabase()

export default {
  props: {
    itemFavorite: {
      type: Boolean,
      required: true
    },
    itemId: {
      type: String,
      required: false,
      default: ''
    },
    iconOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    flat: {
      type: Boolean,
      required: false,
      default: false
    },
    holdMenu: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['favoriteChanged'],
  methods: {
    favoriteNote() {
      if (this.itemId) {
        update(
          ref(
            db,
            `${this.$store.getters['users/userId']}/notes/id-${this.itemId}`
          ),
          {
            favorite: !this.itemFavorite
          }
        )
        return this.$emit('favoriteChanged')
      }
      this.$emit('favoriteChanged', !this.itemFavorite)
    }
  }
}
</script>
