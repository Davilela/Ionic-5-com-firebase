import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { NavController } from '@ionic/angular';
import { User } from '../../models/user';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user = {} as User;
  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private utilCtrl: UtilService) { }

  ngOnInit() {
  }

  async register(user: User) {
    this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.navCtrl.navigateForward('login');
      })
      .catch((error) => {
      this.utilCtrl.showToast(error.message);
      });
  }
}
