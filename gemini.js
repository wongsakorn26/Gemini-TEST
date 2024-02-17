const { GoogleGenerativeAI } = require("@google/generative-ai"); //import googlegeneratuveAI มา

require("dotenv").config()
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); //GEMINI_API_KEY in file .env

async function chatPrompt(prompt) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

//   const prompt = "สวัสดีชาวไทยแบบสุภาพหน่อย" //ส่ง prompt ไปเป็น text ได้คำตอบ ai

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

const fileToGenerativePart = (imageData, mimeType) => {
    //imageDate = base64 data (multer)
    return {
      inlineData: {
        data: imageData,
        mimeType,
      },
    }
  }

const imageChat = async (prompt, imageData, mimeType) => {
    // For text-and-image input (multimodal), use the gemini-pro-vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })
    const imageParts = [fileToGenerativePart(imageData, mimeType)]
    const result = await model.generateContent([prompt, ...imageParts])
    const response = await result.response
    const text = response.text()
    return text 
  }

  const chatHistoryPrompt = async (prompt, history) => {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
  
    const chat = model.startChat({
      history
    })
  
    const result = await chat.sendMessage(prompt)
    const response = await result.response
    const text = response.text()
    return text
  }

module.exports = {
    chatPrompt,
    imageChat,
    chatHistoryPrompt
}