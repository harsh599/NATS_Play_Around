import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as log from "https://deno.land/std/log/mod.ts"
import { addEntry, deleteEntry, getEntry, updateEntry } from "./dbconnection.ts";

const app = new Application();

const router = new Router();

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});

router
  .get("/",(ctx) => {
    console.log("CONTROLLER");
    ctx.response.body = "Router has been created";
   })

   router.post("/user-add-details", async ({ request, response }: { request: any; response: any },) => {
  try{
    const bodyValue = await request.body().value;
    const {key, value} = bodyValue;
    // const result = await addEntry(key, value);
    const result = await updateEntry(key, value);

      response.status = 200;
    if(result.isSuccess){
       response.body = {
        success: true,
        data: result.data,
      };
    }else{
      response.body = {
        success: false,
        data: [],
      };
    }
     
      } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
   })

    router.get("/user-details", async ({ request, response }: { request: any; response: any },) => {
    try{
    // const key = "harshstudy599";
    // const {key, value} = request.body;
    console.log(request.url);
    const params = new URLSearchParams(request.url.search);
    const key = params.get('key') || "";
    const data = await getEntry(key);
       response.status = 200;
    if(data.isSuccess){
       response.body = {
        success: true,
        data,
      };
    }else{
      response.body = {
        success: false,
        data: [],
      };
    }
      } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
   })

  router.put("/update-user-details",  async ({ request, response }: { request: any; response: any },) => {
    console.log("Inside update user details");
    try{
    const bodyValue = await request.body().value;
    const {key, value} = bodyValue;
    const result = await updateEntry(key, value);
    response.status = 200;
      if(result.isSuccess){
       response.body = {
        success: true,
        data: result.data,
      };
    }else{
      response.body = {
        success: false,
        data: null,
      };
    }
      } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
   })

  router.delete("/delete-user-details",  async ({ request, response }: { request: any; response: any },) => {
    console.log("Inside user details");
    try{
      console.log(request.url);
      const params = new URLSearchParams(request.url.search);
      const key = params.get('key') || "";
      console.log("Delete key", key);
    // const {key} = bodyValue;
    const result = await deleteEntry(key);
    response.status = 200;
      if(result.isSuccess){
       response.body = {
        success: true,
        data: result.data,
      };
    }else{
      response.body = {
        success: false,
        data: null,
      };
    }
      } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: `Error: ${error}`,
      };
    }
   })

app.use(router.routes());

app.use(router.allowedMethods());

await app.listen({ port: 8000 });