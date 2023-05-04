<template>
    <div class="d-flex">
      <h1>All Users</h1>
      <div>
        <label for="filter"><strong>Filter By:</strong></label>
        <select class="custom-select form-control" @change="filterChange(filterValue)" v-model="filterValue">
          <option value="all">All</option>
          <option value="food">Food</option>
          <option value="clothes">Clothing</option>
          <option value="travel">Travel</option>
          <option value="chill">Binge Watch</option>
        </select>
      </div>
    </div>

    <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Choice</th>
              <th scope="col">Handle</th>
              <th scope="col"></th>

            </tr>
          </thead>
          <tbody v-if = "watchValue.length > 0">
            <tr v-for="(val, index) in watchValue" :key="index">
              <th scope="row">{{ val.firstName }}</th>
              <td>{{ val.lastName }}</td>
              <td>{{ val.choice }}</td>
              <td>{{ val.what }}</td>
              <td ><p @click = "deleteEntry(val)" style="color:red">Del </p></td>
            </tr>
          </tbody>
        </table>

    <button class = "btn btn-primary" @click = incCounter>Counter++ {{ count }}</button>

</template>

<script setup lang="ts">
import user_service from "@/services/user_service";
import { connect, StringCodec, JSONCodec } from "nats.ws";
import { onMounted, onUnmounted, reactive, ref } from 'vue';
const sc = StringCodec();
const nc = ref<any>();
const sub = ref<any>();
const watchValue = ref<any>([]);
const filterValue = ref<string>("all");

const count = ref<number>(0);

const incCounter = ()=>{
    count.value += 1;
    nc.value.publish("count", sc.encode(count.value+""));
}

const subCount = () =>{
    sub.value = nc.value.subscribe("count");
    console.log(sub.value);
    (async () => {
        for await (const m of sub.value) {
            console.log(`[${sub.value.getProcessed()}]: ${sc.decode(m.data)}`);
        }
        console.log("subscription closed");
    })();
}


const deleteEntry = async(val : any)=>{
    console.log("Delete");
    console.log(val);
    const key = val.choice + "." + val.firstName;
    await user_service.deleteUserDetail(key);
}

const filterChange = async(filterParam: string) => {
    console.log(filterParam);
    watchValue.value = [];
    const js = nc.value.jetstream();
    const kv = await js.views.kv("user",{history: 1});
    let watchParam = "hobby." + filterParam + ".*";
    if(filterParam == "all"){
        watchParam = "hobby.>";
    }
    const watch = await kv.watch({ key: watchParam });
    (async () => {
        for await (const e of watch) {
            watch.value = [];
            console.log("VALUE", e);
            console.log(sc.decode(e.value));
            if(e.value && (e.operation != "DEL" && e.operation != "PURGE")){
                console.log(e.operation);
                watchValue.value.push(JSON.parse(sc.decode(e.value)));
                console.log(
                    `watch: ${e.key}: ${e.operation} ${e.value ? sc.decode(e.value) : ""}`,
                );
            }
           
        }
    })().then();
}

onMounted(async()=>{
    try{
        nc.value = await connect({ servers: "ws://localhost:8080" });
            filterChange("all");
            subCount();
    }catch(e){
        console.error(e);
    }
});

const requestReply = () => {
    // set up a subscription to process the request
    const sc = StringCodec();
    nc.value.subscribe("time", {
        callback: (_err, msg) => {
            msg.respond(sc.encode(new Date().toLocaleTimeString()));
        },
    });

    // create a subscription subject that the responding send replies to
    const inbox = createInbox();
    const sub = nc.value.subscribe(inbox, {
        max: 1,
        callback: (_err, msg) => {
            t.log(`the time is ${sc.decode(msg.data)}`);
        },
    });

    nc.publish("time", Empty, { reply: inbox });
}

onUnmounted(async()=>{
    await sub.value.drain();
});
</script>

<style scoped>
.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>