<template>
    <div class = "card bg-light mb-3 m-2">
    <h3 class="card-header">Header</h3>
    <div class = "card-body">
      <div class="row m-2">
        <div class="col m-1">
          <input type="text" class="form-control" placeholder="First name" v-model = "userDetails.firstName">
        </div>
        <div class="col m-1">
          <input type="text" class="form-control" placeholder="Last name" v-model = "userDetails.lastName">
        </div>
      </div>
      <div class = "row m-2">
        <div class = "col m-1">
            <select class="custom-select form-control" v-model = "userDetails.gender">
                <option selected>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>
             <div class="col m-1">
                  <input type="text" class="form-control" placeholder="Email" v-model = "userDetails.email">
            </div>
      </div>
    </div>
        
    </div>
          <button type="submit" class="btn btn-primary m-2" @click = "submit">Submit</button>
    
</template>

<script lang = "ts" setup>
import { ref, defineEmits } from 'vue';
import UserDetails from './UserDetails.vue';

const emits = defineEmits(['submitForm']);

export interface IUserDetail{
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
}
let props = defineProps<{
    userDetail: IUserDetail,
    mutable: true,
    required:false
    default: () => {
        firstName: "",
        lastName:""
    }
}>();

const userDetails = ref<IUserDetail>(props.userDetail);

const submit = () => {
    emits('submitForm', userDetails.value);
}

</script>