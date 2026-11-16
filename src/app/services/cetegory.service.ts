import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../model/category';
import { OpertaionalResult } from '../model/opertaional-result';

@Injectable({
  providedIn: 'root'
})
export class CetegoryService {
   apiURl = "https://tnr512.runasp.net/api";

  constructor(private http : HttpClient) { 
  }
   getCategories(id? : number , name ?: string):  Observable<OpertaionalResult<Category[]>>{
      let params = new HttpParams();

    if (id) {
     params = params.set('Id', id);
    }

    if (name?.trim()) {
        params = params.set('Name', name.trim());
    }
      return this.http.get<OpertaionalResult<Category[]>>(`${this.apiURl}/Category`,{params});
    }

  addCategories(name:string): Observable<OpertaionalResult<Category[]>>{
    return this.http.post<OpertaionalResult<Category[]>>(`${this.apiURl}/Category`,{ name : name })
  }

  updateCategory(id:number, Name : string): Observable<OpertaionalResult<string>> {
  return this.http.put<OpertaionalResult<string>>(
   `${this.apiURl}/Category`,{id:id,name : Name}
  );
  }

  deleteCategory (id : number){
    return this.http.delete<OpertaionalResult<string>>(`${this.apiURl}/Category/${id}`)
  }
}
