import {
  ErrorStateMatcher,
  ErrorStateTracker
} from "./chunk-IQZQ567O.js";
import {
  BrnFormFieldControl
} from "./chunk-OBSGMN66.js";
import {
  ActiveDescendantKeyManager
} from "./chunk-ZW62AG5I.js";
import {
  BrnLabelDirective
} from "./chunk-3QNA5THV.js";
import "./chunk-YUX3MMK3.js";
import {
  takeUntilDestroyed,
  toObservable,
  toSignal
} from "./chunk-NQTT4SFU.js";
import "./chunk-PFK2ZDSC.js";
import "./chunk-FR2CQ6ZG.js";
import "./chunk-QTVNIIM2.js";
import {
  provideExposedSideProviderExisting,
  provideExposesStateProviderExisting
} from "./chunk-42P2JB6C.js";
import "./chunk-H7QGH3RH.js";
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  OverlayModule
} from "./chunk-3O3MFXS3.js";
import {
  Directionality
} from "./chunk-FXRHJ26G.js";
import {
  A,
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
  _IdGenerator,
  hasModifierKey
} from "./chunk-MOZ2DJVD.js";
import {
  Platform,
  coerceArray
} from "./chunk-UXQYWOLL.js";
import {
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm
} from "./chunk-KA6QQ6AI.js";
import {
  NgTemplateOutlet
} from "./chunk-O2JNKGSU.js";
import {
  isPlatformBrowser
} from "./chunk-A3A3ULYF.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  NgZone,
  Output,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  setClassMetadata,
  signal,
  untracked,
  viewChild,
  ɵɵHostDirectivesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵcontentQuery,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵhostProperty,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryAdvance,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuerySignal
} from "./chunk-NQQX34FG.js";
import {
  defer,
  fromEvent,
  merge
} from "./chunk-WPM5VTLQ.js";
import "./chunk-PEBH6BBU.js";
import {
  Subject,
  delay,
  filter,
  interval,
  map,
  of,
  startWith,
  switchMap,
  takeUntil
} from "./chunk-4S3KYZTJ.js";
import "./chunk-WDMUDEB6.js";

// node_modules/@angular/cdk/fesm2022/selection-model-0f5fc202.mjs
var SelectionModel = class {
  _multiple;
  _emitChanges;
  compareWith;
  /** Currently-selected values. */
  _selection = /* @__PURE__ */ new Set();
  /** Keeps track of the deselected options that haven't been emitted by the change event. */
  _deselectedToEmit = [];
  /** Keeps track of the selected options that haven't been emitted by the change event. */
  _selectedToEmit = [];
  /** Cache for the array value of the selected items. */
  _selected;
  /** Selected values. */
  get selected() {
    if (!this._selected) {
      this._selected = Array.from(this._selection.values());
    }
    return this._selected;
  }
  /** Event emitted when the value has changed. */
  changed = new Subject();
  constructor(_multiple = false, initiallySelectedValues, _emitChanges = true, compareWith) {
    this._multiple = _multiple;
    this._emitChanges = _emitChanges;
    this.compareWith = compareWith;
    if (initiallySelectedValues && initiallySelectedValues.length) {
      if (_multiple) {
        initiallySelectedValues.forEach((value) => this._markSelected(value));
      } else {
        this._markSelected(initiallySelectedValues[0]);
      }
      this._selectedToEmit.length = 0;
    }
  }
  /**
   * Selects a value or an array of values.
   * @param values The values to select
   * @return Whether the selection changed as a result of this call
   * @breaking-change 16.0.0 make return type boolean
   */
  select(...values) {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._markSelected(value));
    const changed = this._hasQueuedChanges();
    this._emitChangeEvent();
    return changed;
  }
  /**
   * Deselects a value or an array of values.
   * @param values The values to deselect
   * @return Whether the selection changed as a result of this call
   * @breaking-change 16.0.0 make return type boolean
   */
  deselect(...values) {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._unmarkSelected(value));
    const changed = this._hasQueuedChanges();
    this._emitChangeEvent();
    return changed;
  }
  /**
   * Sets the selected values
   * @param values The new selected values
   * @return Whether the selection changed as a result of this call
   * @breaking-change 16.0.0 make return type boolean
   */
  setSelection(...values) {
    this._verifyValueAssignment(values);
    const oldValues = this.selected;
    const newSelectedSet = new Set(values.map((value) => this._getConcreteValue(value)));
    values.forEach((value) => this._markSelected(value));
    oldValues.filter((value) => !newSelectedSet.has(this._getConcreteValue(value, newSelectedSet))).forEach((value) => this._unmarkSelected(value));
    const changed = this._hasQueuedChanges();
    this._emitChangeEvent();
    return changed;
  }
  /**
   * Toggles a value between selected and deselected.
   * @param value The value to toggle
   * @return Whether the selection changed as a result of this call
   * @breaking-change 16.0.0 make return type boolean
   */
  toggle(value) {
    return this.isSelected(value) ? this.deselect(value) : this.select(value);
  }
  /**
   * Clears all of the selected values.
   * @param flushEvent Whether to flush the changes in an event.
   *   If false, the changes to the selection will be flushed along with the next event.
   * @return Whether the selection changed as a result of this call
   * @breaking-change 16.0.0 make return type boolean
   */
  clear(flushEvent = true) {
    this._unmarkAll();
    const changed = this._hasQueuedChanges();
    if (flushEvent) {
      this._emitChangeEvent();
    }
    return changed;
  }
  /**
   * Determines whether a value is selected.
   */
  isSelected(value) {
    return this._selection.has(this._getConcreteValue(value));
  }
  /**
   * Determines whether the model does not have a value.
   */
  isEmpty() {
    return this._selection.size === 0;
  }
  /**
   * Determines whether the model has a value.
   */
  hasValue() {
    return !this.isEmpty();
  }
  /**
   * Sorts the selected values based on a predicate function.
   */
  sort(predicate) {
    if (this._multiple && this.selected) {
      this._selected.sort(predicate);
    }
  }
  /**
   * Gets whether multiple values can be selected.
   */
  isMultipleSelection() {
    return this._multiple;
  }
  /** Emits a change event and clears the records of selected and deselected values. */
  _emitChangeEvent() {
    this._selected = null;
    if (this._selectedToEmit.length || this._deselectedToEmit.length) {
      this.changed.next({
        source: this,
        added: this._selectedToEmit,
        removed: this._deselectedToEmit
      });
      this._deselectedToEmit = [];
      this._selectedToEmit = [];
    }
  }
  /** Selects a value. */
  _markSelected(value) {
    value = this._getConcreteValue(value);
    if (!this.isSelected(value)) {
      if (!this._multiple) {
        this._unmarkAll();
      }
      if (!this.isSelected(value)) {
        this._selection.add(value);
      }
      if (this._emitChanges) {
        this._selectedToEmit.push(value);
      }
    }
  }
  /** Deselects a value. */
  _unmarkSelected(value) {
    value = this._getConcreteValue(value);
    if (this.isSelected(value)) {
      this._selection.delete(value);
      if (this._emitChanges) {
        this._deselectedToEmit.push(value);
      }
    }
  }
  /** Clears out the selected values. */
  _unmarkAll() {
    if (!this.isEmpty()) {
      this._selection.forEach((value) => this._unmarkSelected(value));
    }
  }
  /**
   * Verifies the value assignment and throws an error if the specified value array is
   * including multiple values while the selection model is not supporting multiple values.
   */
  _verifyValueAssignment(values) {
    if (values.length > 1 && !this._multiple && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMultipleValuesInSingleSelectionError();
    }
  }
  /** Whether there are queued up change to be emitted. */
  _hasQueuedChanges() {
    return !!(this._deselectedToEmit.length || this._selectedToEmit.length);
  }
  /** Returns a value that is comparable to inputValue by applying compareWith function, returns the same inputValue otherwise. */
  _getConcreteValue(inputValue, selection) {
    if (!this.compareWith) {
      return inputValue;
    } else {
      selection = selection ?? this._selection;
      for (let selectedValue of selection) {
        if (this.compareWith(inputValue, selectedValue)) {
          return selectedValue;
        }
      }
      return inputValue;
    }
  }
};
function getMultipleValuesInSingleSelectionError() {
  return Error("Cannot pass multiple values into SelectionModel with single-value mode.");
}

