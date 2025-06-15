import { Component, inject, type OnDestroy, type OnInit } from "@angular/core"
import { Store } from "@ngrx/store"
import { Subject, Subscription, takeUntil } from "rxjs"
import { NgForOf, NgIf } from "@angular/common"
import { HlmButtonDirective } from "@spartan-ng/ui-button-helm"
import { HlmDialogContentComponent } from "@spartan-ng/ui-dialog-helm"
import { BrnDialogComponent, BrnDialogContentDirective, BrnDialogTriggerDirective } from "@spartan-ng/brain/dialog"
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { HlmInputDirective } from "@spartan-ng/ui-input-helm"
import { HlmRadioComponent, HlmRadioGroupComponent, HlmRadioIndicatorComponent } from "@spartan-ng/ui-radiogroup-helm"
import { BrnSelectComponent, BrnSelectContentComponent, BrnSelectValueComponent } from "@spartan-ng/brain/select"
import { HlmSelectContentDirective, HlmSelectImports, HlmSelectOptionComponent } from "@spartan-ng/ui-select-helm"
import { NgIcon, provideIcons } from "@ng-icons/core"
import { NgScrollbar } from "ngx-scrollbar"
import { lucidePlus, lucideX, lucideChevronLeft, lucideChevronRight } from "@ng-icons/lucide"
import {
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
} from "@ng-icons/heroicons/outline"

import { SpaceCardComponent } from "./components/space-card/space-card.component"
import { HlmErrorDirective, HlmFormFieldComponent } from "@spartan-ng/ui-formfield-helm"
import { HlmToasterComponent } from "@spartan-ng/ui-sonner-helm"
import { Actions, ofType } from "@ngrx/effects"
import { toast } from "ngx-sonner"

// Import your existing models and services
import type { Space } from "../../../../store/models/Space.model"
import type { SpaceMembersRequest } from "../../../../core/requests/space-members.request"
import { SpacePrivilegesEnum } from "../../../../store/models/enums/space-privilges.enum"
import { Navigate } from "../../../../store/actions/router.actions"
import type { User } from "../../../../store/models/user.model"
import type { SpaceRequest } from "../../../../core/requests/space.request"
import { CreateSpace, CreateSpaceFailure, CreateSpaceSuccess } from "../../../../store/actions/space.actions"
import { selectTeamSpaces, selectUserSpaces } from "../../../../store/selectors/company.selector"
import type { Team } from "../../../../store/models/team.model"
import { SpaceVisibilityEnum } from "../../../../store/models/enums/space-visibility.enum"
import { selectManagedTeams } from "../../../../store/selectors/teams.selector"
import {CarouselComponent} from '../../../../shared/components/carousel/carousel.component';
import {CarouselItemComponent} from '../../../../shared/components/carousel-item/carousel-item.component';

@Component({
  selector: "app-spaces",
  imports: [
    NgIcon,
    HlmButtonDirective,
    BrnDialogComponent,
    BrnDialogContentDirective,
    HlmRadioGroupComponent,
    FormsModule,
    NgForOf,
    NgIf,
    NgScrollbar,
    ReactiveFormsModule,
    HlmDialogContentComponent,
    HlmRadioComponent,
    HlmRadioIndicatorComponent,
    HlmSelectOptionComponent,
    HlmInputDirective,
    HlmSelectContentDirective,
    HlmSelectImports,
    BrnDialogTriggerDirective,
    SpaceCardComponent,
    HlmFormFieldComponent,
    BrnSelectComponent,
    BrnSelectContentComponent,
    BrnSelectValueComponent,
    HlmErrorDirective,
    HlmToasterComponent,
    CarouselItemComponent,
    CarouselComponent,
    CarouselItemComponent,
  ],
  providers: [
    provideIcons({
      lucidePlus,
      lucideChevronLeft,
      lucideChevronRight,
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
    }),
  ],
  templateUrl: "./spaces.component.html",
  standalone: true,
  styleUrl: "./spaces.component.css",
})
export class SpacesComponent implements OnInit, OnDestroy {
  formBuilder = inject(FormBuilder)
  store = inject(Store)
  actions$ = inject(Actions)
  private destroy$ = new Subject<void>()

