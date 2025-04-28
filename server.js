// AI-чат через Hugging Face
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
    res.status(500).json({ error: 'Ошибка AI, попробуйте позже.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));