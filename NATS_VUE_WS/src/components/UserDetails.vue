<template>
    <h2>User details page</h2>
    <div class = "w-100">
      <reg-user :user-detail="parentUserDetail" @submit-form="onformSubmit"></reg-user>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">First</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Larry</td>
          <td>the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </table>
</template>

<script lang = "ts" setup>
import user_service from '@/services/user_service';
import RegUser, { type IUserDetail } from "./RegUser.vue"
import { onMounted, reactive } from 'vue';

const parentUserDetail = reactive<IUserDetail>({
  firstName: "",
  lastName: "",
  email:"",
  gender: "",
});

onMounted(async()=>{
    await user_service.getAllUserDetails();
});

const onformSubmit = async(userDetail: IUserDetail)=>{
  console.log(userDetail);
  const key = userDetail.email;
  const value = userDetail;
  // await user_service.submitUserDetail(key, value);
  // await user_service.updateUserDetail(key,value);
  await user_service.deleteUserDetail(key);
  console.log(value);
}

</script>