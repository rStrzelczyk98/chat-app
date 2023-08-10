import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  show: boolean = false;
  roomForm: FormGroup;
  rooms$: any;
  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private as: AuthService
  ) {
    this.roomForm = this.fb.group({
      roomName: [null, Validators.required],
    });
    this.rooms$ = this.chatService.getAllRooms();
  }

  createRoom() {
    const { roomName } = this.roomForm.value;
    this.show = false;
    this.chatService.createNewChat(roomName, this.as.getUser().uid);
    this.roomForm.reset();
  }

  displayRoomForm() {
    this.show = !this.show;
  }

  logOut() {
    this.as.logout();
  }
}
