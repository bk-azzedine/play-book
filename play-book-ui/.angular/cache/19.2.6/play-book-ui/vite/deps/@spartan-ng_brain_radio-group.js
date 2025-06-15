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
import "./chunk-O2JNKGSU.js";
import "./chunk-A3A3ULYF.js";
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  InjectionToken,
  NgModule,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
  output,
  setClassMetadata,
  signal,
  viewChild,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵhostProperty,
  ɵɵlistener,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵviewQuerySignal
} from "./chunk-NQQX34FG.js";
import "./chunk-WPM5VTLQ.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-4S3KYZTJ.js";
import "./chunk-WDMUDEB6.js";

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-radio-group.mjs
var _c0 = ["input"];
var _c1 = [[["", "target", ""], ["", "indicator", ""]], "*"];
var _c2 = ["[target],[indicator]", "*"];
var BrnRadioGroupToken = new InjectionToken("BrnRadioGroupToken");
function provideBrnRadioGroupToken(directive) {
  return {
    provide: BrnRadioGroupToken,
    useExisting: directive
  };
}
function injectBrnRadioGroup() {
  return inject(BrnRadioGroupToken);
}
var BrnRadioChange = class {
  source;
  value;
  constructor(source, value) {
    this.source = source;
    this.value = value;
  }
};
var BrnRadioComponent = class _BrnRadioComponent {
  static _nextUniqueId = 0;
  _focusMonitor = inject(FocusMonitor);
  _elementRef = inject(ElementRef);
  radioGroup = injectBrnRadioGroup();
  /**
   * Whether the radio button is disabled.
   */
  disabled = input(false, {
    transform: booleanAttribute
  });
  /**
   * Whether the radio button is disabled or the radio group is disabled.
   */
  disabledState = computed(() => this.disabled() || this.radioGroup && this.radioGroup.disabled());
  /**
   * Whether the radio button is checked.
   */
  checked = computed(() => this.radioGroup.value() === this.value());
  tabIndex = computed(() => {
    const disabled = this.disabledState();
    const checked = this.checked();
    const hasSelectedRadio = this.radioGroup.value() !== void 0;
    const isFirstRadio = this.radioGroup.radioButtons()[0] === this;
    if (disabled || !checked && (hasSelectedRadio || !isFirstRadio)) {
      return -1;
    }
    return 0;
  });
  /**
   * The unique ID for the radio button input. If none is supplied, it will be auto-generated.
   */
  id = input(void 0);
  ariaLabel = input(void 0, {
    alias: "aria-label"
  });
  ariaLabelledby = input(void 0, {
    alias: "aria-labelledby"
  });
  ariaDescribedby = input(void 0, {
    alias: "aria-describedby"
  });
  /**
   * The value this radio button represents.
   */
  value = input.required();
  /**
   * Whether the radio button is required.
   */
  required = input(false, {
    transform: booleanAttribute
  });
  /**
   * Event emitted when the checked state of this radio button changes.
   */
  change = output();
  hostId = computed(() => this.id() ? this.id() : `brn-radio-${++_BrnRadioComponent._nextUniqueId}`);
  inputId = computed(() => `${this.hostId()}-input`);
  inputElement = viewChild.required("input");
  constructor() {
    this._focusMonitor.monitor(this._elementRef, true);
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
  /** Dispatch change event with current value. */
  emitChangeEvent() {
    this.change.emit(new BrnRadioChange(this, this.value()));
  }
  onInputClick(event) {
    event.stopPropagation();
  }
  onInputInteraction(event) {
    event.stopPropagation();
    if (!this.checked() && !this.disabledState()) {
      this.emitChangeEvent();
      this.radioGroup.select(this, this.value());
    }
  }
  /** Triggered when the user clicks on the touch target. */
  onTouchTargetClick(event) {
    this.onInputInteraction(event);
    if (!this.disabledState()) {
      this.inputElement().nativeElement.focus();
    }
  }
  /** @nocollapse */
  static ɵfac = function BrnRadioComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnRadioComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnRadioComponent,
    selectors: [["brn-radio"]],
    viewQuery: function BrnRadioComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuerySignal(ctx.inputElement, _c0, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    hostAttrs: [1, "brn-radio"],
    hostVars: 12,
    hostBindings: function BrnRadioComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("focus", function BrnRadioComponent_focus_HostBindingHandler() {
          return ctx.inputElement().nativeElement.focus();
        });
      }
      if (rf & 2) {
        ɵɵattribute("id", ctx.hostId())("data-checked", ctx.checked())("data-disabled", ctx.disabledState())("data-value", ctx.value())("tabindex", null)("aria-label", null)("aria-labelledby", null)("aria-describedby", null);
        ɵɵclassProp("brn-radio-checked", ctx.checked())("brn-radio-disabled", ctx.disabledState());
      }
    },
    inputs: {
      disabled: [1, "disabled"],
      id: [1, "id"],
      ariaLabel: [1, "aria-label", "ariaLabel"],
      ariaLabelledby: [1, "aria-labelledby", "ariaLabelledby"],
      ariaDescribedby: [1, "aria-describedby", "ariaDescribedby"],
      value: [1, "value"],
      required: [1, "required"]
    },
    outputs: {
      change: "change"
    },
    exportAs: ["brnRadio"],
    ngContentSelectors: _c2,
    decls: 6,
    vars: 11,
    consts: [["input", ""], ["data-slot", "indicator", 2, "display", "flex", "height", "fit-content", "width", "fit-content", 3, "click"], ["type", "radio", 2, "position", "absolute", "width", "1px", "height", "1px", "padding", "0", "margin", "-1px", "overflow", "hidden", "clip", "rect(0, 0, 0, 0)", "white-space", "nowrap", "border-width", "0", 3, "change", "click", "id", "checked", "disabled", "tabIndex", "required"], ["data-slot", "label", 3, "for"]],
    template: function BrnRadioComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵprojectionDef(_c1);
        ɵɵelementStart(0, "div", 1);
        ɵɵlistener("click", function BrnRadioComponent_Template_div_click_0_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onTouchTargetClick($event));
        });
        ɵɵprojection(1);
        ɵɵelementEnd();
        ɵɵelementStart(2, "input", 2, 0);
        ɵɵlistener("change", function BrnRadioComponent_Template_input_change_2_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onInputInteraction($event));
        })("click", function BrnRadioComponent_Template_input_click_2_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onInputClick($event));
        });
        ɵɵelementEnd();
        ɵɵelementStart(4, "label", 3);
        ɵɵprojection(5, 1);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵadvance(2);
        ɵɵproperty("id", ctx.inputId())("checked", ctx.checked())("disabled", ctx.disabledState())("tabIndex", ctx.tabIndex())("required", ctx.required());
        ɵɵattribute("name", ctx.radioGroup.name())("value", ctx.value())("aria-label", ctx.ariaLabel())("aria-labelledby", ctx.ariaLabelledby())("aria-describedby", ctx.ariaDescribedby());
        ɵɵadvance(2);
        ɵɵproperty("for", ctx.inputId());
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnRadioComponent, [{
    type: Component,
    args: [{
      selector: "brn-radio",
      standalone: true,
      host: {
        class: "brn-radio",
        "[attr.id]": "hostId()",
        "[class.brn-radio-checked]": "checked()",
        "[class.brn-radio-disabled]": "disabledState()",
        "[attr.data-checked]": "checked()",
        "[attr.data-disabled]": "disabledState()",
        "[attr.data-value]": "value()",
        // Needs to be removed since it causes some a11y issues (see #21266).
        "[attr.tabindex]": "null",
        "[attr.aria-label]": "null",
        "[attr.aria-labelledby]": "null",
        "[attr.aria-describedby]": "null",
        // Note: under normal conditions focus shouldn't land on this element, however it may be
        // programmatically set, for example inside of a focus trap, in this case we want to forward
        // the focus to the native element.
        "(focus)": "inputElement().nativeElement.focus()"
      },
      exportAs: "brnRadio",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
		<div
			data-slot="indicator"
			style="display: flex; height: fit-content; width: fit-content"
			(click)="onTouchTargetClick($event)"
		>
			<ng-content select="[target],[indicator]" />
		</div>
		<input
			#input
			style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;"
			type="radio"
			[id]="inputId()"
			[checked]="checked()"
			[disabled]="disabledState()"
			[tabIndex]="tabIndex()"
			[attr.name]="radioGroup.name()"
			[attr.value]="value()"
			[required]="required()"
			[attr.aria-label]="ariaLabel()"
			[attr.aria-labelledby]="ariaLabelledby()"
			[attr.aria-describedby]="ariaDescribedby()"
			(change)="onInputInteraction($event)"
			(click)="onInputClick($event)"
		/>
		<label [for]="inputId()" data-slot="label">
			<ng-content />
		</label>
	`
    }]
  }], () => [], null);
})();
var BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BrnRadioGroupDirective),
  multi: true
};
var BrnRadioGroupDirective = class _BrnRadioGroupDirective {
  static _nextUniqueId = 0;
  onChange = () => {
  };
  onTouched = () => {
  };
  name = input(`brn-radio-group-${_BrnRadioGroupDirective._nextUniqueId++}`);
  /**
   * The value of the selected radio button.
   */
  value = model();
  /**
   * Whether the radio group is disabled.
   */
  disabled = input(false, {
    transform: booleanAttribute
  });
  /**
   * Whether the radio group should be required.
   */
  required = input(false, {
    transform: booleanAttribute
  });
  /**
   * The direction of the radio group.
   */
  direction = input("ltr");
  /**
   * Event emitted when the group value changes.
   */
  change = output();
  /**
   * The internal disabled state of the radio group. This could be switched to a linkedSignal when we can drop v18 support.
   * @internal
   */
  disabledState = computed(() => signal(this.disabled()));
  /**
   * Access the radio buttons within the group.
   * @internal
   */
  radioButtons = contentChildren(BrnRadioComponent, {
    descendants: true
  });
  writeValue(value) {
    this.value.set(value);
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabledState().set(isDisabled);
  }
  /**
   * Select a radio button.
   * @internal
   */
  select(radioButton, value) {
    if (this.value() === value) {
      return;
    }
    this.value.set(value);
    this.onChange(value);
    this.change.emit(new BrnRadioChange(radioButton, value));
  }
  /** @nocollapse */
  static ɵfac = function BrnRadioGroupDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnRadioGroupDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnRadioGroupDirective,
    selectors: [["", "brnRadioGroup", ""]],
    contentQueries: function BrnRadioGroupDirective_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.radioButtons, BrnRadioComponent, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    hostAttrs: ["role", "radiogroup"],
    hostVars: 1,
    hostBindings: function BrnRadioGroupDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("focusout", function BrnRadioGroupDirective_focusout_HostBindingHandler() {
          return ctx.onTouched();
        });
      }
      if (rf & 2) {
        ɵɵhostProperty("dir", ctx.direction());
      }
    },
    inputs: {
      name: [1, "name"],
      value: [1, "value"],
      disabled: [1, "disabled"],
      required: [1, "required"],
      direction: [1, "direction"]
    },
    outputs: {
      value: "valueChange",
      change: "change"
    },
    features: [ɵɵProvidersFeature([BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, provideBrnRadioGroupToken(_BrnRadioGroupDirective)])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnRadioGroupDirective, [{
    type: Directive,
    args: [{
      selector: "[brnRadioGroup]",
      standalone: true,
      providers: [BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, provideBrnRadioGroupToken(BrnRadioGroupDirective)],
      host: {
        role: "radiogroup",
        "[dir]": "direction()",
        "(focusout)": "onTouched()"
      }
    }]
  }], null, null);
})();
var BrnRadioGroupImports = [BrnRadioGroupDirective, BrnRadioComponent];
var BrnRadioGroupModule = class _BrnRadioGroupModule {
  /** @nocollapse */
  static ɵfac = function BrnRadioGroupModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnRadioGroupModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _BrnRadioGroupModule,
    imports: [BrnRadioGroupDirective, BrnRadioComponent],
    exports: [BrnRadioGroupDirective, BrnRadioComponent]
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnRadioGroupModule, [{
    type: NgModule,
    args: [{
      imports: [...BrnRadioGroupImports],
      exports: [...BrnRadioGroupImports]
    }]
  }], null, null);
})();
export {
  BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR,
  BrnRadioChange,
  BrnRadioComponent,
  BrnRadioGroupDirective,
  BrnRadioGroupImports,
  BrnRadioGroupModule
};
//# sourceMappingURL=@spartan-ng_brain_radio-group.js.map
