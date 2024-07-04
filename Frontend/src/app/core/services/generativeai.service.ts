import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from 'src/app/core/configs/geminiConfig';
import { Observable } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GenerativeaiService {
  private genAI: any; // Adjust according to the correct type
  private chat: any;

  constructor() {
    const apiKey = environment.geminiApiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  startChat(): Observable<string> {
    return new Observable(observer => {
      try {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        this.chat = model.startChat({
          generationConfig: GENERATION_CONFIG,
          safetySettings: SAFETY_SETTINGS,
          history: [],
        });
  
        // Instead of using event listeners, we'll just emit a message that the chat has started
        observer.next("Chat started successfully");
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  sendMessage(userInput: string): Observable<string> {
    return new Observable(observer => {
      if (!this.chat) {
        observer.error(new Error("Chat not initialized. Call startChat() first."));
        return;
      }
  
      this.chat.sendMessage([userInput])
        .then((result: any) => {
          if (typeof result.response === 'function') {
            // If the response is a function, we need to call it to get the actual response
            const responseFunction = result.response;
            try {
              const responseText = responseFunction();
              observer.next(responseText);
            } catch (error : any) {
              observer.error(new Error(`Error processing response: ${error.message}`));
            }
          } else if (result.response && typeof result.response.text === 'function') {
            // If response.text is a function, call it
            observer.next(result.response.text());
          } else {
            // Fallback to the previous approach
            const response = result.response?.text || result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (response) {
              observer.next(response);
            } else {
              observer.error(new Error("Unexpected response format"));
            }
          }
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }
}
