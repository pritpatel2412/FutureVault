import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: "GOOGLE_API_KEY"});

async function main() {
  try {
    const response = await ai.models.list();
    for await (const model of response) {
      console.log(model.name);
    }
  } catch (e) {
    console.error(e);
  }
}
main();
