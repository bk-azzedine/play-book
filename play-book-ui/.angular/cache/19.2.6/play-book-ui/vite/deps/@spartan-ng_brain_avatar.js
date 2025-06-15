import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  HostListener,
  NgModule,
  Pipe,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  setClassMetadata,
  signal,
  ɵɵconditional,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵlistener,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵqueryAdvance,
  ɵɵtemplate
} from "./chunk-NQQX34FG.js";
import "./chunk-WPM5VTLQ.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-4S3KYZTJ.js";
import "./chunk-WDMUDEB6.js";

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-avatar.mjs
var _c0 = [[["", "brnAvatarImage", ""]], [["", "brnAvatarFallback", ""]]];
var _c1 = ["[brnAvatarImage]", "[brnAvatarFallback]"];
function BrnAvatarComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function BrnAvatarComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 1);
  }
}
var BrnAvatarImageDirective = class _BrnAvatarImageDirective {
  _loaded = signal(false);
  onError() {
    this._loaded.set(false);
  }
  onLoad() {
    this._loaded.set(true);
  }
  canShow = computed(() => this._loaded());
  /** @nocollapse */
  static ɵfac = function BrnAvatarImageDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnAvatarImageDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnAvatarImageDirective,
    selectors: [["img", "brnAvatarImage", ""]],
    hostBindings: function BrnAvatarImageDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("error", function BrnAvatarImageDirective_error_HostBindingHandler() {
          return ctx.onError();
        })("load", function BrnAvatarImageDirective_load_HostBindingHandler() {
          return ctx.onLoad();
        });
      }
    },
    exportAs: ["avatarImage"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnAvatarImageDirective, [{
    type: Directive,
    args: [{
      selector: "img[brnAvatarImage]",
      standalone: true,
      exportAs: "avatarImage"
    }]
  }], null, {
    onError: [{
      type: HostListener,
      args: ["error"]
    }],
    onLoad: [{
      type: HostListener,
      args: ["load"]
    }]
  });
})();
var BrnAvatarComponent = class _BrnAvatarComponent {
  image = contentChild(BrnAvatarImageDirective);
  /** @nocollapse */
  static ɵfac = function BrnAvatarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnAvatarComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnAvatarComponent,
    selectors: [["brn-avatar"]],
    contentQueries: function BrnAvatarComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.image, BrnAvatarImageDirective, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    ngContentSelectors: _c1,
    decls: 2,
    vars: 1,
    template: function BrnAvatarComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c0);
        ɵɵtemplate(0, BrnAvatarComponent_Conditional_0_Template, 1, 0)(1, BrnAvatarComponent_Conditional_1_Template, 1, 0);
      }
      if (rf & 2) {
        let tmp_0_0;
        ɵɵconditional(((tmp_0_0 = ctx.image()) == null ? null : tmp_0_0.canShow()) ? 0 : 1);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnAvatarComponent, [{
    type: Component,
    args: [{
      selector: "brn-avatar",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: `
		@if (image()?.canShow()) {
			<ng-content select="[brnAvatarImage]" />
		} @else {
			<ng-content select="[brnAvatarFallback]" />
		}
	`
    }]
  }], null, null);
})();
var BrnAvatarFallbackDirective = class _BrnAvatarFallbackDirective {
  _element = inject(ElementRef).nativeElement;
  userClass = input("", {
    alias: "class"
  });
  autoColor = input(false, {
    transform: booleanAttribute
  });
  getTextContent() {
    return this._element.textContent;
  }
  /** @nocollapse */
  static ɵfac = function BrnAvatarFallbackDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnAvatarFallbackDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnAvatarFallbackDirective,
    selectors: [["", "brnAvatarFallback", ""]],
    inputs: {
      userClass: [1, "class", "userClass"],
      autoColor: [1, "autoColor"]
    },
    exportAs: ["avatarFallback"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnAvatarFallbackDirective, [{
    type: Directive,
    args: [{
      selector: "[brnAvatarFallback]",
      standalone: true,
      exportAs: "avatarFallback"
    }]
  }], null, null);
})();
function hashString(str) {
  let h;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h || 0) + str.charCodeAt(i) | 0;
  return h || 0;
}
function hashManyTimes(times, str) {
  let h = hashString(str);
  for (let i = 0; i < times; i++) h = hashString(String(h));
  return h;
}
function hexColorFor(str) {
  const hash = str.length <= 2 ? hashManyTimes(5, str) : hashString(str);
  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = hash >> i * 8 & 255;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}
var toInitial = (capitalize = true) => (word) => {
  const initial = word.charAt(0);
  return capitalize ? initial.toLocaleUpperCase() : initial;
};
var firstAndLast = (initials) => `${initials[0]}${initials[initials.length - 1]}`;
var InitialsPipe = class _InitialsPipe {
  transform(name, capitalize = true, firstAndLastOnly = true, delimiter = " ") {
    if (!name) return "";
    const initials = name.trim().split(delimiter).filter(Boolean).map(toInitial(capitalize));
    if (firstAndLastOnly && initials.length > 1) return firstAndLast(initials);
    return initials.join("");
  }
  /** @nocollapse */
  static ɵfac = function InitialsPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InitialsPipe)();
  };
  /** @nocollapse */
  static ɵpipe = ɵɵdefinePipe({
    name: "initials",
    type: _InitialsPipe,
    pure: true
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InitialsPipe, [{
    type: Pipe,
    args: [{
      name: "initials",
      standalone: true
    }]
  }], null, null);
})();
var isShortHand = (hex) => hex.length === 3;
var cleanup = (hex) => {
  const noHash = hex.replace("#", "").trim().toLowerCase();
  if (!isShortHand(noHash)) return noHash;
  return noHash.split("").map((char) => char + char).join("");
};
var isBright = (hex) => Number.parseInt(cleanup(hex), 16) > 16777215 / 1.25;
var BrnAvatarImports = [BrnAvatarComponent, BrnAvatarFallbackDirective, BrnAvatarImageDirective];
var BrnAvatarModule = class _BrnAvatarModule {
  /** @nocollapse */
  static ɵfac = function BrnAvatarModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnAvatarModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _BrnAvatarModule,
    imports: [BrnAvatarComponent, BrnAvatarFallbackDirective, BrnAvatarImageDirective],
    exports: [BrnAvatarComponent, BrnAvatarFallbackDirective, BrnAvatarImageDirective]
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnAvatarModule, [{
    type: NgModule,
    args: [{
      imports: [...BrnAvatarImports],
      exports: [...BrnAvatarImports]
    }]
  }], null, null);
})();
export {
  BrnAvatarComponent,
  BrnAvatarFallbackDirective,
  BrnAvatarImageDirective,
  BrnAvatarImports,
  BrnAvatarModule,
  InitialsPipe,
  hexColorFor,
  isBright
};
//# sourceMappingURL=@spartan-ng_brain_avatar.js.map
