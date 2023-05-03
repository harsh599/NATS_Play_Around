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
import { connect, StringCodec, JSONCodec } from "nats.ws";
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
        console.log("AFTER SUBSCRIPTION");
        incCounter();


        const jc = JSONCodec();
        const js = nc.value.jetstream();
        const jsm = await nc.value.jetstreamManager();
        const kv = await js.views.kv("user", { history: 5 });

        const watch = await kv.watch({key: "hobby.food.*"});
        (async () => {
            for await (const e of watch) {
                // do something with the change
                console.log(
                    `watch: ${e.key}: ${e.operation} ${e.value ? sc.decode(e.value) : ""}`,
                );
            }
        })().then();


    }catch(e){
        console.error(e);
    }finally{
        // await nc.value.drain();
    }
});
</script>
