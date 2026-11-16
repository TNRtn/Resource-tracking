import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectserviceService {

  constructor(private http: HttpClient) { }
  apiURl = "http://tnr512.runasp.net/api";
  getprojects ():Observable<any>{
    return this.http.get<any>(`${this.apiURl}/Project`);
  }
}
