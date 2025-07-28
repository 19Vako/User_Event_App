<script setup lang="ts">
import axios from 'axios'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../store/store'

const router = useRouter()
const adminStore = useAdminStore()

type Form = {
  firstName: string
  lastName: string
  password: string
}

type Errors = Partial<Record<keyof Form, string>>

const form = ref<Form>({
  firstName: '',
  lastName: '',
  password: ''
})

const errors = ref<Errors>({})
const touched = ref<Record<keyof Form, boolean>>({
  firstName: false,
  lastName: false,
  password: false
})

const serverError = ref<string | null>(null)
const isSubmitting = ref(false)

function validate(values: Form): Errors {
  const e: Errors = {}
  if (!values.firstName.trim()) e.firstName = 'First name is required'
  if (!values.lastName.trim()) e.lastName = 'Last name is required'
  if (!values.password) e.password = 'Password is required'
  return e
}

const isDisabled = computed(() => {
  return (
    !form.value.firstName.trim() ||
    !form.value.lastName.trim() ||
    isSubmitting.value
  )
})

function markTouched(field: keyof Form) {
  touched.value[field] = true
}

async function onSubmit() {
  touched.value = { firstName: true, lastName: true, password: true }
  errors.value = validate(form.value)

  if (Object.keys(errors.value).length) return

  isSubmitting.value = true
  serverError.value = null

  try {
    const { data } = await axios.post('http://localhost:3000/api/login', form.value)

    adminStore.setAdminData(
      data.admin._id,
      data.admin.firstName,
      data.admin.lastName
    )

    router.push('/Home')
  } catch (err: any) {
    serverError.value =
      err?.response?.data?.message || err?.message || 'Something went wrong'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="Container">
    <form class="LoginContainer" @submit.prevent="onSubmit" novalidate>
      <h1 class="title">Log in</h1>

      <input
        placeholder="First Name"
        type="text"
        class="input"
        v-model.trim="form.firstName"
        @blur="markTouched('firstName')"
        autocomplete="given-name"
      />
      <p v-if="touched.firstName && errors.firstName" class="error">
        {{ errors.firstName }}
      </p>

      <input
        placeholder="Last Name"
        type="text"
        class="input"
        v-model.trim="form.lastName"
        @blur="markTouched('lastName')"
        autocomplete="family-name"
      />
      <p v-if="touched.lastName && errors.lastName" class="error">
        {{ errors.lastName }}
      </p>

      <input
        placeholder="Password"
        type="password"
        class="input"
        v-model="form.password"
        @blur="markTouched('password')"
        autocomplete="new-password"
      />
      <p v-if="touched.password && errors.password" class="error">
        {{ errors.password }}
      </p>

      <button class="logInButton" type="submit" :disabled="isDisabled">
        {{ isSubmitting ? 'Loading...' : 'Log in' }}
      </button>

      <router-link to="/Sign_up" class="signUpButton">Sign up</router-link>

      <p v-if="serverError" class="error server">{{ serverError }}</p>
    </form>
  </div>
</template>

<style src="../views/styles/log_in.css"/>
