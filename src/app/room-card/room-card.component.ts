import { Component, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss'],
})
export class RoomCardComponent {
  @Input() chatName!: string;

  constructor(private chatService: ChatService, private router: Router) {}

  joinChat() {
    this.chatService.setChatName(this.chatName);
    this.router.navigate(['chat']);
  }
}
