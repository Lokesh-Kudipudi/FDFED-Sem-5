const { GoogleGenAI } = require("@google/genai");

async function chatGemini(userInput, history, toursData) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is not set in the environment variables."
      );
    }

    const chatHistory = [];
    if (history) {
      history.forEach((item) => {
        chatHistory.push({
          role: item.role,
          parts: item.parts.map((part) => ({
            text: part.text,
          })),
        });
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const config = {
      responseMimeType: "text/plain",
      systemInstruction: [
        {
          text: `You are a friendly and knowledgeable virtual assistant for a tourism and hotel booking website. Your responsibilities include: - Helping users find suitable tours and hotels based on their preferences. - Having friendly, casual conversations when the user is not asking for booking-related help. - When responding, structure your reply using the following XML-like tags: - tours and hotels tags should be arrays included with _id <message> Your message to the user goes here. </message> <hotels> [List of recommended hotels here, if any. Each hotel entry should include name, location, price, and 1-2 key features. Leave empty if none.] </hotels> <tours> [List of recommended tours here, if any. Each tour entry should include name, location, price, and a short description. Leave empty if none.] </tours> <user_intent> [suggestions | casual_chat | asking_info | other] — Summarize the users intent here. </user_intent> <redirect> [yes | no] — “yes” If the tours tag or the hotels tag is not empty and user_intent is not asking_info “no” otherwise. </redirect> Use natural, engaging, and helpful language in <message>. Keep recommendations personalized if possible. The List of Tours is as Follows : ${JSON.stringify(
            toursData
          )}`,
        },
      ],
    };

    const model = "gemini-2.0-flash-lite";

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `Hello`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `<message> Hi there! Welcome to our travel and hotel booking website. How can I help you today? Are you looking for a specific destination or type of experience? </message> <hotels> </hotels> <tours> </tours> <user_intent> casual_chat </user_intent> <redirect> no </redirect> `,
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: `Suggest me some tours in Northern India`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `<message> I can certainly help with that! Northern India has some fantastic tours. To give you the best recommendations, could you tell me what kind of experience you're looking for, and what your budget is? Do you prefer something adventurous, cultural, or relaxing? Are there any specific cities or regions in Northern India you'd like to visit? </message> <hotels> </hotels> <tours> </tours> <user_intent> asking_info </user_intent> <redirect> no </redirect> `,
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: `Hilly Areas`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `<message> Great! If you like hilly areas, I have a few suggestions for you! How about a Himalayan Escape to Shimla and Manali? You can enjoy scenic views and adventure activities. Or, if you are looking for a more adventurous trip, you can go to Kashmir. </message> <hotels> </hotels> <tours> [ { "_id": "6807944aa51a30bbeeed04bf", "name": "Kashmir Paradise: Srinagar, Gulmarg & Pahalgam", "location": "Srinagar", "price": "₹35,000", "description": "Discover the breathtaking beauty of Kashmir with a tour of Srinagar, Gulmarg, and Pahalgam. Experience stunning landscapes, serene lakes, snow-capped mountains, and adventure activities.", }, {"_id": "6807944aa51a30bbeeed04c1", "name": "Himalayan Escape: Shimla & Manali", "location": "Chandigarh", "price": "₹35,000", "description": "Experience the breathtaking beauty of the Himalayas with a serene escape to Shimla and Manali. Enjoy scenic views, adventure activities, and the cool mountain air.", }, ] </tours> <user_intent> suggestions </user_intent> <redirect> yes </redirect> `,
          },
        ],
      },
      ...chatHistory,
    ];

    const chat = ai.chats.create({
      model,
      config,
      history: contents,
    });

    const response = await chat.sendMessage({
      message: userInput,
    });

    return response.text;
  } catch (error) {
    console.error("Error in chatGemini:", error);
    throw new Error(
      "Failed to generate response from Gemini AI."
    );
  }
}

module.exports = { chatGemini };
