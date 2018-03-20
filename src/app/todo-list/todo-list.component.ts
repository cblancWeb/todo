import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

import { TodoService } from './../todo.service';
import { TodoModel } from './../todo.model';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, AfterViewInit {

  public disableAnimation = true;

  private todos: TodoModel[] = [];

  private _lastStatus: string;

  constructor(
    private _todoService: TodoService,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    combineLatest(
      this._route.params.pipe(map(params => params.status)),
      this._todoService.todos
    )
    .subscribe(([status, todos]) => {
      if (this._lastStatus !== status) {
        this.disableAnimation = true;
      }
      this._lastStatus = status;

      if (status === 'completed') {
        this.todos = todos.filter((todo: TodoModel) => {
          return todo.completed === true;
        });
      } else if (status === 'active') {
        this.todos = todos.filter((todo: TodoModel) => {
          return todo.completed === false;
        });
      } else {
        this.todos = todos;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.disableAnimation = false;
    }, 0);
  }

  public hasCompleted(): boolean {
    const completed = this.todos.filter((todo: TodoModel) => {
      return todo.completed === true;
    });

    return completed.length !== 0;
  }

  public setAllTo(completed: any): void {
    this._todoService.setCompletedToAll(completed.checked);
  }

  public remove(id: string): void {
    this._todoService.remove(id);
  }

  public update(todo: TodoModel): void {
    this._todoService.update(todo);
  }

  public trackById(index, item): number {
    return item.id;
  }

}
