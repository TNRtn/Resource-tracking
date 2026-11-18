import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment  } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectserviceService {

  constructor(private http: HttpClient) { }
  apiURl = environment .apiURl;
  getprojects ():Observable<any>{
    return this.http.get<any>(`${this.apiURl}/Project`);
  }
}
