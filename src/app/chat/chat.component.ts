import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService, Message } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  messageForm: FormGroup;
  messages$: Observable<Message[]>;
  chatName!: string;
  constructor(
    private fb: FormBuilder,
    private chat: ChatService,
    private auth: AuthService,
    private router: Router
  ) {
    this.messageForm = this.fb.group({
      message: [null, Validators.required],
    });
    this.messages$ = this.chat.getMessages();
    this.chatName = this.chat.getChatName();
  }

  send() {
    const { message } = this.messageForm.value;
    this.chat.sendMessage(this.auth.getUser(), message);
    this.messageForm.reset();
  }

  quickMessage() {
    this.chat.sendMessage(this.auth.getUser(), '😎');
  }

  goToList() {
    this.router.navigate(['list']);
  }
}
