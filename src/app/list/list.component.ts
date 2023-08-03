import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  show: boolean = false;
  roomForm: FormGroup;
  rooms$: any;
  constructor(private fb: FormBuilder, private chatService: ChatService) {
    this.roomForm = this.fb.group({
      roomName: [null, Validators.required],
    });
    this.rooms$ = this.chatService.getAllRooms();
  }

  createRoom() {
    const { roomName } = this.roomForm.value;
    this.show = false;
    this.chatService.createNewChat(roomName);
    this.roomForm.reset();
  }

  displayRoomForm() {
    this.show = !this.show;
  }
}
