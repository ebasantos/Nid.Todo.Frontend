import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TodoEntity } from '../model/todo';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  public array: TodoEntity[] = [];
  private todoRoute: string = '/todo';
  public insertForm: FormGroup = new FormGroup({
    descricao: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
  });

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.getData();
  }

  insertData() {
    if (this.insertForm.invalid) {
      alert('revise os dados e tente novamente');
      return;
    }

    const data = {
      descricao: this.insertForm.controls['descricao'].value,
      concluido: false,
    };

    this.httpClient
      .post(environment.apiUrl + this.todoRoute, data)
      .subscribe((r) => this.getData());
  }

  getData() {
    this.httpClient
      .get<TodoEntity[]>(environment.apiUrl + this.todoRoute)
      .subscribe((res) => (this.array = res));
  }

  finishItem(item: TodoEntity) {
    item.concluido = !item.concluido;
    this.httpClient
      .put(environment.apiUrl + `${this.todoRoute}/${item.id}`, item)
      .subscribe((r) => this.getData());
  }

  delete(id: number) {
    this.httpClient
      .delete(environment.apiUrl + `${this.todoRoute}/${id}`)
      .subscribe((r) => this.getData());
  }
}
