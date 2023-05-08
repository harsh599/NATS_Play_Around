<template>
  <div class="d-flex">
    <h1>All Users</h1>
    <div>
      <label for="filter"><strong>Filter By:</strong></label>
      <select
        class="custom-select form-control"
        @change="filterChange(filterValue)"
        v-model="filterValue"
      >
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
    <tbody v-if="watchValue.length > 0">
      <tr v-for="(val, index) in watchValue" :key="index">
        <th scope="row">{{ val.firstName }}</th>
        <td>{{ val.lastName }}</td>
        <td>{{ val.choice }}</td>
        <td>{{ val.what }}</td>
        <td><p @click="deleteEntry(val)" style="color: red">Del</p></td>
      </tr>
    </tbody>
  </table>

  <button class="btn btn-primary" @click="incCounter">Counter++ {{ count }}</button>
</template>

<script setup lang="ts">
import user_service from '@/services/user_service'
import { User } from '@/user'
import { connect, StringCodec, createInbox } from 'nats.ws'
import { onMounted, onUnmounted, ref } from 'vue'
import pb from 'protobufjs/minimal.js'

const sc = StringCodec()
const nc = ref<any>()
const sub = ref<any>()
const reqReplySub = ref<any>()
const inboxSub = ref<any>()

const inbox = createInbox()

const watchValue = ref<any>([])
const filterValue = ref<string>('all')

const count = ref<number>(0)

const incCounter = () => {
  // count.value += 1;
  // nc.value.publish("count", sc.encode(count.value+""));
  nc.value.publish('time', sc.encode('1234'), { reply: inbox })
}

const deleteEntry = async (val: any) => {
  const key = val.choice + '.' + val.firstName
  await user_service.deleteUserDetail(key)
}

const filterChange = async (filterParam: string) => {
  watchValue.value = []
  const js = nc.value.jetstream()
  const kv = await js.views.kv('ast', { history: 1 })
  let watchParam = 'hobby.' + filterParam + '.*'
  if (filterParam == 'all') {
    watchParam = 'hobby.>'
  }
  const watch = await kv.watch({ key: watchParam })
  ;(async () => {
    for await (const e of watch) {
      watch.value = []
      if (e.value && e.operation != 'DEL' && e.operation != 'PURGE') {
        const decodeResult = User.decode(pb.Reader.create(e.value))
        watchValue.value.push(decodeResult)
        console.log(e)
      }
    }
  })().then()
}

onMounted(async () => {
  try {
    nc.value = await connect({ servers: 'ws://localhost:8080' })
    filterChange('all')
    // subCount();
    requestReply()
  } catch (e) {
    console.error(e)
  }
})

const subCount = () => {
  sub.value = nc.value.subscribe('count')
  ;(async () => {
    for await (const m of sub.value) {
      console.log(`[${sub.value.getProcessed()}]: ${sc.decode(m.data)}`)
    }
    console.log('subscription closed')
  })()
}

const requestReply = async () => {
  reqReplySub.value = nc.value.subscribe('time')
  ;(async () => {
    for await (const m of reqReplySub.value) {
      console.log(m)
      m.respond(m.data)
      // console.log(`[${reqReplySub.value.getProcessed()}]: ${sc.decode(m.data)}`);
    }
  })()

  inboxSub.value = nc.value.subscribe(inbox)
  ;(async () => {
    for await (const m of inboxSub.value) {
      console.log('Received:')
      console.log(`[${inboxSub.value.getProcessed()}]: ${sc.decode(m.data)}`)
    }
  })()
}

onUnmounted(async () => {
  await sub.value?.drain()
})
</script>

<style scoped>
.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
