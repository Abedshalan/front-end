import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, Observable, Subject } from 'rxjs';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export interface TableRow {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public Dark: Subject<boolean> = new Subject<boolean>();

  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private http: HttpClient
  ) {}

  // Set dark mode
  setDarkMode(isDarkMode: boolean) {
    this.Dark.next(isDarkMode);
  }

  // Show or hide spinner
  showOrHideSpinner(loading: boolean) {
    if (loading) {
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
  }

  // Push a message to the message service
  pushMessage(type: 'success' | 'error' | 'warn' | 'info', summary: string, messageText: string) {
    this.messageService.add({
      severity: type,
      summary: summary,
      detail: messageText
    });
  }

  // Push a success toast message
  pushToast() {
    this.pushMessage('success', 'Success Message', 'Record Saved Successfully');
  }

  // Get message type as string
  getMessagetype(messageType: MessageType): 'success' | 'error' | 'info' | 'warn' {
    switch (messageType) {
      case MessageType.Success:
        return 'success';
      case MessageType.Error:
        return 'error';
      case MessageType.Info:
        return 'info';
      case MessageType.Warn:
        return 'warn';
      default:
        return 'info';
    }
  }

  // Example HTTP GET request with spinner
  getData(url: string): Observable<any> {
    this.showOrHideSpinner(true);
    return this.http.get(url).pipe(
      finalize(() => this.showOrHideSpinner(false))
    );
  }

  // Example HTTP POST request with spinner
  postData(url: string, body: any): Observable<any> {
    this.showOrHideSpinner(true);
    return this.http.post(url, body).pipe(
      finalize(() => this.showOrHideSpinner(false))
    );
  }
}

export enum MessageType {
  Info = 1,
  Success = 2,
  Warn = 3,
  Error = 4
}