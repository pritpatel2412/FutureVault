import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: "AIzaSyC1yp-QhaC4LQlLfoBQA3AS1hPwc51PNCw"});

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
