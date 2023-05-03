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
const sc = StringCodec();
const nc = ref<any>();
const sub = ref<any>();
onMounted(async()=>{
    try{
        nc.value = await connect({ servers: "localhost:4222" });
        sub.value = nc.value.subscribe("hello");
        for await (const m of sub) {
            const message = sc.decode(m.data);
            messages.value.push(`[${sub.value.getProcessed()}]: ${message}`);
        }

        nc.value.publish("hello", sc.encode("world"));
        nc.value.publish("hello", sc.encode("again"));
    }catch(e){
        console.error(e);
    }finally{
        await nc.value.drain();
    }
   

});



</script>
