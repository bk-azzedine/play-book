import "./chunk-ZW62AG5I.js";
import "./chunk-YUX3MMK3.js";
import "./chunk-FR2CQ6ZG.js";
import "./chunk-QTVNIIM2.js";
import {
  FocusMonitor
} from "./chunk-MOZ2DJVD.js";
import "./chunk-UXQYWOLL.js";
import {
  NG_VALUE_ACCESSOR
} from "./chunk-KA6QQ6AI.js";
import {
  NgStyle
} from "./chunk-O2JNKGSU.js";
import {
  isPlatformBrowser
} from "./chunk-A3A3ULYF.js";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  NgModule,
  PLATFORM_ID,
  Renderer2,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  setClassMetadata,
  signal,
  viewChild,
  ɵɵProvidersFeature,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵlistener,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryAdvance,
  ɵɵviewQuerySignal
} from "./chunk-NQQX34FG.js";
import "./chunk-WPM5VTLQ.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-4S3KYZTJ.js";
import "./chunk-WDMUDEB6.js";

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-checkbox.mjs
var _c0 = ["checkBox"];
var _c1 = ["*"];
var _c2 = () => ({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0"
});
var BRN_CHECKBOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BrnCheckboxComponent),
  multi: true
};
function indeterminateBooleanAttribute(value) {
  if (value === "indeterminate") return "indeterminate";
  return booleanAttribute(value);
}
var CONTAINER_POST_FIX = "-checkbox";
var BrnCheckboxComponent = class _BrnCheckboxComponent {
  _renderer = inject(Renderer2);
  _elementRef = inject(ElementRef);
  _focusMonitor = inject(FocusMonitor);
  _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  _focusVisible = signal(false);
  focusVisible = this._focusVisible.asReadonly();
  _focused = signal(false);
  focused = this._focused.asReadonly();
  checked = model(false);
  isChecked = this.checked.asReadonly();
  _dataState = computed(() => {
    const checked = this.checked();
    if (checked === "indeterminate") return "indeterminate";
    return checked ? "checked" : "unchecked";
  });
  _ariaChecked = computed(() => {
    const checked = this.checked();
    if (checked === "indeterminate") return "mixed";
    return checked ? "true" : "false";
  });
  _value = computed(() => {
    const checked = this.checked();
    if (checked === "indeterminate") return "";
    return checked ? "on" : "off";
  });
  /** Used to set the id on the underlying input element. */
  id = input(null);
  hostId = computed(() => this.id() ? this.id() + CONTAINER_POST_FIX : null);
  /** Used to set the name attribute on the underlying input element. */
  name = input(null);
  hostName = computed(() => this.name() ? this.name() + CONTAINER_POST_FIX : null);
  /** Used to set the aria-label attribute on the underlying input element. */
  ariaLabel = input(null, {
    alias: "aria-label"
  });
  /** Used to set the aria-labelledby attribute on the underlying input element. */
  ariaLabelledby = input(null, {
    alias: "aria-labelledby"
  });
  ariaDescribedby = input(null, {
    alias: "aria-describedby"
  });
  required = input(false, {
    transform: booleanAttribute
  });
  disabled = input(false, {
    transform: booleanAttribute
  });
  state = computed(() => ({
    disabled: signal(this.disabled())
  }));
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onChange = () => {
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onTouched = () => {
  };
  checkbox = viewChild.required("checkBox");
  changed = output();
  constructor() {
    effect(() => {
      const parent = this._renderer.parentNode(this._elementRef.nativeElement);
      if (!parent) return;
      if (parent?.tagName === "LABEL") {
        this._renderer.setAttribute(parent, "data-disabled", this.state().disabled() ? "true" : "false");
        return;
      }
      if (!this._isBrowser) return;
      const label = parent?.querySelector(`label[for="${this.id()}"]`);
      if (!label) return;
      this._renderer.setAttribute(label, "data-disabled", this.state().disabled() ? "true" : "false");
    });
  }
  toggle(event) {
    if (this.state().disabled()) return;
    event.preventDefault();
    const previousChecked = this.checked();
    this.checked.set(previousChecked === "indeterminate" ? true : !previousChecked);
    this._onChange(!previousChecked);
    this.changed.emit(!previousChecked);
  }
  ngAfterContentInit() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
      if (focusOrigin) this._focused.set(true);
      if (focusOrigin === "keyboard" || focusOrigin === "program") {
        this._focusVisible.set(true);
      }
      if (!focusOrigin) {
        Promise.resolve().then(() => {
          this._focusVisible.set(false);
          this._focused.set(false);
          this._onTouched();
        });
      }
    });
    this.checkbox().nativeElement.indeterminate = this.checked() === "indeterminate";
    if (this.checkbox().nativeElement.indeterminate) {
      this.checkbox().nativeElement.value = "indeterminate";
    } else {
      this.checkbox().nativeElement.value = this.checked() ? "on" : "off";
    }
    this.checkbox().nativeElement.dispatchEvent(new Event("change"));
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
  writeValue(value) {
    if (value === "indeterminate") {
      this.checked.set("indeterminate");
    } else {
      this.checked.set(!!value);
    }
  }
  registerOnChange(fn) {
    this._onChange = fn;
  }
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  /** Implemented as a part of ControlValueAccessor. */
  setDisabledState(isDisabled) {
    this.state().disabled.set(isDisabled);
  }
  /**
   * If the space key is pressed, prevent the default action to stop the page from scrolling.
   */
  preventScrolling(event) {
    event.preventDefault();
  }
  /** @nocollapse */
  static ɵfac = function BrnCheckboxComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnCheckboxComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnCheckboxComponent,
    selectors: [["brn-checkbox"]],
    viewQuery: function BrnCheckboxComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuerySignal(ctx.checkbox, _c0, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    hostVars: 10,
    hostBindings: function BrnCheckboxComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function BrnCheckboxComponent_click_HostBindingHandler($event) {
          return ctx.toggle($event);
        })("keyup.space", function BrnCheckboxComponent_keyup_space_HostBindingHandler($event) {
          return ctx.toggle($event);
        })("keyup.enter", function BrnCheckboxComponent_keyup_enter_HostBindingHandler($event) {
          return ctx.toggle($event);
        })("keydown.space", function BrnCheckboxComponent_keydown_space_HostBindingHandler($event) {
          return ctx.preventScrolling($event);
        });
      }
      if (rf & 2) {
        ɵɵattribute("tabindex", ctx.state().disabled() ? "-1" : "0")("data-state", ctx._dataState())("data-focus-visible", ctx.focusVisible())("data-focus", ctx.focused())("data-disabled", ctx.state().disabled())("aria-labelledby", null)("aria-label", null)("aria-describedby", null)("id", ctx.hostId())("name", ctx.hostName());
      }
    },
    inputs: {
      checked: [1, "checked"],
      id: [1, "id"],
      name: [1, "name"],
      ariaLabel: [1, "aria-label", "ariaLabel"],
      ariaLabelledby: [1, "aria-labelledby", "ariaLabelledby"],
      ariaDescribedby: [1, "aria-describedby", "ariaDescribedby"],
      required: [1, "required"],
      disabled: [1, "disabled"]
    },
    outputs: {
      checked: "checkedChange",
      changed: "changed"
    },
    features: [ɵɵProvidersFeature([BRN_CHECKBOX_VALUE_ACCESSOR])],
    ngContentSelectors: _c1,
    decls: 3,
    vars: 12,
    consts: [["checkBox", ""], ["tabindex", "-1", "type", "checkbox", "role", "checkbox", 3, "ngStyle", "id", "name", "value", "checked", "required"]],
    template: function BrnCheckboxComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵelement(0, "input", 1, 0);
        ɵɵprojection(2);
      }
      if (rf & 2) {
        let tmp_2_0;
        let tmp_3_0;
        ɵɵproperty("ngStyle", ɵɵpureFunction0(11, _c2))("id", (tmp_2_0 = ctx.id()) !== null && tmp_2_0 !== void 0 ? tmp_2_0 : "")("name", (tmp_3_0 = ctx.name()) !== null && tmp_3_0 !== void 0 ? tmp_3_0 : "")("value", ctx._value())("checked", ctx.isChecked())("required", ctx.required());
        ɵɵattribute("aria-label", ctx.ariaLabel())("aria-labelledby", ctx.ariaLabelledby())("aria-describedby", ctx.ariaDescribedby())("aria-required", ctx.required() || null)("aria-checked", ctx._ariaChecked());
      }
    },
    dependencies: [NgStyle],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnCheckboxComponent, [{
    type: Component,
    args: [{
      selector: "brn-checkbox",
      imports: [NgStyle],
      template: `
		<input
			#checkBox
			tabindex="-1"
			type="checkbox"
			role="checkbox"
			[ngStyle]="{
				position: 'absolute',
				width: '1px',
				height: '1px',
				padding: '0',
				margin: '-1px',
				overflow: 'hidden',
				clip: 'rect(0, 0, 0, 0)',
				whiteSpace: 'nowrap',
				borderWidth: '0',
			}"
			[id]="id() ?? ''"
			[name]="name() ?? ''"
			[value]="_value()"
			[checked]="isChecked()"
			[required]="required()"
			[attr.aria-label]="ariaLabel()"
			[attr.aria-labelledby]="ariaLabelledby()"
			[attr.aria-describedby]="ariaDescribedby()"
			[attr.aria-required]="required() || null"
			[attr.aria-checked]="_ariaChecked()"
		/>
		<ng-content />
	`,
      host: {
        "[attr.tabindex]": 'state().disabled() ? "-1" : "0"',
        "[attr.data-state]": "_dataState()",
        "[attr.data-focus-visible]": "focusVisible()",
        "[attr.data-focus]": "focused()",
        "[attr.data-disabled]": "state().disabled()",
        "[attr.aria-labelledby]": "null",
        "[attr.aria-label]": "null",
        "[attr.aria-describedby]": "null",
        "[attr.id]": "hostId()",
        "[attr.name]": "hostName()"
      },
      providers: [BRN_CHECKBOX_VALUE_ACCESSOR],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None
    }]
  }], () => [], {
    toggle: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }, {
      type: HostListener,
      args: ["keyup.space", ["$event"]]
    }, {
      type: HostListener,
      args: ["keyup.enter", ["$event"]]
    }],
    preventScrolling: [{
      type: HostListener,
      args: ["keydown.space", ["$event"]]
    }]
  });
})();
var BrnCheckboxImports = [BrnCheckboxComponent];
var BrnCheckboxModule = class _BrnCheckboxModule {
  /** @nocollapse */
  static ɵfac = function BrnCheckboxModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnCheckboxModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _BrnCheckboxModule,
    imports: [BrnCheckboxComponent],
    exports: [BrnCheckboxComponent]
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnCheckboxModule, [{
    type: NgModule,
    args: [{
      imports: [...BrnCheckboxImports],
      exports: [...BrnCheckboxImports]
    }]
  }], null, null);
})();
export {
  BRN_CHECKBOX_VALUE_ACCESSOR,
  BrnCheckboxComponent,
  BrnCheckboxImports,
  BrnCheckboxModule,
  indeterminateBooleanAttribute
};
//# sourceMappingURL=@spartan-ng_brain_checkbox.js.map
