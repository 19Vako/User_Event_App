<script setup lang="ts">
import axios from 'axios'
import { ref, computed } from 'vue'
import { useAdminStore, useControllers } from '../../store/store'


const errors = ref<Errors>({})
const loading = ref(false)
const showModalAddUser = useControllers()
const serverError = ref<string | null>(null)
const adminStore = useAdminStore()
const form = ref<Form>({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
})

type Form = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}
type Errors = Partial<Record<keyof Form, string>>
const emit = defineEmits<{
  (e: 'created', user: any): void
  (e: 'cancel'): void
}>()






const isDisabled = computed(() => {
  const e = validate(form.value)
  return loading.value || Object.keys(e).length > 0
})
const touched = ref<Record<keyof Form, boolean>>({
  firstName: false,
  lastName: false,
  email: false,
  phoneNumber: false,
})
function validate(values: Form): Errors {
  const e: Errors = {}
  if (!values.firstName.trim()) e.firstName = 'First name is required'
  if (!values.lastName.trim()) e.lastName = 'Last name is required'
  if (!values.email.trim()) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Invalid email'
  if (!values.phoneNumber.trim()) e.phoneNumber = 'Phone number is required'
  return e
}
function hasError(field: keyof Form) {
  return touched.value[field] && !!errors.value[field]
}
function markTouched(field: keyof Form) {
  touched.value[field] = true
}
const fields = ['firstName', 'lastName', 'email', 'phoneNumber'] as const
const showErrors = computed(() =>
  fields
    .filter(f => hasError(f))
    .map(f => errors.value[f])
    .join(' • ')
)
async function addUser() {
  ;(Object.keys(touched.value) as (keyof Form)[]).forEach(k => (touched.value[k] = true))
  errors.value = validate(form.value)
  if (Object.keys(errors.value).length) return

  loading.value = true
  serverError.value = null

  try {
    const payload = {
      adminId: adminStore.adminId,
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      email: form.value.email.toLowerCase().trim(),
      phoneNumber: form.value.phoneNumber.trim(),
    }
    const { data } = await axios.post('http://localhost:3000/api/create_user', payload)

    adminStore.addUser?.(data.user)
    emit('created', data.user)

    form.value = { firstName: '', lastName: '', email: '', phoneNumber: '' }
    ;(Object.keys(touched.value) as (keyof Form)[]).forEach(k => (touched.value[k] = false))
    
  } catch (err: any) {
    serverError.value = err?.response?.data?.message
  } finally {
    loading.value = false
  }
}

function cancel() {
  showModalAddUser.showAddUserModal()
}
</script>

<template>
  <div class="AddUserContainer" v-if="showModalAddUser.showAddUser" >
    <div class="AddData_title">
      <h1>Add User</h1>
      <img src="@/assets/reject.png" @click="cancel" class="close" />
    </div>

    <div class="DataContainer">
      <div class="AddData">
        <img src="@/assets/account.png" alt="" />
        <input
          type="text"
          placeholder="First name"
          v-model.trim="form.firstName"
          @blur="markTouched('firstName')"
          :class="{ invalid: hasError('firstName') }"
        />
      </div>


      <div class="AddData">
        <img src="@/assets/account.png" alt="" />
        <input
          type="text"
          placeholder="Last name"
          v-model.trim="form.lastName"
          @blur="markTouched('lastName')"
          :class="{ invalid: hasError('lastName') }"
        />
      </div>
      

      <div class="AddData">
        <img src="@/assets/email.png" alt="" />
        <input
          type="email"
          placeholder="Email"
          v-model.trim="form.email"
          @blur="markTouched('email')"
          :class="{ invalid: hasError('email') }"
        />
      </div>

      <div class="AddData">
        <img src="@/assets/iphone.png" alt="" />
        <input
          type="text"
          placeholder="Phone Number"
          v-model.trim="form.phoneNumber"
          @blur="markTouched('phoneNumber')"
          :class="{ invalid: hasError('phoneNumber') }"
        />
      </div>
    </div>

    <div class="addButtonContainer">
      <button class="addButton" :disabled="isDisabled || loading" @click="addUser">
        {{ loading ? 'Adding...' : 'Add User' }}
      </button>
      <p v-if="serverError" class="error server">{{ serverError }}</p>
      <p v-if="hasError('firstName')" class="error">{{ showErrors }}</p>
      <button class="cancelButton" type="button" @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.invalid {
  border-color: #ff6b6b !important;
}
.error {
  color: #ff6b6b;
  font-size: 0.85rem;
  margin: 0.2rem 0 0.6rem 2.5rem;
}
.server {
  margin-bottom: 0.6rem;
}
.close {
  cursor: pointer;
}
.addButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

<style src="./styles/addUser.css"></style>
