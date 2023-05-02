<template>
        <button class = "p-2 btn btn-primary" @click = "userDetails">Click me</button>
</template>

<script setup lang = "ts" >
import router from "@/router";

const userDetails = ()=>{
    router.push("/user-details");
}

</script>

<style scoped>
</style>