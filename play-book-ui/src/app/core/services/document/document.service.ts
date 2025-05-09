import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpService} from '../../../shared/services/http.service';
import {Document} from '../../../store/models/document.model';
import {Company} from '../../../store/models/company.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  httpService = inject(HttpService);

  loadRecentDocs(organization: string, user: string): Observable<Document[]> {
    return this.httpService.get<Document[]>(`doc/organization/${organization}/user/${user}`).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Invalid server response');
      })
    );
  }

  saveDocument(document: Document): Observable<Document> {
    return this.httpService.post<any>("doc/", document).pipe(
      map(data => {
        if (data && data.body) {
          const responseDoc:Document = {
            id: data?.body.id,
            title: data?.body.title,
            description: data?.body.description,
            space: data?.body.space,
            organization: data?.body.organization,
            authors:data?.body.authors,
            content: data?.body.content,
            tags: data?.body.tags,
            lastUpdated: data?.body.lastUpdated,
            createdAt: data?.body.createdAt
          };
          return responseDoc;
        } else {
          throw new Error('Invalid server response');
        }
      })
    );
  }
}
