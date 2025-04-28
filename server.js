const express = require('express');
const axios = require('axios');
const cors = require('cors');

// 1. Явно создаем приложение
const app = express();

// 2. Подключаем middleware
app.use(cors());
app.use(express.json());

// 3. Теперь роут будет работать
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      { inputs: message },
      { headers: { 'Authorization': `Bearer ${process.env.HF_TOKEN}` } }
    );
    res.json({ reply: response.data[0].generated_text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Ошибка AI' });
  }
});

// 4. Не забываем запустить сервер!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
