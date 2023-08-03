import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { chatGuard } from './services/auth.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [() => chatGuard()],
  },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
