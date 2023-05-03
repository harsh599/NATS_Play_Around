<template>
    <div>
        <h1>Nats Subscription</h1>
    </div>
    <div v-if = "messages.length > 0">
        <p v-for="(message, index) in messages" :key="index">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
import { connect, StringCodec } from "nats.ws";
import { onMounted, reactive, ref } from 'vue';
const messages = ref<any>([]);
// const sc = StringCodec();
const nc = ref<any>();
const sub = ref<any>();

onMounted(async()=>{
    try {
        nc.value = await connect({ servers: "ws://localhost:8080" });
        sub.value = nc.value.subscribe("hello");
        const iterator = sub.value[Symbol.asyncIterator]();
        while (true) {
            const message = await iterator.next();
            if (message.done) break;
            console.log(message.value.data);
            messages.value.push(`[${sub.value.getProcessed()}]: ${message.value.data}`);
        }
        nc.value.publish("hello", "world");
        nc.value.publish("hello", "again");
    } catch(e){
        console.error(e);
    }finally{
        await nc.value.drain();
    }
});
</script>
