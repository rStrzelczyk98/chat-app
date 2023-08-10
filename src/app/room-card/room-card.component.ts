import { AfterViewInit, Component, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss'],
})
export class RoomCardComponent implements AfterViewInit {
  @Input() chatName!: string;
  creatorId!: Observable<string>;
  userId: String;
  constructor(
    private chatService: ChatService,
    private router: Router,
    private as: AuthService,
    private storage: StorageService
  ) {
    this.userId = this.as.getUser().uid;
  }

  ngAfterViewInit(): void {
    setTimeout(
      () => (this.creatorId = this.chatService.getCreatorId(this.chatName))
    );
  }

  joinChat() {
    this.chatService.setChatName(this.chatName);
    this.router.navigate(['chat']);
  }

  deleteChat() {
    this.storage.deleteImages(this.chatName);
    this.chatService.deleteChatRoom(this.chatName);
  }
}
