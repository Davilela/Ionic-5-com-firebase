import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder } from '@angular/forms';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Task } from 'src/models/task';
import { TaskService } from '../services/task.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasks: any[] = [];
  user: string;
  processando: boolean = false;
  bookingForm: FormBuilder;
  constructor(
    private alertCtrl: AlertController,
    private utilService: UtilService,
    private actionSheet: ActionSheetController,
    private loadingCtrl: LoadingController,
    private taskService: TaskService,
    public fb: FormBuilder,
    private navCtrl: NavController,
    private afAuth : AngularFireAuth,
    private alertController: AlertController,
    private toastCtrl: ToastController) {
    this.user = localStorage.getItem('user');
  }

  fetchTasks() {
    this.taskService.getTaskList(this.user).valueChanges().subscribe(res => {
      console.log(res);
    })
  }
  
 async ionViewWillEnter() {
  let loading = this.loadingCtrl.create({ message: 'Carregando' });
  (await loading).present();
  this.user = localStorage.getItem('user');
    this.user = this.user.substring(1, this.user.length - 1);
    this.user = this.user.replace(/[^a-zA-Z0-9]/g,'');
    console.log(this.user);
    this.fetchTasks();
    let taskRes = this.taskService.getTaskList(this.user);
    taskRes.snapshotChanges().subscribe(async (res) => {
      this.tasks = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.tasks.push(a as Task);
      });
     (await loading).dismiss();
    });
  }
  deleteAll(){
    this.tasks.map(x=>{
      this.delete(x.$key);
    })
  }

  delete(id) {
    this.taskService.deleteTask(this.user, id);
  }

  updateTask(id, tsk: string, dn: boolean, fv: boolean) {
    let updateTaskForm = this.fb.group({
      task: [tsk],
      done: !dn
    });
    this.taskService.updateTask(id, this.user, updateTaskForm.value)
      .then(() => {
        this.fetchTasks();
        let taskRes = this.taskService.getTaskList(this.user);
        taskRes.snapshotChanges().subscribe(res => {
          this.tasks = [];
          res.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            this.tasks.push(a as Task);
          })
        });
      })
      .catch(error => console.log(error));
  }
  async openActions(t){
    const actionSheet = await this.actionSheet.create({
      header: 'O que deseja fazer?',
      buttons: [{
        text: t.done ? 'Desmarcar' : 'Marcar',
        icon: t.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          t.done = !t.done;
        }
      }, 
      {
        text: t.fav ?  'Desfavoritar' : 'Favoritar',
        icon: t.fav ? 'star-outline' : 'star',
        handler: () => {
          t.fav = !t.fav;
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

  }
  async showAdd() {
    this.processando=true;
    const alert = await this.alertCtrl.create({
      header: 'O que deseja adicionar?',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'O que deseja adicionar?'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            this.processando=false;
          }
        }, {
          text: 'Adicionar',
          handler: (form) => {
            console.log(form.task);
            this.taskService.createTask(this.user, form.task);
            this.processando=false;
          }
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss()
    .then(async ()=>{
      let loading = this.loadingCtrl.create({ message: 'Carregando' });
      (await loading).present();
      this.fetchTasks();
      let taskRes = this.taskService.getTaskList(this.user);
      taskRes.snapshotChanges().subscribe(async (res) => {
        this.tasks = [];
        res.forEach(item => {
          let a = item.payload.toJSON();
          a['$key'] = item.key;
          this.tasks.push(a as Task);
        });
        (await loading).dismiss();
      });
    })
    return;
  }
  async logOut(){
    console.log(this.user);
    this.user = null;
    console.log(this.user);
    this.navCtrl.navigateForward('login'); 
  }
}