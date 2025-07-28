<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore, useControllers, useUserStore } from '../../store/store'
import axios from 'axios'
import { useRouter } from 'vue-router'


const adminStore = useAdminStore()
const useController = useControllers()
const userStore = useUserStore()
const loading = ref(false)
const error = ref(null)


async function fetchUsers() {
  loading.value = true
  error.value = null


  let page = 1
  try {

    while (true) {
      const { data } = await axios.post('http://localhost:3000/api/get_users',{ adminId: adminStore.adminId, page })

      adminStore.addUsers(data.data)

      if (!data.meta.hasNext) break

      page += 1
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)


const addUser = () => {
  useController.showAddUserModal()
}


</script>

<template>
<div class="UserTableContainer">

    <div class="addUser">
      <button @click="addUser()" class="addUserButton"><img src="../assets/add.png"/></button>
    </div>

    <p v-if="loading">Loading...</p>
    <p v-else-if="error" style="color:red; font-size: 1vw; margin-left: 34vw" >{{ error }}</p>
    <table v-else>
      <thead>
        <tr>
          <th>UserName</th>
          <th>Email</th>
          <th>PhoneNumber</th>
          <th>Events Count</th>
          <th>Next Event Date</th>
        </tr>
      </thead>
    </table>
    <div class="tableContainer">
    <table>
    <tbody>
      <tr v-for="u in adminStore.users" :key="u._id">
        <td style="cursor:pointer;color:blue" @click="userStore.choiseUser(u._id, u.firstName, u.lastName, u.email, u.phoneNumber, u.events)">
          {{ u.firstName }} {{ u.lastName }}
        </td>
        <td>{{ u.email }}</td>
        <td>{{ u.phoneNumber }}</td>
        <td>{{ u.events.length }}</td>
        <td>{{ u.nextEventDate ?? '—' }}</td>
      </tr>
    </tbody>
    </table>
    </div>
</div>
</template>

<style src="./styles/userTable.css"/>

