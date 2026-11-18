import { Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OpertaionalResult } from '../../../model/opertaional-result';
import { Timerperiod } from '../model/timerperiod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeperiodService {
   private apiUrl = `${environment.apiURl}/TimePeriod`;

  constructor(private http : HttpClient) { }

  getTimeperiods(id?:number,Name?:string,CateogryId?:number,Order?:string){
    let params = new HttpParams();
     if (id) {
      params = params.set('Id', id);
    }

    if (Name?.trim()) {
      params = params.set('Name', Name.trim());
    }

    if (CateogryId) {
      params = params.set('CategoryId',CateogryId);
    }
    if (Order) {
      params = params.set('SortOrder', Order);
    }
     return this.http.get<OpertaionalResult<Timerperiod[]>>(
      this.apiUrl,
      { params }
    );
  }

  saveTimePeriod(
  id: number,
  name: string,
  periodDate: string,
  description: string,
  categoryId: number,
  keyNotes: string,
  keyReferenceLinks: string
): Observable<any> {

  const body = {
    Id: id,
    Name: name,
    PeriodDate: periodDate,
    Description: description,
    CategoryId: categoryId,
    KeyNotes: keyNotes,
    KeyReferenceLinks: keyReferenceLinks
  };

  return this.http.post<any>(
    `${this.apiUrl}`,
    body
  );
}

deleteTimePeriod(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${id}`);
}
}
