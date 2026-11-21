import { Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OpertaionalResult } from '../../../model/opertaional-result';
import { Target, TargetInput } from '../model/target';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetService {
    private apiUrl = `${environment.apiURl}/UPSCTargets`;
  constructor(private http : HttpClient) { }

  getTargets(isActive?: boolean): Observable<OpertaionalResult<Target[]>> {

    let params = new HttpParams();

    if (isActive !== undefined) {
      params = params.set('isActive', isActive);
    }

    return this.http.get<OpertaionalResult<Target[]>>(
      this.apiUrl,
      { params }
    );
  }

  addTarget(input: TargetInput): Observable<OpertaionalResult<string>> {

    return this.http.post<OpertaionalResult<string>>(
      this.apiUrl,
      input
    );
  }

  completeTarget(id: number): Observable<OpertaionalResult<Target>> {
  return this.http.put<OpertaionalResult<Target>>(
    `${this.apiUrl}/${id}/Complete`,
    {}
  );
}
}
