<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useControllers, useUserStore,  } from '../../store/store'

interface EventForm {
  userId: string
  title: string
  description: string
  startDate: string
  endDate: string
}

interface Errors {
  [key: string]: string
}

const controllerStore = useControllers();
const userStore = useUserStore();

const userId = useUserStore().userId
const form = ref<EventForm>({
  userId,
  title: '',
  description: '',
  startDate: '',
  endDate: ''
})


const errors = ref<Errors>({})
const loading = ref(false)
const serverError = ref<string | null>(null)

function cancel() {
  controllerStore.showAddEventModal()
}

async function addEvent() {
  loading.value = true
  serverError.value = null
  errors.value = {}

  try {
    const { data } = await axios.post('http://localhost:3000/api/add_event', form.value)
    userStore.addEvent(data.data)
    
    
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      serverError.value = error.response?.data?.message || 'Something went wrong'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="AddEventContainer" v-if="useControllers().showAddEvent">
    <div class="AddData_title">
      <h1>Add Event</h1>
      <img src="@/assets/reject.png" @click="cancel" class="close" />
    </div>

    <div class="EventData">
     <div class="DataBox">
      <input
        class="EventDataInput"
        v-model="form.title"
        type="text"
        placeholder="Title"
        :class="{ invalid: errors.title }"
      />

      <input
        class="EventDataInput"
        v-model="form.startDate"
        type="date"
        placeholder="Start Date"
        :class="{ invalid: errors.startDate }"
      />
      
      <input
        class="EventDataInput"
        v-model="form.endDate"
        type="date"
        placeholder="End Date"
        :class="{ invalid: errors.endDate }"
      />
      
     </div>



      <textarea
        class="describeArea"
        v-model="form.description"
        type="text"
        placeholder="Description"
        :class="{ invalid: errors.description }"
      />

    </div>

    <div v-if="serverError" class="error server">{{ serverError }}</div>

    <div class="addButtonContainer">
      <button class="addButton" @click="addEvent" :disabled="loading">
        Add Event
      </button>
      <button class="cancelButton" type="button" @click="cancel">
        Cancel
      </button>
    </div>
  </div>
</template>

<style src='./styles/addEvent.css' scoped />