  userSpaces: Space[] = []
  teamSpaces: Space[] = []
  subscriptions = new Subscription()
  managedTeams: Team[] = []
  availableUsers: User[] = []

  icons: string[] = [
    "heroBookOpen",
    "heroLightBulb",
    "heroBeaker",
    "heroBriefcase",
    "heroAcademicCap",
    "heroRocketLaunch",
    "heroShieldCheck",
    "heroUserGroup",
    "heroDocumentText",
    "heroComputerDesktop",
    "heroScale",
    "heroBanknotes",
    "heroHeart",
    "heroCodeBracket",
  ]

  filteredUsers: User[] = []
  selectedMembers: SpaceMembersRequest[] = []
  memberSearchInput = ""
  privilegeToAssignControl = new FormControl(SpacePrivilegesEnum.CAN_VIEW, { nonNullable: true })
  selectedIconIndex = 0

  spaceForm = this.formBuilder.group({
    name: new FormControl("", [Validators.required, Validators.maxLength(20)]),
    description: new FormControl("", [Validators.maxLength(100)]),
    icon: new FormControl(this.icons[0]),
    team: new FormControl(""),
    visibility: new FormControl(SpaceVisibilityEnum.PRIVATE),
  })

  ngOnInit(): void {
    // Your existing ngOnInit logic remains the same
    this.actions$.pipe(ofType(CreateSpaceSuccess), takeUntil(this.destroy$)).subscribe((action) => {
      toast.success("space has been created", {
        description: `${action.space.name} was successfully created`,
      })
    })

    this.actions$.pipe(ofType(CreateSpaceFailure), takeUntil(this.destroy$)).subscribe((action) => {
      toast.error("Failed to create space", {
        description: action.error?.message || "An error occurred while saving the document",
      })
    })

    this.subscriptions.add(this.store.select(selectUserSpaces).subscribe((spaces) => (this.userSpaces = spaces || [])))

    this.subscriptions.add(this.store.select(selectTeamSpaces).subscribe((spaces) => (this.teamSpaces = spaces || [])))

    this.subscriptions.add(this.store.select(selectManagedTeams).subscribe((teams) => (this.managedTeams = teams)))

    const teamControl = this.spaceForm.get("team")
    if (teamControl) {
      this.subscriptions.add(
        teamControl.valueChanges.subscribe((selectedTeamId: string | null) => {
          if (typeof selectedTeamId === "string" && selectedTeamId) {
            this.loadTeamMembers(selectedTeamId)
          } else {
            this.availableUsers = []
            this.filteredUsers = []
            this.selectedMembers = []
            this.memberSearchInput = ""
          }
        }),
      )
    }

    this.selectIcon(0)
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.subscriptions.unsubscribe()
  }

  // Carousel event handlers
  onSlideChange(index: number): void {
    console.log("User spaces carousel slide changed to:", index)
  }

  onTeamSlideChange(index: number): void {
    console.log("Team spaces carousel slide changed to:", index)
  }

  // TrackBy function for better performance
  trackBySpaceId(index: number, space: Space): string {
    return space.spaceId
  }

  // Your existing methods remain the same
  view(space: string) {
    this.store.dispatch(Navigate({ path: ["home", "space", space] }))
  }

  loadTeamMembers(teamId: string): void {
    const selectedTeam = this.managedTeams.find((team) => team.teamId === teamId)

    if (selectedTeam && selectedTeam.members) {
      this.availableUsers = selectedTeam.members.filter((member) => member && member.user).map((member) => member.user)
    } else {
      this.availableUsers = []
    }

    this.memberSearchInput = ""
    this.filteredUsers = []
    this.selectedMembers = []
    this.privilegeToAssignControl.reset(SpacePrivilegesEnum.CAN_VIEW)
  }

