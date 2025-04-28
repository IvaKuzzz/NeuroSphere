const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Роут для чата с AI
app.post('/api/chat', async (req, res) => {
  try {
    const { message, user_id } = req.body;
    
    // Запрос к Hugging Face
    const aiResponse = await axios.post(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      { inputs: message },
      { headers: { 'Authorization': `Bearer ${process.env.HF_TOKEN}` } }
    );
    const reply = aiResponse.data[0].generated_text;

    // Сохраняем в Supabase
    const { error } = await supabase
      .from('chats')
      .insert([{ user_id, message, reply }]);

    if (error) throw error;
    res.json({ reply });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Роут для получения истории чатов
app.get('/api/chats/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: 'Не удалось загрузить историю' });
  }
});

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('NeuroSphere API работает! 🚀');
});
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
