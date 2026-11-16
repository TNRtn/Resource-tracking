import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OpertaionalResult } from '../../model/opertaional-result';
import { Resources } from '../model/resources';

@Injectable({
  providedIn: 'root'
})
export class ResourecesService {
  apiURl = "http://tnr512.runasp.net/api";
  constructor( private http : HttpClient) { 
    
  }

getResources(Id?:number, name? : string, CategoryId? : number, RevisionCount?:number): Observable<OpertaionalResult<Resources[]>> {
   let params = new HttpParams();
  
  if (CategoryId !== undefined && CategoryId !== null) {
    params = params.set('categoryId', CategoryId);
  }
  if (name?.trim()) {
        params = params.set('Name', name.trim());
  }
  if(Id !== undefined && Id !==null){
    params = params.set('Id',Id);
  }

  if(RevisionCount !==undefined && RevisionCount!==null){
    params = params.set('RevisionCount',RevisionCount);
  }

  return this.http.get<OpertaionalResult<Resources[]>>(
    `${this.apiURl}/Resources`,{params}
  );
}

addResource(
  name: string,
  description: string,
  categoryId: number,
  referenceKeys: string,
  referenceNoteLinks: string,
  keyPoints: string,
  id? : number
) {
  if(id === null || id===undefined){
  const Addbody = {
    name: name,
    description: description,
    categoryId: categoryId,
    referenceKeys: referenceKeys,
    referenceNoteLinks: referenceNoteLinks,
    keyPoints: keyPoints
  };

  return this.http.post<any>(`${this.apiURl}/Resources`, Addbody);
}
else{
  const Updatebody={
    id : id,
     name: name,
    description: description,
    categoryId: categoryId,
    referenceKeys: referenceKeys,
    referenceNoteLinks: referenceNoteLinks,
    keyPoints: keyPoints
  }
  return this.http.post<any>(`${this.apiURl}/Resources`, Updatebody);
}
}
deleteResource(id:number){
  return this.http.delete<any>(`${this.apiURl}/Resources/${id}`);
}
}
