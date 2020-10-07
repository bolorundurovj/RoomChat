import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, NavParams, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  nickname = '';
  messages = [];
  users = [];
  message = '';

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private socket: Socket,
    private toastCtrl: ToastController
  ) {
    this.nickname = route.snapshot.queryParamMap.get('nickname');
    console.log(this.nickname);
    this.getMessages().subscribe((message) => {
      this.messages.push(message);
    });
    this.getUsers().subscribe((data) => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left:' + user)
      } else {
        this.showToast('User joined:' + user)
      }
    });
  }

  ngOnInit() {}

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  async showToast(msg) {
    let toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }

  sendMessage(val: string) {
    this.socket.emit('add-message', { text: this.message });
    this.message = '';
  }

  getUsers() {
    let observable = new Observable((observer) => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getMessages() {
    let observable = new Observable((observer) => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
}
