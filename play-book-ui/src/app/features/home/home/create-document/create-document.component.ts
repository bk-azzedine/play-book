import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject, OnDestroy} from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Warning from '@editorjs/warning';
import InlineCode from '@editorjs/inline-code';
// @ts-ignore
import Marker from '@editorjs/marker';
import {
  HlmBreadcrumbDirective,
  HlmBreadcrumbItemDirective,
  HlmBreadcrumbLinkDirective,
  HlmBreadcrumbListDirective,
  HlmBreadcrumbPageDirective,
  HlmBreadcrumbSeparatorComponent,
} from '@spartan-ng/ui-breadcrumb-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import {HlmMenuComponent, HlmMenuItemDirective} from '@spartan-ng/ui-menu-helm';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {
  bootstrapChat,
  bootstrapClipboard,
  bootstrapClock, bootstrapCloud,
  bootstrapEye,
  bootstrapPlus
} from '@ng-icons/bootstrap-icons';
import {lucideChevronDown, lucideList, lucidePlus} from '@ng-icons/lucide';
import {NgForOf, NgIf} from '@angular/common';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { BrnSeparatorComponent } from '@spartan-ng/brain/separator';
import {Document} from '../../../../store/models/document.model';
import {FormsModule} from '@angular/forms';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import {Store} from '@ngrx/store';
import {User} from '../../../../store/models/user.model';
import {Subscription} from 'rxjs';
import {selectUser} from '../../../../store/selectors/auth.selector';
import {selectUserSpaces} from '../../../../store/selectors/company.selector';
import {Space} from '../../../../store/models/Space.model';
import {saveDocument} from '../../../../store/actions/document.actions';

@Component({
  selector: 'app-create-document',
  imports: [
    HlmBreadcrumbDirective,
    HlmBreadcrumbItemDirective,
    HlmBreadcrumbPageDirective,
    HlmBreadcrumbLinkDirective,
    HlmBreadcrumbListDirective,
    HlmBreadcrumbSeparatorComponent,
    HlmInputDirective,
    NgIcon,
    HlmButtonDirective,
    NgIf,
    HlmSeparatorDirective,
    BrnSeparatorComponent,
    FormsModule,
    BrnMenuTriggerDirective,
    NgForOf,
    HlmIconDirective,
    HlmMenuComponent
  ],
  providers: [
    provideIcons({
      lucideList,
      lucidePlus,
      lucideChevronDown,
      bootstrapChat,
      bootstrapClipboard,
      bootstrapClock,
      bootstrapEye,
      bootstrapCloud,
      bootstrapPlus
    })
  ],
  templateUrl: './create-document.component.html',
  standalone: true,
  styleUrl: './create-document.component.css'
})
export class CreateDocumentComponent implements OnInit, AfterViewInit, OnDestroy {
  store = inject(Store)
  activeTab = 'toc';
  editor!: EditorJS;
  spaces!: Space[];
  selectedSpace: Space | null = null;
  documentEdit: Document = {
    id: '',
    title: 'Untitled Document',
    description: '',
    space: '',
    organization: '',
    authors: [],
    content: null,
    tags: [],
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  @ViewChild('titleInput') titleInput: ElementRef | undefined;
  isEditing = false;
  documentTitle = 'Untitled Document';
  currentUser?: User;
  private subscriptions = new Subscription();
  authors: Array<{id: string, name: string, initials: string, color: string}> = [];

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select(selectUser).subscribe(user => {
        if (user) {
          this.currentUser = user;

          if (user.userId) {
            this.documentEdit.authors = [user];
          }
          this.initializeAuthors();
        }
      })
    );
    this.subscriptions.add(
      this.store.select(selectUserSpaces).subscribe(spaces => {
        this.spaces = spaces;
      })
    )
  }

  initializeAuthors(): void {
    if (this.currentUser) {

      const firstName = this.currentUser.firstName || '';
      const lastName = this.currentUser.lastName || '';

      const firstInitial = firstName.length > 0 ? firstName[0] : '';
      const lastInitial = lastName.length > 0 ? lastName[0] : '';
      const initials = `${firstInitial}${lastInitial}`;
      const safeInitials = initials.trim() ? initials.toUpperCase() : 'UN';

      const fullName = firstName || lastName ?
        `${firstName} ${lastName}`.trim() :
        (this.currentUser.userId || 'Unknown User');
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      this.authors = [{
        id: this.currentUser.userId || 'unknown',
        name: fullName,
        initials: safeInitials,
        color: randomColor
      }];
    } else {
      this.authors = [];
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.initEditor();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  initEditor(): void {
    const editorTools: any = {
      header: {
        class: Header,
        inlineToolbar: ['marker', 'inlineCode'],
        config: {
          placeholder: 'Enter a heading',
          levels: [1, 2, 3, 4, 5, 6],
          defaultLevel: 3
        }
      },
      list: {
        class: List,
        inlineToolbar: true
      },
      table: {
        class: Table,
        inlineToolbar: true
      },
      quote: {
        class: Quote,
        inlineToolbar: true
      },
      code: {
        class: CodeTool
      },
      delimiter: {
        class: Delimiter
      },
      warning: {
        class: Warning,
        inlineToolbar: true
      },
      inlineCode: {
        class: InlineCode
      },
      marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M'
      },
    };

    this.editor = new EditorJS({
      holder: 'editorjs',
      autofocus: true,
      placeholder: 'Start writing your document...',
      tools: editorTools,
      sanitizer: {
        p: true,
        b: true,
        a: true,
        // Add other allowed tags
        span: {
          class: true,
          style: true
        },
        mark: {
          class: true,
          style: true
        }
      }
    });
  }

  saveEditorContent(): void {
    if (!this.editor) {
      return;
    }
     this.editor.save()
      .then((outputData) => {
        this.documentEdit.content = outputData
      })
      .catch((error) => {
        console.error('Saving failed: ', error);
      });
    this.store.dispatch(saveDocument({document: this.documentEdit}));
  }

  startEditing(): void {
    this.isEditing = true;
    setTimeout(() => {
      if (this.titleInput) {
        this.titleInput.nativeElement.focus();
        this.titleInput.nativeElement.select(); // Selects the text for easy replacement
      }
    });
  }

  saveTitle(): void {
    this.isEditing = false;
    // this.documentEdit.title is already updated by [(ngModel)]
    if (this.documentEdit.title.trim() === '') {
      this.documentEdit.title = 'Untitled Document'; // Prevent blank title
    }
    this.documentEdit.lastUpdated = new Date().toISOString();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveTitle();
    } else if (event.key === 'Escape') {
      this.isEditing = false;
    }
  }

  selectSpace(space: Space): void {
    this.selectedSpace = space;
    this.documentEdit.space = space.spaceId;
    this.documentEdit.lastUpdated = new Date().toISOString();
    console.log('Space set in document:', this.documentEdit);
  }


}
