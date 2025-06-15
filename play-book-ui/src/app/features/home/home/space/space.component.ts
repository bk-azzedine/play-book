import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {filter, take} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Subject, Subscription, takeUntil} from 'rxjs';
import {Store} from '@ngrx/store';
import {selectSpaceById} from '../../../../store/selectors/company.selector';
import {Space} from '../../../../store/models/Space.model';
import {lucidePencilLine, lucidePlus, lucideTrash, lucideX} from '@ng-icons/lucide';
import {
  heroAcademicCap,
  heroBanknotes, heroBeaker, heroBookOpen, heroBriefcase, heroCodeBracket,
  heroComputerDesktop, heroDocumentText,
  heroGlobeAlt, heroHeart, heroLightBulb,
  heroLockClosed,
  heroPlus, heroRocketLaunch,
  heroScale, heroShieldCheck, heroUserGroup,
  heroUserPlus,
  heroXMark
} from '@ng-icons/heroicons/outline';
import {Document} from '../../../../store/models/document.model';
import {selectSpaceDocuments} from '../../../../store/selectors/document.selector';
import {NgForOf, NgIf} from '@angular/common';
import {Navigate} from '../../../../store/actions/router.actions';
import {loadSpaceDocuments, saveDocumentFailure, saveDocumentSuccess} from '../../../../store/actions/document.actions';
import {DocCardComponent} from '../documents/shared-components/doc-card/doc-card.component';
import {featherMoreVertical} from '@ng-icons/feather-icons';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {BrnMenuTriggerDirective} from '@spartan-ng/brain/menu';
import {HlmMenuComponent} from '@spartan-ng/ui-menu-helm';
import {bootstrapArchive} from '@ng-icons/bootstrap-icons';
import {BrnDialogComponent, BrnDialogContentDirective, BrnDialogTriggerDirective} from '@spartan-ng/brain/dialog';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgScrollbar} from 'ngx-scrollbar';
import {User} from '../../../../store/models/user.model';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';
import {SpaceVisibilityEnum} from '../../../../store/models/enums/space-visibility.enum';
import {HlmDialogModule} from '@spartan-ng/ui-dialog-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmErrorDirective, HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmSelectModule} from '@spartan-ng/ui-select-helm';
import {HlmRadioGroupComponent, HlmRadioGroupModule, HlmRadioIndicatorComponent} from '@spartan-ng/ui-radiogroup-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {SpaceUpdateRequest} from '../../../../core/requests/space-update.request';
import {
  DeleteSpace,
  DeleteSpaceSuccess,
  UpdateSpace,
  UpdateSpaceSuccess
} from '../../../../store/actions/space.actions';
import {Actions, ofType} from '@ngrx/effects';
import {toast} from 'ngx-sonner';
import {
  HlmAlertDialogCancelButtonDirective, HlmAlertDialogComponent, HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective, HlmAlertDialogFooterComponent, HlmAlertDialogHeaderComponent,
  HlmAlertDialogModule,
  HlmAlertDialogTitleDirective
} from '@spartan-ng/ui-alertdialog-helm';
import {BrnAlertDialogContentDirective, BrnAlertDialogTriggerDirective} from '@spartan-ng/brain/alert-dialog';


@Component({
  selector: 'app-space',
  imports: [
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogContentComponent,
    HlmButtonDirective,
    NgIcon,
    DocCardComponent,
    NgForOf,
    HlmButtonDirective,
    HlmButtonDirective,
    BrnMenuTriggerDirective,
    HlmMenuComponent,
    BrnDialogComponent,
    BrnDialogContentDirective,
    FormsModule,
    NgIf,
    NgScrollbar,
    ReactiveFormsModule,
    BrnDialogTriggerDirective,
    HlmDialogModule,
    HlmInputDirective,
    HlmErrorDirective,
    HlmToasterComponent,
    HlmSelectModule,
    HlmRadioGroupComponent,
    HlmRadioGroupModule,
    HlmRadioIndicatorComponent,
    HlmLabelDirective,
    HlmAlertDialogModule,
    HlmAlertDialogModule,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogFooterComponent,
    BrnAlertDialogTriggerDirective,
    HlmButtonDirective,
    HlmButtonDirective
  ],
  providers: [
    provideIcons({
      lucidePlus,
      heroPlus,
      heroXMark,
      heroUserPlus,
      heroGlobeAlt,
      heroLockClosed,
      heroScale,
      heroComputerDesktop,
      heroBanknotes,
      heroHeart,
      heroCodeBracket,
      heroBookOpen,
      heroBeaker,
      heroBriefcase,
      heroAcademicCap,
      heroRocketLaunch,
      heroShieldCheck,
      heroUserGroup,
      heroDocumentText,
      heroLightBulb,
      lucideX,
      featherMoreVertical,
      bootstrapArchive,
      lucideTrash,
      lucidePencilLine
    })
  ],
  templateUrl: './space.component.html',
  standalone: true,
  styleUrl: './space.component.css'
})
export class SpaceComponent implements OnInit, OnDestroy {
  actions$ = inject(Actions)
  formBuilder = inject(FormBuilder)
  store = inject(Store);
  subscriptions = new Subscription()
  private destroy$ = new Subject<void>();
  icons: string[] = [
    'heroBookOpen',
    'heroLightBulb',
    'heroBeaker',
    'heroBriefcase',
    'heroAcademicCap',
    'heroRocketLaunch',
    'heroShieldCheck',
    'heroUserGroup',
    'heroDocumentText',
    'heroComputerDesktop',
    'heroScale',
    'heroBanknotes',
    'heroHeart',
    'heroCodeBracket'
  ];

