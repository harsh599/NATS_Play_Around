<template>
    <div>
        <h1>Nats Subscription</h1>
    </div>
    <div v-if = "messages.length > 0">
        <p v-for="(message, index) in messages" :key="index">{{ message }}</p>
    </div>

    <button class = "btn btn-primary" @click = incCounter>Counter++ {{ count }}</button>
    <!-- <button class = "btn btn-danger" @click = checkSubscription>Check Subscription</button> -->

</template>

<script setup lang="ts">
import { connect, StringCodec } from "nats.ws";
import { onMounted, reactive, ref } from 'vue';
const messages = ref<any>([]);
const sc = StringCodec();
const nc = ref<any>();
const sub = ref<any>();
const countSub = ref<any>();


const count = ref<number>(0);

const incCounter = ()=>{
    count.value += 1;
    nc.value.publish("count", sc.encode(count.value+""));
}

// const checkSubscription = () => {
//      nc.value.subscribe("count", (msg) => {
//         console.log("HEL");
//         const countValue = parseInt(msg.data);
//         if (!isNaN(countValue)) {
//             count.value = countValue;
//         }
//         console.log('COUNT');
//     });
// }

onMounted(async()=>{
    try{
        nc.value = await connect({ servers: "ws://localhost:8080" });
        
        // sub.value = nc.value.subscribe("hello");
        // console.log(sub.value);
        // for await (const m of sub) {
        //     // const message = sc.decode(m.data);
        //     console.log(m.data);
        //     messages.value.push(`[${sub.value.getProcessed()}]: ${m.data}`);
        // }
        nc.value.publish("hello", sc.encode("world"));
        nc.value.publish("hello", sc.encode("again"));

        console.log("BEFORE SUBSCRIPTION");
         sub.value = nc.value.subscribe("count");
        console.log(sub.value);
       (async () => {
            for await (const m of sub.value) {
                console.log(`[${sub.value.getProcessed()}]: ${sc.decode(m.data)}`);
            }
            console.log("subscription closed");
        })();
        //  nc.value.subscribe("count", (msg) => {
        //     console.log("HEL");
        //     const countValue = parseInt(msg.data);
        //     if (!isNaN(countValue)) {
        //         count.value = countValue;
        //     }
        //     console.log('COUNT');
        // });
        console.log("AFTER SUBSCRIPTION");
        incCounter();
        //      nc.value.publish("hello", "world");
        // nc.value.publish("hello", "again");
    }catch(e){
        console.error(e);
    }finally{
        // await nc.value.drain();
    }
});
</script>
