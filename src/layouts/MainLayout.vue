<template>
  <q-layout view="lHh Lpr lFf">
    <q-footer elevated reveal class="bg-orange-3 text-black">
      <div v-if="email" class="fixed-bottom text-center q-mb-xl q-pa-sm"></div>
      <q-toolbar class="row no-padding">
        <q-btn
          flat
          dense
          round
          icon="more_vert"
          aria-label="Menu"
          class="no-padding"
          @click="toggleLeftDrawer"
        />
        <div class="col-11">
          <q-list class="row">
            <q-item
              class="col justify-center no-padding"
              clickable
              exact
              to="/"
            >
              <q-item-section avatar class="no-padding">
                <q-avatar icon="view_list"></q-avatar>
              </q-item-section>
            </q-item>
            <q-item
              class="col justify-center no-padding"
              clickable
              exact
              to="/notes"
            >
              <q-item-section avatar class="no-padding">
                <q-avatar icon="note"></q-avatar>
              </q-item-section>
            </q-item>
            <q-item class="col justify-center no-padding" clickable>
              <q-item-section avatar class="no-padding">
                <q-avatar
                  round
                  color="orange"
                  text-color="white"
                  icon="add"
                ></q-avatar>
              </q-item-section>

              <q-menu
                class="text-center"
                auto-close
                self="top middle"
                anchor="bottom middle"
              >
                <q-list style="min-width: 100px">
                  <q-item clickable @click="addTask">
                    <q-item-section avatar>
                      <q-avatar icon="view_list"></q-avatar>
                    </q-item-section>
                    <q-item-section> Task</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="addNote">
                    <q-item-section avatar>
                      <q-avatar icon="note"></q-avatar>
                    </q-item-section>
                    <q-item-section> Note</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="addProcess">
                    <q-item-section avatar>
                      <q-icon name="update"></q-icon>
                    </q-item-section>
                    <q-item-section> Process</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-item
              class="col justify-center no-padding"
              clickable
              exact
              to="/processes"
            >
              <q-item-section avatar class="no-padding">
                <q-icon name="update"></q-icon>
              </q-item-section>
            </q-item>
            <q-item
              class="col justify-center no-padding"
              clickable
              exact
              to="/settings"
            >
              <q-item-section avatar class="no-padding">
                <q-icon name="settings"></q-icon>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-toolbar>
    </q-footer>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-toolbar-title>
        <div>Organizify</div>
      </q-toolbar-title>
      <q-list>
        <q-item-label v-if="email" header>
          {{ email.slice(0, email.indexOf('@')) }}</q-item-label
        >
        <q-btn
          v-else
          class="full-width q-ma-lg no-margin"
          color="secondary"
          label="Sign In"
          to="/auth"
        />
        <q-item-label header> {{ formattedDate }}</q-item-label>

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
                  <q-item-section>Task</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="addNote">
                  <q-item-section>Note</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="addProcess">
                  <q-item-section>Process</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'
import AddProcessForm from 'components/AddProcessForm.vue'
import AddTaskForm from 'components/AddTaskForm.vue'
import AddNoteForm from 'components/AddNoteForm.vue'

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
    addTask() {
      this.$q.dialog({
        component: AddTaskForm
      })
    },
    addProcess() {
      this.$q.dialog({
        component: AddProcessForm
      })
    },
    addNote() {
      this.$q.dialog({
        component: AddNoteForm
      })
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
}
</script>
