<script setup lang="ts">
   import { useUserStore } from '../../store/store.ts'
   import EventsList from '../components/EventsList.vue'
   import AddEvent from '../components/AddEvent.vue'
   const useStore = useUserStore()


</script>

<template>
  <div class="userContainer">
    <div class="userDataContainer">
     <div>
       <div class="dataContainer">
          <img src="../assets/account.png" />
          <h1>{{useStore.firstName + ' ' + useStore.lastName}}</h1>
       </div>
        <div class="dataContainer">
          <img src="../assets/iphone.png" style="margin-left: 0.5vw; margin-right: 0.5vw"/>
          <h1>{{useStore.phoneNumber}}</h1>
       </div>
        <div class="dataContainer">
          <img src="../assets/email.png" />
          <h1>{{useStore.email}}</h1>
       </div>
      </div>
      
       
    </div>
    <EventsList/>
    <AddEvent />
  </div>
</template>

<style src="./styles/user.css"/>