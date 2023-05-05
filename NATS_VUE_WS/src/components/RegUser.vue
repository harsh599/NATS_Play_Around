<template>
  <div class="card bg-light mb-3 m-2">
    <h3 class="card-header">Header</h3>
    <div class="card-body">
      <div class="row m-2">
        <div class="col m-1">
          <label for="firstName"><strong>First Name </strong> </label>
          <input
            type="text"
            class="form-control"
            placeholder="First name"
            v-model="userDetails.firstName"
          />
        </div>
        <div class="col m-1">
          <label for="firstName"><strong>Last Name </strong> </label>

          <input
            type="text"
            class="form-control"
            placeholder="Last name"
            v-model="userDetails.lastName"
          />
        </div>
      </div>
      <div class="row m-2">
        <div class="col m-1">
          <label for="hobby"><strong>Hobby </strong> </label>

          <select class="custom-select form-control" v-model="userDetails.choice">
            <option value="food">Food</option>
            <option value="clothes">Clothing</option>
            <option value="travel">Travel</option>
            <option value="chill">Binge Watch</option>
          </select>
        </div>
        <div class="col m-1">
          <label for="firstName"><strong>What exactly? </strong> </label>
          <input
            type="text"
            class="form-control"
            placeholder="Last name"
            v-model="userDetails.what"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="text-center">
    <button type="submit" class="btn btn-primary m-2" @click="submit">Submit</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue'

const emits = defineEmits(['submitForm'])

export interface IUserDetail {
  firstName: string
  lastName: string
  // gender: string;
  // email: string;
  what: string
  choice: string
}
let props = defineProps<{
  userDetail: IUserDetail
  required: false
  default: () => {
    firstName: string
    lastName: string
    // gender:"",
    // email:"",
    choice: string
    what: string
  }
}>()

const userDetails = ref<IUserDetail>(props.userDetail)

const submit = () => {
  emits('submitForm', userDetails.value)
}
</script>
