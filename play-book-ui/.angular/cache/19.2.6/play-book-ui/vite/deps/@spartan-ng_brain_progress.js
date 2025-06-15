import {
  Component,
  InjectionToken,
  NgModule,
  computed,
  inject,
  input,
  numberAttribute,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵprojection,
  ɵɵprojectionDef
} from "./chunk-NQQX34FG.js";
import "./chunk-WPM5VTLQ.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-4S3KYZTJ.js";
import "./chunk-WDMUDEB6.js";

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-progress.mjs
var _c0 = ["*"];
var BrnProgressToken = new InjectionToken("BrnProgressComponent");
function provideBrnProgress(progress) {
  return {
    provide: BrnProgressToken,
    useExisting: progress
  };
}
function injectBrnProgress() {
  return inject(BrnProgressToken);
}
var BrnProgressIndicatorComponent = class _BrnProgressIndicatorComponent {
  progress = injectBrnProgress();
  /** @nocollapse */
  static ɵfac = function BrnProgressIndicatorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnProgressIndicatorComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnProgressIndicatorComponent,
    selectors: [["brn-progress-indicator"]],
    hostVars: 3,
    hostBindings: function BrnProgressIndicatorComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-state", ctx.progress.state())("data-value", ctx.progress.value())("data-max", ctx.progress.max());
      }
    },
    decls: 0,
    vars: 0,
    template: function BrnProgressIndicatorComponent_Template(rf, ctx) {
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnProgressIndicatorComponent, [{
    type: Component,
    args: [{
      selector: "brn-progress-indicator",
      standalone: true,
      template: "",
      host: {
        "[attr.data-state]": "progress.state()",
        "[attr.data-value]": "progress.value()",
        "[attr.data-max]": "progress.max()"
      }
    }]
  }], null, null);
})();
var BrnProgressComponent = class _BrnProgressComponent {
  value = input(void 0, {
    transform: (value) => value === void 0 || value === null ? void 0 : Number(value)
  });
  max = input(100, {
    transform: numberAttribute
  });
  getValueLabel = input((value, max) => `${Math.round(value / max * 100)}%`);
  label = computed(() => {
    const value = this.value();
    return value === null || value === void 0 ? void 0 : this.getValueLabel()(value, this.max());
  });
  state = computed(() => {
    const value = this.value();
    const max = this.max();
    return value === null || value === void 0 ? "indeterminate" : value === max ? "complete" : "loading";
  });
  ngOnChanges(changes) {
    if ("value" in changes || "max" in changes) {
      this.validate();
    }
  }
  validate() {
    const value = this.value();
    const max = this.max();
    if (value === null || value === void 0) {
      return;
    }
    if (value > max || value < 0) {
      throw Error("Value must be 0 or greater and less or equal to max");
    }
    if (max < 0) {
      throw Error("max must be greater than 0");
    }
  }
  /** @nocollapse */
  static ɵfac = function BrnProgressComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnProgressComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnProgressComponent,
    selectors: [["brn-progress"]],
    hostAttrs: ["role", "progressbar"],
    hostVars: 7,
    hostBindings: function BrnProgressComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("aria-valuemax", ctx.max())("aria-valuemin", 0)("aria-valuenow", ctx.value())("aria-valuetext", ctx.label())("data-state", ctx.state())("data-value", ctx.value())("data-max", ctx.max());
      }
    },
    inputs: {
      value: [1, "value"],
      max: [1, "max"],
      getValueLabel: [1, "getValueLabel"]
    },
    exportAs: ["brnProgress"],
    features: [ɵɵProvidersFeature([provideBrnProgress(_BrnProgressComponent)]), ɵɵNgOnChangesFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function BrnProgressComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnProgressComponent, [{
    type: Component,
    args: [{
      selector: "brn-progress",
      standalone: true,
      template: "<ng-content/>",
      exportAs: "brnProgress",
      providers: [provideBrnProgress(BrnProgressComponent)],
      host: {
        role: "progressbar",
        "[attr.aria-valuemax]": "max()",
        "[attr.aria-valuemin]": "0",
        "[attr.aria-valuenow]": "value()",
        "[attr.aria-valuetext]": "label()",
        "[attr.data-state]": "state()",
        "[attr.data-value]": "value()",
        "[attr.data-max]": "max()"
      }
    }]
  }], null, null);
})();
var BrnProgressImports = [BrnProgressComponent, BrnProgressIndicatorComponent];
var BrnProgressModule = class _BrnProgressModule {
  /** @nocollapse */
  static ɵfac = function BrnProgressModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnProgressModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _BrnProgressModule,
    imports: [BrnProgressComponent, BrnProgressIndicatorComponent],
    exports: [BrnProgressComponent, BrnProgressIndicatorComponent]
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnProgressModule, [{
    type: NgModule,
    args: [{
      imports: [...BrnProgressImports],
      exports: [...BrnProgressImports]
    }]
  }], null, null);
})();
export {
  BrnProgressComponent,
  BrnProgressImports,
  BrnProgressIndicatorComponent,
  BrnProgressModule,
  injectBrnProgress
};
//# sourceMappingURL=@spartan-ng_brain_progress.js.map
