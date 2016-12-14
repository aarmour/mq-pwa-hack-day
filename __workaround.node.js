"use strict";
var __compiler__ = require('@angular/compiler');
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var patch = false;
if (!core_1.__core_private__['ViewUtils']) {
    patch = true;
    core_1.__core_private__['ViewUtils'] = core_1.__core_private__['view_utils'];
}
if (__compiler__ && __compiler__.SelectorMatcher && __compiler__.CssSelector) {
    patch = true;
    (__compiler__).__compiler_private__ = {
        SelectorMatcher: __compiler__.SelectorMatcher,
        CssSelector: __compiler__.CssSelector
    };
}
if (patch) {
    var __universal__ = require('angular2-platform-node/__private_imports__');
    __universal__.ViewUtils = core_1.__core_private__['view_utils'];
    __universal__.CssSelector = __universal__.CssSelector || __compiler__.CssSelector;
    __universal__.SelectorMatcher = __universal__.SelectorMatcher || __compiler__.SelectorMatcher;
}
function universalMaterialSupports(eventName) { return Boolean(this.isCustomEvent(eventName)); }
platform_browser_1.__platform_browser_private__.HammerGesturesPlugin.prototype.supports = universalMaterialSupports;
var node_1 = require("angular2-universal/node");
function renderComponentFix(componentProto) {
    return new node_1.NodeDomRenderer(this, componentProto, this._animationDriver);
}
node_1.NodeDomRootRenderer.prototype.renderComponent = renderComponentFix;
