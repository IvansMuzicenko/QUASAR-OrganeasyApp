<template>
  <q-drawer v-model="drawerState" show-if-above bordered>
    <q-toolbar-title>
      <div class="text-center">Organeasy</div>
    </q-toolbar-title>
    <q-list>
      <q-item-label v-if="email" header>
        {{ email.slice(0, email.indexOf('@')) }}
      </q-item-label>
      <q-btn
        v-else
        class="full-width q-ma-lg no-margin"
        color="secondary"
        label="Sign In"
        to="/auth"
      />
      <q-item-label header>{{ formattedDate }}</q-item-label>

      <q-item>
        <q-btn
          icon="search"
          flat
          rounded
          outline
          class="full-width"
          @click="openSearch"
        >
          Search
        </q-btn>
      </q-item>

      <list-link
        v-for="link in email ? links : unauthLinks"
        :key="link.title"
        :class="
          parentPath == (link['link'].replace('/', '') || 'tasks')
            ? 'activeLink'
            : ''
        "
        v-bind="link"
      />

      <div v-if="email" class="text-center">
        <q-btn color="primary" rounded icon="add">
          Add...
          <items-creation-menu />
        </q-btn>
      </div>
    </q-list>
  </q-drawer>
</template>

<script>
import { date } from 'quasar'

import ListLink from 'src/components/common/layout/parts/ListLink.vue'
import Search from 'src/components/common/dialogs/Search.vue'
import ItemsCreationMenu from 'src/components/common/layout/parts/ItemsCreationMenu.vue'

export default {
  components: {
    ListLink,
    ItemsCreationMenu
  },
  props: {
    leftDrawerOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['stateChanged'],
  data() {
    const timeStamp = Date.now()
    const formattedDate = date.formatDate(timeStamp, 'dddd, D MMMM YYYY')

    return {
      links: [
        {
          title: 'Diary',
          caption: '',
          icon: 'view_list',
          link: '/'
        },
        {
          title: 'Free tasks',
          caption: '',
          icon: 'alarm_off',
          link: '/free-tasks'
        },
        {
          title: 'Notes',
          caption: '',
          icon: 'note',
          link: '/notes'
        },
        {
          title: 'Processes',
          caption: '',
          icon: 'update',
          link: '/processes'
        },
        {
          title: 'Categories',
          caption: '',
          icon: 'category',
          link: '/categories'
        },
        {
          title: 'Time Logs',
          caption: '',
          icon: 'pending_actions',
          link: '/logs'
        },
        {
          title: 'Log Processes',
          caption: '',
          icon: 'account_tree',
          link: '/log-processes'
        },
        {
          title: 'Log Categories',
          caption: '',
          icon: 'hub',
          link: '/log-categories'
        },
        {
          title: 'Help',
          caption: '',
          icon: 'help',
          link: '/help'
        },
        {
          title: 'Settings',
          caption: '',
          icon: 'settings',
          link: '/settings'
        }
      ],
      unauthLinks: [
        {
          title: 'Help',
          caption: '',
          icon: 'help',
          link: '/help'
        }
      ],
      formattedDate
    }
  },
  computed: {
    email() {
      return this.$store.getters['users/email']
    },
    parentPath() {
      return this.$route.meta.parentPath || null
    },
    drawerState: {
      set(value) {
        this.$emit('stateChanged', value)
      },
      get() {
        return this.leftDrawerOpen
      }
    }
  },
  methods: {
    openSearch() {
      this.$q.dialog({
        component: Search,
        componentProps: {
          searchType: 'all'
        }
      })
    }
  }
}
</script>
