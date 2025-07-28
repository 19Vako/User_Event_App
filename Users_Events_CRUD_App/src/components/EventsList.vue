<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore, useControllers, useUserStore } from '../../store/store'
import axios from 'axios'
import { useRouter } from 'vue-router'


const router = useRouter()
const adminStore = useAdminStore()
const userStore = useUserStore()
const controllerStore = useControllers()

const loading = ref(false)
const error = ref<string | null>(null)

const limit = 10


async function fetchEvents() {
  loading.value = true
  error.value = null

  let page = 1
  userStore.clearEvents()

  try {
    while (true) {
      const { data } = await axios.post('http://localhost:3000/api/get_events', {
        userId: userStore.userId,
        page,
        limit
      })

      userStore.addEvents(data.data)

      if (!data.meta.hasNext) break
      page += 1
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

onMounted(fetchEvents)
</script>

<template>
  <div class="EventTableContainer">
    <div class="addEvent">
        <img src="../assets/arrow.png" @click="router.push('/Home')"/>
      <button @click="controllerStore.showAddEventModal()" class="addUserButton">
        <img src="../assets/add.png" alt="Add Event" />
      </button>
    </div>

    <div v-if="loading" class="loader">Loading events...</div>
     <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="userStore.events.length === 0" class="empty">No events found</div>

    <div class="List">
      <div v-for="e in userStore.events" :key="e._id" class="EventCard">

        <h2>Title: {{ e.title }}</h2>
        <p><strong>Start Date:</strong> {{ new Date(e.startDate).toLocaleString() }}</p>
        <p><strong>End Date:</strong> {{ new Date(e.endDate).toLocaleString() }}</p>
        <p><strong>Description:</strong> {{ e.description }}</p>
        
      </div>
    </div>
     
  </div>
</template>

<style scoped src="./styles/eventList.css" />