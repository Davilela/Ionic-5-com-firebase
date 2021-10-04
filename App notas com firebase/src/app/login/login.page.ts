import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AlertController, NavController } from '@ionic/angular';
import { User } from '../../models/user';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {} as User;
  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private utilCtrl: UtilService,
    private alertController: AlertController
    ) { 
      localStorage.setItem('user', '');
    }

  ngOnInit() {
           
  }


  async login(user: User) {
    this.afAuth.signInWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const usr: any = user.toJSON();
        let email = JSON.stringify(usr.email);
        localStorage.setItem('user', email);
        this.navCtrl.navigateForward('home');
   
      })
      .catch((e) => {
        const errorMessage: string = e.message;
        this.utilCtrl.showToast(errorMessage);
      });
  }
  async redefinir(user: User) {
    const alert = await this.alertController.create({
      header: 'Confirmar redefinição de senha',
      message: 'tem certeza que deseja redefinir a senha?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancelar',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar!',
          handler: () => {
            this.recuperarSenha(user).then(()=>{
            this.utilCtrl.showToast("Um email de recuperação foi enviado para a caixa de entrada do email " + user.email, 3000)
            })
            .catch((e)=> {
            this.utilCtrl.showToast(e.message, 3000);
            })
          }
        }
      ]
    });

    await alert.present();
  }

  recuperarSenha(user){
    return this.afAuth.sendPasswordResetEmail(user.email)
  }

  register() {
    this.navCtrl.navigateForward('register');
  }

}
