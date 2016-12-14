"use strict";
var __compiler__ = require('@angular/compiler');
var core_1 = require("@angular/core");
if (!core_1.__core_private__['ViewUtils']) {
    core_1.__core_private__['ViewUtils'] = core_1.__core_private__['view_utils'];
}
if (__compiler__ && __compiler__.SelectorMatcher && __compiler__.CssSelector) {
    (__compiler__).__compiler_private__ = {
        SelectorMatcher: __compiler__.SelectorMatcher,
        CssSelector: __compiler__.CssSelector
    };
}
