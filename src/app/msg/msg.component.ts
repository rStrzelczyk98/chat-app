import { Component, Input, OnChanges } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.scss'],
})
export class MsgComponent implements OnChanges {
  @Input() url!: string;
  @Input() imageUrl?: string;
  @Input() username!: string;
  @Input() time!: number;
  @Input() msg!: string;
  @Input() id!: string;
  user!: boolean;
  hidden: boolean = true;
  constructor(private auth: AuthService) {}

  ngOnChanges() {
    this.user = this.id === this.auth.getUser().uid;
  }

  toggleTime() {
    this.hidden = !this.hidden;
  }
}
