const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");

const router = new Router();
const apikey = process.env.API_KEY;
console.log(process.env.API_KEY);

const { post } = require('./utils');

async function getAIResponse(content) {
  const base_url = process.env.process.env.OPENAI_BASE_URL

  var data = {
    Content: content
  };

  const completion = await post(base_url + "/v1/chat/completions", data, apikey);
  return (completion?.choices?.[0].message?.content || "AI 挂了").trim();
}

router.post("/message/post", async (ctx) => {
  const { ToUserName, FromUserName, Content, CreateTime } = ctx.request.body;

  const response = await getAIResponse(Content);

  ctx.body = {
    ToUserName: FromUserName,
    FromUserName: ToUserName,
    CreateTime: new Date(),
    MsgType: "text",

    Content: response,
  };
});

const app = new Koa();
app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

const port = process.env.PORT || 80;
async function bootstrap() {
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();
