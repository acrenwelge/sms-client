import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _throw } from 'rxjs/observable/throw';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Associate } from '../models/associate';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class AssociateService {
  private associateURI: string = environment.baseApiUrl + environment.apiUrls.associates;

  constructor(private http: HttpClient) { }

  /**
   * Return the attendance statistics of an individual associate
   * @param assoc the associate
   */
  public getAttendanceStats(assoc: Associate) {
    let stats = {
      present: 0,
      absent: 0,
      attendFraction: 0
    }
    for (let dateStr in assoc.attendance) {
      if (assoc.attendance[dateStr]) stats.present++;
      else stats.absent++;
    }
    stats.attendFraction = stats.present / (stats.absent + stats.present);
    return stats;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code (400 or 500 status)
      // The response body may contain clues as to what went wrong
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return _throw('Something went wrong - please try again');
  };

  public getAssociatesInStaging(): Observable<Associate[]> {
    return this.http.get<Associate[]>(this.associateURI)
      .pipe(
        retry(3), // retry up to 3 times if call fails
        catchError(this.handleError) // then handle error
      );
  }

  public getAssociate(id: number): Observable<Associate> {
    return this.http.get<Associate>(`${this.associateURI}/${id}`)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  public addNewAssociate(associate: Associate): Observable<Associate> {
    return this.http.post<Associate>(`${this.associateURI}`, associate, httpOptions)
      .pipe(catchError(this.handleError));
  }

  public updateAssociate(associate: Associate): Observable<Associate> {
    return this.http.put<Associate>(`${this.associateURI}/${associate.id}`, associate, httpOptions)
      .pipe(catchError(this.handleError));
  }

  public deleteAssociate(id: number): Observable<{}> {
    return this.http.delete(`${this.associateURI}/${id}`, httpOptions)
      .pipe(catchError(this.handleError));
  }

}
