import { defineStore } from 'pinia'
import router from '@/router'



export const useAdminStore = defineStore('admin', {
  state: () => ({
    adminId: '',
    firstName: '',
    lastName: '',
    users:[],
    login: false,
  }),
  actions: {
    setAdminData( adminId, firstName, lastName ) {
      this.adminId = adminId;
      this.firstName = firstName;
      this.lastName = lastName;
      this.login = true
    },

    logOut() {
      this.$reset()
      this.login = false
      router.push('/')
    },

    cleanList() {
      this.users = []
    },

    addUser(user) {
      this.users.push(user)
    },

    addUsers(newUsers){
      this.users.push(...newUsers)
    }
  }
})
export const useUserStore = defineStore('user', {
  state: () => {
  return {
    userId: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    events: [],
    nextEventDate: ''
  }},
  
  getters: {
    eventsCount: (state) => state.events.length
  },
  actions: {
    choiseUser(userId, firstName, lastName, email, phoneNumber, events) {
      this.userId = userId,
      this.firstName = firstName, 
      this.lastName = lastName
      this.email = email
      this.phoneNumber = phoneNumber
      this.events = [...events]
      useAdminStore().cleanList()
      router.push('/User')
    },

    addEvents(events) {
      this.events.push(...events)
    },
    
    addEvent(event) {
      this.events.push(event)
    },
    clearEvents() {
      this.events = []
    },
  }

})

export const useControllers = defineStore('controller', {
  state: () => {
  return {
    showAddUser: false,
    showAddEvent: false
  }},
  
  actions: {
    showAddUserModal() {
      !this.showAddUser ? this.showAddUser = true : this.showAddUser = false
    },
    showAddEventModal() {
      !this.showAddEvent ? this.showAddEvent = true : this.showAddEvent = false
    }
  }

})