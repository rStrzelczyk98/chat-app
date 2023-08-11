import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService, Message } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  messageForm: FormGroup;
  messages$: Observable<Message[]>;
  chatName!: string;
  image!: null | File;
  constructor(
    private fb: FormBuilder,
    private chat: ChatService,
    private auth: AuthService,
    private router: Router,
    private storage: StorageService
  ) {
    this.messageForm = this.fb.group({
      message: [null, Validators.required],
    });
    this.messages$ = this.chat.getMessages();
    this.chatName = this.chat.getChatName();
  }

  getImage(event: any) {
    this.image = <File>event.target.files[0];
  }

  send() {
    const { message } = this.messageForm.value;
    if (this.image)
      this.storage.messageWithImage(this.image, this.auth.getUser(), message);
    else this.chat.sendMessage(this.auth.getUser(), message);
    this.messageForm.reset();
    this.image = null;
  }

  quickMessage() {
    this.chat.sendMessage(this.auth.getUser(), '😎');
  }

  goToList() {
    this.router.navigate(['list']);
  }

  copyRoomLink() {
    const room = this.router.createUrlTree([''], {
      queryParams: { room: this.chatName },
    });
    const link = location.origin + this.router.serializeUrl(room);
    navigator.clipboard.writeText(link).then(() => alert('Copied room link'));
  }
}
