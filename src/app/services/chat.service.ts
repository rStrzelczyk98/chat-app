import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
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
  imageUrl?: string;
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

  sendMessage(
    { displayName, photoURL, uid }: User,
    msg: string,
    imageUrl: string = ''
  ) {
    const message: Message = {
      msg,
      userId: uid,
      username: displayName ?? 'guest',
      userAvatar: photoURL ?? '',
      time: Date.now(),
      imageUrl,
    };

    this.getMessages()
      .pipe(
        tap((messages) => {
          const arr = [...messages];
          arr.push(message);
          updateDoc(doc(this.fs, `CHAT/${this.chatName}`), { messages: arr });
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

  createNewChat(name: string, creatorId: string) {
    setDoc(doc(this.fs, `CHAT/${name}`), {
      messages: [],
      images: [],
      creatorId,
    });
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

  getImagesRef(chatName: string) {
    return this.messages$.pipe(
      map(
        (chats) =>
          chats.find((chat: any) => chat['chatName'] === chatName).images
      )
    ) as Observable<string[]>;
  }

  addImageRef(imageRef: string) {
    this.getImagesRef(this.chatName)
      .pipe(
        tap((images) => {
          const arr = [...images];
          arr.push(this.chatName + '/' + imageRef);
          updateDoc(doc(this.fs, `CHAT/${this.chatName}`), { images: arr });
        }),
        take(1)
      )
      .subscribe();
  }

  deleteChatRoom(chatName: string) {
    deleteDoc(doc(this.fs, `CHAT/${chatName}`)).then(() =>
      console.log(`[DELETED] ${chatName}`)
    );
  }

  getCreatorId(chatName: string) {
    return this.messages$.pipe(
      map(
        (chats) =>
          chats.find((chat: any) => chat['chatName'] === chatName).creatorId
      )
    ) as Observable<string>;
  }
}
