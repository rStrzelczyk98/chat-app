import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatComponent } from './chat-list/chat/chat.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'chats', component: ChatListComponent },
  { path: 'chat/:users', component: ChatComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
