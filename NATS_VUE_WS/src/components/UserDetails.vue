<template>
  <h2>User details page</h2>
  <div class="w-100">
    <reg-user :user-detail="parentUserDetail" @submit-form="onformSubmit"></reg-user>
  </div>
</template>

<script lang="ts" setup>
import user_service from '@/services/user_service'
import RegUser, { type IUserDetail } from './RegUser.vue'
import { onMounted, reactive } from 'vue'

const parentUserDetail = reactive<IUserDetail>({
  firstName: '',
  lastName: '',
  what: '',
  choice: ''
})

const onformSubmit = async (userDetail: IUserDetail) => {
  console.log(userDetail)
  let key = userDetail.choice
  key = key + '.' + userDetail.firstName
  const value = userDetail
  await user_service.submitUserDetail(key, value)
  // await user_service.updateUserDetail(key,value);
  // await user_service.deleteUserDetail(key);
  console.log(value)
}
</script>
