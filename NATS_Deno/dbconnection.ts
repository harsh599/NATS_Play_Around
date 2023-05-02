import * as nats from "https://deno.land/x/nats@v1.13.0/src/mod.ts";

// deno-lint-ignore prefer-const
let nc, sc: nats.Codec<string>, js, jsm, kv: nats.KV, jc: nats.Codec<unknown>;
const rootKey = "hobby.";
try{
    nc = await nats.connect();
    sc = nats.StringCodec();
    jc = nats.JSONCodec();
    js = nc.jetstream();
    jsm = await nc.jetstreamManager();
    kv = await js.views.kv("user");
}catch(e){
    console.log("Error in creating the connection");
}

export const addEntry = async(key: string, value: any) => {
    try{
        console.log("Add ENTRY");
        console.log(key);
        console.log(value);
        const val = await kv.create(rootKey+key, jc.encode(value));
        const result = {
            isSuccess: true,
            data : val
        };
        return result;
    }catch(e){
        console.log(e);
        console.log("Entry to KV store already exists!!");
        return {isSuccess: false, data: -1};
    }
};

export const getEntry = async(key:string) => {
    try{
        let val = await kv.get(rootKey+key);
        console.log(rootKey+key);
        console.log(val);
        let myValue = null;
        if(val !== null){
            myValue = await new TextDecoder().decode(val.value);
            myValue = JSON.parse(myValue);
        }
        return {isSuccess: true,data: myValue};
    }catch(e){
        console.log("Unable to get from KV store!!");
        return {isSuccess: false, data: null}
    }
};

export const updateEntry = async(key:string, value: any) => {
    try{
        console.log("Updating ENTRY");
        console.log(key);
        console.log(value);
        let val = await kv.put(rootKey+key, jc.encode(value));
        console.log("Update val", val);
        const result = {
            isSuccess: true,
            data : await getEntry(key)
        };
        console.log("Updating entry");
        console.log(result);
        return result;
    }catch(e){
        console.log("Unable to update entry in KV store!!");
        return {isSuccess: false, data: null}
    }
};

export const deleteEntry = async(key:string) => {
    try{
        console.log("Delete ENTRY");
        await kv.delete(rootKey+key);
        const result = {
            isSuccess: true,
            data : null
        };
        return result;
    }catch(e){
        console.log("Unable to delete entry from KV store!!");
        return { isSuccess: false, data : null };
    }
};

// export default {
//     nc, sc, js, jsm, kv, addEntry
// }