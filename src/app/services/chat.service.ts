import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
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
  constructor(private fs: Firestore) {
    this.messages$ = collectionData(collection(this.fs, 'CHAT'));
  }

  sendMessage({ displayName, photoURL, uid }: User, msg: string) {
    const message: Message = {
      msg,
      userId: uid,
      username: displayName ?? 'guest',
      userAvatar: photoURL ?? '',
      time: Date.now(),
    };

    this.messages$
      .pipe(
        tap(([{ messages }]) => {
          if (message.msg === 'clear') {
            updateDoc(doc(this.fs, 'CHAT/MESSAGES'), { messages: [] });
          } else {
            const arr = [...messages];
            arr.push(message);
            updateDoc(doc(this.fs, 'CHAT/MESSAGES'), { messages: arr });
          }
        }),
        take(1)
      )
      .subscribe();
  }

  getMessages() {
    return this.messages$.pipe(map(([{ messages }]) => messages)) as Observable<
      Message[]
    >;
  }

  deleteMessages() {
    updateDoc(doc(this.fs, 'CHAT/MESSAGES'), { messages: [] });
  }
}
