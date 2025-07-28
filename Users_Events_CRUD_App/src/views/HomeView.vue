<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import UsersTable from '@/components/UsersTable.vue'
import AddUser from '@/components/AddUser.vue'
import { useAdminStore } from '../../store/store'

const adminStore = useAdminStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')

const logOut = () => {
  adminStore.logOut()
}

const filterUsers = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/filter_users', {
      adminId: adminStore.adminId,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phoneNumber: phoneNumber.value
    })

    useAdminStore().cleanList()
    adminStore.addUsers(response.data.users)
  } catch (err) {
    console.error('Filtering error:', err)
  }
}

</script>

<template>
  <header class="header">
    <div class="adminContainer">
      <img src="../assets/account.png" />
      <h1>{{ adminStore.firstName }} {{ adminStore.lastName }}</h1>
    </div>
    <img @click="logOut" class="log_out" src="../assets/log-out.png" />
  </header>

  <main class="mainContainer">
    <div class="filters">
      <div class="filter_title">
        <h1>Filters</h1>
      </div>

      <div class="filter">
        <img src="../assets/account.png" alt="" />
        <input v-model="firstName" type="text" placeholder="First name" />
      </div>

      <div class="filter">
        <img src="../assets/account.png" alt="" />
        <input v-model="lastName" type="text" placeholder="Last name" />
      </div>

      <div class="filter">
        <img src="../assets/email.png" alt="" />
        <input v-model="email" type="email" placeholder="Email" />
      </div>

      <div class="filter">
        <img src="../assets/iphone.png" alt="" />
        <input v-model="phoneNumber" type="text" placeholder="Phone number" />
      </div>

      <div class="filterButtonContainer">
        <button @click="filterUsers">Filter</button>
      </div>
    </div>

    <AddUser />
    <UsersTable />
  </main>
</template>

<style src="../views/styles/home.css" />
