const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const BOT_TOKEN = '6122475627:AAHnUo-9w4hL2kegjFB7Nj0o_Sn3SQgh13I';
const webapp_url='https://all.point704.ru';

const bot = new TelegramBot(BOT_TOKEN, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text==="/start"){
    await bot.sendMessage(
        chatId, 'Вот кнопка',
        {reply_markup: {
            inline_keyboard:[
                [{text: 'Сделать заказ',web_app: {url: webapp_url}}]
            ]
        }}
    )
  }
  
  //bot.sendMessage(chatId, 'Received your message');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text==="/static"){
    await bot.sendMessage(
        chatId, 'Вот кнопка',
        {reply_markup: {
            keyboard:[
                [{text: 'Сделать заказ',web_app: {url: webapp_url}}]
            ]
        }}
    )
  }
  
  //bot.sendMessage(chatId, 'Received your message');
});


app.post(
  '/web-data',async (req,res)=>{
    const {queryId, products, total} = req.body;
    try {
      await bot.answerWebAppQuery(queryId,{
        type: 'article',
        id:queryId,
        title:'Успешная покупка',
        input_message_content: {message_text: 'Сумма заказа: '+total+' руб.'}
      })
      return res.status(200).json({})
    } catch (error) {
      await bot.answerWebAppQuery(queryId,{
        type: 'article',
        id:queryId,
        title:'Не удалось приобрести товар',
        input_message_content: {message_text: 'Не удалось приобрести товар'}
      })
      return res.status(500).json({})
    }
    
  }
)

const PORT = 8000;
app.listen(PORT,()=>{console.log('server startted on PORT '+PORT)})