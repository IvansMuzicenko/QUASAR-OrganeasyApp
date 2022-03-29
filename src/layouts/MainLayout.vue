<template>
  <q-layout view="LHh Lpr lFf">
    <q-pull-to-refresh
      style="height: 3rem; z-index: 1000"
      class="absolute full-width"
      @refresh="reload"
    />
    <q-header elevated class="gt-xs bg-orange-4">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Organeasy</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
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
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-list>
    </q-drawer>

    <q-footer
      v-if="email"
      elevated
      reveal
      class="lt-sm bg-orange-3 text-black text-caption"
    >
      <q-toolbar class="row no-padding">
        <div class="col-12">
          <q-list class="row">
            <q-item
              class="col justify-center no-padding"
              clickable
              exact
              :class="parentPath == 'tasks' ? 'activeLink' : ''"
              to="/"
            >
              <q-item-section class="text-center" style="line-height: 0">
                <q-item-section class="row no-padding">
                  <q-icon size="sm" name="view_list" class="col" />
                </q-item-section>
                <q-item-section class="no-margin text-weight-light">
                  Diary
                </q-item-section>
              </q-item-section>
            </q-item>

            <q-item
              class="col justify-center no-padding"
              clickable
              :class="parentPath == 'free-tasks' ? 'activeLink' : ''"
              to="/free-tasks"
            >
              <q-item-section class="text-center" style="line-height: 0">
                <q-item-section class="row no-padding">
                  <q-icon size="sm" name="alarm_off" class="col" />
                </q-item-section>
                <q-item-section class="no-margin text-weight-light">
                  Free tasks
                </q-item-section>
              </q-item-section>
            </q-item>

            <q-item class="col-2 justify-center no-padding" clickable>
              <q-avatar round color="orange" text-color="white" icon="add" />

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
                </q-list>
              </q-menu>
            </q-item>

            <q-item
              class="col justify-center no-padding"
              clickable
              :class="parentPath == 'notes' ? 'activeLink' : ''"
              to="/notes"
            >
              <q-item-section class="text-center" style="line-height: 0">
                <q-item-section class="row no-padding">
                  <q-icon size="sm" name="note" class="col" />
                </q-item-section>
                <q-item-section class="no-margin text-weight-light">
                  Notes
                </q-item-section>
              </q-item-section>
            </q-item>

            <q-item
              class="col justify-center no-padding"
              clickable
              :class="
                parentPath == 'processes' ||
                parentPath == 'categories' ||
                parentPath == 'settings' ||
                parentPath == 'help'
                  ? 'activeLink'
                  : ''
              "
            >
              <q-menu
                class="text-center"
                auto-close
                self="top middle"
                anchor="bottom middle"
              >
                <q-list style="min-width: 100px" separator>
                  <q-item
                    class="col justify-center no-padding"
                    clickable
                    :class="parentPath == 'processes' ? 'activeLink' : ''"
                    to="/processes"
                  >
                    <q-item-section class="text-center" style="line-height: 0">
                      <q-item-section class="row no-padding">
                        <q-icon size="sm" name="update" class="col" />
                      </q-item-section>
                      <q-item-section class="no-margin text-weight-light">
                        Processes
                      </q-item-section>
                    </q-item-section>
                  </q-item>
                  <q-item
                    class="col justify-center no-padding"
                    clickable
                    :class="parentPath == 'categories' ? 'activeLink' : ''"
                    to="/categories"
                  >
                    <q-item-section class="text-center" style="line-height: 0">
                      <q-item-section class="row no-padding">
                        <q-icon size="sm" name="category" class="col" />
                      </q-item-section>
                      <q-item-section class="no-margin text-weight-light">
                        Categories
                      </q-item-section>
                    </q-item-section>
                  </q-item>

                  <q-item
                    class="col justify-center no-padding"
                    clickable
                    :class="parentPath == 'help' ? 'activeLink' : ''"
                    to="/help"
                  >
                    <q-item-section class="text-center" style="line-height: 0">
                      <q-item-section class="row no-padding">
                        <q-icon size="sm" name="help" class="col" />
                      </q-item-section>
                      <q-item-section class="no-margin text-weight-light">
                        Help
                      </q-item-section>
                    </q-item-section>
                  </q-item>
                  <q-item
                    class="col justify-center no-padding"
                    clickable
                    :class="parentPath == 'settings' ? 'activeLink' : ''"
                    to="/settings"
                  >
                    <q-item-section class="text-center" style="line-height: 0">
                      <q-item-section class="row no-padding">
                        <q-icon size="sm" name="settings" class="col" />
                      </q-item-section>
                      <q-item-section class="no-margin text-weight-light">
                        Settings
                      </q-item-section>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
              <q-item-section class="text-center" style="line-height: 0">
                <q-item-section class="row no-padding">
                  <q-icon size="sm" name="more_vert" class="col" />
                </q-item-section>
                <q-item-section class="no-margin text-weight-light">
                  More
                </q-item-section>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'
import AddTask from 'src/components/common/dialogs/AddTask.vue'
import AddFreeTask from 'src/components/common/dialogs/AddFreeTask.vue'
import AddProcess from 'src/components/common/dialogs/AddProcess.vue'
import AddNote from 'src/components/common/dialogs/AddNote.vue'
import AddCategory from 'src/components/common/dialogs/AddCategory.vue'
import ListLink from 'src/components/common/ListLink.vue'
import Search from 'src/components/common/dialogs/Search.vue'

export default {
  components: {
    ListLink
  },
  data() {
    const timeStamp = Date.now()
    const formattedDate = date.formatDate(timeStamp, 'dddd, D MMMM YYYY')

    return {
      leftDrawerOpen: false,
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
    }
  },
  methods: {
    reload(done) {
      location.reload()
      done()
    },
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
    openSearch() {
      this.$q.dialog({
        component: Search,
        componentProps: {
          searchType: 'all'
        }
      })
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
}
</script>

<style lang="scss">
.activeLink {
  color: rgb(50, 115, 255);
}
</style>
