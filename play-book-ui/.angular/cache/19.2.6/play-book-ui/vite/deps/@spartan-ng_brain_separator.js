import {
  Component,
  NgModule,
  booleanAttribute,
  computed,
  input,
  setClassMetadata,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵhostProperty
} from "./chunk-NQQX34FG.js";
import "./chunk-WPM5VTLQ.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-4S3KYZTJ.js";
import "./chunk-WDMUDEB6.js";

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-separator.mjs
var BrnSeparatorComponent = class _BrnSeparatorComponent {
  orientation = input("horizontal");
  decorative = input(false, {
    transform: booleanAttribute
  });
  role = computed(() => this.decorative() ? "none" : "separator");
  ariaOrientation = computed(() => this.decorative() ? void 0 : this.orientation() === "vertical" ? "vertical" : void 0);
  /** @nocollapse */
  static ɵfac = function BrnSeparatorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSeparatorComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnSeparatorComponent,
    selectors: [["brn-separator"]],
    hostVars: 3,
    hostBindings: function BrnSeparatorComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵhostProperty("role", ctx.role());
        ɵɵattribute("aria-orientation", ctx.ariaOrientation())("data-orientation", ctx.orientation());
      }
    },
    inputs: {
      orientation: [1, "orientation"],
      decorative: [1, "decorative"]
    },
    decls: 0,
    vars: 0,
    template: function BrnSeparatorComponent_Template(rf, ctx) {
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSeparatorComponent, [{
    type: Component,
    args: [{
      selector: "brn-separator",
      standalone: true,
      template: "",
      host: {
        "[role]": "role()",
        "[attr.aria-orientation]": "ariaOrientation()",
        "[attr.data-orientation]": "orientation()"
      }
    }]
  }], null, null);
})();
var BrnSeparatorModule = class _BrnSeparatorModule {
  /** @nocollapse */
  static ɵfac = function BrnSeparatorModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSeparatorModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _BrnSeparatorModule,
    imports: [BrnSeparatorComponent],
    exports: [BrnSeparatorComponent]
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSeparatorModule, [{
    type: NgModule,
    args: [{
      imports: [BrnSeparatorComponent],
      exports: [BrnSeparatorComponent]
    }]
  }], null, null);
})();
export {
  BrnSeparatorComponent,
  BrnSeparatorModule
};
//# sourceMappingURL=@spartan-ng_brain_separator.js.map
