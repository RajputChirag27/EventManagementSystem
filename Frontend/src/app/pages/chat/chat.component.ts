import { Component, OnInit } from '@angular/core';
import { GenerativeaiService } from 'src/app/core/services/generativeai.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import 'prismjs';
// import 'prismjs/components/prism-typescript.min.js';
// import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
// import 'prismjs/plugins/line-highlight/prism-line-highlight.js';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chatHistory: string[] = [];
  chatForm!: FormGroup;
  loading: boolean = false;

  constructor(private generativeAIService: GenerativeaiService, private fb: FormBuilder) { }

  ngOnInit() {
    this.chatForm = this.fb.group({
      userInput: ['', Validators.required]
    });

    this.generativeAIService.startChat().subscribe(response => {
      const markdownResponse = this.formatAIResponse(response);
      this.chatHistory.push('AI: ' + markdownResponse);
    }, error => {
      console.error(error);
    });
  }

  onSubmit() {
    if (this.chatForm.invalid) {
      return;
    }

    const userInput = this.chatForm.get('userInput')?.value;
    if (userInput.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      return;
    }

    this.chatHistory.push('You: ' + userInput);
    this.chatForm.get('userInput')?.reset();

    this.loading = true;
    this.generativeAIService.sendMessage(userInput).subscribe(response => {
      this.chatHistory.push('AI: ' + response);
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }


  getMessageClass(message: string): any {
    return {
      'ai-message': message.startsWith('AI:'),
      'user-message': !message.startsWith('AI:')
    };
  }

  formatAIResponse(message: string): string {
    // Implement formatting logic for AI responses if needed
    // Example: return message.replace('AI:', '<strong>AI:</strong>');


      // Implement logic to convert text to Markdown format
      // You can use regular expressions or string manipulation techniques
      // to achieve this. For example, convert headings (prefixed with #)
      // to Markdown headings (##, ###, etc.).
    
      // Example conversion (replace with your logic)
      message = message.replace(/^# (.*)/gm, '## $1');
    
  
    return message;
  }
}
