import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Task } from 'src/models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskListRef: AngularFireList<any>;
  taskRef: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase) { }

  createTask(usr: string, tsk: string) {
    this.taskListRef = this.db.list('/task/' + usr);
    console.log(tsk);
    return this.taskListRef.push({
      task: tsk,
      done: false,
    });
  }

  getTask(usr: string, id: string) {
    this.taskRef = this.db.object('/task/' + usr + '/' + id);
    return this.taskRef;
  }

  getTaskList(usr: string) {
    this.taskListRef = this.db.list('/task/' + usr);
    return this.taskListRef;
  }

  updateTask(id, usr:string, tsk: Task) {
    console.log(tsk);
    return this.db.object('/task/' + usr + '/' + id).update(tsk);
  }

  deleteTask(usr: string, id: string) {
    this.taskRef = this.db.object('/task/' + usr + '/' + id);
    this.taskRef.remove();
  }
}