  selectIcon(index: number): void {
    this.selectedIconIndex = index
    this.spaceForm.get("icon")?.setValue(this.icons[index])
  }

  onMemberSearchInput(): void {
    const searchTerm = this.memberSearchInput.trim().toLowerCase()

    if (!searchTerm) {
      this.filteredUsers = []
      return
    }

    this.filteredUsers = this.availableUsers
      .filter((user) => {
        if (!user || !user.firstName || !user.lastName || !user.email) {
          return false
        }
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        const email = user.email.toLowerCase()
        return fullName.includes(searchTerm) || email.includes(searchTerm)
      })
      .filter((user) => !this.selectedMembers.some((selectedItem) => selectedItem.member.userId === user.userId))
  }

  formatUserDisplay(user: User): string {
    if (!user) return ""
    return `${user.firstName} ${user.lastName} (${user.email})`
  }

  selectUser(user: User): void {
    const selectedPrivilege = this.privilegeToAssignControl.value

    if (!selectedPrivilege) {
      console.warn("Please select a privilege before adding a member.")
      return
    }

    if (this.selectedMembers.some((selectedItem) => selectedItem.member.userId === user.userId)) {
      console.warn(`User ${this.formatUserDisplay(user)} is already added.`)
      return
    }

    const memberRequest: SpaceMembersRequest = {
      member: user,
      privilege: selectedPrivilege,
    }

    this.selectedMembers.push(memberRequest)
    this.memberSearchInput = ""
    this.filteredUsers = []
  }

  removeMember(index: number): void {
    this.selectedMembers.splice(index, 1)
  }

  saveSpace(): void {
    if (this.spaceForm.valid) {
      const membersForRequest: SpaceMembersRequest[] = this.selectedMembers

      const newSpaceRequest: SpaceRequest = {
        name: this.spaceForm.get("name")?.value || "",
        description: this.spaceForm.get("description")?.value || "",
        icon: this.spaceForm.get("icon")?.value || this.icons[0],
        team_id: this.spaceForm.get("team")?.value || "",
        visibility: this.spaceForm.get("visibility")?.value || SpaceVisibilityEnum.PRIVATE,
        members: membersForRequest,
      }

      this.store.dispatch(CreateSpace({ space: newSpaceRequest }))

      this.spaceForm.reset({
        visibility: SpaceVisibilityEnum.PRIVATE,
        icon: this.icons[0],
      })
      this.selectedIconIndex = 0
      this.selectedMembers = []
      this.memberSearchInput = ""
      this.filteredUsers = []
      this.availableUsers = []
      this.privilegeToAssignControl.reset(SpacePrivilegesEnum.CAN_VIEW)
    } else {
      this.spaceForm.markAllAsTouched()
    }
  }

  private getFormValidationErrors(): { control: string; error: string; value: any }[] {
    const errors: { control: string; error: string; value: any }[] = []

    Object.keys(this.spaceForm.controls).forEach((key) => {
      const control = this.spaceForm.get(key)

      if (control && !control.valid) {
        const controlErrors = control.errors
        if (controlErrors) {
          Object.keys(controlErrors).forEach((keyError) => {
            errors.push({
              control: key,
              error: keyError,
              value: controlErrors[keyError],
            })
          })
        }
      }
    })

    return errors
  }

  protected readonly SpaceVisibilityEnum = SpaceVisibilityEnum
  protected readonly heroUserGroup = heroUserGroup

  get privilegeOptions(): string[] {
    return Object.values(SpacePrivilegesEnum)
  }

  formatMemberWithPrivilegeDisplay(item: SpaceMembersRequest): string {
    if (!item || !item.member) return ""
    const formattedPrivilege = item.privilege
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
    return `${this.formatUserDisplay(item.member)} (${formattedPrivilege})`
  }
}
