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

        <essential-link
          v-for="link in email ? essentialLinks : unauthLinks"
          :key="link.title"
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
      <div v-if="email" class="fixed-bottom text-center q-mb-xl q-pa-sm" />
      <q-toolbar class="row no-padding">
        <div class="col-12">
          <q-list class="row">
            <q-item
              class="col justify-center no-padding"
              clickable
              exact
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
              exact
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
              exact
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

            <q-item class="col justify-center no-padding" clickable exact>
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
                    exact
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
                    exact
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
                    exact
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
import EssentialLink from 'src/components/EssentialLink.vue'
import AddTaskForm from 'src/components/AddTaskForm.vue'
import AddFreeTaskForm from 'src/components/AddFreeTaskForm.vue'
import AddProcessForm from 'src/components/AddProcessForm.vue'
import AddNoteForm from 'src/components/AddNoteForm.vue'
import AddCategoryForm from 'src/components/AddCategoryForm.vue'
import Search from 'src/components/Search.vue'

export default {
  components: {
    EssentialLink
  },

  data() {
    const timeStamp = Date.now()
    const formattedDate = date.formatDate(timeStamp, 'dddd, D MMMM YYYY')

    return {
      leftDrawerOpen: false,
      essentialLinks: [
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
    }
  },
  methods: {
    reload(done) {
      location.reload()
      done()
    },
    addTask() {
      this.$q.dialog({
        component: AddTaskForm
      })
    },
    addFreeTask() {
      this.$q.dialog({
        component: AddFreeTaskForm
      })
    },
    addNote() {
      this.$q.dialog({
        component: AddNoteForm
      })
    },
    addProcess() {
      this.$q.dialog({
        component: AddProcessForm
      })
    },
    addCategory() {
      this.$q.dialog({
        component: AddCategoryForm
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
