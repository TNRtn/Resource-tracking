import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
    apiURl = "http://tnr512.runasp.net/api";
  constructor(private http : HttpClient) { }
  getMenus(projectId: number) {
    const params = {
  id: projectId
};

    return this.http.get<any>(`${this.apiURl}/Menu`, { params });
  }
}
