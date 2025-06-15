import {
  A11yModule,
  FocusTrapFactory,
  InteractivityChecker
} from "./chunk-FR2CQ6ZG.js";
import {
  provideCustomClassSettableExisting,
  provideExposesStateProviderExisting
} from "./chunk-42P2JB6C.js";
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayModule,
  OverlayPositionBuilder,
  OverlayRef,
  PortalModule,
  ScrollStrategyOptions,
  TemplatePortal
} from "./chunk-3O3MFXS3.js";
import {
  Directionality
} from "./chunk-FXRHJ26G.js";
import {
  ESCAPE,
  FocusMonitor,
  _IdGenerator,
  hasModifierKey
} from "./chunk-MOZ2DJVD.js";
import {
  Platform,
  _getFocusedElementPierceShadowDom,
  coerceNumberProperty
} from "./chunk-UXQYWOLL.js";
import {
  DOCUMENT
} from "./chunk-A3A3ULYF.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  Injectable,
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  Renderer2,
  RendererFactory2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  output,
  runInInjectionContext,
  setClassMetadata,
  signal,
  untracked,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵhostProperty,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵqueryRefresh,
  ɵɵtemplate,
  ɵɵviewQuery
} from "./chunk-NQQX34FG.js";
import {
  defer
} from "./chunk-WPM5VTLQ.js";
import {
  Subject,
  filter,
  of,
  startWith,
  take,
  takeUntil
} from "./chunk-4S3KYZTJ.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// node_modules/@angular/cdk/fesm2022/dialog.mjs
function CdkDialogContainer_ng_template_0_Template(rf, ctx) {
}
var DialogConfig = class {
  /**
   * Where the attached component should live in Angular's *logical* component tree.
   * This affects what is available for injection and the change detection order for the
   * component instantiated inside of the dialog. This does not affect where the dialog
   * content will be rendered.
   */
  viewContainerRef;
  /**
   * Injector used for the instantiation of the component to be attached. If provided,
   * takes precedence over the injector indirectly provided by `ViewContainerRef`.
   */
  injector;
  /** ID for the dialog. If omitted, a unique one will be generated. */
  id;
  /** The ARIA role of the dialog element. */
  role = "dialog";
  /** Optional CSS class or classes applied to the overlay panel. */
  panelClass = "";
  /** Whether the dialog has a backdrop. */
  hasBackdrop = true;
  /** Optional CSS class or classes applied to the overlay backdrop. */
  backdropClass = "";
  /** Whether the dialog closes with the escape key or pointer events outside the panel element. */
  disableClose = false;
  /** Width of the dialog. */
  width = "";
  /** Height of the dialog. */
  height = "";
  /** Min-width of the dialog. If a number is provided, assumes pixel units. */
  minWidth;
  /** Min-height of the dialog. If a number is provided, assumes pixel units. */
  minHeight;
  /** Max-width of the dialog. If a number is provided, assumes pixel units. Defaults to 80vw. */
  maxWidth;
  /** Max-height of the dialog. If a number is provided, assumes pixel units. */
  maxHeight;
  /** Strategy to use when positioning the dialog. Defaults to centering it on the page. */
  positionStrategy;
  /** Data being injected into the child component. */
  data = null;
  /** Layout direction for the dialog's content. */
  direction;
  /** ID of the element that describes the dialog. */
  ariaDescribedBy = null;
  /** ID of the element that labels the dialog. */
  ariaLabelledBy = null;
  /** Dialog label applied via `aria-label` */
  ariaLabel = null;
  /**
   * Whether this is a modal dialog. Used to set the `aria-modal` attribute. Off by default,
   * because it can interfere with other overlay-based components (e.g. `mat-select`) and because
   * it is redundant since the dialog marks all outside content as `aria-hidden` anyway.
   */
  ariaModal = false;
  /**
   * Where the dialog should focus on open.
   * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
   * AutoFocusTarget instead.
   */
  autoFocus = "first-tabbable";
  /**
   * Whether the dialog should restore focus to the previously-focused element upon closing.
   * Has the following behavior based on the type that is passed in:
   * - `boolean` - when true, will return focus to the element that was focused before the dialog
   *    was opened, otherwise won't restore focus at all.
   * - `string` - focus will be restored to the first element that matches the CSS selector.
   * - `HTMLElement` - focus will be restored to the specific element.
   */
  restoreFocus = true;
  /**
   * Scroll strategy to be used for the dialog. This determines how
   * the dialog responds to scrolling underneath the panel element.
   */
  scrollStrategy;
  /**
   * Whether the dialog should close when the user navigates backwards or forwards through browser
   * history. This does not apply to navigation via anchor element unless using URL-hash based
   * routing (`HashLocationStrategy` in the Angular router).
   */
  closeOnNavigation = true;
  /**
   * Whether the dialog should close when the dialog service is destroyed. This is useful if
   * another service is wrapping the dialog and is managing the destruction instead.
   */
  closeOnDestroy = true;
  /**
   * Whether the dialog should close when the underlying overlay is detached. This is useful if
   * another service is wrapping the dialog and is managing the destruction instead. E.g. an
   * external detachment can happen as a result of a scroll strategy triggering it or when the
   * browser location changes.
   */
  closeOnOverlayDetachments = true;
  /**
   * Alternate `ComponentFactoryResolver` to use when resolving the associated component.
   * @deprecated No longer used. Will be removed.
   * @breaking-change 20.0.0
   */
  componentFactoryResolver;
  /**
   * Providers that will be exposed to the contents of the dialog. Can also
   * be provided as a function in order to generate the providers lazily.
   */
  providers;
  /**
   * Component into which the dialog content will be rendered. Defaults to `CdkDialogContainer`.
   * A configuration object can be passed in to customize the providers that will be exposed
   * to the dialog container.
   */
  container;
  /**
   * Context that will be passed to template-based dialogs.
   * A function can be passed in to resolve the context lazily.
   */
  templateContext;
};
function throwDialogContentAlreadyAttachedError() {
  throw Error("Attempting to attach dialog content after content is already attached");
}
var CdkDialogContainer = class _CdkDialogContainer extends BasePortalOutlet {
  _elementRef = inject(ElementRef);
  _focusTrapFactory = inject(FocusTrapFactory);
  _config;
  _interactivityChecker = inject(InteractivityChecker);
  _ngZone = inject(NgZone);
  _overlayRef = inject(OverlayRef);
  _focusMonitor = inject(FocusMonitor);
  _renderer = inject(Renderer2);
  _platform = inject(Platform);
  _document = inject(DOCUMENT, {
    optional: true
  });
  /** The portal outlet inside of this container into which the dialog content will be loaded. */
  _portalOutlet;
  /** The class that traps and manages focus within the dialog. */
  _focusTrap = null;
  /** Element that was focused before the dialog was opened. Save this to restore upon close. */
  _elementFocusedBeforeDialogWasOpened = null;
  /**
   * Type of interaction that led to the dialog being closed. This is used to determine
   * whether the focus style will be applied when returning focus to its original location
   * after the dialog is closed.
   */
  _closeInteractionType = null;
  /**
   * Queue of the IDs of the dialog's label element, based on their definition order. The first
   * ID will be used as the `aria-labelledby` value. We use a queue here to handle the case
   * where there are two or more titles in the DOM at a time and the first one is destroyed while
   * the rest are present.
   */
  _ariaLabelledByQueue = [];
  _changeDetectorRef = inject(ChangeDetectorRef);
  _injector = inject(Injector);
  _isDestroyed = false;
  constructor() {
    super();
    this._config = inject(DialogConfig, {
      optional: true
    }) || new DialogConfig();
    if (this._config.ariaLabelledBy) {
      this._ariaLabelledByQueue.push(this._config.ariaLabelledBy);
    }
  }
  _addAriaLabelledBy(id) {
    this._ariaLabelledByQueue.push(id);
    this._changeDetectorRef.markForCheck();
  }
  _removeAriaLabelledBy(id) {
    const index = this._ariaLabelledByQueue.indexOf(id);
    if (index > -1) {
      this._ariaLabelledByQueue.splice(index, 1);
      this._changeDetectorRef.markForCheck();
    }
  }
  _contentAttached() {
    this._initializeFocusTrap();
    this._handleBackdropClicks();
    this._captureInitialFocus();
  }
  /**
   * Can be used by child classes to customize the initial focus
   * capturing behavior (e.g. if it's tied to an animation).
   */
  _captureInitialFocus() {
    this._trapFocus();
  }
  ngOnDestroy() {
    this._isDestroyed = true;
    this._restoreFocus();
  }
  /**
   * Attach a ComponentPortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachComponentPortal(portal) {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throwDialogContentAlreadyAttachedError();
    }
    const result = this._portalOutlet.attachComponentPortal(portal);
    this._contentAttached();
    return result;
  }
  /**
   * Attach a TemplatePortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachTemplatePortal(portal) {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throwDialogContentAlreadyAttachedError();
    }
    const result = this._portalOutlet.attachTemplatePortal(portal);
    this._contentAttached();
    return result;
  }
  /**
   * Attaches a DOM portal to the dialog container.
   * @param portal Portal to be attached.
   * @deprecated To be turned into a method.
   * @breaking-change 10.0.0
   */
  attachDomPortal = (portal) => {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throwDialogContentAlreadyAttachedError();
    }
    const result = this._portalOutlet.attachDomPortal(portal);
    this._contentAttached();
    return result;
  };
  // TODO(crisbeto): this shouldn't be exposed, but there are internal references to it.
  /** Captures focus if it isn't already inside the dialog. */
  _recaptureFocus() {
    if (!this._containsFocus()) {
      this._trapFocus();
    }
  }
  /**
   * Focuses the provided element. If the element is not focusable, it will add a tabIndex
   * attribute to forcefully focus it. The attribute is removed after focus is moved.
   * @param element The element to focus.
   */
  _forceFocus(element, options) {
    if (!this._interactivityChecker.isFocusable(element)) {
      element.tabIndex = -1;
      this._ngZone.runOutsideAngular(() => {
        const callback = () => {
          deregisterBlur();
          deregisterMousedown();
          element.removeAttribute("tabindex");
        };
        const deregisterBlur = this._renderer.listen(element, "blur", callback);
        const deregisterMousedown = this._renderer.listen(element, "mousedown", callback);
      });
    }
    element.focus(options);
  }
  /**
   * Focuses the first element that matches the given selector within the focus trap.
   * @param selector The CSS selector for the element to set focus to.
   */
  _focusByCssSelector(selector, options) {
    let elementToFocus = this._elementRef.nativeElement.querySelector(selector);
    if (elementToFocus) {
      this._forceFocus(elementToFocus, options);
    }
  }
  /**
   * Moves the focus inside the focus trap. When autoFocus is not set to 'dialog', if focus
   * cannot be moved then focus will go to the dialog container.
   */
  _trapFocus() {
    if (this._isDestroyed) {
      return;
    }
    afterNextRender(() => {
      const element = this._elementRef.nativeElement;
      switch (this._config.autoFocus) {
        case false:
        case "dialog":
          if (!this._containsFocus()) {
            element.focus();
          }
          break;
        case true:
        case "first-tabbable":
          const focusedSuccessfully = this._focusTrap?.focusInitialElement();
          if (!focusedSuccessfully) {
            this._focusDialogContainer();
          }
          break;
        case "first-heading":
          this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
          break;
        default:
          this._focusByCssSelector(this._config.autoFocus);
          break;
      }
    }, {
      injector: this._injector
    });
  }
  /** Restores focus to the element that was focused before the dialog opened. */
  _restoreFocus() {
    const focusConfig = this._config.restoreFocus;
    let focusTargetElement = null;
    if (typeof focusConfig === "string") {
      focusTargetElement = this._document.querySelector(focusConfig);
    } else if (typeof focusConfig === "boolean") {
      focusTargetElement = focusConfig ? this._elementFocusedBeforeDialogWasOpened : null;
    } else if (focusConfig) {
      focusTargetElement = focusConfig;
    }
    if (this._config.restoreFocus && focusTargetElement && typeof focusTargetElement.focus === "function") {
      const activeElement = _getFocusedElementPierceShadowDom();
      const element = this._elementRef.nativeElement;
      if (!activeElement || activeElement === this._document.body || activeElement === element || element.contains(activeElement)) {
        if (this._focusMonitor) {
          this._focusMonitor.focusVia(focusTargetElement, this._closeInteractionType);
          this._closeInteractionType = null;
        } else {
          focusTargetElement.focus();
        }
      }
    }
    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }
  /** Focuses the dialog container. */
  _focusDialogContainer() {
    if (this._elementRef.nativeElement.focus) {
      this._elementRef.nativeElement.focus();
    }
  }
  /** Returns whether focus is inside the dialog. */
  _containsFocus() {
    const element = this._elementRef.nativeElement;
    const activeElement = _getFocusedElementPierceShadowDom();
    return element === activeElement || element.contains(activeElement);
  }
  /** Sets up the focus trap. */
  _initializeFocusTrap() {
    if (this._platform.isBrowser) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
      if (this._document) {
        this._elementFocusedBeforeDialogWasOpened = _getFocusedElementPierceShadowDom();
      }
    }
  }
  /** Sets up the listener that handles clicks on the dialog backdrop. */
  _handleBackdropClicks() {
    this._overlayRef.backdropClick().subscribe(() => {
      if (this._config.disableClose) {
        this._recaptureFocus();
      }
    });
  }
  static ɵfac = function CdkDialogContainer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkDialogContainer)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _CdkDialogContainer,
    selectors: [["cdk-dialog-container"]],
    viewQuery: function CdkDialogContainer_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(CdkPortalOutlet, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._portalOutlet = _t.first);
      }
    },
    hostAttrs: ["tabindex", "-1", 1, "cdk-dialog-container"],
    hostVars: 6,
    hostBindings: function CdkDialogContainer_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("id", ctx._config.id || null)("role", ctx._config.role)("aria-modal", ctx._config.ariaModal)("aria-labelledby", ctx._config.ariaLabel ? null : ctx._ariaLabelledByQueue[0])("aria-label", ctx._config.ariaLabel)("aria-describedby", ctx._config.ariaDescribedBy || null);
      }
    },
    features: [ɵɵInheritDefinitionFeature],
    decls: 1,
    vars: 0,
    consts: [["cdkPortalOutlet", ""]],
    template: function CdkDialogContainer_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, CdkDialogContainer_ng_template_0_Template, 0, 0, "ng-template", 0);
      }
    },
    dependencies: [CdkPortalOutlet],
    styles: [".cdk-dialog-container{display:block;width:100%;height:100%;min-height:inherit;max-height:inherit}"],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkDialogContainer, [{
    type: Component,
    args: [{
      selector: "cdk-dialog-container",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.Default,
      imports: [CdkPortalOutlet],
      host: {
        "class": "cdk-dialog-container",
        "tabindex": "-1",
        "[attr.id]": "_config.id || null",
        "[attr.role]": "_config.role",
        "[attr.aria-modal]": "_config.ariaModal",
        "[attr.aria-labelledby]": "_config.ariaLabel ? null : _ariaLabelledByQueue[0]",
        "[attr.aria-label]": "_config.ariaLabel",
        "[attr.aria-describedby]": "_config.ariaDescribedBy || null"
      },
      template: "<ng-template cdkPortalOutlet />\n",
      styles: [".cdk-dialog-container{display:block;width:100%;height:100%;min-height:inherit;max-height:inherit}"]
    }]
  }], () => [], {
    _portalOutlet: [{
      type: ViewChild,
      args: [CdkPortalOutlet, {
        static: true
      }]
    }]
  });
})();
var DialogRef = class {
  overlayRef;
  config;
  /**
   * Instance of component opened into the dialog. Will be
   * null when the dialog is opened using a `TemplateRef`.
   */
  componentInstance;
  /**
   * `ComponentRef` of the component opened into the dialog. Will be
   * null when the dialog is opened using a `TemplateRef`.
   */
  componentRef;
  /** Instance of the container that is rendering out the dialog content. */
  containerInstance;
  /** Whether the user is allowed to close the dialog. */
  disableClose;
  /** Emits when the dialog has been closed. */
  closed = new Subject();
  /** Emits when the backdrop of the dialog is clicked. */
  backdropClick;
  /** Emits when on keyboard events within the dialog. */
  keydownEvents;
  /** Emits on pointer events that happen outside of the dialog. */
  outsidePointerEvents;
  /** Unique ID for the dialog. */
  id;
  /** Subscription to external detachments of the dialog. */
  _detachSubscription;
  constructor(overlayRef, config) {
    this.overlayRef = overlayRef;
    this.config = config;
    this.disableClose = config.disableClose;
    this.backdropClick = overlayRef.backdropClick();
    this.keydownEvents = overlayRef.keydownEvents();
    this.outsidePointerEvents = overlayRef.outsidePointerEvents();
    this.id = config.id;
    this.keydownEvents.subscribe((event) => {
      if (event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)) {
        event.preventDefault();
        this.close(void 0, {
          focusOrigin: "keyboard"
        });
      }
    });
    this.backdropClick.subscribe(() => {
      if (!this.disableClose) {
        this.close(void 0, {
          focusOrigin: "mouse"
        });
      }
    });
    this._detachSubscription = overlayRef.detachments().subscribe(() => {
      if (config.closeOnOverlayDetachments !== false) {
        this.close();
      }
    });
  }
  /**
   * Close the dialog.
   * @param result Optional result to return to the dialog opener.
   * @param options Additional options to customize the closing behavior.
   */
  close(result, options) {
    if (this.containerInstance) {
      const closedSubject = this.closed;
      this.containerInstance._closeInteractionType = options?.focusOrigin || "program";
      this._detachSubscription.unsubscribe();
      this.overlayRef.dispose();
      closedSubject.next(result);
      closedSubject.complete();
      this.componentInstance = this.containerInstance = null;
    }
  }
  /** Updates the position of the dialog based on the current position strategy. */
  updatePosition() {
    this.overlayRef.updatePosition();
    return this;
  }
  /**
   * Updates the dialog's width and height.
   * @param width New width of the dialog.
   * @param height New height of the dialog.
   */
  updateSize(width = "", height = "") {
    this.overlayRef.updateSize({
      width,
      height
    });
    return this;
  }
  /** Add a CSS class or an array of classes to the overlay pane. */
  addPanelClass(classes) {
    this.overlayRef.addPanelClass(classes);
    return this;
  }
  /** Remove a CSS class or an array of classes from the overlay pane. */
  removePanelClass(classes) {
    this.overlayRef.removePanelClass(classes);
    return this;
  }
};
var DIALOG_SCROLL_STRATEGY = new InjectionToken("DialogScrollStrategy", {
  providedIn: "root",
  factory: () => {
    const overlay = inject(Overlay);
    return () => overlay.scrollStrategies.block();
  }
});
var DIALOG_DATA = new InjectionToken("DialogData");
var DEFAULT_DIALOG_CONFIG = new InjectionToken("DefaultDialogConfig");
var Dialog = class _Dialog {
  _overlay = inject(Overlay);
  _injector = inject(Injector);
  _defaultOptions = inject(DEFAULT_DIALOG_CONFIG, {
    optional: true
  });
  _parentDialog = inject(_Dialog, {
    optional: true,
    skipSelf: true
  });
  _overlayContainer = inject(OverlayContainer);
  _idGenerator = inject(_IdGenerator);
  _openDialogsAtThisLevel = [];
  _afterAllClosedAtThisLevel = new Subject();
  _afterOpenedAtThisLevel = new Subject();
  _ariaHiddenElements = /* @__PURE__ */ new Map();
  _scrollStrategy = inject(DIALOG_SCROLL_STRATEGY);
  /** Keeps track of the currently-open dialogs. */
  get openDialogs() {
    return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
  }
  /** Stream that emits when a dialog has been opened. */
  get afterOpened() {
    return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
  }
  /**
   * Stream that emits when all open dialog have finished closing.
   * Will emit on subscribe if there are no open dialogs to begin with.
   */
  afterAllClosed = defer(() => this.openDialogs.length ? this._getAfterAllClosed() : this._getAfterAllClosed().pipe(startWith(void 0)));
  constructor() {
  }
  open(componentOrTemplateRef, config) {
    const defaults = this._defaultOptions || new DialogConfig();
    config = __spreadValues(__spreadValues({}, defaults), config);
    config.id = config.id || this._idGenerator.getId("cdk-dialog-");
    if (config.id && this.getDialogById(config.id) && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
    }
    const overlayConfig = this._getOverlayConfig(config);
    const overlayRef = this._overlay.create(overlayConfig);
    const dialogRef = new DialogRef(overlayRef, config);
    const dialogContainer = this._attachContainer(overlayRef, dialogRef, config);
    dialogRef.containerInstance = dialogContainer;
    this._attachDialogContent(componentOrTemplateRef, dialogRef, dialogContainer, config);
    if (!this.openDialogs.length) {
      this._hideNonDialogContentFromAssistiveTechnology();
    }
    this.openDialogs.push(dialogRef);
    dialogRef.closed.subscribe(() => this._removeOpenDialog(dialogRef, true));
    this.afterOpened.next(dialogRef);
    return dialogRef;
  }
  /**
   * Closes all of the currently-open dialogs.
   */
  closeAll() {
    reverseForEach(this.openDialogs, (dialog) => dialog.close());
  }
  /**
   * Finds an open dialog by its id.
   * @param id ID to use when looking up the dialog.
   */
  getDialogById(id) {
    return this.openDialogs.find((dialog) => dialog.id === id);
  }
  ngOnDestroy() {
    reverseForEach(this._openDialogsAtThisLevel, (dialog) => {
      if (dialog.config.closeOnDestroy === false) {
        this._removeOpenDialog(dialog, false);
      }
    });
    reverseForEach(this._openDialogsAtThisLevel, (dialog) => dialog.close());
    this._afterAllClosedAtThisLevel.complete();
    this._afterOpenedAtThisLevel.complete();
    this._openDialogsAtThisLevel = [];
  }
  /**
   * Creates an overlay config from a dialog config.
   * @param config The dialog configuration.
   * @returns The overlay configuration.
   */
  _getOverlayConfig(config) {
    const state = new OverlayConfig({
      positionStrategy: config.positionStrategy || this._overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: config.scrollStrategy || this._scrollStrategy(),
      panelClass: config.panelClass,
      hasBackdrop: config.hasBackdrop,
      direction: config.direction,
      minWidth: config.minWidth,
      minHeight: config.minHeight,
      maxWidth: config.maxWidth,
      maxHeight: config.maxHeight,
      width: config.width,
      height: config.height,
      disposeOnNavigation: config.closeOnNavigation
    });
    if (config.backdropClass) {
      state.backdropClass = config.backdropClass;
    }
    return state;
  }
  /**
   * Attaches a dialog container to a dialog's already-created overlay.
   * @param overlay Reference to the dialog's underlying overlay.
   * @param config The dialog configuration.
   * @returns A promise resolving to a ComponentRef for the attached container.
   */
  _attachContainer(overlay, dialogRef, config) {
    const userInjector = config.injector || config.viewContainerRef?.injector;
    const providers = [{
      provide: DialogConfig,
      useValue: config
    }, {
      provide: DialogRef,
      useValue: dialogRef
    }, {
      provide: OverlayRef,
      useValue: overlay
    }];
    let containerType;
    if (config.container) {
      if (typeof config.container === "function") {
        containerType = config.container;
      } else {
        containerType = config.container.type;
        providers.push(...config.container.providers(config));
      }
    } else {
      containerType = CdkDialogContainer;
    }
    const containerPortal = new ComponentPortal(containerType, config.viewContainerRef, Injector.create({
      parent: userInjector || this._injector,
      providers
    }));
    const containerRef = overlay.attach(containerPortal);
    return containerRef.instance;
  }
  /**
   * Attaches the user-provided component to the already-created dialog container.
   * @param componentOrTemplateRef The type of component being loaded into the dialog,
   *     or a TemplateRef to instantiate as the content.
   * @param dialogRef Reference to the dialog being opened.
   * @param dialogContainer Component that is going to wrap the dialog content.
   * @param config Configuration used to open the dialog.
   */
  _attachDialogContent(componentOrTemplateRef, dialogRef, dialogContainer, config) {
    if (componentOrTemplateRef instanceof TemplateRef) {
      const injector = this._createInjector(config, dialogRef, dialogContainer, void 0);
      let context = {
        $implicit: config.data,
        dialogRef
      };
      if (config.templateContext) {
        context = __spreadValues(__spreadValues({}, context), typeof config.templateContext === "function" ? config.templateContext() : config.templateContext);
      }
      dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, context, injector));
    } else {
      const injector = this._createInjector(config, dialogRef, dialogContainer, this._injector);
      const contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector));
      dialogRef.componentRef = contentRef;
      dialogRef.componentInstance = contentRef.instance;
    }
  }
  /**
   * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
   * of a dialog to close itself and, optionally, to return a value.
   * @param config Config object that is used to construct the dialog.
   * @param dialogRef Reference to the dialog being opened.
   * @param dialogContainer Component that is going to wrap the dialog content.
   * @param fallbackInjector Injector to use as a fallback when a lookup fails in the custom
   * dialog injector, if the user didn't provide a custom one.
   * @returns The custom injector that can be used inside the dialog.
   */
  _createInjector(config, dialogRef, dialogContainer, fallbackInjector) {
    const userInjector = config.injector || config.viewContainerRef?.injector;
    const providers = [{
      provide: DIALOG_DATA,
      useValue: config.data
    }, {
      provide: DialogRef,
      useValue: dialogRef
    }];
    if (config.providers) {
      if (typeof config.providers === "function") {
        providers.push(...config.providers(dialogRef, config, dialogContainer));
      } else {
        providers.push(...config.providers);
      }
    }
    if (config.direction && (!userInjector || !userInjector.get(Directionality, null, {
      optional: true
    }))) {
      providers.push({
        provide: Directionality,
        useValue: {
          value: config.direction,
          change: of()
        }
      });
    }
    return Injector.create({
      parent: userInjector || fallbackInjector,
      providers
    });
  }
  /**
   * Removes a dialog from the array of open dialogs.
   * @param dialogRef Dialog to be removed.
   * @param emitEvent Whether to emit an event if this is the last dialog.
   */
  _removeOpenDialog(dialogRef, emitEvent) {
    const index = this.openDialogs.indexOf(dialogRef);
    if (index > -1) {
      this.openDialogs.splice(index, 1);
      if (!this.openDialogs.length) {
        this._ariaHiddenElements.forEach((previousValue, element) => {
          if (previousValue) {
            element.setAttribute("aria-hidden", previousValue);
          } else {
            element.removeAttribute("aria-hidden");
          }
        });
        this._ariaHiddenElements.clear();
        if (emitEvent) {
          this._getAfterAllClosed().next();
        }
      }
    }
  }
  /** Hides all of the content that isn't an overlay from assistive technology. */
  _hideNonDialogContentFromAssistiveTechnology() {
    const overlayContainer = this._overlayContainer.getContainerElement();
    if (overlayContainer.parentElement) {
      const siblings = overlayContainer.parentElement.children;
      for (let i = siblings.length - 1; i > -1; i--) {
        const sibling = siblings[i];
        if (sibling !== overlayContainer && sibling.nodeName !== "SCRIPT" && sibling.nodeName !== "STYLE" && !sibling.hasAttribute("aria-live")) {
          this._ariaHiddenElements.set(sibling, sibling.getAttribute("aria-hidden"));
          sibling.setAttribute("aria-hidden", "true");
        }
      }
    }
  }
  _getAfterAllClosed() {
    const parent = this._parentDialog;
    return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
  }
  static ɵfac = function Dialog_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Dialog)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _Dialog,
    factory: _Dialog.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Dialog, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function reverseForEach(items, callback) {
  let i = items.length;
  while (i--) {
    callback(items[i]);
  }
}
var DialogModule = class _DialogModule {
  static ɵfac = function DialogModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DialogModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _DialogModule,
    imports: [OverlayModule, PortalModule, A11yModule, CdkDialogContainer],
    exports: [
      // Re-export the PortalModule so that people extending the `CdkDialogContainer`
      // don't have to remember to import it or be faced with an unhelpful error.
      PortalModule,
      CdkDialogContainer
    ]
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [Dialog],
    imports: [
      OverlayModule,
      PortalModule,
      A11yModule,
      // Re-export the PortalModule so that people extending the `CdkDialogContainer`
      // don't have to remember to import it or be faced with an unhelpful error.
      PortalModule
    ]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DialogModule, [{
    type: NgModule,
    args: [{
      imports: [OverlayModule, PortalModule, A11yModule, CdkDialogContainer],
      exports: [
        // Re-export the PortalModule so that people extending the `CdkDialogContainer`
        // don't have to remember to import it or be faced with an unhelpful error.
        PortalModule,
        CdkDialogContainer
      ],
      providers: [Dialog]
    }]
  }], null, null);
})();

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-dialog.mjs
var _c0 = ["*"];
var cssClassesToArray = (classes, defaultClass = "") => {
  if (typeof classes === "string") {
    const splitClasses = classes.trim().split(" ");
    if (splitClasses.length === 0) {
      return [defaultClass];
    }
    return splitClasses;
  }
  return classes ?? [];
};
var BrnDialogRef = class {
  _cdkDialogRef;
  _open;
  state;
  dialogId;
  _options;
  _closing$ = new Subject();
  closing$ = this._closing$.asObservable();
  closed$;
  _previousTimeout;
  get open() {
    return this.state() === "open";
  }
  constructor(_cdkDialogRef, _open, state, dialogId, _options) {
    this._cdkDialogRef = _cdkDialogRef;
    this._open = _open;
    this.state = state;
    this.dialogId = dialogId;
    this._options = _options;
    this.closed$ = this._cdkDialogRef.closed.pipe(take(1));
  }
  close(result, delay = this._options?.closeDelay ?? 0) {
    if (!this.open || this._options?.disableClose) return;
    this._closing$.next();
    this._open.set(false);
    if (this._previousTimeout) {
      clearTimeout(this._previousTimeout);
    }
    this._previousTimeout = setTimeout(() => {
      this._cdkDialogRef.close(result);
    }, delay);
  }
  setPanelClass(paneClass) {
    this._cdkDialogRef.config.panelClass = cssClassesToArray(paneClass);
  }
  setOverlayClass(overlayClass) {
    this._cdkDialogRef.config.backdropClass = cssClassesToArray(overlayClass);
  }
  setAriaDescribedBy(ariaDescribedBy) {
    this._cdkDialogRef.config.ariaDescribedBy = ariaDescribedBy;
  }
  setAriaLabelledBy(ariaLabelledBy) {
    this._cdkDialogRef.config.ariaLabelledBy = ariaLabelledBy;
  }
  setAriaLabel(ariaLabel) {
    this._cdkDialogRef.config.ariaLabel = ariaLabel;
  }
};
var BrnDialogCloseDirective = class _BrnDialogCloseDirective {
  _brnDialogRef = inject(BrnDialogRef);
  delay = input(void 0, {
    transform: coerceNumberProperty
  });
  close() {
    this._brnDialogRef.close(void 0, this.delay());
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogCloseDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogCloseDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialogCloseDirective,
    selectors: [["button", "brnDialogClose", ""]],
    hostBindings: function BrnDialogCloseDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function BrnDialogCloseDirective_click_HostBindingHandler() {
          return ctx.close();
        });
      }
    },
    inputs: {
      delay: [1, "delay"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogCloseDirective, [{
    type: Directive,
    args: [{
      selector: "button[brnDialogClose]",
      standalone: true,
      host: {
        "(click)": "close()"
      }
    }]
  }], null, null);
})();
var defaultOptions = {
  attachPositions: [],
  autoFocus: "first-tabbable",
  closeDelay: 100,
  closeOnBackdropClick: true,
  closeOnOutsidePointerEvents: false,
  disableClose: false,
  hasBackdrop: true,
  positionStrategy: null,
  restoreFocus: true,
  role: "dialog",
  scrollStrategy: null
};
var BRN_DIALOG_DEFAULT_OPTIONS = new InjectionToken("brn-dialog-default-options", {
  providedIn: "root",
  factory: () => defaultOptions
});
function provideBrnDialogDefaultOptions(options) {
  return {
    provide: BRN_DIALOG_DEFAULT_OPTIONS,
    useValue: __spreadValues(__spreadValues({}, defaultOptions), options)
  };
}
function injectBrnDialogDefaultOptions() {
  return inject(BRN_DIALOG_DEFAULT_OPTIONS, {
    optional: true
  }) ?? defaultOptions;
}
var dialogSequence = 0;
var injectBrnDialogCtx = () => {
  return inject(DIALOG_DATA);
};
var injectBrnDialogContext = (options = {}) => {
  return inject(DIALOG_DATA, options);
};
var BrnDialogService = class _BrnDialogService {
  _cdkDialog = inject(Dialog);
  _rendererFactory = inject(RendererFactory2);
  _renderer = this._rendererFactory.createRenderer(null, null);
  _positionBuilder = inject(OverlayPositionBuilder);
  _sso = inject(ScrollStrategyOptions);
  _injector = inject(Injector);
  open(content, vcr, context, options) {
    if (options?.id && this._cdkDialog.getDialogById(options.id)) {
      throw new Error(`Dialog with ID: ${options.id} already exists`);
    }
    const positionStrategy = options?.positionStrategy ?? (options?.attachTo && options?.attachPositions && options?.attachPositions?.length > 0 ? this._positionBuilder?.flexibleConnectedTo(options.attachTo).withPositions(options.attachPositions ?? []) : this._positionBuilder.global().centerHorizontally().centerVertically());
    let brnDialogRef;
    let effectRef;
    const contextOrData = __spreadProps(__spreadValues({}, context), {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      close: (result = void 0) => brnDialogRef.close(result, options?.closeDelay)
    });
    const destroyed$ = new Subject();
    const open = signal(true);
    const state = computed(() => open() ? "open" : "closed");
    const dialogId = dialogSequence++;
    const cdkDialogRef = this._cdkDialog.open(content, {
      id: options?.id ?? `brn-dialog-${dialogId}`,
      role: options?.role,
      viewContainerRef: vcr,
      templateContext: () => ({
        $implicit: contextOrData
      }),
      data: contextOrData,
      hasBackdrop: options?.hasBackdrop,
      panelClass: cssClassesToArray(options?.panelClass),
      backdropClass: cssClassesToArray(options?.backdropClass, "bg-transparent"),
      positionStrategy,
      scrollStrategy: options?.scrollStrategy ?? this._sso?.block(),
      restoreFocus: options?.restoreFocus,
      disableClose: true,
      autoFocus: options?.autoFocus ?? "first-tabbable",
      ariaDescribedBy: options?.ariaDescribedBy ?? `brn-dialog-description-${dialogId}`,
      ariaLabelledBy: options?.ariaLabelledBy ?? `brn-dialog-title-${dialogId}`,
      ariaLabel: options?.ariaLabel,
      ariaModal: options?.ariaModal,
      providers: (cdkDialogRef2) => {
        brnDialogRef = new BrnDialogRef(cdkDialogRef2, open, state, dialogId, options);
        runInInjectionContext(this._injector, () => {
          effectRef = effect(() => {
            if (overlay) {
              this._renderer.setAttribute(overlay, "data-state", state());
            }
            if (backdrop) {
              this._renderer.setAttribute(backdrop, "data-state", state());
            }
          });
        });
        const providers = [{
          provide: BrnDialogRef,
          useValue: brnDialogRef
        }];
        if (options?.providers) {
          if (typeof options.providers === "function") {
            providers.push(...options.providers());
          }
          if (Array.isArray(options.providers)) {
            providers.push(...options.providers);
          }
        }
        return providers;
      }
    });
    const overlay = cdkDialogRef.overlayRef.overlayElement;
    const backdrop = cdkDialogRef.overlayRef.backdropElement;
    if (options?.closeOnOutsidePointerEvents) {
      cdkDialogRef.outsidePointerEvents.pipe(takeUntil(destroyed$)).subscribe(() => {
        brnDialogRef.close(void 0, options?.closeDelay);
      });
    }
    if (options?.closeOnBackdropClick) {
      cdkDialogRef.backdropClick.pipe(takeUntil(destroyed$)).subscribe(() => {
        brnDialogRef.close(void 0, options?.closeDelay);
      });
    }
    if (!options?.disableClose) {
      cdkDialogRef.keydownEvents.pipe(filter((e) => e.key === "Escape"), takeUntil(destroyed$)).subscribe(() => {
        brnDialogRef.close(void 0, options?.closeDelay);
      });
    }
    cdkDialogRef.closed.pipe(takeUntil(destroyed$)).subscribe(() => {
      effectRef?.destroy();
      destroyed$.next();
    });
    return brnDialogRef;
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogService)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _BrnDialogService,
    factory: _BrnDialogService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var BrnDialogComponent = class _BrnDialogComponent {
  _dialogService = inject(BrnDialogService);
  _vcr = inject(ViewContainerRef);
  positionBuilder = inject(OverlayPositionBuilder);
  ssos = inject(ScrollStrategyOptions);
  _injector = inject(Injector);
  _defaultOptions = injectBrnDialogDefaultOptions();
  _context = {};
  stateComputed = computed(() => this._dialogRef()?.state() ?? "closed");
  _contentTemplate;
  _dialogRef = signal(void 0);
  _dialogStateEffectRef;
  _backdropClass = signal(null);
  _panelClass = signal(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closed = output();
  stateChanged = output();
  state = input(null);
  role = input(this._defaultOptions.role);
  hasBackdrop = input(this._defaultOptions.hasBackdrop, {
    transform: booleanAttribute
  });
  positionStrategy = input(this._defaultOptions.positionStrategy);
  mutablePositionStrategy = computed(() => signal(this.positionStrategy()));
  _positionStrategyState = computed(() => this.mutablePositionStrategy()());
  scrollStrategy = input(this._defaultOptions.scrollStrategy);
  _options = computed(() => {
    const scrollStrategyInput = this.scrollStrategy();
    let scrollStrategy;
    if (scrollStrategyInput === "close") {
      scrollStrategy = this.ssos.close();
    } else if (scrollStrategyInput === "reposition") {
      scrollStrategy = this.ssos.reposition();
    } else {
      scrollStrategy = scrollStrategyInput;
    }
    return {
      role: this.role(),
      hasBackdrop: this.hasBackdrop(),
      positionStrategy: this._positionStrategyState(),
      scrollStrategy,
      restoreFocus: this.restoreFocus(),
      closeOnOutsidePointerEvents: this._closeOnOutsidePointerEventsState(),
      closeOnBackdropClick: this.closeOnBackdropClick(),
      attachTo: this._attachToState(),
      attachPositions: this._attachPositionsState(),
      autoFocus: this.autoFocus(),
      closeDelay: this.closeDelay(),
      disableClose: this.disableClose(),
      backdropClass: this._backdropClass() ?? "",
      panelClass: this._panelClass() ?? "",
      ariaDescribedBy: this._ariaDescribedByState(),
      ariaLabelledBy: this._ariaLabelledByState(),
      ariaLabel: this._ariaLabelState(),
      ariaModal: this._ariaModalState()
    };
  });
  constructor() {
    effect(() => {
      const state = this.state();
      if (state === "open") {
        untracked(() => this.open());
      }
      if (state === "closed") {
        untracked(() => this.close(this._options().closeDelay));
      }
    });
  }
  restoreFocus = input(this._defaultOptions.restoreFocus);
  closeOnOutsidePointerEvents = input(this._defaultOptions.closeOnOutsidePointerEvents, {
    transform: booleanAttribute
  });
  mutableCloseOnOutsidePointerEvents = computed(() => signal(this.closeOnOutsidePointerEvents()));
  _closeOnOutsidePointerEventsState = computed(() => this.mutableCloseOnOutsidePointerEvents()());
  closeOnBackdropClick = input(this._defaultOptions.closeOnBackdropClick, {
    transform: booleanAttribute
  });
  attachTo = input(null);
  mutableAttachTo = computed(() => signal(this.attachTo()));
  _attachToState = computed(() => this.mutableAttachTo()());
  attachPositions = input(this._defaultOptions.attachPositions);
  mutableAttachPositions = computed(() => signal(this.attachPositions()));
  _attachPositionsState = computed(() => this.mutableAttachPositions()());
  autoFocus = input(this._defaultOptions.autoFocus);
  closeDelay = input(this._defaultOptions.closeDelay, {
    transform: numberAttribute
  });
  disableClose = input(this._defaultOptions.disableClose, {
    transform: booleanAttribute
  });
  ariaDescribedBy = input(null, {
    alias: "aria-describedby"
  });
  _mutableAriaDescribedBy = computed(() => signal(this.ariaDescribedBy()));
  _ariaDescribedByState = computed(() => this._mutableAriaDescribedBy()());
  ariaLabelledBy = input(null, {
    alias: "aria-labelledby"
  });
  _mutableAriaLabelledBy = computed(() => signal(this.ariaLabelledBy()));
  _ariaLabelledByState = computed(() => this._mutableAriaLabelledBy()());
  ariaLabel = input(null, {
    alias: "aria-label"
  });
  _mutableAriaLabel = computed(() => signal(this.ariaLabel()));
  _ariaLabelState = computed(() => this._mutableAriaLabel()());
  ariaModal = input(true, {
    alias: "aria-modal",
    transform: booleanAttribute
  });
  _mutableAriaModal = computed(() => signal(this.ariaModal()));
  _ariaModalState = computed(() => this._mutableAriaModal()());
  open() {
    if (!this._contentTemplate || this._dialogRef()) return;
    this._dialogStateEffectRef?.destroy();
    const dialogRef = this._dialogService.open(this._contentTemplate, this._vcr, this._context, this._options());
    this._dialogRef.set(dialogRef);
    runInInjectionContext(this._injector, () => {
      this._dialogStateEffectRef = effect(() => {
        const state = dialogRef.state();
        untracked(() => this.stateChanged.emit(state));
      });
    });
    dialogRef.closed$.pipe(take(1)).subscribe((result) => {
      this._dialogRef.set(void 0);
      this.closed.emit(result);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  close(result, delay) {
    this._dialogRef()?.close(result, delay ?? this._options().closeDelay);
  }
  registerTemplate(template) {
    this._contentTemplate = template;
  }
  setOverlayClass(overlayClass) {
    this._backdropClass.set(overlayClass);
    this._dialogRef()?.setOverlayClass(overlayClass);
  }
  setPanelClass(panelClass) {
    this._panelClass.set(panelClass ?? "");
    this._dialogRef()?.setPanelClass(panelClass);
  }
  setContext(context) {
    this._context = __spreadValues(__spreadValues({}, this._context), context);
  }
  setAriaDescribedBy(ariaDescribedBy) {
    this._mutableAriaDescribedBy().set(ariaDescribedBy);
    this._dialogRef()?.setAriaDescribedBy(ariaDescribedBy);
  }
  setAriaLabelledBy(ariaLabelledBy) {
    this._mutableAriaLabelledBy().set(ariaLabelledBy);
    this._dialogRef()?.setAriaLabelledBy(ariaLabelledBy);
  }
  setAriaLabel(ariaLabel) {
    this._mutableAriaLabel().set(ariaLabel);
    this._dialogRef()?.setAriaLabel(ariaLabel);
  }
  setAriaModal(ariaModal) {
    this._mutableAriaModal().set(ariaModal);
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnDialogComponent,
    selectors: [["brn-dialog"]],
    inputs: {
      state: [1, "state"],
      role: [1, "role"],
      hasBackdrop: [1, "hasBackdrop"],
      positionStrategy: [1, "positionStrategy"],
      scrollStrategy: [1, "scrollStrategy"],
      restoreFocus: [1, "restoreFocus"],
      closeOnOutsidePointerEvents: [1, "closeOnOutsidePointerEvents"],
      closeOnBackdropClick: [1, "closeOnBackdropClick"],
      attachTo: [1, "attachTo"],
      attachPositions: [1, "attachPositions"],
      autoFocus: [1, "autoFocus"],
      closeDelay: [1, "closeDelay"],
      disableClose: [1, "disableClose"],
      ariaDescribedBy: [1, "aria-describedby", "ariaDescribedBy"],
      ariaLabelledBy: [1, "aria-labelledby", "ariaLabelledBy"],
      ariaLabel: [1, "aria-label", "ariaLabel"],
      ariaModal: [1, "aria-modal", "ariaModal"]
    },
    outputs: {
      closed: "closed",
      stateChanged: "stateChanged"
    },
    exportAs: ["brnDialog"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function BrnDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogComponent, [{
    type: Component,
    args: [{
      selector: "brn-dialog",
      standalone: true,
      template: `
		<ng-content />
	`,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      exportAs: "brnDialog"
    }]
  }], () => [], null);
})();
var BrnDialogContentDirective = class _BrnDialogContentDirective {
  _brnDialog = inject(BrnDialogComponent, {
    optional: true
  });
  _brnDialogRef = inject(BrnDialogRef, {
    optional: true
  });
  _template = inject(TemplateRef);
  state = computed(() => this._brnDialog?.stateComputed() ?? this._brnDialogRef?.state() ?? "closed");
  className = input(void 0, {
    alias: "class"
  });
  context = input(void 0);
  constructor() {
    if (!this._brnDialog) return;
    this._brnDialog.registerTemplate(this._template);
    effect(() => {
      const context = this.context();
      if (!this._brnDialog || !context) return;
      untracked(() => this._brnDialog?.setContext(context));
    });
    effect(() => {
      if (!this._brnDialog) return;
      const newClass = this.className();
      untracked(() => this._brnDialog?.setPanelClass(newClass));
    });
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogContentDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogContentDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialogContentDirective,
    selectors: [["", "brnDialogContent", ""]],
    inputs: {
      className: [1, "class", "className"],
      context: [1, "context"]
    },
    features: [ɵɵProvidersFeature([provideExposesStateProviderExisting(() => _BrnDialogContentDirective)])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogContentDirective, [{
    type: Directive,
    args: [{
      selector: "[brnDialogContent]",
      standalone: true,
      providers: [provideExposesStateProviderExisting(() => BrnDialogContentDirective)]
    }]
  }], () => [], null);
})();
var BrnDialogDescriptionDirective = class _BrnDialogDescriptionDirective {
  _brnDialogRef = inject(BrnDialogRef);
  _id = signal(`brn-dialog-description-${this._brnDialogRef?.dialogId}`);
  constructor() {
    effect(() => {
      this._brnDialogRef.setAriaDescribedBy(this._id());
    });
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogDescriptionDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogDescriptionDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialogDescriptionDirective,
    selectors: [["", "brnDialogDescription", ""]],
    hostVars: 1,
    hostBindings: function BrnDialogDescriptionDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵhostProperty("id", ctx._id());
      }
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogDescriptionDirective, [{
    type: Directive,
    args: [{
      selector: "[brnDialogDescription]",
      standalone: true,
      host: {
        "[id]": "_id()"
      }
    }]
  }], () => [], null);
})();
var BrnDialogOverlayComponent = class _BrnDialogOverlayComponent {
  _brnDialog = inject(BrnDialogComponent);
  className = input(void 0, {
    alias: "class"
  });
  setClassToCustomElement(newClass) {
    this._brnDialog.setOverlayClass(newClass);
  }
  constructor() {
    effect(() => {
      if (!this._brnDialog) return;
      const newClass = this.className();
      untracked(() => this._brnDialog.setOverlayClass(newClass));
    });
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogOverlayComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogOverlayComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnDialogOverlayComponent,
    selectors: [["brn-dialog-overlay"]],
    inputs: {
      className: [1, "class", "className"]
    },
    features: [ɵɵProvidersFeature([provideCustomClassSettableExisting(() => _BrnDialogOverlayComponent)])],
    decls: 0,
    vars: 0,
    template: function BrnDialogOverlayComponent_Template(rf, ctx) {
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogOverlayComponent, [{
    type: Component,
    args: [{
      selector: "brn-dialog-overlay",
      standalone: true,
      template: "",
      providers: [provideCustomClassSettableExisting(() => BrnDialogOverlayComponent)],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None
    }]
  }], () => [], null);
})();
var BrnDialogTitleDirective = class _BrnDialogTitleDirective {
  _brnDialogRef = inject(BrnDialogRef);
  _id = signal(`brn-dialog-title-${this._brnDialogRef?.dialogId}`);
  constructor() {
    effect(() => {
      this._brnDialogRef.setAriaLabelledBy(this._id());
    });
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogTitleDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogTitleDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialogTitleDirective,
    selectors: [["", "brnDialogTitle", ""]],
    hostVars: 1,
    hostBindings: function BrnDialogTitleDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵhostProperty("id", ctx._id());
      }
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogTitleDirective, [{
    type: Directive,
    args: [{
      selector: "[brnDialogTitle]",
      standalone: true,
      host: {
        "[id]": "_id()"
      }
    }]
  }], () => [], null);
})();
var idSequence = 0;
var BrnDialogTriggerDirective = class _BrnDialogTriggerDirective {
  _brnDialog = inject(BrnDialogComponent, {
    optional: true
  });
  _brnDialogRef = inject(BrnDialogRef, {
    optional: true
  });
  id = input(`brn-dialog-trigger-${idSequence++}`);
  state = this._brnDialogRef?.state ?? signal("closed");
  dialogId = `brn-dialog-${this._brnDialogRef?.dialogId ?? idSequence++}`;
  brnDialogTriggerFor = input(void 0, {
    alias: "brnDialogTriggerFor"
  });
  mutableBrnDialogTriggerFor = computed(() => signal(this.brnDialogTriggerFor()));
  brnDialogTriggerForState = computed(() => this.mutableBrnDialogTriggerFor()());
  constructor() {
    effect(() => {
      const brnDialog = this.brnDialogTriggerForState();
      if (!brnDialog) return;
      this._brnDialog = brnDialog;
    });
  }
  open() {
    this._brnDialog?.open();
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogTriggerDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogTriggerDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialogTriggerDirective,
    selectors: [["button", "brnDialogTrigger", ""], ["button", "brnDialogTriggerFor", ""]],
    hostAttrs: ["aria-haspopup", "dialog"],
    hostVars: 4,
    hostBindings: function BrnDialogTriggerDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function BrnDialogTriggerDirective_click_HostBindingHandler() {
          return ctx.open();
        });
      }
      if (rf & 2) {
        ɵɵhostProperty("id", ctx.id());
        ɵɵattribute("aria-expanded", ctx.state() === "open" ? "true" : "false")("data-state", ctx.state())("aria-controls", ctx.dialogId);
      }
    },
    inputs: {
      id: [1, "id"],
      brnDialogTriggerFor: [1, "brnDialogTriggerFor"]
    },
    exportAs: ["brnDialogTrigger"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogTriggerDirective, [{
    type: Directive,
    args: [{
      selector: "button[brnDialogTrigger],button[brnDialogTriggerFor]",
      standalone: true,
      host: {
        "[id]": "id()",
        "(click)": "open()",
        "aria-haspopup": "dialog",
        "[attr.aria-expanded]": "state() === 'open' ? 'true': 'false'",
        "[attr.data-state]": "state()",
        "[attr.aria-controls]": "dialogId"
      },
      exportAs: "brnDialogTrigger"
    }]
  }], () => [], null);
})();
var DEFAULT_BRN_DIALOG_OPTIONS = {
  role: "dialog",
  attachPositions: [],
  attachTo: null,
  autoFocus: "first-tabbable",
  backdropClass: "",
  closeDelay: 100,
  closeOnBackdropClick: true,
  closeOnOutsidePointerEvents: false,
  hasBackdrop: true,
  panelClass: "",
  positionStrategy: null,
  restoreFocus: true,
  scrollStrategy: null,
  disableClose: false,
  ariaLabel: void 0,
  ariaModal: true
};
var BrnDialogImports = [BrnDialogComponent, BrnDialogOverlayComponent, BrnDialogTriggerDirective, BrnDialogCloseDirective, BrnDialogContentDirective, BrnDialogTitleDirective, BrnDialogDescriptionDirective];
var BrnDialogModule = class _BrnDialogModule {
  /** @nocollapse */
  static ɵfac = function BrnDialogModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _BrnDialogModule,
    imports: [BrnDialogComponent, BrnDialogOverlayComponent, BrnDialogTriggerDirective, BrnDialogCloseDirective, BrnDialogContentDirective, BrnDialogTitleDirective, BrnDialogDescriptionDirective],
    exports: [BrnDialogComponent, BrnDialogOverlayComponent, BrnDialogTriggerDirective, BrnDialogCloseDirective, BrnDialogContentDirective, BrnDialogTitleDirective, BrnDialogDescriptionDirective]
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogModule, [{
    type: NgModule,
    args: [{
      imports: [...BrnDialogImports],
      exports: [...BrnDialogImports]
    }]
  }], null, null);
})();

export {
  cssClassesToArray,
  BrnDialogRef,
  BrnDialogCloseDirective,
  defaultOptions,
  provideBrnDialogDefaultOptions,
  injectBrnDialogDefaultOptions,
  injectBrnDialogCtx,
  injectBrnDialogContext,
  BrnDialogService,
  BrnDialogComponent,
  BrnDialogContentDirective,
  BrnDialogDescriptionDirective,
  BrnDialogOverlayComponent,
  BrnDialogTitleDirective,
  BrnDialogTriggerDirective,
  DEFAULT_BRN_DIALOG_OPTIONS,
  BrnDialogImports,
  BrnDialogModule
};
//# sourceMappingURL=chunk-2NUXUK2I.js.map
