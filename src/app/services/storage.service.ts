import { Injectable } from '@angular/core';
import {
  FirebaseStorage,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { ChatService } from './chat.service';
import { User } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private app: FirebaseApp = initializeApp(environment.firebase);
  private storage: FirebaseStorage = getStorage(this.app);

  constructor(private chat: ChatService) {}

  messageWithImage(file: any, user: User, msg: string) {
    const chatName = this.chat.getChatName();
    const storageRef = ref(this.storage, `${chatName}/${file.name}`);
    uploadBytes(storageRef, file).then(() =>
      getDownloadURL(storageRef).then((url) =>
        this.chat.sendMessage(user, msg, url)
      )
    );
  }
}
