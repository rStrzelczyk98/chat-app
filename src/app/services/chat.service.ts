import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, map, take, tap } from 'rxjs';
import { User } from './auth.service';

export interface Message {
  msg: string;
  userId: string;
  username: string;
  userAvatar: string;
  time: number;
}
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messages$: Observable<any>;
  private chatName: string = 'MESSAGES';
  constructor(private fs: Firestore) {
    this.messages$ = collectionData(collection(this.fs, 'CHAT'), {
      idField: 'chatName',
    });
  }

  sendMessage({ displayName, photoURL, uid }: User, msg: string) {
    const message: Message = {
      msg,
      userId: uid,
      username: displayName ?? 'guest',
      userAvatar: photoURL ?? '',
      time: Date.now(),
    };

    this.getMessages()
      .pipe(
        tap((messages) => {
          if (message.msg === 'clear') {
            updateDoc(doc(this.fs, `CHAT/${this.chatName}`), { messages: [] });
          } else {
            const arr = [...messages];
            arr.push(message);
            updateDoc(doc(this.fs, `CHAT/${this.chatName}`), { messages: arr });
          }
        }),
        take(1)
      )
      .subscribe();
  }

  getMessages() {
    return this.messages$.pipe(
      map(
        (chats) =>
          chats.find((chat: any) => chat['chatName'] === this.chatName).messages
      )
    ) as Observable<Message[]>;
  }

  deleteMessages(chatName: string) {
    updateDoc(doc(this.fs, `CHAT/${chatName}`), { messages: [] });
  }

  createNewChat(name: string) {
    setDoc(doc(this.fs, `CHAT/${name}`), { messages: [] });
  }

  setChatName(name: string) {
    this.chatName = name;
  }

  getChatName() {
    return this.chatName;
  }

  getAllRooms() {
    return this.messages$.pipe(
      map((chats) => chats.map((chat: any) => chat['chatName']))
    );
  }
}
