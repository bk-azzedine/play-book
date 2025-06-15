import "./chunk-ZW62AG5I.js";
import "./chunk-YUX3MMK3.js";
import {
  toSignal
} from "./chunk-NQTT4SFU.js";
import "./chunk-PFK2ZDSC.js";
import "./chunk-FR2CQ6ZG.js";
import "./chunk-QTVNIIM2.js";
import {
  brnZoneOptimized,
  provideExposedSideProviderExisting,
  provideExposesStateProviderExisting
} from "./chunk-42P2JB6C.js";
import "./chunk-H7QGH3RH.js";
import {
  Overlay,
  OverlayPositionBuilder,
  TemplatePortal
} from "./chunk-3O3MFXS3.js";
import "./chunk-FXRHJ26G.js";
import {
  FocusMonitor
} from "./chunk-MOZ2DJVD.js";
import "./chunk-UXQYWOLL.js";
import "./chunk-O2JNKGSU.js";
import "./chunk-A3A3ULYF.js";
import {
  Component,
  Directive,
  ElementRef,
  Injectable,
  NgModule,
  NgZone,
  TemplateRef,
  ViewContainerRef,
  computed,
  contentChild,
  effect,
  inject,
  input,
  setClassMetadata,
  signal,
  untracked,
  ɵɵProvidersFeature,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵqueryAdvance
} from "./chunk-NQQX34FG.js";
import {
  fromEvent,
  merge
} from "./chunk-WPM5VTLQ.js";
import "./chunk-PEBH6BBU.js";
import {
  BehaviorSubject,
  Subject,
  delay,
  distinctUntilChanged,
  filter,
  map,
  of,
  share,
  switchMap,
  takeUntil,
  tap
} from "./chunk-4S3KYZTJ.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-hover-card.mjs
var _c0 = ["*"];
function movedOut({
  currentTarget,
  relatedTarget
}) {
  return !isElement(relatedTarget) || !isElement(currentTarget) || !currentTarget.contains(relatedTarget);
}
function isElement(node) {
  return !!node && "nodeType" in node && node.nodeType === Node.ELEMENT_NODE;
}
var createHoverObservable = (nativeElement, zone, destroyed$) => {
  return merge(
    fromEvent(nativeElement, "mouseenter").pipe(map(() => true)),
    fromEvent(nativeElement, "mouseleave").pipe(map(() => false)),
    // Hello, Safari
    fromEvent(nativeElement, "mouseout").pipe(filter(movedOut), map(() => false)),
    /**
     * NOTE: onmouseout events don't trigger when objects move under mouse in Safari
     * https://bugs.webkit.org/show_bug.cgi?id=4117
     */
    fromEvent(nativeElement, "transitionend").pipe(map(() => nativeElement.matches(":hover")))
  ).pipe(distinctUntilChanged(), brnZoneOptimized(zone), takeUntil(destroyed$));
};
var BrnHoverCardContentDirective = class _BrnHoverCardContentDirective {
  _contentService = inject(BrnHoverCardContentService);
  state = this._contentService.state;
  side = this._contentService.side;
  template = inject(TemplateRef);
  /** @nocollapse */
  static ɵfac = function BrnHoverCardContentDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnHoverCardContentDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnHoverCardContentDirective,
    selectors: [["", "brnHoverCardContent", ""]],
    exportAs: ["brnHoverCardContent"],
    features: [ɵɵProvidersFeature([provideExposedSideProviderExisting(() => _BrnHoverCardContentDirective), provideExposesStateProviderExisting(() => _BrnHoverCardContentDirective)])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnHoverCardContentDirective, [{
    type: Directive,
    args: [{
      selector: "[brnHoverCardContent]",
      standalone: true,
      exportAs: "brnHoverCardContent",
      providers: [provideExposedSideProviderExisting(() => BrnHoverCardContentDirective), provideExposesStateProviderExisting(() => BrnHoverCardContentDirective)]
    }]
  }], null, null);
})();
var topFirstPositions = [{
  originX: "center",
  originY: "top",
  overlayX: "center",
  overlayY: "bottom"
}, {
  originX: "center",
  originY: "bottom",
  overlayX: "center",
  overlayY: "top"
}];
var bottomFirstPositions = [{
  originX: "center",
  originY: "bottom",
  overlayX: "center",
  overlayY: "top"
}, {
  originX: "center",
  originY: "top",
  overlayX: "center",
  overlayY: "bottom"
}];
var BrnHoverCardContentService = class _BrnHoverCardContentService {
  _overlay = inject(Overlay);
  _zone = inject(NgZone);
  _psBuilder = inject(OverlayPositionBuilder);
  _content = signal(null);
  _state = signal("closed");
  _config = {};
  _overlayRef;
  _positionStrategy;
  _destroyed$ = new Subject();
  _positionChangesObservables$ = new BehaviorSubject(void 0);
  _overlayHoveredObservables$ = new BehaviorSubject(void 0);
  positionChanges$ = this._positionChangesObservables$.pipe(switchMap((positionChangeObservable) => positionChangeObservable ? positionChangeObservable : of(void 0)), filter((change) => change !== void 0 && change !== null));
  hovered$ = this._overlayHoveredObservables$.pipe(switchMap((overlayHoveredObservable) => overlayHoveredObservable ? overlayHoveredObservable : of(false)));
  state = this._state.asReadonly();
  side = toSignal(this.positionChanges$.pipe(map((change) => (
    // todo: better translation or adjusting hlm to take that into account
    change.connectionPair.originY === "center" ? change.connectionPair.originX === "start" ? "left" : "right" : change.connectionPair.originY
  ))), {
    initialValue: "bottom"
  });
  setConfig(config) {
    this._config = config;
    if (config.attachTo) {
      this._positionStrategy = this._psBuilder.flexibleConnectedTo(config.attachTo).withPositions(config.attachPositions ?? config.align === "top" ? topFirstPositions : bottomFirstPositions).withDefaultOffsetY(config.sideOffset ?? 0);
      this._config = __spreadProps(__spreadValues({}, this._config), {
        positionStrategy: this._positionStrategy,
        scrollStrategy: this._overlay.scrollStrategies.reposition()
      });
      this._positionChangesObservables$.next(this._positionStrategy.positionChanges);
    }
    this._overlayRef = this._overlay.create(this._config);
  }
  setContent(value, vcr) {
    this._content.set(new TemplatePortal(value instanceof TemplateRef ? value : value.template, vcr));
    if (!this._overlayRef) {
      this._overlayRef = this._overlay.create(this._config);
    }
  }
  setState(newState) {
    this._state.set(newState);
  }
  show() {
    const content = this._content();
    if (!content || !this._overlayRef) return;
    this._overlayRef?.detach();
    this._overlayRef?.attach(content);
    this._destroyed$ = new Subject();
    this._overlayHoveredObservables$.next(createHoverObservable(this._overlayRef.hostElement, this._zone, this._destroyed$));
  }
  hide() {
    this._overlayRef?.detach();
    this._destroyed$.next();
    this._destroyed$.complete();
    this._destroyed$ = new Subject();
  }
  /** @nocollapse */
  static ɵfac = function BrnHoverCardContentService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnHoverCardContentService)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _BrnHoverCardContentService,
    factory: _BrnHoverCardContentService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnHoverCardContentService, [{
    type: Injectable
  }], null, null);
})();
var BrnHoverCardTriggerDirective = class _BrnHoverCardTriggerDirective {
  _destroy$ = new Subject();
  _vcr = inject(ViewContainerRef);
  _zone = inject(NgZone);
  _el = inject(ElementRef);
  _contentService = inject(BrnHoverCardContentService);
  _focusMonitor = inject(FocusMonitor);
  focused$ = this._focusMonitor.monitor(this._el).pipe(map((e) => e !== null));
  hovered$ = merge(fromEvent(this._el.nativeElement, "click").pipe(map(() => false)), createHoverObservable(this._el.nativeElement, this._zone, this._destroy$), this._contentService.hovered$, this.focused$).pipe(distinctUntilChanged());
  showing$ = this.hovered$.pipe(
    // we set the state to open here because we are about to open show the content
    tap((visible) => visible && this._contentService.setState("open")),
    switchMap((visible) => {
      return of(visible).pipe(delay(visible ? this.showDelay() : this.hideDelay()));
    }),
    switchMap((visible) => {
      if (visible) return of(visible);
      this._contentService.setState("closed");
      return of(visible).pipe(delay(this.animationDelay()));
    }),
    distinctUntilChanged(),
    share(),
    takeUntil(this._destroy$)
  );
  showDelay = input(300);
  hideDelay = input(500);
  animationDelay = input(100);
  sideOffset = input(5);
  align = input("bottom");
  brnHoverCardTriggerFor = input(void 0);
  mutableBrnHoverCardTriggerFor = computed(() => signal(this.brnHoverCardTriggerFor()));
  _brnHoverCardTriggerForState = computed(() => this.mutableBrnHoverCardTriggerFor()());
  constructor() {
    effect(() => {
      const value = this._brnHoverCardTriggerForState();
      untracked(() => {
        if (value) {
          this._contentService.setContent(value, this._vcr);
        }
      });
    });
  }
  ngOnInit() {
    this._contentService.setConfig({
      attachTo: this._el,
      align: this.align(),
      sideOffset: this.sideOffset()
    });
    this.showing$.subscribe((isHovered) => {
      if (isHovered) {
        this._contentService.show();
      } else {
        this._contentService.hide();
      }
    });
  }
  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
  /** @nocollapse */
  static ɵfac = function BrnHoverCardTriggerDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnHoverCardTriggerDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnHoverCardTriggerDirective,
    selectors: [["", "brnHoverCardTrigger", "", 5, "ng-container"], ["", "brnHoverCardTriggerFor", "", 5, "ng-container"]],
    inputs: {
      showDelay: [1, "showDelay"],
      hideDelay: [1, "hideDelay"],
      animationDelay: [1, "animationDelay"],
      sideOffset: [1, "sideOffset"],
      align: [1, "align"],
      brnHoverCardTriggerFor: [1, "brnHoverCardTriggerFor"]
    },
    exportAs: ["brnHoverCardTrigger"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnHoverCardTriggerDirective, [{
    type: Directive,
    args: [{
      selector: "[brnHoverCardTrigger]:not(ng-container),[brnHoverCardTriggerFor]:not(ng-container)",
      standalone: true,
      exportAs: "brnHoverCardTrigger"
    }]
  }], () => [], null);
})();
var BrnHoverCardComponent = class _BrnHoverCardComponent {
  _trigger = contentChild(BrnHoverCardTriggerDirective);
  _content = contentChild(BrnHoverCardContentDirective);
  ngAfterContentInit() {
    if (!this._trigger() || !this._content()) return;
    this._trigger()?.mutableBrnHoverCardTriggerFor().set(this._content());
  }
  /** @nocollapse */
  static ɵfac = function BrnHoverCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnHoverCardComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnHoverCardComponent,
    selectors: [["brn-hover-card"]],
    contentQueries: function BrnHoverCardComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx._trigger, BrnHoverCardTriggerDirective, 5);
        ɵɵcontentQuerySignal(dirIndex, ctx._content, BrnHoverCardContentDirective, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(2);
      }
    },
    features: [ɵɵProvidersFeature([BrnHoverCardContentService])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function BrnHoverCardComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnHoverCardComponent, [{
    type: Component,
    args: [{
      selector: "brn-hover-card",
      standalone: true,
      providers: [BrnHoverCardContentService],
      template: `
		<ng-content />
	`
    }]
  }], null, null);
})();
var BrnHoverCardImports = [BrnHoverCardComponent, BrnHoverCardContentDirective, BrnHoverCardTriggerDirective];
var BrnHoverCardModule = class _BrnHoverCardModule {
  /** @nocollapse */
  static ɵfac = function BrnHoverCardModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnHoverCardModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _BrnHoverCardModule,
    imports: [BrnHoverCardComponent, BrnHoverCardContentDirective, BrnHoverCardTriggerDirective],
    exports: [BrnHoverCardComponent, BrnHoverCardContentDirective, BrnHoverCardTriggerDirective]
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnHoverCardModule, [{
    type: NgModule,
    args: [{
      imports: [...BrnHoverCardImports],
      exports: [...BrnHoverCardImports]
    }]
  }], null, null);
})();
export {
  BrnHoverCardComponent,
  BrnHoverCardContentDirective,
  BrnHoverCardContentService,
  BrnHoverCardImports,
  BrnHoverCardModule,
  BrnHoverCardTriggerDirective,
  createHoverObservable,
  isElement
};
//# sourceMappingURL=@spartan-ng_brain_hover-card.js.map