// node_modules/@angular/cdk/fesm2022/listbox.mjs
var ListboxSelectionModel = class extends SelectionModel {
  multiple;
  constructor(multiple = false, initiallySelectedValues, emitChanges = true, compareWith) {
    super(true, initiallySelectedValues, emitChanges, compareWith);
    this.multiple = multiple;
  }
  isMultipleSelection() {
    return this.multiple;
  }
  select(...values) {
    if (this.multiple) {
      return super.select(...values);
    } else {
      return super.setSelection(...values);
    }
  }
};
var CdkOption = class _CdkOption {
  /** The id of the option's host element. */
  get id() {
    return this._id || this._generatedId;
  }
  set id(value) {
    this._id = value;
  }
  _id;
  _generatedId = inject(_IdGenerator).getId("cdk-option-");
  /** The value of this option. */
  value;
  /**
   * The text used to locate this item during listbox typeahead. If not specified,
   * the `textContent` of the item will be used.
   */
  typeaheadLabel;
  /** Whether this option is disabled. */
  get disabled() {
    return this.listbox.disabled || this._disabled();
  }
  set disabled(value) {
    this._disabled.set(value);
  }
  _disabled = signal(false);
  /** The tabindex of the option when it is enabled. */
  get enabledTabIndex() {
    return this._enabledTabIndex() === void 0 ? this.listbox.enabledTabIndex : this._enabledTabIndex();
  }
  set enabledTabIndex(value) {
    this._enabledTabIndex.set(value);
  }
  _enabledTabIndex = signal(void 0);
  /** The option's host element */
  element = inject(ElementRef).nativeElement;
  /** The parent listbox this option belongs to. */
  listbox = inject(CdkListbox);
  /** Emits when the option is destroyed. */
  destroyed = new Subject();
  /** Emits when the option is clicked. */
  _clicked = new Subject();
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
  /** Whether this option is selected. */
  isSelected() {
    return this.listbox.isSelected(this);
  }
  /** Whether this option is active. */
  isActive() {
    return this.listbox.isActive(this);
  }
  /** Toggle the selected state of this option. */
  toggle() {
    this.listbox.toggle(this);
  }
  /** Select this option if it is not selected. */
  select() {
    this.listbox.select(this);
  }
  /** Deselect this option if it is selected. */
  deselect() {
    this.listbox.deselect(this);
  }
  /** Focus this option. */
  focus() {
    this.element.focus();
  }
  /** Get the label for this element which is required by the FocusableOption interface. */
  getLabel() {
    return (this.typeaheadLabel ?? this.element.textContent?.trim()) || "";
  }
  /**
   * No-op implemented as a part of `Highlightable`.
   * @docs-private
   */
  setActiveStyles() {
    if (this.listbox.useActiveDescendant) {
      this.element.scrollIntoView({
        block: "nearest",
        inline: "nearest"
      });
    }
  }
  /**
   * No-op implemented as a part of `Highlightable`.
   * @docs-private
   */
  setInactiveStyles() {
  }
  /** Handle focus events on the option. */
  _handleFocus() {
    if (this.listbox.useActiveDescendant) {
      this.listbox._setActiveOption(this);
      this.listbox.focus();
    }
  }
  /** Get the tabindex for this option. */
  _getTabIndex() {
    if (this.listbox.useActiveDescendant || this.disabled) {
      return -1;
    }
    return this.isActive() ? this.enabledTabIndex : -1;
  }
  static ɵfac = function CdkOption_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkOption)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkOption,
    selectors: [["", "cdkOption", ""]],
    hostAttrs: ["role", "option", 1, "cdk-option"],
    hostVars: 6,
    hostBindings: function CdkOption_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function CdkOption_click_HostBindingHandler($event) {
          return ctx._clicked.next($event);
        })("focus", function CdkOption_focus_HostBindingHandler() {
          return ctx._handleFocus();
        });
      }
      if (rf & 2) {
        ɵɵhostProperty("id", ctx.id);
        ɵɵattribute("aria-selected", ctx.isSelected())("tabindex", ctx._getTabIndex())("aria-disabled", ctx.disabled);
        ɵɵclassProp("cdk-option-active", ctx.isActive());
      }
    },
    inputs: {
      id: "id",
      value: [0, "cdkOption", "value"],
      typeaheadLabel: [0, "cdkOptionTypeaheadLabel", "typeaheadLabel"],
      disabled: [2, "cdkOptionDisabled", "disabled", booleanAttribute],
      enabledTabIndex: [0, "tabindex", "enabledTabIndex"]
    },
    exportAs: ["cdkOption"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkOption, [{
    type: Directive,
    args: [{
      selector: "[cdkOption]",
      exportAs: "cdkOption",
      host: {
        "role": "option",
        "class": "cdk-option",
        "[id]": "id",
        "[attr.aria-selected]": "isSelected()",
        "[attr.tabindex]": "_getTabIndex()",
        "[attr.aria-disabled]": "disabled",
        "[class.cdk-option-active]": "isActive()",
        "(click)": "_clicked.next($event)",
        "(focus)": "_handleFocus()"
      }
    }]
  }], null, {
    id: [{
      type: Input
    }],
    value: [{
      type: Input,
      args: ["cdkOption"]
    }],
    typeaheadLabel: [{
      type: Input,
      args: ["cdkOptionTypeaheadLabel"]
    }],
    disabled: [{
      type: Input,
      args: [{
        alias: "cdkOptionDisabled",
        transform: booleanAttribute
      }]
    }],
    enabledTabIndex: [{
      type: Input,
      args: ["tabindex"]
    }]
  });
})();
var CdkListbox = class _CdkListbox {
  _cleanupWindowBlur;
  /** The id of the option's host element. */
  get id() {
    return this._id || this._generatedId;
  }
  set id(value) {
    this._id = value;
  }
  _id;
  _generatedId = inject(_IdGenerator).getId("cdk-listbox-");
  /** The tabindex to use when the listbox is enabled. */
  get enabledTabIndex() {
    return this._enabledTabIndex() === void 0 ? 0 : this._enabledTabIndex();
  }
  set enabledTabIndex(value) {
    this._enabledTabIndex.set(value);
  }
  _enabledTabIndex = signal(void 0);
  /** The value selected in the listbox, represented as an array of option values. */
  get value() {
    return this._invalid ? [] : this.selectionModel.selected;
  }
  set value(value) {
    this._setSelection(value);
  }
  /**
   * Whether the listbox allows multiple options to be selected. If the value switches from `true`
   * to `false`, and more than one option is selected, all options are deselected.
   */
  get multiple() {
    return this.selectionModel.multiple;
  }
  set multiple(value) {
    this.selectionModel.multiple = value;
    if (this.options) {
      this._updateInternalValue();
    }
  }
  /** Whether the listbox is disabled. */
  get disabled() {
    return this._disabled();
  }
  set disabled(value) {
    this._disabled.set(value);
  }
  _disabled = signal(false);
  /** Whether the listbox will use active descendant or will move focus onto the options. */
  get useActiveDescendant() {
    return this._useActiveDescendant();
  }
  set useActiveDescendant(value) {
    this._useActiveDescendant.set(value);
  }
  _useActiveDescendant = signal(false);
  /** The orientation of the listbox. Only affects keyboard interaction, not visual layout. */
  get orientation() {
    return this._orientation;
  }
  set orientation(value) {
    this._orientation = value === "horizontal" ? "horizontal" : "vertical";
    if (value === "horizontal") {
      this.listKeyManager?.withHorizontalOrientation(this._dir?.value || "ltr");
    } else {
      this.listKeyManager?.withVerticalOrientation();
    }
  }
  _orientation = "vertical";
  /** The function used to compare option values. */
  get compareWith() {
    return this.selectionModel.compareWith;
  }
  set compareWith(fn) {
    this.selectionModel.compareWith = fn;
  }
  /**
   * Whether the keyboard navigation should wrap when the user presses arrow down on the last item
   * or arrow up on the first item.
   */
  get navigationWrapDisabled() {
    return this._navigationWrapDisabled;
  }
  set navigationWrapDisabled(wrap) {
    this._navigationWrapDisabled = wrap;
    this.listKeyManager?.withWrap(!this._navigationWrapDisabled);
  }
  _navigationWrapDisabled = false;
  /** Whether keyboard navigation should skip over disabled items. */
  get navigateDisabledOptions() {
    return this._navigateDisabledOptions;
  }
  set navigateDisabledOptions(skip) {
    this._navigateDisabledOptions = skip;
    this.listKeyManager?.skipPredicate(this._navigateDisabledOptions ? this._skipNonePredicate : this._skipDisabledPredicate);
  }
  _navigateDisabledOptions = false;
  /** Emits when the selected value(s) in the listbox change. */
  valueChange = new Subject();
  /** The child options in this listbox. */
  options;
  /** The selection model used by the listbox. */
  selectionModel = new ListboxSelectionModel();
  /** The key manager that manages keyboard navigation for this listbox. */
  listKeyManager;
  /** Emits when the listbox is destroyed. */
  destroyed = new Subject();
  /** The host element of the listbox. */
  element = inject(ElementRef).nativeElement;
  /** The Angular zone. */
  ngZone = inject(NgZone);
  /** The change detector for this listbox. */
  changeDetectorRef = inject(ChangeDetectorRef);
  /** Whether the currently selected value in the selection model is invalid. */
  _invalid = false;
  /** The last user-triggered option. */
  _lastTriggered = null;
  /** Callback called when the listbox has been touched */
  _onTouched = () => {
  };
  /** Callback called when the listbox value changes */
  _onChange = () => {
  };
  /** Emits when an option has been clicked. */
  _optionClicked = defer(() => this.options.changes.pipe(startWith(this.options), switchMap((options) => merge(...options.map((option) => option._clicked.pipe(map((event) => ({
    option,
    event
  }))))))));
  /** The directionality of the page. */
  _dir = inject(Directionality, {
    optional: true
  });
  /** Whether the component is being rendered in the browser. */
  _isBrowser = inject(Platform).isBrowser;
  /** A predicate that skips disabled options. */
  _skipDisabledPredicate = (option) => option.disabled;
  /** A predicate that does not skip any options. */
  _skipNonePredicate = () => false;
  /** Whether the listbox currently has focus. */
  _hasFocus = false;
  /** A reference to the option that was active before the listbox lost focus. */
  _previousActiveOption = null;
  constructor() {
    if (this._isBrowser) {
      const renderer = inject(Renderer2);
      this._cleanupWindowBlur = this.ngZone.runOutsideAngular(() => {
        return renderer.listen("window", "blur", () => {
          if (this.element.contains(document.activeElement) && this._previousActiveOption) {
            this._setActiveOption(this._previousActiveOption);
            this._previousActiveOption = null;
          }
        });
      });
    }
  }
  ngAfterContentInit() {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      this._verifyNoOptionValueCollisions();
      this._verifyOptionValues();
    }
    this._initKeyManager();
    merge(this.selectionModel.changed, this.options.changes).pipe(startWith(null), takeUntil(this.destroyed)).subscribe(() => this._updateInternalValue());
    this._optionClicked.pipe(filter(({
      option
    }) => !option.disabled), takeUntil(this.destroyed)).subscribe(({
      option,
      event
    }) => this._handleOptionClicked(option, event));
  }
  ngOnDestroy() {
    this._cleanupWindowBlur?.();
    this.listKeyManager?.destroy();
    this.destroyed.next();
    this.destroyed.complete();
  }
  /**
   * Toggle the selected state of the given option.
   * @param option The option to toggle
   */
  toggle(option) {
    this.toggleValue(option.value);
  }
  /**
   * Toggle the selected state of the given value.
   * @param value The value to toggle
   */
  toggleValue(value) {
    if (this._invalid) {
      this.selectionModel.clear(false);
    }
    this.selectionModel.toggle(value);
  }
  /**
   * Select the given option.
   * @param option The option to select
   */
  select(option) {
    this.selectValue(option.value);
  }
  /**
   * Select the given value.
   * @param value The value to select
   */
  selectValue(value) {
    if (this._invalid) {
      this.selectionModel.clear(false);
    }
    this.selectionModel.select(value);
  }
  /**
   * Deselect the given option.
   * @param option The option to deselect
   */
  deselect(option) {
    this.deselectValue(option.value);
  }
  /**
   * Deselect the given value.
   * @param value The value to deselect
   */
  deselectValue(value) {
    if (this._invalid) {
      this.selectionModel.clear(false);
    }
    this.selectionModel.deselect(value);
  }
  /**
   * Set the selected state of all options.
   * @param isSelected The new selected state to set
   */
  setAllSelected(isSelected) {
    if (!isSelected) {
      this.selectionModel.clear();
    } else {
      if (this._invalid) {
        this.selectionModel.clear(false);
      }
      this.selectionModel.select(...this.options.map((option) => option.value));
    }
  }
  /**
   * Get whether the given option is selected.
   * @param option The option to get the selected state of
   */
  isSelected(option) {
    return this.isValueSelected(option.value);
  }
  /**
   * Get whether the given option is active.
   * @param option The option to get the active state of
   */
  isActive(option) {
    return !!(this.listKeyManager?.activeItem === option);
  }
  /**
   * Get whether the given value is selected.
   * @param value The value to get the selected state of
   */
  isValueSelected(value) {
    if (this._invalid) {
      return false;
    }
    return this.selectionModel.isSelected(value);
  }
  /**
   * Registers a callback to be invoked when the listbox's value changes from user input.
   * @param fn The callback to register
   * @docs-private
   */
  registerOnChange(fn) {
    this._onChange = fn;
  }
  /**
   * Registers a callback to be invoked when the listbox is blurred by the user.
   * @param fn The callback to register
   * @docs-private
   */
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  /**
   * Sets the listbox's value.
   * @param value The new value of the listbox
   * @docs-private
   */
  writeValue(value) {
    this._setSelection(value);
    this._verifyOptionValues();
  }
  /**
   * Sets the disabled state of the listbox.
   * @param isDisabled The new disabled state
   * @docs-private
   */
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }
  /** Focus the listbox's host element. */
  focus() {
    this.element.focus();
  }
  /**
   * Triggers the given option in response to user interaction.
   * - In single selection mode: selects the option and deselects any other selected option.
   * - In multi selection mode: toggles the selected state of the option.
   * @param option The option to trigger
   */
  triggerOption(option) {
    if (option && !option.disabled) {
      this._lastTriggered = option;
      const changed = this.multiple ? this.selectionModel.toggle(option.value) : this.selectionModel.select(option.value);
      if (changed) {
        this._onChange(this.value);
        this.valueChange.next({
          value: this.value,
          listbox: this,
          option
        });
      }
    }
  }
  /**
   * Trigger the given range of options in response to user interaction.
   * Should only be called in multi-selection mode.
   * @param trigger The option that was triggered
   * @param from The start index of the options to toggle
   * @param to The end index of the options to toggle
   * @param on Whether to toggle the option range on
   */
  triggerRange(trigger, from, to, on) {
    if (this.disabled || trigger && trigger.disabled) {
      return;
    }
    this._lastTriggered = trigger;
    const isEqual = this.compareWith ?? Object.is;
    const updateValues = [...this.options].slice(Math.max(0, Math.min(from, to)), Math.min(this.options.length, Math.max(from, to) + 1)).filter((option) => !option.disabled).map((option) => option.value);
    const selected = [...this.value];
    for (const updateValue of updateValues) {
      const selectedIndex = selected.findIndex((selectedValue) => isEqual(selectedValue, updateValue));
      if (on && selectedIndex === -1) {
        selected.push(updateValue);
      } else if (!on && selectedIndex !== -1) {
        selected.splice(selectedIndex, 1);
      }
    }
    let changed = this.selectionModel.setSelection(...selected);
    if (changed) {
      this._onChange(this.value);
      this.valueChange.next({
        value: this.value,
        listbox: this,
        option: trigger
      });
    }
  }
  /**
   * Sets the given option as active.
   * @param option The option to make active
   */
  _setActiveOption(option) {
    this.listKeyManager.setActiveItem(option);
  }
  /** Called when the listbox receives focus. */
  _handleFocus() {
    if (!this.useActiveDescendant) {
      if (this.selectionModel.selected.length > 0) {
        this._setNextFocusToSelectedOption();
      } else {
        this.listKeyManager.setNextItemActive();
      }
      this._focusActiveOption();
    }
  }
  /** Called when the user presses keydown on the listbox. */
  _handleKeydown(event) {
    if (this.disabled) {
      return;
    }
    const {
      keyCode
    } = event;
    const previousActiveIndex = this.listKeyManager.activeItemIndex;
    const ctrlKeys = ["ctrlKey", "metaKey"];
    if (this.multiple && keyCode === A && hasModifierKey(event, ...ctrlKeys)) {
      this.triggerRange(null, 0, this.options.length - 1, this.options.length !== this.value.length);
      event.preventDefault();
      return;
    }
    if (this.multiple && (keyCode === SPACE || keyCode === ENTER) && hasModifierKey(event, "shiftKey")) {
      if (this.listKeyManager.activeItem && this.listKeyManager.activeItemIndex != null) {
        this.triggerRange(this.listKeyManager.activeItem, this._getLastTriggeredIndex() ?? this.listKeyManager.activeItemIndex, this.listKeyManager.activeItemIndex, !this.listKeyManager.activeItem.isSelected());
      }
      event.preventDefault();
      return;
    }
    if (this.multiple && keyCode === HOME && hasModifierKey(event, ...ctrlKeys) && hasModifierKey(event, "shiftKey")) {
      const trigger = this.listKeyManager.activeItem;
      if (trigger) {
        const from = this.listKeyManager.activeItemIndex;
        this.listKeyManager.setFirstItemActive();
        this.triggerRange(trigger, from, this.listKeyManager.activeItemIndex, !trigger.isSelected());
      }
      event.preventDefault();
      return;
    }
    if (this.multiple && keyCode === END && hasModifierKey(event, ...ctrlKeys) && hasModifierKey(event, "shiftKey")) {
      const trigger = this.listKeyManager.activeItem;
      if (trigger) {
        const from = this.listKeyManager.activeItemIndex;
        this.listKeyManager.setLastItemActive();
        this.triggerRange(trigger, from, this.listKeyManager.activeItemIndex, !trigger.isSelected());
      }
      event.preventDefault();
      return;
    }
    if (keyCode === SPACE || keyCode === ENTER) {
      this.triggerOption(this.listKeyManager.activeItem);
      event.preventDefault();
      return;
    }
    const isNavKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === HOME || keyCode === END;
    this.listKeyManager.onKeydown(event);
    if (isNavKey && event.shiftKey && previousActiveIndex !== this.listKeyManager.activeItemIndex) {
      this.triggerOption(this.listKeyManager.activeItem);
    }
  }
  /** Called when a focus moves into the listbox. */
  _handleFocusIn() {
    this._hasFocus = true;
  }
  /**
   * Called when the focus leaves an element in the listbox.
   * @param event The focusout event
   */
  _handleFocusOut(event) {
    this._previousActiveOption = this.listKeyManager.activeItem;
    const otherElement = event.relatedTarget;
    if (this.element !== otherElement && !this.element.contains(otherElement)) {
      this._onTouched();
      this._hasFocus = false;
      this._setNextFocusToSelectedOption();
    }
  }
  /** Get the id of the active option if active descendant is being used. */
  _getAriaActiveDescendant() {
    return this.useActiveDescendant ? this.listKeyManager?.activeItem?.id : null;
  }
  /** Get the tabindex for the listbox. */
  _getTabIndex() {
    if (this.disabled) {
      return -1;
    }
    return this.useActiveDescendant || !this.listKeyManager.activeItem ? this.enabledTabIndex : -1;
  }
  /** Initialize the key manager. */
  _initKeyManager() {
    this.listKeyManager = new ActiveDescendantKeyManager(this.options).withWrap(!this._navigationWrapDisabled).withTypeAhead().withHomeAndEnd().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._navigateDisabledOptions ? this._skipNonePredicate : this._skipDisabledPredicate);
    if (this.orientation === "vertical") {
      this.listKeyManager.withVerticalOrientation();
    } else {
      this.listKeyManager.withHorizontalOrientation(this._dir?.value || "ltr");
    }
    if (this.selectionModel.selected.length) {
      Promise.resolve().then(() => this._setNextFocusToSelectedOption());
    }
    this.listKeyManager.change.subscribe(() => this._focusActiveOption());
    this.options.changes.pipe(takeUntil(this.destroyed)).subscribe(() => {
      const activeOption = this.listKeyManager.activeItem;
      if (activeOption && !this.options.find((option) => option === activeOption)) {
        this.listKeyManager.setActiveItem(-1);
        this.changeDetectorRef.markForCheck();
      }
    });
  }
  /** Focus the active option. */
  _focusActiveOption() {
    if (!this.useActiveDescendant) {
      this.listKeyManager.activeItem?.focus();
    }
    this.changeDetectorRef.markForCheck();
  }
  /**
   * Set the selected values.
   * @param value The list of new selected values.
   */
  _setSelection(value) {
    if (this._invalid) {
      this.selectionModel.clear(false);
    }
    this.selectionModel.setSelection(...this._coerceValue(value));
    if (!this._hasFocus) {
      this._setNextFocusToSelectedOption();
    }
  }
  /** Sets the first selected option as first in the keyboard focus order. */
  _setNextFocusToSelectedOption() {
    const selected = this.options?.find((option) => option.isSelected());
    if (selected) {
      this.listKeyManager.updateActiveItem(selected);
    }
  }
  /** Update the internal value of the listbox based on the selection model. */
  _updateInternalValue() {
    const indexCache = /* @__PURE__ */ new Map();
    this.selectionModel.sort((a, b) => {
      const aIndex = this._getIndexForValue(indexCache, a);
      const bIndex = this._getIndexForValue(indexCache, b);
      return aIndex - bIndex;
    });
    const selected = this.selectionModel.selected;
    this._invalid = !this.multiple && selected.length > 1 || !!this._getInvalidOptionValues(selected).length;
    this.changeDetectorRef.markForCheck();
  }
  /**
   * Gets the index of the given value in the given list of options.
   * @param cache The cache of indices found so far
   * @param value The value to find
   * @return The index of the value in the options list
   */
  _getIndexForValue(cache, value) {
    const isEqual = this.compareWith || Object.is;
    if (!cache.has(value)) {
      let index = -1;
      for (let i = 0; i < this.options.length; i++) {
        if (isEqual(value, this.options.get(i).value)) {
          index = i;
          break;
        }
      }
      cache.set(value, index);
    }
    return cache.get(value);
  }
  /**
   * Handle the user clicking an option.
   * @param option The option that was clicked.
   */
  _handleOptionClicked(option, event) {
    event.preventDefault();
    this.listKeyManager.setActiveItem(option);
    if (event.shiftKey && this.multiple) {
      this.triggerRange(option, this._getLastTriggeredIndex() ?? this.listKeyManager.activeItemIndex, this.listKeyManager.activeItemIndex, !option.isSelected());
    } else {
      this.triggerOption(option);
    }
  }
  /** Verifies that no two options represent the same value under the compareWith function. */
  _verifyNoOptionValueCollisions() {
    this.options.changes.pipe(startWith(this.options), takeUntil(this.destroyed)).subscribe(() => {
      const isEqual = this.compareWith ?? Object.is;
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options.get(i);
        let duplicate = null;
        for (let j = i + 1; j < this.options.length; j++) {
          const other = this.options.get(j);
          if (isEqual(option.value, other.value)) {
            duplicate = other;
            break;
          }
        }
        if (duplicate) {
          if (this.compareWith) {
            console.warn(`Found multiple CdkOption representing the same value under the given compareWith function`, {
              option1: option.element,
              option2: duplicate.element,
              compareWith: this.compareWith
            });
          } else {
            console.warn(`Found multiple CdkOption with the same value`, {
              option1: option.element,
              option2: duplicate.element
            });
          }
          return;
        }
      }
    });
  }
  /** Verifies that the option values are valid. */
  _verifyOptionValues() {
    if (this.options && (typeof ngDevMode === "undefined" || ngDevMode)) {
      const selected = this.selectionModel.selected;
      const invalidValues = this._getInvalidOptionValues(selected);
      if (!this.multiple && selected.length > 1) {
        throw Error("Listbox cannot have more than one selected value in multi-selection mode.");
      }
      if (invalidValues.length) {
        throw Error("Listbox has selected values that do not match any of its options.");
      }
    }
  }
  /**
   * Coerces a value into an array representing a listbox selection.
   * @param value The value to coerce
   * @return An array
   */
  _coerceValue(value) {
    return value == null ? [] : coerceArray(value);
  }
  /**
   * Get the sublist of values that do not represent valid option values in this listbox.
   * @param values The list of values
   * @return The sublist of values that are not valid option values
   */
  _getInvalidOptionValues(values) {
    const isEqual = this.compareWith || Object.is;
    const validValues = (this.options || []).map((option) => option.value);
    return values.filter((value) => !validValues.some((validValue) => isEqual(value, validValue)));
  }
  /** Get the index of the last triggered option. */
  _getLastTriggeredIndex() {
    const index = this.options.toArray().indexOf(this._lastTriggered);
    return index === -1 ? null : index;
  }
  static ɵfac = function CdkListbox_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkListbox)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkListbox,
    selectors: [["", "cdkListbox", ""]],
    contentQueries: function CdkListbox_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, CdkOption, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.options = _t);
      }
    },
    hostAttrs: ["role", "listbox", 1, "cdk-listbox"],
    hostVars: 6,
    hostBindings: function CdkListbox_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("focus", function CdkListbox_focus_HostBindingHandler() {
          return ctx._handleFocus();
        })("keydown", function CdkListbox_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        })("focusout", function CdkListbox_focusout_HostBindingHandler($event) {
          return ctx._handleFocusOut($event);
        })("focusin", function CdkListbox_focusin_HostBindingHandler() {
          return ctx._handleFocusIn();
        });
      }
      if (rf & 2) {
        ɵɵhostProperty("id", ctx.id);
        ɵɵattribute("tabindex", ctx._getTabIndex())("aria-disabled", ctx.disabled)("aria-multiselectable", ctx.multiple)("aria-activedescendant", ctx._getAriaActiveDescendant())("aria-orientation", ctx.orientation);
      }
    },
    inputs: {
      id: "id",
      enabledTabIndex: [0, "tabindex", "enabledTabIndex"],
      value: [0, "cdkListboxValue", "value"],
      multiple: [2, "cdkListboxMultiple", "multiple", booleanAttribute],
      disabled: [2, "cdkListboxDisabled", "disabled", booleanAttribute],
      useActiveDescendant: [2, "cdkListboxUseActiveDescendant", "useActiveDescendant", booleanAttribute],
      orientation: [0, "cdkListboxOrientation", "orientation"],
      compareWith: [0, "cdkListboxCompareWith", "compareWith"],
      navigationWrapDisabled: [2, "cdkListboxNavigationWrapDisabled", "navigationWrapDisabled", booleanAttribute],
      navigateDisabledOptions: [2, "cdkListboxNavigatesDisabledOptions", "navigateDisabledOptions", booleanAttribute]
    },
    outputs: {
      valueChange: "cdkListboxValueChange"
    },
    exportAs: ["cdkListbox"],
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _CdkListbox),
      multi: true
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkListbox, [{
    type: Directive,
    args: [{
      selector: "[cdkListbox]",
      exportAs: "cdkListbox",
      host: {
        "role": "listbox",
        "class": "cdk-listbox",
        "[id]": "id",
        "[attr.tabindex]": "_getTabIndex()",
        "[attr.aria-disabled]": "disabled",
        "[attr.aria-multiselectable]": "multiple",
        "[attr.aria-activedescendant]": "_getAriaActiveDescendant()",
        "[attr.aria-orientation]": "orientation",
        "(focus)": "_handleFocus()",
        "(keydown)": "_handleKeydown($event)",
        "(focusout)": "_handleFocusOut($event)",
        "(focusin)": "_handleFocusIn()"
      },
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CdkListbox),
        multi: true
      }]
    }]
  }], () => [], {
    id: [{
      type: Input
    }],
    enabledTabIndex: [{
      type: Input,
      args: ["tabindex"]
    }],
    value: [{
      type: Input,
      args: ["cdkListboxValue"]
    }],
    multiple: [{
      type: Input,
      args: [{
        alias: "cdkListboxMultiple",
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        alias: "cdkListboxDisabled",
        transform: booleanAttribute
      }]
    }],
    useActiveDescendant: [{
      type: Input,
      args: [{
        alias: "cdkListboxUseActiveDescendant",
        transform: booleanAttribute
      }]
    }],
    orientation: [{
      type: Input,
      args: ["cdkListboxOrientation"]
    }],
    compareWith: [{
      type: Input,
      args: ["cdkListboxCompareWith"]
    }],
    navigationWrapDisabled: [{
      type: Input,
      args: [{
        alias: "cdkListboxNavigationWrapDisabled",
        transform: booleanAttribute
      }]
    }],
    navigateDisabledOptions: [{
      type: Input,
      args: [{
        alias: "cdkListboxNavigatesDisabledOptions",
        transform: booleanAttribute
      }]
    }],
    valueChange: [{
      type: Output,
      args: ["cdkListboxValueChange"]
    }],
    options: [{
      type: ContentChildren,
      args: [CdkOption, {
        descendants: true
      }]
    }]
  });
})();
var EXPORTED_DECLARATIONS = [CdkListbox, CdkOption];
var CdkListboxModule = class _CdkListboxModule {
  static ɵfac = function CdkListboxModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkListboxModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _CdkListboxModule,
    imports: [CdkListbox, CdkOption],
    exports: [CdkListbox, CdkOption]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkListboxModule, [{
    type: NgModule,
    args: [{
      imports: [...EXPORTED_DECLARATIONS],
      exports: [...EXPORTED_DECLARATIONS]
    }]
  }], null, null);
})();

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-select.mjs
var _c0 = ["viewport"];
var _c1 = ["*", [["hlm-select-scroll-up"]], [["brnSelectScrollUp"]], [["brnSelectScrollDown"]], [["hlm-select-scroll-down"]]];
var _c2 = ["*", "hlm-select-scroll-up", "brnSelectScrollUp", "brnSelectScrollDown", "hlm-select-scroll-down"];
function BrnSelectContentComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 1);
    ɵɵprojection(1, 2);
  }
}
function BrnSelectContentComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function BrnSelectContentComponent_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 3);
    ɵɵprojection(1, 4);
  }
}
function BrnSelectContentComponent_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
var _c3 = (a0) => ({
  $implicit: a0
});
function BrnSelectValueComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0, 2);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = ɵɵnextContext();
    const defaultPlaceholderTemplate_r2 = ɵɵreference(5);
    ɵɵproperty("ngTemplateOutlet", (tmp_3_0 = (tmp_3_0 = ctx_r0.customPlaceholderTemplate()) == null ? null : tmp_3_0.templateRef) !== null && tmp_3_0 !== void 0 ? tmp_3_0 : defaultPlaceholderTemplate_r2);
  }
}
function BrnSelectValueComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0, 3);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = ɵɵnextContext();
    const defaultValueTemplate_r3 = ɵɵreference(3);
    ɵɵproperty("ngTemplateOutlet", (tmp_3_0 = (tmp_3_0 = ctx_r0.customValueTemplate()) == null ? null : tmp_3_0.templateRef) !== null && tmp_3_0 !== void 0 ? tmp_3_0 : defaultValueTemplate_r3)("ngTemplateOutletContext", ɵɵpureFunction1(2, _c3, ctx_r0._select.value()));
  }
}
function BrnSelectValueComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtext(0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵtextInterpolate(ctx_r0.value());
  }
}
function BrnSelectValueComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtext(0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵtextInterpolate(ctx_r0.placeholder());
  }
}
var _c4 = [[["hlm-select-trigger"], ["", "brnSelectTrigger", ""]], [["label", "hlmLabel", ""], ["label", "brnLabel", ""]], "*"];
var _c5 = ["hlm-select-trigger,[brnSelectTrigger]", "label[hlmLabel],label[brnLabel]", "*"];
function BrnSelectComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "label", 1);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵattribute("id", ctx_r1.labelId());
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r1.placeholder());
  }
}
function BrnSelectComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 1);
  }
}
function BrnSelectComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 2);
  }
}
var BrnSelectContentToken = new InjectionToken("BrnSelectContentToken");
function injectBrnSelectContent() {
  return inject(BrnSelectContentToken);
}
function provideBrnSelectContent(select) {
  return {
    provide: BrnSelectContentToken,
    useExisting: select
  };
}
var BrnSelectToken = new InjectionToken("BrnSelectToken");
function injectBrnSelect() {
  return inject(BrnSelectToken);
}
function provideBrnSelect(select) {
  return {
    provide: BrnSelectToken,
    useExisting: select
  };
}
var nextId$1 = 0;
var BrnSelectOptionDirective = class _BrnSelectOptionDirective {
  _select = injectBrnSelect();
  _content = injectBrnSelectContent();
  elementRef = inject(ElementRef);
  id = input(`brn-option-${nextId$1++}`);
  value = input();
  // we use "_disabled" here because disabled is already defined in the Highlightable interface
  _disabled = input(false, {
    alias: "disabled",
    transform: booleanAttribute
  });
  get disabled() {
    return this._disabled();
  }
  selected = computed(() => this.value() !== void 0 && this._select.isSelected(this.value()));
  _active = signal(false);
  checkedState = computed(() => this.selected() ? "checked" : "unchecked");
  dir = this._select.dir;
  select() {
    if (this._disabled()) {
      return;
    }
    this._select.selectOption(this.value());
  }
  /** Get the label for this element which is required by the FocusableOption interface. */
  getLabel() {
    return this.elementRef.nativeElement.textContent?.trim() ?? "";
  }
  setActiveStyles() {
    this._active.set(true);
    this.elementRef.nativeElement.scrollIntoView({
      block: "nearest"
    });
  }
  setInactiveStyles() {
    this._active.set(false);
  }
  activate() {
    if (this._disabled()) {
      return;
    }
    this._content.setActiveOption(this);
  }
  /** @nocollapse */
  static ɵfac = function BrnSelectOptionDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectOptionDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnSelectOptionDirective,
    selectors: [["", "brnOption", ""]],
    hostAttrs: ["role", "option"],
    hostVars: 6,
    hostBindings: function BrnSelectOptionDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function BrnSelectOptionDirective_click_HostBindingHandler() {
          return ctx.select();
        })("mouseenter", function BrnSelectOptionDirective_mouseenter_HostBindingHandler() {
          return ctx.activate();
        });
      }
      if (rf & 2) {
        ɵɵhostProperty("id", ctx.id());
        ɵɵattribute("aria-selected", ctx.selected())("aria-disabled", ctx._disabled())("dir", ctx._select.dir())("data-active", ctx._active() ? "" : void 0)("data-disabled", ctx._disabled() ? "" : void 0);
      }
    },
    inputs: {
      id: [1, "id"],
      value: [1, "value"],
      _disabled: [1, "disabled", "_disabled"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectOptionDirective, [{
    type: Directive,
    args: [{
      selector: "[brnOption]",
      standalone: true,
      host: {
        role: "option",
        "[id]": "id()",
        "[attr.aria-selected]": "selected()",
        "[attr.aria-disabled]": "_disabled()",
        "(click)": "select()",
        "[attr.dir]": "_select.dir()",
        "[attr.data-active]": "_active() ? '' : undefined",
        "[attr.data-disabled]": "_disabled() ? '' : undefined",
        "(mouseenter)": "activate()"
      }
    }]
  }], null, null);
})();
var SCROLLBY_PIXELS = 100;
var BrnSelectScrollUpDirective = class _BrnSelectScrollUpDirective {
  _el = inject(ElementRef);
  _selectContent = inject(BrnSelectContentComponent);
  _endReached = new Subject();
  _destroyRef = inject(DestroyRef);
  startEmittingEvents() {
    const mouseLeave$ = fromEvent(this._el.nativeElement, "mouseleave");
    interval(100).pipe(takeUntil(mouseLeave$), takeUntil(this._endReached), takeUntilDestroyed(this._destroyRef)).subscribe(() => this._selectContent.moveFocusUp());
  }
  stopEmittingEvents() {
    this._endReached.next(true);
  }
  /** @nocollapse */
  static ɵfac = function BrnSelectScrollUpDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectScrollUpDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnSelectScrollUpDirective,
    selectors: [["", "brnSelectScrollUp", ""], ["brn-select-scroll-up"], ["hlm-select-scroll-up", 5, "noHlm"]],
    hostAttrs: ["aria-hidden", "true"],
    hostBindings: function BrnSelectScrollUpDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("mouseenter", function BrnSelectScrollUpDirective_mouseenter_HostBindingHandler() {
          return ctx.startEmittingEvents();
        });
      }
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectScrollUpDirective, [{
    type: Directive,
    args: [{
      selector: "[brnSelectScrollUp], brn-select-scroll-up, hlm-select-scroll-up:not(noHlm)",
      standalone: true,
      host: {
        "aria-hidden": "true",
        "(mouseenter)": "startEmittingEvents()"
      }
    }]
  }], null, null);
})();
var BrnSelectScrollDownDirective = class _BrnSelectScrollDownDirective {
  _el = inject(ElementRef);
  _selectContent = inject(BrnSelectContentComponent);
  _endReached = new Subject();
  _destroyRef = inject(DestroyRef);
  startEmittingEvents() {
    const mouseLeave$ = fromEvent(this._el.nativeElement, "mouseleave");
    interval(100).pipe(takeUntil(mouseLeave$), takeUntil(this._endReached), takeUntilDestroyed(this._destroyRef)).subscribe(() => this._selectContent.moveFocusDown());
  }
  stopEmittingEvents() {
    this._endReached.next(true);
  }
  /** @nocollapse */
  static ɵfac = function BrnSelectScrollDownDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectScrollDownDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnSelectScrollDownDirective,
    selectors: [["", "brnSelectScrollDown", ""], ["brn-select-scroll-down"], ["hlm-select-scroll-down", 5, "noHlm"]],
    hostAttrs: ["aria-hidden", "true"],
    hostBindings: function BrnSelectScrollDownDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("mouseenter", function BrnSelectScrollDownDirective_mouseenter_HostBindingHandler() {
          return ctx.startEmittingEvents();
        });
      }
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectScrollDownDirective, [{
    type: Directive,
    args: [{
      selector: "[brnSelectScrollDown], brn-select-scroll-down, hlm-select-scroll-down:not(noHlm)",
      standalone: true,
      host: {
        "aria-hidden": "true",
        "(mouseenter)": "startEmittingEvents()"
      }
    }]
  }], null, null);
})();
var BrnSelectContentComponent = class _BrnSelectContentComponent {
  _elementRef = inject(ElementRef);
  _injector = inject(Injector);
  _select = injectBrnSelect();
  canScrollUp = signal(false);
  canScrollDown = signal(false);
  viewport = viewChild.required("viewport");
  scrollUpBtn = contentChild(BrnSelectScrollUpDirective);
  scrollDownBtn = contentChild(BrnSelectScrollDownDirective);
  _options = contentChildren(BrnSelectOptionDirective, {
    descendants: true
  });
  /** @internal */
  keyManager = null;
  constructor() {
    effect(() => {
      this._select.open() && afterNextRender(() => this.updateArrowDisplay(), {
        injector: this._injector
      });
    });
  }
  ngAfterContentInit() {
    this.keyManager = new ActiveDescendantKeyManager(this._options, this._injector).withHomeAndEnd().withVerticalOrientation().withTypeAhead().withAllowedModifierKeys(["shiftKey"]).withWrap().skipPredicate((option) => option._disabled());
    effect(() => {
      const open = this._select.open();
      const options = this._options();
      if (!open || !options.length) {
        return;
      }
      untracked(() => {
        const selectedOption = options.find((option) => option.selected());
        if (selectedOption) {
          this.keyManager?.setActiveItem(selectedOption);
        } else {
          this.keyManager?.setFirstItemActive();
        }
      });
    }, {
      injector: this._injector
    });
  }
  updateArrowDisplay() {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = this.viewport().nativeElement;
    this.canScrollUp.set(scrollTop > 0);
    const maxScroll = scrollHeight - clientHeight;
    this.canScrollDown.set(Math.ceil(scrollTop) < maxScroll);
  }
  handleScroll() {
    this.updateArrowDisplay();
  }
  focusList() {
    this._elementRef.nativeElement.focus();
  }
  moveFocusUp() {
    this.viewport().nativeElement.scrollBy({
      top: -SCROLLBY_PIXELS,
      behavior: "smooth"
    });
    if (this.viewport().nativeElement.scrollTop === 0) {
      this.scrollUpBtn()?.stopEmittingEvents();
    }
  }
  moveFocusDown() {
    this.viewport().nativeElement.scrollBy({
      top: SCROLLBY_PIXELS,
      behavior: "smooth"
    });
    const viewportSize = this._elementRef.nativeElement.scrollHeight;
    const viewportScrollPosition = this.viewport().nativeElement.scrollTop;
    if (viewportSize + viewportScrollPosition + SCROLLBY_PIXELS > this.viewport().nativeElement.scrollHeight + SCROLLBY_PIXELS / 2) {
      this.scrollDownBtn()?.stopEmittingEvents();
    }
  }
  setActiveOption(option) {
    const index = this._options().findIndex((o) => o === option);
    if (index === -1) {
      return;
    }
    this.keyManager?.setActiveItem(index);
  }
  selectActiveItem(event) {
    event.preventDefault();
    const activeOption = this.keyManager?.activeItem;
    if (activeOption) {
      this._select.selectOption(activeOption.value());
    }
  }
  /** @nocollapse */
  static ɵfac = function BrnSelectContentComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectContentComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnSelectContentComponent,
    selectors: [["brn-select-content"], ["hlm-select-content", 5, "noHlm"]],
    contentQueries: function BrnSelectContentComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.scrollUpBtn, BrnSelectScrollUpDirective, 5);
        ɵɵcontentQuerySignal(dirIndex, ctx.scrollDownBtn, BrnSelectScrollDownDirective, 5);
        ɵɵcontentQuerySignal(dirIndex, ctx._options, BrnSelectOptionDirective, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(3);
      }
    },
    viewQuery: function BrnSelectContentComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuerySignal(ctx.viewport, _c0, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    hostAttrs: ["role", "listbox", "tabindex", "0", "aria-orientation", "vertical"],
    hostVars: 7,
    hostBindings: function BrnSelectContentComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("keydown", function BrnSelectContentComponent_keydown_HostBindingHandler($event) {
          return ctx.keyManager == null ? null : ctx.keyManager.onKeydown($event);
        })("keydown.enter", function BrnSelectContentComponent_keydown_enter_HostBindingHandler($event) {
          return ctx.selectActiveItem($event);
        })("keydown.space", function BrnSelectContentComponent_keydown_space_HostBindingHandler($event) {
          return ctx.selectActiveItem($event);
        });
      }
      if (rf & 2) {
        ɵɵhostProperty("id", ctx._select.id() + "--content");
        ɵɵattribute("aria-multiselectable", ctx._select.multiple())("aria-disabled", ctx._select.disabled() || ctx._select._formDisabled())("aria-activedescendant", ctx.keyManager == null ? null : ctx.keyManager.activeItem == null ? null : ctx.keyManager.activeItem.id())("aria-labelledBy", ctx._select.labelId())("aria-controlledBy", ctx._select.id() + "--trigger")("dir", ctx._select.dir());
      }
    },
    features: [ɵɵProvidersFeature([provideBrnSelectContent(_BrnSelectContentComponent)])],
    ngContentSelectors: _c2,
    decls: 9,
    vars: 2,
    consts: [["scrollUp", ""], ["viewport", ""], ["scrollDown", ""], [4, "ngTemplateOutlet"], ["data-brn-select-viewport", "", 2, "flex", "1 1 0%", "position", "relative", "width", "100%", "overflow", "auto", "min-height", "36px", "padding-bottom", "2px", "margin-bottom", "-2px", 3, "scroll"]],
    template: function BrnSelectContentComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵprojectionDef(_c1);
        ɵɵtemplate(0, BrnSelectContentComponent_ng_template_0_Template, 2, 0, "ng-template", null, 0, ɵɵtemplateRefExtractor)(2, BrnSelectContentComponent_ng_container_2_Template, 1, 0, "ng-container", 3);
        ɵɵelementStart(3, "div", 4, 1);
        ɵɵlistener("scroll", function BrnSelectContentComponent_Template_div_scroll_3_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.handleScroll());
        });
        ɵɵprojection(5);
        ɵɵelementEnd();
        ɵɵtemplate(6, BrnSelectContentComponent_ng_template_6_Template, 2, 0, "ng-template", null, 2, ɵɵtemplateRefExtractor)(8, BrnSelectContentComponent_ng_container_8_Template, 1, 0, "ng-container", 3);
      }
      if (rf & 2) {
        const scrollUp_r2 = ɵɵreference(1);
        const scrollDown_r3 = ɵɵreference(7);
        ɵɵadvance(2);
        ɵɵproperty("ngTemplateOutlet", ctx.canScrollUp() && ctx.scrollUpBtn() ? scrollUp_r2 : null);
        ɵɵadvance(6);
        ɵɵproperty("ngTemplateOutlet", ctx.canScrollDown() && ctx.scrollDownBtn() ? scrollDown_r3 : null);
      }
    },
    dependencies: [NgTemplateOutlet],
    styles: ["[_nghost-%COMP%]{display:flex;box-sizing:border-box;flex-direction:column;outline:none;pointer-events:auto}[data-brn-select-viewport][_ngcontent-%COMP%]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch}[data-brn-select-viewport][_ngcontent-%COMP%]::-webkit-scrollbar{display:none}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectContentComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "brn-select-content, hlm-select-content:not(noHlm)",
      imports: [NgTemplateOutlet],
      providers: [provideBrnSelectContent(BrnSelectContentComponent)],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        role: "listbox",
        tabindex: "0",
        "[attr.aria-multiselectable]": "_select.multiple()",
        "[attr.aria-disabled]": "_select.disabled() || _select._formDisabled()",
        "aria-orientation": "vertical",
        "[attr.aria-activedescendant]": "keyManager?.activeItem?.id()",
        "[attr.aria-labelledBy]": "_select.labelId()",
        "[attr.aria-controlledBy]": "_select.id() +'--trigger'",
        "[id]": "_select.id() + '--content'",
        "[attr.dir]": "_select.dir()",
        "(keydown)": "keyManager?.onKeydown($event)",
        "(keydown.enter)": "selectActiveItem($event)",
        "(keydown.space)": "selectActiveItem($event)"
      },
      template: `
		<ng-template #scrollUp>
			<ng-content select="hlm-select-scroll-up" />
			<ng-content select="brnSelectScrollUp" />
		</ng-template>
		<ng-container *ngTemplateOutlet="canScrollUp() && scrollUpBtn() ? scrollUp : null" />
		<div
			data-brn-select-viewport
			#viewport
			(scroll)="handleScroll()"
			style="flex: 1 1 0%;
			position: relative;
			width:100%;
			overflow:auto;
			min-height: 36px;
      padding-bottom: 2px;
      margin-bottom: -2px;"
		>
			<ng-content />
		</div>
		<ng-template #scrollDown>
			<ng-content select="brnSelectScrollDown" />
			<ng-content select="hlm-select-scroll-down" />
		</ng-template>
		<ng-container *ngTemplateOutlet="canScrollDown() && scrollDownBtn() ? scrollDown : null" />
	`,
      styles: [":host{display:flex;box-sizing:border-box;flex-direction:column;outline:none;pointer-events:auto}[data-brn-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch}[data-brn-select-viewport]::-webkit-scrollbar{display:none}\n"]
    }]
  }], () => [], null);
})();
var BrnSelectGroupDirective = class _BrnSelectGroupDirective {
  labelledBy = signal("");
  /** @nocollapse */
  static ɵfac = function BrnSelectGroupDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectGroupDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnSelectGroupDirective,
    selectors: [["", "brnSelectGroup", ""]],
    hostAttrs: ["role", "group"],
    hostVars: 1,
    hostBindings: function BrnSelectGroupDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("aria-labelledby", ctx.labelledBy());
      }
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectGroupDirective, [{
    type: Directive,
    args: [{
      selector: "[brnSelectGroup]",
      standalone: true,
      host: {
        role: "group",
        "[attr.aria-labelledby]": "labelledBy()"
      }
    }]
  }], null, null);
})();
var BrnSelectLabelDirective = class _BrnSelectLabelDirective {
  _group = inject(BrnSelectGroupDirective, {
    optional: true
  });
  _label = inject(BrnLabelDirective, {
    host: true
  });
  constructor() {
    this._group?.labelledBy.set(this._label.id());
  }
  /** @nocollapse */
  static ɵfac = function BrnSelectLabelDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectLabelDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnSelectLabelDirective,
    selectors: [["", "brnSelectLabel", ""]],
    features: [ɵɵHostDirectivesFeature([BrnLabelDirective])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectLabelDirective, [{
    type: Directive,
    args: [{
      selector: "[brnSelectLabel]",
      hostDirectives: [BrnLabelDirective],
      standalone: true
    }]
  }], () => [], null);
})();
var BrnSelectPlaceholderDirective = class _BrnSelectPlaceholderDirective {
  /** @internale */
  templateRef = inject(TemplateRef);
  /** @nocollapse */
  static ɵfac = function BrnSelectPlaceholderDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectPlaceholderDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnSelectPlaceholderDirective,
    selectors: [["", "brnSelectPlaceholder", ""], ["", "hlmSelectPlaceholder", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectPlaceholderDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[brnSelectPlaceholder], [hlmSelectPlaceholder]"
    }]
  }], null, null);
})();
var BrnSelectTriggerDirective = class _BrnSelectTriggerDirective {
  _elementRef = inject(ElementRef);
  _select = injectBrnSelect();
  _ngControl = inject(NgControl, {
    optional: true
  });
  _platform = inject(PLATFORM_ID);
  _triggerId = computed(() => `${this._select.id()}--trigger`);
  _contentId = computed(() => `${this._select.id()}--content`);
  _disabled = computed(() => this._select.disabled() || this._select._formDisabled());
  _labelledBy = computed(() => {
    const value = this._select.value();
    if (Array.isArray(value) && value.length > 0) {
      return `${this._select.labelId()} ${this._select.id()}--value`;
    }
    return this._select.labelId();
  });
  _resizeObserver;
  constructor() {
    this._select.trigger.set(this);
  }
  ngAfterViewInit() {
    this._select.triggerWidth.set(this._elementRef.nativeElement.offsetWidth);
    if (isPlatformBrowser(this._platform)) {
      this._resizeObserver = new ResizeObserver(() => this._select.triggerWidth.set(this._elementRef.nativeElement.offsetWidth));
      this._resizeObserver.observe(this._elementRef.nativeElement);
    }
  }
  ngOnDestroy() {
    this._resizeObserver?.disconnect();
  }
  focus() {
    this._elementRef.nativeElement.focus();
  }
  /** @nocollapse */
  static ɵfac = function BrnSelectTriggerDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectTriggerDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnSelectTriggerDirective,
    selectors: [["", "brnSelectTrigger", ""]],
    hostAttrs: ["type", "button", "role", "combobox", "aria-autocomplete", "none"],
    hostVars: 18,
    hostBindings: function BrnSelectTriggerDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("keydown.ArrowDown", function BrnSelectTriggerDirective_keydown_ArrowDown_HostBindingHandler() {
          return ctx._select.show();
        });
      }
      if (rf & 2) {
        ɵɵhostProperty("disabled", ctx._disabled());
        ɵɵattribute("id", ctx._triggerId())("aria-expanded", ctx._select.open())("aria-controls", ctx._contentId())("aria-labelledBy", ctx._labelledBy())("dir", ctx._select.dir());
        ɵɵclassProp("ng-invalid", (ctx._ngControl == null ? null : ctx._ngControl.invalid) || null)("ng-dirty", (ctx._ngControl == null ? null : ctx._ngControl.dirty) || null)("ng-valid", (ctx._ngControl == null ? null : ctx._ngControl.valid) || null)("ng-touched", (ctx._ngControl == null ? null : ctx._ngControl.touched) || null)("ng-untouched", (ctx._ngControl == null ? null : ctx._ngControl.untouched) || null)("ng-pristine", (ctx._ngControl == null ? null : ctx._ngControl.pristine) || null);
      }
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectTriggerDirective, [{
    type: Directive,
    args: [{
      selector: "[brnSelectTrigger]",
      standalone: true,
      host: {
        type: "button",
        role: "combobox",
        "[attr.id]": "_triggerId()",
        "[disabled]": "_disabled()",
        "[attr.aria-expanded]": "_select.open()",
        "[attr.aria-controls]": "_contentId()",
        "[attr.aria-labelledBy]": "_labelledBy()",
        "aria-autocomplete": "none",
        "[attr.dir]": "_select.dir()",
        "[class.ng-invalid]": "_ngControl?.invalid || null",
        "[class.ng-dirty]": "_ngControl?.dirty || null",
        "[class.ng-valid]": "_ngControl?.valid || null",
        "[class.ng-touched]": "_ngControl?.touched || null",
        "[class.ng-untouched]": "_ngControl?.untouched || null",
        "[class.ng-pristine]": "_ngControl?.pristine || null",
        "(keydown.ArrowDown)": "_select.show()"
      }
    }]
  }], () => [], null);
})();
var BrnSelectValueDirective = class _BrnSelectValueDirective {
  /** @internale */
  templateRef = inject(TemplateRef);
  /** @nocollapse */
  static ɵfac = function BrnSelectValueDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectValueDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnSelectValueDirective,
    selectors: [["", "brnSelectValue", ""], ["", "hlmSelectValue", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectValueDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[brnSelectValue], [hlmSelectValue]"
    }]
  }], null, null);
})();
var BrnSelectValueComponent = class _BrnSelectValueComponent {
  _select = injectBrnSelect();
  id = computed(() => `${this._select.id()}--value`);
  placeholder = computed(() => this._select.placeholder());
  _showPlaceholder = computed(() => this.value() === null || this.value() === void 0 || this.value() === "");
  /** Allow a custom value template */
  customValueTemplate = contentChild(BrnSelectValueDirective, {
    descendants: true
  });
  customPlaceholderTemplate = contentChild(BrnSelectPlaceholderDirective, {
    descendants: true
  });
  value = computed(() => {
    const value = this._values();
    if (value.length === 0) {
      return null;
    }
    const existingOptions = value.filter((val) => this._select.options().some((option) => this._select.compareWith()(option.value(), val)));
    const selectedOption = existingOptions.map((val) => this._select.options().find((option) => this._select.compareWith()(option.value(), val)));
    if (selectedOption.length === 0) {
      return null;
    }
    const selectedLabels = selectedOption.map((option) => option?.getLabel());
    if (this._select.dir() === "rtl") {
      selectedLabels.reverse();
    }
    return this.transformFn()(selectedLabels);
  });
  /** Normalize the values as an array */
  _values = computed(() => Array.isArray(this._select.value()) ? this._select.value() : [this._select.value()]);
  transformFn = input((values) => (values ?? []).join(", "));
  /** @nocollapse */
  static ɵfac = function BrnSelectValueComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectValueComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnSelectValueComponent,
    selectors: [["brn-select-value"], ["hlm-select-value"]],
    contentQueries: function BrnSelectValueComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.customValueTemplate, BrnSelectValueDirective, 5);
        ɵɵcontentQuerySignal(dirIndex, ctx.customPlaceholderTemplate, BrnSelectPlaceholderDirective, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(2);
      }
    },
    hostVars: 1,
    hostBindings: function BrnSelectValueComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵhostProperty("id", ctx.id());
      }
    },
    inputs: {
      transformFn: [1, "transformFn"]
    },
    decls: 6,
    vars: 1,
    consts: [["defaultValueTemplate", ""], ["defaultPlaceholderTemplate", ""], [3, "ngTemplateOutlet"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"]],
    template: function BrnSelectValueComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, BrnSelectValueComponent_Conditional_0_Template, 1, 1, "ng-container", 2)(1, BrnSelectValueComponent_Conditional_1_Template, 1, 4, "ng-container", 3)(2, BrnSelectValueComponent_ng_template_2_Template, 1, 1, "ng-template", null, 0, ɵɵtemplateRefExtractor)(4, BrnSelectValueComponent_ng_template_4_Template, 1, 1, "ng-template", null, 1, ɵɵtemplateRefExtractor);
      }
      if (rf & 2) {
        ɵɵconditional(ctx._showPlaceholder() ? 0 : 1);
      }
    },
    dependencies: [NgTemplateOutlet],
    styles: ["[_nghost-%COMP%]{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;white-space:nowrap;pointer-events:none}"],
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectValueComponent, [{
    type: Component,
    args: [{
      selector: "brn-select-value, hlm-select-value",
      imports: [NgTemplateOutlet],
      template: `
		@if (_showPlaceholder()) {
			<ng-container [ngTemplateOutlet]="customPlaceholderTemplate()?.templateRef ?? defaultPlaceholderTemplate" />
		} @else {
			<ng-container
				[ngTemplateOutlet]="customValueTemplate()?.templateRef ?? defaultValueTemplate"
				[ngTemplateOutletContext]="{ $implicit: _select.value() }"
			/>
		}

		<ng-template #defaultValueTemplate>{{ value() }}</ng-template>
		<ng-template #defaultPlaceholderTemplate>{{ placeholder() }}</ng-template>
	`,
      host: {
        "[id]": "id()"
      },
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [":host{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;white-space:nowrap;pointer-events:none}\n"]
    }]
  }], null, null);
})();
var nextId = 0;
var BrnSelectComponent = class _BrnSelectComponent {
  _defaultErrorStateMatcher = inject(ErrorStateMatcher);
  _parentForm = inject(NgForm, {
    optional: true
  });
  _injector = inject(Injector);
  _parentFormGroup = inject(FormGroupDirective, {
    optional: true
  });
  ngControl = inject(NgControl, {
    optional: true,
    self: true
  });
  id = input(`brn-select-${nextId++}`);
  multiple = input(false, {
    transform: booleanAttribute
  });
  placeholder = input("");
  disabled = input(false, {
    transform: booleanAttribute
  });
  dir = input("ltr");
  closeDelay = input(100, {
    transform: numberAttribute
  });
  open = model(false);
  value = model();
  compareWith = input((o1, o2) => o1 === o2);
  _formDisabled = signal(false);
  /** Label provided by the consumer. */
  selectLabel = contentChild(BrnLabelDirective, {
    descendants: false
  });
  /** Overlay pane containing the options. */
  selectContent = contentChild.required(BrnSelectContentComponent);
  /** @internal */
  options = contentChildren(BrnSelectOptionDirective, {
    descendants: true
  });
  /** @internal Derive the selected options to filter out the unselected options */
  selectedOptions = computed(() => this.options().filter((option) => option.selected()));
  /** Overlay pane containing the options. */
  _overlayDir = viewChild.required(CdkConnectedOverlay);
  trigger = signal(null);
  triggerWidth = signal(0);
  _delayedExpanded = toSignal(toObservable(this.open).pipe(switchMap((expanded) => !expanded ? of(expanded).pipe(delay(this.closeDelay())) : of(expanded)), takeUntilDestroyed()), {
    initialValue: false
  });
  state = computed(() => this.open() ? "open" : "closed");
  _positionChanges$ = new Subject();
  side = toSignal(this._positionChanges$.pipe(map((change) => (
    // todo: better translation or adjusting hlm to take that into account
    change.connectionPair.originY === "center" ? change.connectionPair.originX === "start" ? "left" : "right" : change.connectionPair.originY
  ))), {
    initialValue: "bottom"
  });
  labelId = computed(() => this.selectLabel()?.id ?? `${this.id()}--label`);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onChange = () => {
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onTouched = () => {
  };
  /*
   * This position config ensures that the top "start" corner of the overlay
   * is aligned with with the top "start" of the origin by default (overlapping
   * the trigger completely). If the panel cannot fit below the trigger, it
   * will fall back to a position above the trigger.
   */
  _positions = [{
    originX: "start",
    originY: "bottom",
    overlayX: "start",
    overlayY: "top"
  }, {
    originX: "end",
    originY: "bottom",
    overlayX: "end",
    overlayY: "top"
  }, {
    originX: "start",
    originY: "top",
    overlayX: "start",
    overlayY: "bottom"
  }, {
    originX: "end",
    originY: "top",
    overlayX: "end",
    overlayY: "bottom"
  }];
  errorStateTracker;
  errorState = computed(() => this.errorStateTracker.errorState());
  constructor() {
    if (this.ngControl !== null) {
      this.ngControl.valueAccessor = this;
    }
    this.errorStateTracker = new ErrorStateTracker(this._defaultErrorStateMatcher, this.ngControl, this._parentFormGroup, this._parentForm);
  }
  ngDoCheck() {
    this.errorStateTracker.updateErrorState();
  }
  toggle() {
    if (this.open()) {
      this.hide();
    } else {
      this.show();
    }
  }
  show() {
    if (this.open() || this.disabled() || this._formDisabled() || this.options()?.length == 0) {
      return;
    }
    this.open.set(true);
    afterNextRender(() => this.selectContent().focusList(), {
      injector: this._injector
    });
  }
  hide() {
    if (!this.open()) return;
    this.open.set(false);
    this._onTouched();
    this.trigger()?.focus();
  }
  writeValue(value) {
    this.value.set(value);
  }
  registerOnChange(fn) {
    this._onChange = fn;
  }
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this._formDisabled.set(isDisabled);
  }
  selectOption(value) {
    if (this.multiple()) {
      const currentValue = this.value();
      const newValue = currentValue ? [...currentValue, value] : [value];
      this.value.set(newValue);
    } else {
      this.value.set(value);
    }
    this._onChange?.(this.value());
    if (!this.multiple()) {
      this.hide();
    }
  }
  deselectOption(value) {
    if (this.multiple()) {
      const currentValue = this.value();
      const newValue = currentValue.filter((val) => !this.compareWith()(val, value));
      this.value.set(newValue);
    } else {
      this.value.set(null);
    }
    this._onChange?.(this.value());
  }
  toggleSelect(value) {
    if (this.isSelected(value)) {
      this.deselectOption(value);
    } else {
      this.selectOption(value);
    }
  }
  isSelected(value) {
    const selection = this.value();
    if (Array.isArray(selection)) {
      return selection.some((val) => this.compareWith()(val, value));
    } else if (value !== void 0) {
      return this.compareWith()(selection, value);
    }
    return false;
  }
  /** @nocollapse */
  static ɵfac = function BrnSelectComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectComponent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnSelectComponent,
    selectors: [["brn-select"], ["hlm-select"]],
    contentQueries: function BrnSelectComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.selectLabel, BrnLabelDirective, 4);
        ɵɵcontentQuerySignal(dirIndex, ctx.selectContent, BrnSelectContentComponent, 5);
        ɵɵcontentQuerySignal(dirIndex, ctx.options, BrnSelectOptionDirective, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(3);
      }
    },
    viewQuery: function BrnSelectComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuerySignal(ctx._overlayDir, CdkConnectedOverlay, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    inputs: {
      id: [1, "id"],
      multiple: [1, "multiple"],
      placeholder: [1, "placeholder"],
      disabled: [1, "disabled"],
      dir: [1, "dir"],
      closeDelay: [1, "closeDelay"],
      open: [1, "open"],
      value: [1, "value"],
      compareWith: [1, "compareWith"]
    },
    outputs: {
      open: "openChange",
      value: "valueChange"
    },
    features: [ɵɵProvidersFeature([provideExposedSideProviderExisting(() => _BrnSelectComponent), provideExposesStateProviderExisting(() => _BrnSelectComponent), provideBrnSelect(_BrnSelectComponent), {
      provide: BrnFormFieldControl,
      useExisting: _BrnSelectComponent
    }])],
    ngContentSelectors: _c5,
    decls: 6,
    vars: 5,
    consts: [["trigger", "cdkOverlayOrigin"], [1, "hidden"], ["cdk-overlay-origin", "", 3, "click"], ["cdk-connected-overlay", "", "cdkConnectedOverlayLockPosition", "", "cdkConnectedOverlayHasBackdrop", "", "cdkConnectedOverlayBackdropClass", "cdk-overlay-transparent-backdrop", 3, "backdropClick", "detach", "positionChange", "cdkConnectedOverlayOrigin", "cdkConnectedOverlayOpen", "cdkConnectedOverlayPositions", "cdkConnectedOverlayWidth"]],
    template: function BrnSelectComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵprojectionDef(_c4);
        ɵɵtemplate(0, BrnSelectComponent_Conditional_0_Template, 2, 2, "label", 1)(1, BrnSelectComponent_Conditional_1_Template, 1, 0);
        ɵɵelementStart(2, "div", 2, 0);
        ɵɵlistener("click", function BrnSelectComponent_Template_div_click_2_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.toggle());
        });
        ɵɵprojection(4);
        ɵɵelementEnd();
        ɵɵtemplate(5, BrnSelectComponent_ng_template_5_Template, 1, 0, "ng-template", 3);
        ɵɵlistener("backdropClick", function BrnSelectComponent_Template_ng_template_backdropClick_5_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.hide());
        })("detach", function BrnSelectComponent_Template_ng_template_detach_5_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.hide());
        })("positionChange", function BrnSelectComponent_Template_ng_template_positionChange_5_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx._positionChanges$.next($event));
        });
      }
      if (rf & 2) {
        const trigger_r3 = ɵɵreference(3);
        ɵɵconditional(!ctx.selectLabel() && ctx.placeholder() ? 0 : 1);
        ɵɵadvance(5);
        ɵɵproperty("cdkConnectedOverlayOrigin", trigger_r3)("cdkConnectedOverlayOpen", ctx._delayedExpanded())("cdkConnectedOverlayPositions", ctx._positions)("cdkConnectedOverlayWidth", ctx.triggerWidth() > 0 ? ctx.triggerWidth() : "auto");
      }
    },
    dependencies: [OverlayModule, CdkConnectedOverlay, CdkOverlayOrigin, CdkListboxModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectComponent, [{
    type: Component,
    args: [{
      selector: "brn-select, hlm-select",
      imports: [OverlayModule, CdkListboxModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [provideExposedSideProviderExisting(() => BrnSelectComponent), provideExposesStateProviderExisting(() => BrnSelectComponent), provideBrnSelect(BrnSelectComponent), {
        provide: BrnFormFieldControl,
        useExisting: BrnSelectComponent
      }],
      template: `
		@if (!selectLabel() && placeholder()) {
			<label class="hidden" [attr.id]="labelId()">{{ placeholder() }}</label>
		} @else {
			<ng-content select="label[hlmLabel],label[brnLabel]" />
		}

		<div cdk-overlay-origin (click)="toggle()" #trigger="cdkOverlayOrigin">
			<ng-content select="hlm-select-trigger,[brnSelectTrigger]" />
		</div>

		<ng-template
			cdk-connected-overlay
			cdkConnectedOverlayLockPosition
			cdkConnectedOverlayHasBackdrop
			cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
			[cdkConnectedOverlayOrigin]="trigger"
			[cdkConnectedOverlayOpen]="_delayedExpanded()"
			[cdkConnectedOverlayPositions]="_positions"
			[cdkConnectedOverlayWidth]="triggerWidth() > 0 ? triggerWidth() : 'auto'"
			(backdropClick)="hide()"
			(detach)="hide()"
			(positionChange)="_positionChanges$.next($event)"
		>
			<ng-content />
		</ng-template>
	`
    }]
  }], () => [], null);
})();
var BrnSelectImports = [BrnSelectComponent, BrnSelectContentComponent, BrnSelectTriggerDirective, BrnSelectOptionDirective, BrnSelectValueComponent, BrnSelectScrollDownDirective, BrnSelectScrollUpDirective, BrnSelectGroupDirective, BrnSelectLabelDirective, BrnSelectValueDirective, BrnSelectPlaceholderDirective];
var BrnSelectModule = class _BrnSelectModule {
  /** @nocollapse */
  static ɵfac = function BrnSelectModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnSelectModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _BrnSelectModule,
    imports: [BrnSelectComponent, BrnSelectContentComponent, BrnSelectTriggerDirective, BrnSelectOptionDirective, BrnSelectValueComponent, BrnSelectScrollDownDirective, BrnSelectScrollUpDirective, BrnSelectGroupDirective, BrnSelectLabelDirective, BrnSelectValueDirective, BrnSelectPlaceholderDirective],
    exports: [BrnSelectComponent, BrnSelectContentComponent, BrnSelectTriggerDirective, BrnSelectOptionDirective, BrnSelectValueComponent, BrnSelectScrollDownDirective, BrnSelectScrollUpDirective, BrnSelectGroupDirective, BrnSelectLabelDirective, BrnSelectValueDirective, BrnSelectPlaceholderDirective]
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({
    imports: [BrnSelectComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnSelectModule, [{
    type: NgModule,
    args: [{
      imports: [...BrnSelectImports],
      exports: [...BrnSelectImports]
    }]
  }], null, null);
})();
export {
  BrnSelectComponent,
  BrnSelectContentComponent,
  BrnSelectGroupDirective,
  BrnSelectImports,
  BrnSelectLabelDirective,
  BrnSelectModule,
  BrnSelectOptionDirective,
  BrnSelectPlaceholderDirective,
  BrnSelectScrollDownDirective,
  BrnSelectScrollUpDirective,
  BrnSelectTriggerDirective,
  BrnSelectValueComponent,
  BrnSelectValueDirective
};
//# sourceMappingURL=@spartan-ng_brain_select.js.map
