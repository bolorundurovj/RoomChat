import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nickname = '';

  constructor(private navCtrl: NavController, private socket: Socket, private router: Router) {}

  joinChat() {
    this.socket.connect();
    this.socket.emit('set-nickname', this.nickname || 'Anon');
    //this.navCtrl.navigateForward('chat-room');
    this.router.navigate(['chat-room'], {queryParams: {nickname: this.nickname}} )
  }

}
