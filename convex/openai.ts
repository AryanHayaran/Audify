import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

import axios from 'axios';


export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    try {
      const options = {
        method: 'POST',
        url: 'https://open-ai-text-to-speech1.p.rapidapi.com/',
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY,
          'x-rapidapi-host': 'open-ai-text-to-speech1.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          model: "tts-1",
          voice: voice as SpeechCreateParams['voice'],
          input,
        },
        responseType: 'arraybuffer' as 'arraybuffer',
      };
      const mp3 = await axios.request(options);
      console.log("SUCCESSFULLY received mp3 data from API request!");
      return mp3.data;
    } catch (error) {
      console.error(`Error occurred  while fetching mp3 data from API: ${error}`);
      throw error; // re-throw the error if you want it to propagate
    }
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {

    const options = {
      method: 'POST',
      url: 'https://chatgpt-42.p.rapidapi.com/texttoimage',
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: { text: prompt }
    };
    
    try {
      const response = await axios.request(options);
      console.log("SUCCESSFULLY received image data from API request!");
      const url = response.data.generated_image;
  
      if(!url) {
        throw new Error('Error generating thumbnail');
      }
      
      const imageResponse = await fetch(url);
      const buffer = await imageResponse.arrayBuffer();
      return buffer;
    } catch (error) {
      console.error(error);
    }
  }
})


// OPEN AI API

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//     })
    
//     export const generateAudioAction = action({
//       args: { input: v.string(), voice: v.string() },
//       handler: async (_, { voice, input }) => {
//         const mp3 = await openai.audio.speech.create({
//           model: "tts-1",
//           voice: voice as SpeechCreateParams['voice'],
//           input,
//         });
    
//         const buffer = await mp3.arrayBuffer();
    
//         return buffer;
//       },
// });
    

// export const generateThumbnailAction = action({
//   args: { prompt: v.string() },
//   handler: async (_, { prompt }) => {
//     const response = await openai.images.generate({
//       model: 'dall-e-3',
//       prompt,
//       size: '1024x1024',
//       quality: 'standard',
//       n: 1,
//     })

//     const url = response.data[0].url;

//     if (!url) {
//       throw new Error('Error generating thumbnail');
//     }

//     const imageResponse = await fetch(url);
//     const buffer = await imageResponse.arrayBuffer();
//     return buffer;
//   }
// })