  selectedIconIndex: number = 0;

  spaceForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    description: new FormControl('', [Validators.maxLength(100)] ),
    icon: new FormControl(this.icons[0]),
    team: new FormControl(''), // This control might need to be removed or handled differently if team is not editable
    visibility: new FormControl(SpaceVisibilityEnum.PRIVATE)
  });

  spaceDocuments : Document  []  = []
  route = inject(ActivatedRoute)
  spaceId!: string | null
  space: Space | undefined;


  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap.pipe(take(1)).subscribe(params => {
        this.spaceId = params.get('id');

        if (!this.spaceId || this.spaceId === 'new') return;

        this.loadSpaceDocs();

        this.subscriptions.add(
          this.store.select(selectSpaceById(this.spaceId))
            .pipe(filter(space => !!space))
            .subscribe(space => {
              this.space = space;
              this.populateEditForm();
            })
        );

        this.subscriptions.add(
          this.store.select(selectSpaceDocuments(this.spaceId)).subscribe(documents => {
            this.spaceDocuments = documents;
          })
        );
      })
    );
    this.actions$.pipe(
      ofType(UpdateSpaceSuccess),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      toast.success('space has been updated', {
        description: `${action.space.name} was successfully updated`
      });
    });

    // Handle error actions
    this.actions$.pipe(
      ofType(saveDocumentFailure),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      toast.error('Failed to update space', {
        description: action.error?.message || 'An error occurred while saving the document'
      });
    });
    this.actions$.pipe(
      ofType(DeleteSpaceSuccess),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      this.store.dispatch(Navigate({path: "home"}))
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  view(doc: string){
    this.store.dispatch(Navigate({path: ['home','document', doc]}))
  }

  loadSpaceDocs (){
    if (this.space)
      this.store.dispatch(loadSpaceDocuments({space: this.space?.spaceId}))
  }

  populateEditForm(): void {
    if (this.space) {
      this.spaceForm.patchValue({
        name: this.space.name,
        description: this.space.description,
        icon: this.space.icon,
        team: this.space.teamId, // Assuming teamId exists on your Space model
        visibility: this.space.visibility
      });

      const iconIndex = this.icons.findIndex(icon => icon === this.space?.icon);
      if (iconIndex !== -1) {
        this.selectedIconIndex = iconIndex;
      }

      // No longer populating `selectedMembers` here as member editing is a separate function.
      // If `space.members` is used elsewhere for display, ensure it's handled there.
    }
  }

  selectIcon(index: number): void {
    this.selectedIconIndex = index;
    this.spaceForm.get('icon')?.setValue(this.icons[index]);
  }

  // Removed `searchUsers`, `addMember`, `addSelectedUserToMembers`, `removeMember`
  // as member management is a separate function.

  formatUserDisplay(user: User): string {
    if (!user) return '';
    return `${user.firstName} ${user.lastName} (${user.email})`;
  }

  saveSpace(): void {
    console.log('Form is valid:', this.spaceForm.valid);

    Object.keys(this.spaceForm.controls).forEach(key => {
      const control = this.spaceForm.get(key);
      console.log(`Control ${key}:`, {
        value: control?.value,
        valid: control?.valid,
        errors: control?.errors,
        dirty: control?.dirty,
        touched: control?.touched
      });
    });

    console.log('Form errors:', this.spaceForm.errors);

    if (this.spaceForm.valid && this.space) {
      const updatedSpaceRequest: SpaceUpdateRequest = {
        space_id: this.space.spaceId,
        name: this.spaceForm.get('name')?.value || '',
        description: this.spaceForm.get('description')?.value || '',
        icon: this.spaceForm.get('icon')?.value || this.icons[0],
        teamId: this.space?.teamId,
        visibility: this.spaceForm.get('visibility')?.value || SpaceVisibilityEnum.PRIVATE,
        members: this.space.members || [],
      };

      console.log('Updating space request:', updatedSpaceRequest);

      this.store.dispatch(UpdateSpace({  space: updatedSpaceRequest }));

      // Optionally close the dialog or give feedback
    } else {
      console.warn('Space form is invalid. Cannot save.');
      console.warn('Form validation errors:', this.getFormValidationErrors());
      this.spaceForm.markAllAsTouched();
    }
  }

  private getFormValidationErrors(): { control: string, error: string, value: any }[] {
    const errors: { control: string, error: string, value: any }[] = [];

    Object.keys(this.spaceForm.controls).forEach(key => {
      const control = this.spaceForm.get(key);

      if (control && !control.valid) {
        const controlErrors = control.errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach(keyError => {
            errors.push({
              control: key,
              error: keyError,
              value: controlErrors[keyError]
            });
          });
        }
      }
    });

    return errors;
  }
  protected readonly SpaceVisibilityEnum = SpaceVisibilityEnum;
  protected readonly heroUserGroup = heroUserGroup;

  deleteSpace(): void {
    this.store.dispatch(DeleteSpace({ id: this.space?.spaceId || ''  }));
  }
}
