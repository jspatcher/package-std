/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/call-bind/callBound.js":
/*!*********************************************!*\
  !*** ./node_modules/call-bind/callBound.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/get-intrinsic/index.js");

var callBind = __webpack_require__(/*! ./ */ "./node_modules/call-bind/index.js");

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};


/***/ }),

/***/ "./node_modules/call-bind/index.js":
/*!*****************************************!*\
  !*** ./node_modules/call-bind/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! function-bind */ "./node_modules/function-bind/index.js");
var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/get-intrinsic/index.js");

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "author": () => (/* binding */ author),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "description": () => (/* binding */ description),
/* harmony export */   "jspatcher": () => (/* binding */ jspatcher),
/* harmony export */   "keywords": () => (/* binding */ keywords),
/* harmony export */   "license": () => (/* binding */ license),
/* harmony export */   "name": () => (/* binding */ name),
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
/* harmony import */ var _package_info__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./package-info */ "./src/package-info.ts");
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

const name = _package_info__WEBPACK_IMPORTED_MODULE_0__["default"].name.split("/").pop().replace(/^package-/, "");
const { author, license, keywords, version, description, jspatcher } = _package_info__WEBPACK_IMPORTED_MODULE_0__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__spreadValues({ name, author, license, keywords, version, description }, jspatcher));


/***/ }),

/***/ "./src/objects/_.ts":
/*!**************************!*\
  !*** ./src/objects/_.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class _ extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.state = { value: void 0 };
  }
  subscribe() {
    super.subscribe();
    const handleArgs = (args) => this.setState({ value: args[0] });
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("updateArgs", handleArgs);
    this.on("updateState", ({ state: { value }, id }) => {
      this.setState({ value }, id);
      this.outlet(0, this.state.value);
    });
    this.on("postInit", () => {
      handleArgs(this.args);
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          this.setState({ value: data });
        }
        this.outlet(0, this.state.value);
      } else if (inlet === 1) {
        this.setState({ value: data });
      }
    });
  }
}
_.description = "Store anything";
_.inlets = [{
  isHot: true,
  type: "anything",
  description: "Bang to output stored value, anything to set the value then output it."
}, {
  isHot: false,
  type: "anything",
  description: "Anything to set the value."
}];
_.outlets = [{
  type: "anything",
  description: "Value"
}];
_.args = [{
  type: "anything",
  optional: true,
  description: "Initial value"
}];


/***/ }),

/***/ "./src/objects/arr.ts":
/*!****************************!*\
  !*** ./src/objects/arr.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ arr)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));


const _arr = class extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { arr: [] };
  }
  subscribe() {
    super.subscribe();
    this.on("updateArgs", () => {
      this.inlets = Math.max(0, ~~+this.args[0]) + 2;
      updateInletsMeta(this.getProp("hot"));
    });
    const updateInletsMeta = (isHot) => {
      const inlet0Meta = _arr.inlets[0];
      const inlet1Meta = __spreadValues({}, _arr.inlets[1]);
      const lastInletMeta = _arr.inlets[2];
      const restInletsMeta = new Array(Math.max(0, ~~+this.args[0])).fill(null).map((v, i) => __spreadProps(__spreadValues({}, inlet1Meta), { description: `${inlet1Meta.description}: ${i}`, isHot }));
      this.setMeta({ inlets: [inlet0Meta, ...restInletsMeta, lastInletMeta] });
    };
    this.on("postInit", () => {
      this.inlets = Math.max(0, ~~+this.args[0]) + 2;
      this.outlets = 1;
      updateInletsMeta(this.getProp("hot"));
    });
    this.on("updateProps", (props) => {
      updateInletsMeta(props.hot);
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        const { arr: arr2 } = this._;
        this._.arr = [];
        this.outlet(0, arr2);
      } else if (inlet === this.inlets - 1) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data) && Array.isArray(data))
          this._.arr = data;
      } else {
        this._.arr[inlet - 1] = data;
        if (this.getProp("hot"))
          this.outlet(0, this._.arr);
      }
    });
  }
};
let arr = _arr;
arr.description = "Construct an array with sufficient inlets";
arr.inlets = [{
  isHot: true,
  type: "object",
  description: "Bang to output current array and initialize a new one"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Value to set to the index"
}, {
  isHot: false,
  type: "object",
  description: "Pre-set the array"
}];
arr.outlets = [{
  type: "object",
  description: "Created array"
}];
arr.args = [{
  type: "anything",
  optional: true,
  default: 1,
  description: "Array length"
}];
arr.props = {
  hot: {
    type: "boolean",
    default: false,
    description: "Output the array on any index set"
  }
};



/***/ }),

/***/ "./src/objects/bang.ts":
/*!*****************************!*\
  !*** ./src/objects/bang.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ bang)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class bang extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("inlet", ({ inlet }) => {
      if (inlet === 0)
        this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang());
    });
  }
}
bang.description = "Transform to bang";
bang.inlets = [{
  isHot: true,
  type: "anything",
  description: "Anything to transform to a bang"
}];
bang.outlets = [{
  type: "bang",
  description: "Bang when inlet"
}];


/***/ }),

/***/ "./src/objects/base.ts":
/*!*****************************!*\
  !*** ./src/objects/base.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StdObject)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class StdObject extends _sdk__WEBPACK_IMPORTED_MODULE_1__.BaseObject {
}
StdObject.package = _index__WEBPACK_IMPORTED_MODULE_0__.name;
StdObject.author = _index__WEBPACK_IMPORTED_MODULE_0__.author;
StdObject.version = _index__WEBPACK_IMPORTED_MODULE_0__.version;
StdObject.description = _index__WEBPACK_IMPORTED_MODULE_0__.description;


/***/ }),

/***/ "./src/objects/call.ts":
/*!*****************************!*\
  !*** ./src/objects/call.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ call)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class call extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { instance: void 0, inputs: [], result: null };
    this.initialInlets = 1;
    this.initialOutlets = 2;
    this.callback = () => this.outletAll([this._.result, this._.instance, ...this._.inputs]);
  }
  subscribe() {
    super.subscribe();
    const handleArgs = (args) => {
      this._.inputs = args.slice(1);
      const argsCount = Math.max(args.length - 1, ~~+this.getProp("args"));
      this.inlets = Math.max(1, this.initialInlets + argsCount);
      this.outlets = this.initialOutlets + argsCount;
    };
    const handleProps = (props) => {
      if (props.args && typeof props.args === "number" && props.args >= 0) {
        const argsCount = Math.max(this.box.args.length - 1, ~~props.args);
        this.inlets = Math.max(1, this.initialInlets + argsCount);
        this.outlets = this.initialOutlets + argsCount;
      }
    };
    this.on("postInit", () => {
      if (this.args.length)
        handleArgs(this.args);
      if (this.props)
        handleProps(this.props);
      if (this.inlets < this.initialInlets)
        this.inlets = this.initialInlets;
      if (this.outlets < this.initialOutlets)
        this.outlets = this.initialOutlets;
    });
    this.on("updateArgs", handleArgs);
    this.on("updateProps", handleProps);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this._.instance = data;
        if (this.execute())
          this.output();
      } else {
        this._.inputs[inlet - 1] = data;
      }
    });
  }
  execute() {
    const m = this.box.args[0];
    try {
      this._.result = this._.instance[m](...this._.inputs);
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }
  output() {
    if (this._.result instanceof Promise && !this.getProp("sync")) {
      this.loading = true;
      this._.result.then((r) => {
        this.loading = false;
        this._.result = r;
        this.callback();
      }, (r) => {
        this.loading = false;
        this.error(r);
      });
      return this;
    }
    return this.callback();
  }
  set loading(loading) {
    this.updateUI({ loading });
  }
}
call.description = "Call a method of current object";
call.inlets = [{
  isHot: true,
  type: "anything",
  description: "Instance to read"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Method argument"
}];
call.outlets = [{
  type: "anything",
  description: "Method return value"
}, {
  type: "anything",
  description: "Instance bypass"
}, {
  type: "anything",
  varLength: true,
  description: "Argument after method called"
}];
call.args = [{
  type: "string",
  optional: false,
  description: "Method name"
}, {
  type: "anything",
  optional: true,
  varLength: true,
  description: "Set arguments while loaded"
}];
call.props = {
  args: {
    type: "number",
    default: 0,
    description: "arguments count for method"
  },
  sync: {
    type: "boolean",
    default: false,
    description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
  }
};


/***/ }),

/***/ "./src/objects/change.ts":
/*!*******************************!*\
  !*** ./src/objects/change.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ change)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");

class change extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { prev: void 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("inlet", ({ inlet, data }) => {
      const result = this.getProp("mode") === "==" ? this._.prev == data : this._.prev === data;
      if (!result)
        this.outlet(0, data);
      this._.prev = data;
    });
  }
}
change.description = "Filter out undesirable repetitions";
change.inlets = [{
  isHot: true,
  type: "anything",
  description: "Anything to be compared with the previous input"
}];
change.outlets = [{
  type: "anything",
  description: "Output if changed"
}];
change.args = [{
  type: "anything",
  description: "Initial state",
  default: void 0,
  optional: true
}];
change.props = {
  mode: {
    type: "enum",
    enums: ["==", "==="],
    default: "===",
    description: "Comparison algorithm"
  }
};


/***/ }),

/***/ "./src/objects/collect.ts":
/*!********************************!*\
  !*** ./src/objects/collect.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ collect)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class collect extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { array: [] };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          this.outlet(0, this._.array);
          this._.array = [];
        } else {
          this._.array.push(data);
        }
      } else if (inlet = 1) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this._.array = [];
      }
    });
  }
}
collect.description = "Collect data in an array";
collect.inlets = [{
  isHot: true,
  type: "anything",
  varLength: false,
  description: "Anything to collect, Bang to output and reset"
}, {
  isHot: false,
  type: "bang",
  varLength: false,
  description: "Reset without output"
}];
collect.outlets = [{
  type: "object",
  varLength: false,
  description: "Collected data as array"
}];


/***/ }),

/***/ "./src/objects/delay.ts":
/*!******************************!*\
  !*** ./src/objects/delay.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ delay)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");

class delay extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { time: +this.args[0], ref: /* @__PURE__ */ new Set() };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("updateArgs", () => {
      const { args } = this.box;
      if (typeof args[0] === "number")
        this._.time = +args[0];
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        this._.ref.add(window.setTimeout(() => this.outlet(0, data), this._.time || 0));
      } else if (inlet === 1) {
        this._.time = +data;
      }
    });
    this.on("destroy", () => {
      this._.ref.forEach((ref) => window.clearTimeout(ref));
    });
  }
}
delay.description = "Delay an input";
delay.inlets = [{
  isHot: true,
  type: "anything",
  description: "Input to be delayed"
}, {
  isHot: false,
  type: "number",
  description: "Delay time in seconds"
}];
delay.outlets = [{
  type: "anything",
  description: "Delayed input"
}];
delay.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Default delay time"
}];


/***/ }),

/***/ "./src/objects/dget.ts":
/*!*****************************!*\
  !*** ./src/objects/dget.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dget)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");

class dget extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { keys: [] };
    this.resetIO = () => {
      const { args } = this.box;
      this._.keys = args.slice();
      this.inlets = 1 + args.length;
      this.outlets = args.length;
    };
  }
  subscribe() {
    super.subscribe();
    this.on("postInit", this.resetIO);
    this.on("updateArgs", this.resetIO);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        let v = data;
        for (let i = 0; i < this._.keys.length; i++) {
          const key = this._.keys[i];
          if (typeof key === "string" || typeof key === "number") {
            try {
              v = v[key];
            } catch (e) {
              this.error(e.message);
              return;
            }
          }
        }
        this.outlet(0, v);
      } else {
        if (typeof data === "string" || typeof data === "number")
          this._.keys[inlet - 1] = data;
        else
          this.error("Key should be a number or a string");
      }
    });
  }
}
dget.description = "Get a deep property of incoming object";
dget.inlets = [{
  isHot: true,
  type: "object",
  description: "Object to get a property"
}, {
  isHot: false,
  type: "string",
  varLength: true,
  description: "Key / name of the property (recursive)"
}];
dget.outlets = [{
  type: "anything",
  varLength: true,
  description: "Value got"
}];
dget.args = [{
  type: "anything",
  optional: false,
  varLength: true,
  description: "Initial key of the property (recursive)"
}];


/***/ }),

/***/ "./src/objects/for-in.ts":
/*!*******************************!*\
  !*** ./src/objects/for-in.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForIn)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class ForIn extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { buffer: this.args[0] };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 3;
    });
    this.on("updateArgs", (args) => this._.buffer = args[0]);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this._.buffer = data;
        for (const key in this._.buffer) {
          this.outletAll([, key, this._.buffer[key]]);
        }
        this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang());
      } else if (inlet === 1) {
        this._.buffer = data;
      }
    });
  }
}
ForIn.description = "Object key-value iterator";
ForIn.inlets = [{
  isHot: true,
  type: "anything",
  description: "Iterate input, bang to redo"
}, {
  isHot: false,
  type: "object",
  description: "Set the iteration object"
}];
ForIn.outlets = [{
  type: "bang",
  description: "Bang when finished"
}, {
  type: "anything",
  description: "Key"
}, {
  type: "anything",
  description: "Value"
}];
ForIn.args = [{
  type: "object",
  optional: true,
  description: "Initial object to iterate"
}];


/***/ }),

/***/ "./src/objects/for.ts":
/*!****************************!*\
  !*** ./src/objects/for.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ For)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class For extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { start: +this.args[0] || 0, end: +this.args[1] || 0, step: +this.args[2] || 1 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 4;
      this.outlets = 2;
    });
    this.on("updateArgs", (args) => {
      this._.start = +args[0] || 0;
      this._.end = +args[1] || 0;
      this._.step = +args[2] || 1;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          const { start, end, step } = this._;
          const times = (end - start) / step;
          if (!isFinite(times) || times < 0) {
            this.error(`Infinite loop from ${start} to ${end} with step ${step}.`);
            return;
          }
          for (let i = start; i < end; i += step) {
            this.outlet(1, i);
          }
          this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang());
        }
      } else if (inlet === 1)
        this._.start = +data;
      else if (inlet === 2)
        this._.end = +data;
      else if (inlet === 3)
        this._.step = +data;
    });
  }
}
For.description = "Number iterator";
For.inlets = [{
  isHot: true,
  type: "bang",
  description: "Do iterations"
}, {
  isHot: false,
  type: "number",
  description: "Set the starting point"
}, {
  isHot: false,
  type: "number",
  description: "Set the end point (excluded)"
}, {
  isHot: false,
  type: "number",
  description: "Set the step"
}];
For.outlets = [{
  type: "bang",
  description: "Bang when finished"
}, {
  type: "number",
  description: "Output all iterations one by one"
}];
For.args = [{
  type: "number",
  optional: false,
  description: "The starting point"
}, {
  type: "number",
  optional: false,
  description: "The end point (excluded)"
}, {
  type: "number",
  optional: true,
  default: 1,
  description: "The step"
}];


/***/ }),

/***/ "./src/objects/gate.ts":
/*!*****************************!*\
  !*** ./src/objects/gate.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ gate)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");

class gate extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { pass: this.args[0] === "undefined" || this.args[0] === "" || !!this.args[0] };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("updateArgs", (args) => {
      this._.pass = args[0] === "undefined" || args[0] === "" || !!args[0];
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (this._.pass)
          this.outlet(0, data);
      } else if (inlet === 1) {
        this._.pass = !!data;
      }
    });
  }
}
gate.description = "Bypass or block incoming data";
gate.inlets = [{
  isHot: true,
  type: "anything",
  description: "Anything to bypass"
}, {
  isHot: false,
  type: "anything",
  description: "Test, falsable to block"
}];
gate.outlets = [{
  type: "anything",
  description: "Anything bypass"
}];
gate.args = [{
  type: "anything",
  optional: true,
  default: true,
  description: "default state"
}];


/***/ }),

/***/ "./src/objects/get.ts":
/*!****************************!*\
  !*** ./src/objects/get.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ get)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");

class get extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { keys: [] };
    this.resetIO = () => {
      const { args } = this.box;
      this._.keys = args.slice();
      this.inlets = 1 + args.length;
      this.outlets = args.length;
    };
  }
  subscribe() {
    super.subscribe();
    this.on("postInit", this.resetIO);
    this.on("updateArgs", this.resetIO);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        for (let i = this._.keys.length - 1; i >= 0; i--) {
          const key = this._.keys[i];
          if (typeof key === "string" || typeof key === "number") {
            try {
              this.outlet(i, data[key]);
            } catch (e) {
              this.error(e.message);
            }
          }
        }
      } else {
        if (typeof data === "string" || typeof data === "number")
          this._.keys[inlet - 1] = data;
        else
          this.error("Key should be a number or a string");
      }
    });
  }
}
get.description = "Get properties of incoming object";
get.inlets = [{
  isHot: true,
  type: "object",
  description: "Object to get a property"
}, {
  isHot: false,
  type: "string",
  varLength: true,
  description: "Key / name of the property"
}];
get.outlets = [{
  type: "anything",
  varLength: true,
  description: "Value got"
}];
get.args = [{
  type: "anything",
  optional: false,
  varLength: true,
  description: "Initial key of the property"
}];


/***/ }),

/***/ "./src/objects/if.ts":
/*!***************************!*\
  !*** ./src/objects/if.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ If)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class If extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0)
        this.outlet(+!data, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang());
    });
  }
}
If.description = "Output a bang on true / false";
If.inlets = [{
  isHot: true,
  type: "boolean",
  description: "True for a bang to left outlet, false for right"
}];
If.outlets = [{
  type: "bang",
  description: "True?"
}, {
  type: "bang",
  description: "False?"
}];


/***/ }),

/***/ "./src/objects/lambda.ts":
/*!*******************************!*\
  !*** ./src/objects/lambda.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ lambda)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class lambda extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { argsCount: typeof this.args[0] === "number" && this.args[0] >= 0 ? ~~this.args[0] : 0, result: void 0 };
    this.lambda = (...args) => {
      this._.result = void 0;
      if (this._.argsCount === 0) {
        this.outletAll([, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang(), args]);
      } else {
        this.outletAll([, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang(), ...args]);
      }
      return this._.result;
    };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = Math.max(3, 2 + this._.argsCount);
    });
    this.on("updateArgs", (args) => {
      if (typeof args[0] === "number" && args[0] >= 0) {
        this._.argsCount = ~~args[0];
        this.outlets = 2 + this._.argsCount;
      }
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(0, this.lambda);
      } else if (inlet === 1) {
        this._.result = data;
      }
    });
  }
}
lambda.description = "Generate anonymous function, output args when called";
lambda.inlets = [{
  isHot: true,
  type: "bang",
  description: "Output anonymous function"
}, {
  isHot: false,
  type: "anything",
  description: "Result of the anonymous function"
}];
lambda.outlets = [{
  type: "function",
  description: "Anonymous function"
}, {
  type: "bang",
  description: "bang while lambda is called"
}, {
  type: "anything",
  varLength: true,
  description: "If args=0, outlet args as array, else argument of current index"
}];
lambda.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Arguments count"
}];


/***/ }),

/***/ "./src/objects/line.ts":
/*!*****************************!*\
  !*** ./src/objects/line.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ line)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


const { decodeLine, getTimestamp } = _sdk__WEBPACK_IMPORTED_MODULE_1__.Utils;
const toAbsoluteTimeLine = (line2, rampTime) => {
  var _a;
  let rT = rampTime;
  let t = 0;
  const out = line2.slice();
  for (let i = 0; i < line2.length; i++) {
    const delta = Math.max(0, +((_a = line2[i][1]) != null ? _a : rT) || 0);
    rT = null;
    t += delta;
    out[i] = [line2[i][0], t];
  }
  return out;
};
class line extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = {
      startedTime: 0,
      startedValue: 0,
      pausedTime: 0,
      paused: false,
      line: null,
      ref: null,
      $: null,
      value: +this.args[0] || 0,
      rampTime: null,
      grain: +Math.max(0, this.args[1]) || 0.1
    };
    this.handleTimeout = () => {
      const { startedTime, startedValue, line: line2, grain } = this._;
      if (!line2[this._.$])
        return;
      const curTime = getTimestamp();
      const elapsed = (curTime - startedTime) / 1e3;
      while (elapsed >= line2[this._.$][1]) {
        this._.$++;
        if (this._.$ >= line2.length) {
          const value2 = line2[line2.length - 1][0];
          this.outletAll([value2, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang()]);
          this._.value = value2;
          this.stopCurrentLine();
          return;
        }
      }
      const { $ } = this._;
      const [targetValue, targetTime] = line2[$];
      const prevValue = $ === 0 ? startedValue : line2[$ - 1][0];
      const prevTime = $ === 0 ? 0 : line2[$ - 1][1];
      const value = prevValue + (elapsed - prevTime) / (targetTime - prevTime) * (targetValue - prevValue);
      this.outlet(0, value);
      this._.value = value;
      this._.ref = window.setTimeout(this.handleTimeout, grain);
    };
  }
  stopCurrentLine() {
    if (this._.ref)
      window.clearTimeout(this._.ref);
    this._ = {
      startedTime: 0,
      startedValue: this._.value,
      pausedTime: 0,
      paused: false,
      line: null,
      ref: null,
      $: null,
      value: this._.value,
      rampTime: null,
      grain: this._.grain
    };
  }
  startLine(line2) {
    this._.line = line2;
    this._.startedTime = getTimestamp();
    this._.$ = 0;
    this.handleTimeout();
  }
  pauseLine() {
    if (this._.ref)
      window.clearTimeout(this._.ref);
    this._.paused = true;
    this._.pausedTime = getTimestamp();
  }
  resumeLine() {
    const { pausedTime } = this._;
    this._.startedTime += getTimestamp() - pausedTime;
    this._.paused = true;
    this._.pausedTime = null;
    this.handleTimeout();
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 2;
    });
    this.on("updateArgs", (args) => {
      if (typeof args[1] === "number") {
        this._.grain = +Math.max(0, args[0]) || 0;
      }
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (data === "stop") {
          this.stopCurrentLine();
        } else if (data === "pause") {
          this.pauseLine();
        } else if (data === "resume") {
          this.resumeLine();
        } else {
          const line2 = toAbsoluteTimeLine(decodeLine(data), this._.rampTime);
          this.stopCurrentLine();
          this.startLine(line2);
        }
      } else if (inlet === 1) {
        if (typeof data === "number")
          this._.rampTime = +Math.max(0, data) || 0;
      } else if (inlet === 2) {
        if (typeof data === "number")
          this._.grain = +Math.max(0, data) || 0;
      }
    });
    this.on("destroy", () => {
      if (this._.ref) {
        window.clearTimeout(this._.ref);
      }
    });
  }
}
line.description = "Generate timed ramp";
line.inlets = [{
  isHot: true,
  type: "anything",
  description: "number to set the value, number[] to start ramps (target - ramp time pairs)"
}, {
  isHot: false,
  type: "number",
  description: "Ramp time in seconds"
}, {
  isHot: false,
  type: "number",
  description: "Time grain in seconds"
}];
line.outlets = [{
  type: "bang",
  description: "Ramped values"
}, {
  type: "bang",
  description: "Bang when finished"
}];
line.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial number"
}, {
  type: "number",
  optional: true,
  default: 0.1,
  description: "Default time grain in seconds"
}];


/***/ }),

/***/ "./src/objects/loadbang.ts":
/*!*********************************!*\
  !*** ./src/objects/loadbang.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ loadbang)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class loadbang extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
      this.patcher.on("postInited", () => this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang()));
    });
    this.on("inlet", ({ inlet }) => {
      if (inlet === 0)
        this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang());
    });
  }
}
loadbang.description = "Bang when patcher is loaded";
loadbang.inlets = [{
  isHot: true,
  type: "anything",
  description: "Anything to transform to a bang"
}];
loadbang.outlets = [{
  type: "bang",
  description: "Bang when inlet"
}];


/***/ }),

/***/ "./src/objects/metro.ts":
/*!******************************!*\
  !*** ./src/objects/metro.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ metro)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class metro extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = {
      time: +this.args[0],
      active: this.getProp("active"),
      intervalRef: null,
      timeoutRef: null,
      last: 0
    };
  }
  subscribe() {
    super.subscribe();
    const handleTimeout = () => {
      this._.last = performance.now();
      this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang());
      this._.intervalRef = window.setInterval(() => {
        this._.last = performance.now();
        this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang());
      }, this._.time * 1e3);
    };
    const activateTimer = (time) => {
      if (this._.timeoutRef) {
        window.clearTimeout(this._.timeoutRef);
        this._.timeoutRef = null;
      }
      if (this._.intervalRef) {
        window.clearInterval(this._.intervalRef);
        this._.intervalRef = null;
      }
      if (time && this._.active) {
        const timeout = Math.max(0, this._.last + this._.time * 1e3 - performance.now());
        this._.timeoutRef = window.setTimeout(handleTimeout, timeout);
      }
      this._.time = time;
    };
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("postInit", () => {
      activateTimer(+this.args[0]);
    });
    this.on("updateArgs", () => {
      if (typeof this.args[0] === "number") {
        activateTimer(Math.max(0, +this.args[0]));
      }
    });
    this.on("updateProps", () => {
      this._.active = this.getProp("active");
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        this._.active = !!data;
        activateTimer(this._.time);
      } else if (inlet === 1) {
        activateTimer(Math.max(0, +data));
      }
    });
    this.on("destroy", () => {
      if (this._.timeoutRef) {
        window.clearTimeout(this._.timeoutRef);
        this._.timeoutRef = null;
      }
      if (this._.intervalRef) {
        window.clearInterval(this._.intervalRef);
        this._.intervalRef = null;
      }
    });
  }
}
metro.description = "Metronome that outputs regularly Bangs";
metro.inlets = [{
  isHot: true,
  type: "boolean",
  description: "Start or stop the metronome"
}, {
  isHot: false,
  type: "number",
  description: "interval in seconds"
}];
metro.outlets = [{
  type: "bang",
  description: "regular Bangs"
}];
metro.args = [{
  type: "number",
  optional: true,
  default: 1,
  description: "Default interval time in seconds"
}];
metro.props = {
  active: {
    type: "boolean",
    default: false,
    description: "Set active the metronome"
  }
};


/***/ }),

/***/ "./src/objects/obj.ts":
/*!****************************!*\
  !*** ./src/objects/obj.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ obj)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj2, key, value) => key in obj2 ? __defProp(obj2, key, { enumerable: true, configurable: true, writable: true, value }) : obj2[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));


const _obj = class extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { obj: {} };
  }
  subscribe() {
    super.subscribe();
    this.on("updateArgs", (args) => {
      this.inlets = args.length + 2;
      updateInletsMeta(this.getProp("hot"));
    });
    const updateInletsMeta = (isHot) => {
      const inlet0Meta = _obj.inlets[0];
      const inlet1Meta = __spreadValues({}, _obj.inlets[1]);
      const lastInletMeta = _obj.inlets[2];
      const restInletsMeta = this.args.map((propKey) => __spreadProps(__spreadValues({}, inlet1Meta), { description: `${inlet1Meta.description}: ${propKey}`, isHot }));
      this.setMeta({ inlets: [inlet0Meta, ...restInletsMeta, lastInletMeta] });
    };
    this.on("postInit", () => {
      this.inlets = this.args.length + 2;
      this.outlets = 1;
      updateInletsMeta(this.getProp("hot"));
    });
    this.on("updateProps", (props) => {
      updateInletsMeta(props.hot);
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        const { obj: obj2 } = this._;
        this._.obj = {};
        this.outlet(0, obj2);
      } else if (inlet === this.inlets - 1) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data) && typeof data === "object")
          this._.obj = data;
      } else {
        const propKey = this.box.args[inlet - 1];
        this._.obj[propKey] = data;
        if (this.getProp("hot"))
          this.outlet(0, this._.obj);
      }
    });
  }
};
let obj = _obj;
obj.description = "Construct an object with various properties";
obj.inlets = [{
  isHot: true,
  type: "object",
  description: "Bang to output current object and initialize a new one"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Value to set to the property"
}, {
  isHot: false,
  type: "object",
  description: "Pre-set the object"
}];
obj.outlets = [{
  type: "object",
  description: "Created object"
}];
obj.args = [{
  type: "anything",
  optional: true,
  varLength: true,
  description: "Key / name of the property"
}];
obj.props = {
  hot: {
    type: "boolean",
    default: false,
    description: "Output the object on any property set"
  }
};



/***/ }),

/***/ "./src/objects/print.ts":
/*!******************************!*\
  !*** ./src/objects/print.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ print)
/* harmony export */ });
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! util */ "./node_modules/util/util.js");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");



class print extends _base__WEBPACK_IMPORTED_MODULE_1__["default"] {
  get title() {
    return `${this.args[0] || "Print"}`;
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 0;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_2__.isBang)(data)) {
          this.patcher.newLog("none", this.title, "Bang", this.box);
        } else {
          this.patcher.newLog("none", this.title, typeof data === "string" ? data : util__WEBPACK_IMPORTED_MODULE_0__.inspect(data), this.box);
        }
      }
    });
  }
}
print.description = "Print to console";
print.inlets = [{
  isHot: true,
  type: "anything",
  description: "Anything to stringify"
}];
print.args = [{
  type: "string",
  optional: true,
  default: "Print",
  description: "Title"
}];


/***/ }),

/***/ "./src/objects/sel.ts":
/*!****************************!*\
  !*** ./src/objects/sel.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sel)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};


const _sel = class extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { array: [] };
    this.resetIO = () => {
      const { args } = this.box;
      const testsCount = args.length;
      const [inletMeta0, inletMeta1] = _sel.meta.inlets;
      const [outletMeta0, outletMeta1] = _sel.meta.outlets;
      const { meta } = this;
      meta.inlets = [inletMeta0];
      meta.outlets = [];
      for (let i = 0; i < testsCount; i++) {
        meta.outlets[i] = __spreadValues({}, outletMeta0);
        meta.outlets[i].description += ` index ${i}`;
        meta.inlets[i + 1] = __spreadValues({}, inletMeta1);
        meta.inlets[i + 1].description += ` index ${i}`;
      }
      meta.outlets[testsCount] = outletMeta1;
      this.setMeta(meta);
      this._.array = args.slice();
      this.inlets = 1 + testsCount;
      this.outlets = testsCount + 1;
    };
  }
  subscribe() {
    super.subscribe();
    this.on("postInit", this.resetIO);
    this.on("updateArgs", this.resetIO);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        const foundIndex = this._.array.indexOf(data);
        if (foundIndex === -1)
          this.outlet(this.outlets - 1, data);
        else
          this.outlet(foundIndex, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang());
      } else {
        this._.array[inlet - 1] = data;
      }
    });
  }
};
let sel = _sel;
sel.description = "Output a bang on a matched inlet";
sel.inlets = [{
  isHot: true,
  type: "anything",
  varLength: false,
  description: "Test for match"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Set value for match"
}];
sel.outlets = [{
  type: "bang",
  varLength: false,
  description: "Bang if match"
}, {
  type: "anything",
  varLength: false,
  description: "Bypass if not matched"
}];
sel.args = [{
  type: "anything",
  optional: false,
  varLength: true,
  description: "Initial value for match"
}];



/***/ }),

/***/ "./src/objects/set.ts":
/*!****************************!*\
  !*** ./src/objects/set.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ set)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");

class set extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { key: typeof this.args[0] === "string" || typeof this.args[0] === "number" ? this.args[0] : void 0, value: this.args[1] };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 1;
    });
    this.on("updateArgs", (args) => {
      if (typeof args[0] === "string" || typeof args[0] === "number")
        this._.key = args[0];
      if (typeof args[1] !== "undefined")
        this._.value = args[1];
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (typeof this._.key === "string" || typeof this._.key === "number") {
          try {
            data[this._.key] = this._.value;
            this.outlet(0, data);
          } catch (e) {
            this.error(e.message);
          }
        } else {
          this.error("Key not defined");
        }
      } else if (inlet === 1) {
        if (typeof data === "string" || typeof data === "number")
          this._.key = data;
        else
          this.error("Key should be a number or a string");
      } else if (inlet === 2) {
        this._.value = data;
      }
    });
  }
}
set.description = "Set a property of incoming object";
set.inlets = [{
  isHot: true,
  type: "object",
  description: "Object to set a property"
}, {
  isHot: false,
  type: "string",
  description: "Key / name of the property"
}, {
  isHot: false,
  type: "anything",
  description: "Value to set to the property"
}];
set.outlets = [{
  type: "anything",
  description: "Object bypass"
}];
set.args = [{
  type: "anything",
  optional: false,
  description: "Initial key of the property"
}, {
  type: "anything",
  optional: true,
  default: void 0,
  description: "Initial value of the property"
}];


/***/ }),

/***/ "./src/objects/thispatcher.ts":
/*!************************************!*\
  !*** ./src/objects/thispatcher.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ thispatcher)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");

class thispatcher extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        this.outlet(0, this.patcher);
      }
    });
  }
}
thispatcher.description = "Current patcher instance";
thispatcher.inlets = [{
  isHot: true,
  type: "bang",
  description: "Bang to output patcher instance"
}];
thispatcher.outlets = [{
  type: "object",
  description: "Patcher instance"
}];


/***/ }),

/***/ "./src/objects/unloadbang.ts":
/*!***********************************!*\
  !*** ./src/objects/unloadbang.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ unloadbang)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class unloadbang extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
      this.patcher.on("unload", () => this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang()));
    });
    this.on("inlet", ({ inlet }) => {
      if (inlet === 0)
        this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang());
    });
  }
}
unloadbang.description = "Bang when patcher will be unloaded";
unloadbang.inlets = [{
  isHot: true,
  type: "anything",
  description: "Anything to transform to a bang"
}];
unloadbang.outlets = [{
  type: "bang",
  description: "Bang when inlet"
}];


/***/ }),

/***/ "./src/objects/v.ts":
/*!**************************!*\
  !*** ./src/objects/v.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ v)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
var _a;


class v extends _base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.state = { value: this.args[1] };
    this._ = { key: (_a = this.box.args[0]) == null ? void 0 : _a.toString(), sharedItem: null };
  }
  subscribe() {
    super.subscribe();
    const handleFilePathChanged = () => {
      var _a2;
      this._.key = (_a2 = this._.sharedItem) == null ? void 0 : _a2.projectPath;
    };
    const handleSaved = (e) => {
      var _a2;
      if (e === this)
        return;
      this.setState({ value: (_a2 = this._.sharedItem) == null ? void 0 : _a2.data });
    };
    const subscribeItem = async () => {
      const file = this._.sharedItem;
      if (!file)
        return;
      await file.addObserver(this.id);
      file.on("destroyed", reload);
      file.on("nameChanged", handleFilePathChanged);
      file.on("pathChanged", handleFilePathChanged);
      file.on("saved", handleSaved);
    };
    const unsubscribeItem = async () => {
      const file = this._.sharedItem;
      if (!file)
        return;
      file.off("destroyed", reload);
      file.off("nameChanged", handleFilePathChanged);
      file.off("pathChanged", handleFilePathChanged);
      file.off("saved", handleSaved);
      await file.removeObserver(this.id);
    };
    const reload = async () => {
      await unsubscribeItem();
      const { key } = this._;
      try {
        const { item } = await this.getSharedItem(key, "unknown", () => this.state.value);
        this._.sharedItem = item;
        this.setState({ value: item.data });
      } catch (error) {
        this.error(error);
      } finally {
        await subscribeItem();
      }
    };
    const handleArgs = async (args) => {
      var _a2, _b;
      const key = (_a2 = args[0]) == null ? void 0 : _a2.toString();
      if (key !== this._.key) {
        this._.key = key;
        await reload();
      } else {
        if (typeof args[1] !== "undefined") {
          this.setState({ value: args[1] });
          (_b = this._.sharedItem) == null ? void 0 : _b.save(this.state.value, this);
        }
      }
    };
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 1;
    });
    this.on("updateArgs", handleArgs);
    this.on("updateState", ({ state: { value }, id }) => {
      var _a2;
      this.setState({ value }, id);
      (_a2 = this._.sharedItem) == null ? void 0 : _a2.save(this.state.value, this);
      this.outlet(0, this.state.value);
    });
    this.on("postInit", reload);
    this.on("inlet", ({ data, inlet }) => {
      var _a2, _b;
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          this.setState({ value: data });
          (_a2 = this._.sharedItem) == null ? void 0 : _a2.save(this.state.value, this);
        }
        this.outlet(0, this.state.value);
      } else if (inlet === 1) {
        this.setState({ value: data });
        (_b = this._.sharedItem) == null ? void 0 : _b.save(this.state.value, this);
      } else if (inlet === 2) {
        if (typeof data === "string" || typeof data === "number") {
          const key = data.toString() || "";
          if (key !== this._.key) {
            this._.key = key;
            reload();
          }
        }
      }
    });
    this.on("destroy", unsubscribeItem);
  }
}
v.description = "Store anything as named sharable variable";
v.inlets = [{
  isHot: true,
  type: "anything",
  description: "Bang to output stored value, anything to set the value then output it."
}, {
  isHot: false,
  type: "anything",
  description: "Anything to set the value."
}, {
  isHot: false,
  type: "anything",
  description: "Set variable name."
}];
v.outlets = [{
  type: "anything",
  description: "Value"
}];
v.args = [{
  type: "anything",
  optional: true,
  description: "Variable name"
}, {
  type: "anything",
  optional: true,
  description: "Initial value"
}];


/***/ }),

/***/ "./src/package-info.ts":
/*!*****************************!*\
  !*** ./src/package-info.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
var _package_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../package.json */ "./package.json");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/*#__PURE__*/ (_package_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_package_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_package_json__WEBPACK_IMPORTED_MODULE_0__, 2))));


/***/ }),

/***/ "./src/sdk.ts":
/*!********************!*\
  !*** ./src/sdk.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bang": () => (/* binding */ Bang),
/* harmony export */   "BaseObject": () => (/* binding */ BaseObject),
/* harmony export */   "BaseUI": () => (/* binding */ BaseUI),
/* harmony export */   "Box": () => (/* binding */ Box),
/* harmony export */   "DefaultObject": () => (/* binding */ DefaultObject),
/* harmony export */   "DefaultUI": () => (/* binding */ DefaultUI),
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "Patcher": () => (/* binding */ Patcher),
/* harmony export */   "React": () => (/* binding */ React),
/* harmony export */   "Utils": () => (/* binding */ Utils),
/* harmony export */   "generateDefaultObject": () => (/* binding */ generateDefaultObject),
/* harmony export */   "generateRemoteObject": () => (/* binding */ generateRemoteObject),
/* harmony export */   "generateRemotedObject": () => (/* binding */ generateRemotedObject),
/* harmony export */   "isBang": () => (/* binding */ isBang)
/* harmony export */ });
const sdk = globalThis.jspatcherEnv.sdk;
const {
  React,
  Patcher,
  Box,
  Line,
  BaseObject,
  BaseUI,
  DefaultObject,
  DefaultUI,
  generateRemotedObject,
  generateDefaultObject,
  generateRemoteObject,
  Bang,
  isBang,
  Utils
} = sdk;


/***/ }),

/***/ "./src/ui/bang.tsx":
/*!*************************!*\
  !*** ./src/ui/bang.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BangUI)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

class BangUI extends _sdk__WEBPACK_IMPORTED_MODULE_0__.DefaultUI {
  constructor() {
    super(...arguments);
    this.handleDoubleClick = (e) => {
      if (this.editor.state.locked)
        this.object.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_0__.Bang());
    };
  }
  render() {
    return /* @__PURE__ */ _sdk__WEBPACK_IMPORTED_MODULE_0__.React.createElement(_sdk__WEBPACK_IMPORTED_MODULE_0__.DefaultUI, __spreadProps(__spreadValues({}, this.props), {
      containerProps: __spreadProps(__spreadValues({}, this.props.containerProps), { onDoubleClick: this.handleDoubleClick })
    }));
  }
}


/***/ }),

/***/ "./node_modules/for-each/index.js":
/*!****************************************!*\
  !*** ./node_modules/for-each/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isCallable = __webpack_require__(/*! is-callable */ "./node_modules/is-callable/index.js");

var toStr = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var forEachArray = function forEachArray(array, iterator, receiver) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
                iterator(array[i], i, array);
            } else {
                iterator.call(receiver, array[i], i, array);
            }
        }
    }
};

var forEachString = function forEachString(string, iterator, receiver) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        if (receiver == null) {
            iterator(string.charAt(i), i, string);
        } else {
            iterator.call(receiver, string.charAt(i), i, string);
        }
    }
};

var forEachObject = function forEachObject(object, iterator, receiver) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
                iterator(object[k], k, object);
            } else {
                iterator.call(receiver, object[k], k, object);
            }
        }
    }
};

var forEach = function forEach(list, iterator, thisArg) {
    if (!isCallable(iterator)) {
        throw new TypeError('iterator must be a function');
    }

    var receiver;
    if (arguments.length >= 3) {
        receiver = thisArg;
    }

    if (toStr.call(list) === '[object Array]') {
        forEachArray(list, iterator, receiver);
    } else if (typeof list === 'string') {
        forEachString(list, iterator, receiver);
    } else {
        forEachObject(list, iterator, receiver);
    }
};

module.exports = forEach;


/***/ }),

/***/ "./node_modules/function-bind/implementation.js":
/*!******************************************************!*\
  !*** ./node_modules/function-bind/implementation.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ "./node_modules/function-bind/index.js":
/*!*********************************************!*\
  !*** ./node_modules/function-bind/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "./node_modules/function-bind/implementation.js");

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ "./node_modules/get-intrinsic/index.js":
/*!*********************************************!*\
  !*** ./node_modules/get-intrinsic/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(/*! has-symbols */ "./node_modules/has-symbols/index.js")();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(/*! function-bind */ "./node_modules/function-bind/index.js");
var hasOwn = __webpack_require__(/*! has */ "./node_modules/has/src/index.js");
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/g, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ "./node_modules/has-symbols/index.js":
/*!*******************************************!*\
  !*** ./node_modules/has-symbols/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(/*! ./shams */ "./node_modules/has-symbols/shams.js");

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ "./node_modules/has-symbols/shams.js":
/*!*******************************************!*\
  !*** ./node_modules/has-symbols/shams.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";


/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ "./node_modules/has-tostringtag/shams.js":
/*!***********************************************!*\
  !*** ./node_modules/has-tostringtag/shams.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var hasSymbols = __webpack_require__(/*! has-symbols/shams */ "./node_modules/has-symbols/shams.js");

module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};


/***/ }),

/***/ "./node_modules/has/src/index.js":
/*!***************************************!*\
  !*** ./node_modules/has/src/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! function-bind */ "./node_modules/function-bind/index.js");

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/inherits/inherits_browser.js":
/*!***************************************************!*\
  !*** ./node_modules/inherits/inherits_browser.js ***!
  \***************************************************/
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ "./node_modules/is-arguments/index.js":
/*!********************************************!*\
  !*** ./node_modules/is-arguments/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var hasToStringTag = __webpack_require__(/*! has-tostringtag/shams */ "./node_modules/has-tostringtag/shams.js")();
var callBound = __webpack_require__(/*! call-bind/callBound */ "./node_modules/call-bind/callBound.js");

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;


/***/ }),

/***/ "./node_modules/is-callable/index.js":
/*!*******************************************!*\
  !*** ./node_modules/is-callable/index.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";


var fnToStr = Function.prototype.toString;
var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike;
var isCallableMarker;
if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
	try {
		badArrayLike = Object.defineProperty({}, 'length', {
			get: function () {
				throw isCallableMarker;
			}
		});
		isCallableMarker = {};
		// eslint-disable-next-line no-throw-literal
		reflectApply(function () { throw 42; }, null, badArrayLike);
	} catch (_) {
		if (_ !== isCallableMarker) {
			reflectApply = null;
		}
	}
} else {
	reflectApply = null;
}

var constructorRegex = /^\s*class\b/;
var isES6ClassFn = function isES6ClassFunction(value) {
	try {
		var fnStr = fnToStr.call(value);
		return constructorRegex.test(fnStr);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionToStr(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && !!Symbol.toStringTag; // better: use `has-tostringtag`
/* globals document: false */
var documentDotAll = typeof document === 'object' && typeof document.all === 'undefined' && document.all !== undefined ? document.all : {};

module.exports = reflectApply
	? function isCallable(value) {
		if (value === documentDotAll) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (typeof value === 'function' && !value.prototype) { return true; }
		try {
			reflectApply(value, null, badArrayLike);
		} catch (e) {
			if (e !== isCallableMarker) { return false; }
		}
		return !isES6ClassFn(value);
	}
	: function isCallable(value) {
		if (value === documentDotAll) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (typeof value === 'function' && !value.prototype) { return true; }
		if (hasToStringTag) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr.call(value);
		return strClass === fnClass || strClass === genClass;
	};


/***/ }),

/***/ "./node_modules/is-generator-function/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/is-generator-function/index.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = __webpack_require__(/*! has-tostringtag/shams */ "./node_modules/has-tostringtag/shams.js")();
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	if (!getProto) {
		return false;
	}
	if (typeof GeneratorFunction === 'undefined') {
		var generatorFunc = getGeneratorFunc();
		GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
	}
	return getProto(fn) === GeneratorFunction;
};


/***/ }),

/***/ "./node_modules/is-typed-array/index.js":
/*!**********************************************!*\
  !*** ./node_modules/is-typed-array/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var forEach = __webpack_require__(/*! for-each */ "./node_modules/for-each/index.js");
var availableTypedArrays = __webpack_require__(/*! available-typed-arrays */ "./node_modules/available-typed-arrays/index.js");
var callBound = __webpack_require__(/*! call-bind/callBound */ "./node_modules/call-bind/callBound.js");

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = __webpack_require__(/*! has-tostringtag/shams */ "./node_modules/has-tostringtag/shams.js")();

var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis;
var typedArrays = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = __webpack_require__(/*! es-abstract/helpers/getOwnPropertyDescriptor */ "./node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js");
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr) {
			var proto = getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf(proto);
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			toStrTags[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf(typedArrays, tag) > -1;
	}
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};


/***/ }),

/***/ "./node_modules/util/support/isBufferBrowser.js":
/*!******************************************************!*\
  !*** ./node_modules/util/support/isBufferBrowser.js ***!
  \******************************************************/
/***/ ((module) => {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),

/***/ "./node_modules/util/support/types.js":
/*!********************************************!*\
  !*** ./node_modules/util/support/types.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9



var isArgumentsObject = __webpack_require__(/*! is-arguments */ "./node_modules/is-arguments/index.js");
var isGeneratorFunction = __webpack_require__(/*! is-generator-function */ "./node_modules/is-generator-function/index.js");
var whichTypedArray = __webpack_require__(/*! which-typed-array */ "./node_modules/which-typed-array/index.js");
var isTypedArray = __webpack_require__(/*! is-typed-array */ "./node_modules/is-typed-array/index.js");

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';

var ObjectToString = uncurryThis(Object.prototype.toString);

var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch(e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray;

// Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
function isPromise(input) {
	return (
		(
			typeof Promise !== 'undefined' &&
			input instanceof Promise
		) ||
		(
			input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
	);
}
exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return (
    isTypedArray(value) ||
    isDataView(value)
  );
}
exports.isArrayBufferView = isArrayBufferView;


function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}
exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}
exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}
exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}
exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}
exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}
exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}
exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}
exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}
exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}
exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}
exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}
isMapToString.working = (
  typeof Map !== 'undefined' &&
  isMapToString(new Map())
);

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working
    ? isMapToString(value)
    : value instanceof Map;
}
exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}
isSetToString.working = (
  typeof Set !== 'undefined' &&
  isSetToString(new Set())
);
function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working
    ? isSetToString(value)
    : value instanceof Set;
}
exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}
isWeakMapToString.working = (
  typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
);
function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working
    ? isWeakMapToString(value)
    : value instanceof WeakMap;
}
exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}
isWeakSetToString.working = (
  typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
);
function isWeakSet(value) {
  return isWeakSetToString(value);
}
exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}
isArrayBufferToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
);
function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working
    ? isArrayBufferToString(value)
    : value instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}
isDataViewToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
);
function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working
    ? isDataViewToString(value)
    : value instanceof DataView;
}
exports.isDataView = isDataView;

// Store a copy of SharedArrayBuffer in case it's deleted elsewhere
var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBufferCopy;
}
exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}
exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}
exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}
exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}
exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}
exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}
exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return (
    isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
  );
}
exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (
    isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
  );
}
exports.isAnyArrayBuffer = isAnyArrayBuffer;

['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function() {
      throw new Error(method + ' is not supported in userland');
    }
  });
});


/***/ }),

/***/ "./node_modules/util/util.js":
/*!***********************************!*\
  !*** ./node_modules/util/util.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnvRegex = /^$/;

if (({"NODE_ENV":"development"}).NODE_DEBUG) {
  var debugEnv = ({"NODE_ENV":"development"}).NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/,/g, '$|^')
    .toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}
exports.debuglog = function(set) {
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
exports.types = __webpack_require__(/*! ./support/types */ "./node_modules/util/support/types.js");

function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
exports.types.isNativeError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ "./node_modules/util/support/isBufferBrowser.js");

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
            function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;


/***/ }),

/***/ "./node_modules/which-typed-array/index.js":
/*!*************************************************!*\
  !*** ./node_modules/which-typed-array/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var forEach = __webpack_require__(/*! for-each */ "./node_modules/for-each/index.js");
var availableTypedArrays = __webpack_require__(/*! available-typed-arrays */ "./node_modules/available-typed-arrays/index.js");
var callBound = __webpack_require__(/*! call-bind/callBound */ "./node_modules/call-bind/callBound.js");

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = __webpack_require__(/*! has-tostringtag/shams */ "./node_modules/has-tostringtag/shams.js")();

var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis;
var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = __webpack_require__(/*! es-abstract/helpers/getOwnPropertyDescriptor */ "./node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js");
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof g[typedArray] === 'function') {
			var arr = new g[typedArray]();
			if (Symbol.toStringTag in arr) {
				var proto = getPrototypeOf(arr);
				var descriptor = gOPD(proto, Symbol.toStringTag);
				if (!descriptor) {
					var superProto = getPrototypeOf(proto);
					descriptor = gOPD(superProto, Symbol.toStringTag);
				}
				toStrTags[typedArray] = descriptor.get;
			}
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var foundName = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!foundName) {
			try {
				var name = getter.call(value);
				if (name === typedArray) {
					foundName = name;
				}
			} catch (e) {}
		}
	});
	return foundName;
};

var isTypedArray = __webpack_require__(/*! is-typed-array */ "./node_modules/is-typed-array/index.js");

module.exports = function whichTypedArray(value) {
	if (!isTypedArray(value)) { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1); }
	return tryTypedArrays(value);
};


/***/ }),

/***/ "./node_modules/available-typed-arrays/index.js":
/*!******************************************************!*\
  !*** ./node_modules/available-typed-arrays/index.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var possibleNames = [
	'BigInt64Array',
	'BigUint64Array',
	'Float32Array',
	'Float64Array',
	'Int16Array',
	'Int32Array',
	'Int8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8Array',
	'Uint8ClampedArray'
];

var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis;

module.exports = function availableTypedArrays() {
	var out = [];
	for (var i = 0; i < possibleNames.length; i++) {
		if (typeof g[possibleNames[i]] === 'function') {
			out[out.length] = possibleNames[i];
		}
	}
	return out;
};


/***/ }),

/***/ "./node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/get-intrinsic/index.js");

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@jspatcher/package-std","version":"1.0.9","description":"The standard package for JSPatcher","main":"dist/index.js","scripts":{"build":"webpack --mode development","build-watch":"webpack --mode development --watch --stats-children"},"keywords":["jspatcher"],"jspatcher":{"isJSPatcherPackage":true,"thumbnail":"","jspatpkg":"index.jspatpkg.js","jsdsppkg.main":"index.jsdsppkg.main.js","jsdsppkg.aw":"index.jsdsppkg.aw.js"},"author":"Fr0stbyteR","license":"GPL-3.0-or-later","repository":"https://github.com/jspatcher/package-std","devDependencies":{"@jspatcher/jspatcher":"^0.0.10","@types/react":"^17.0.19","clean-webpack-plugin":"^4.0.0-alpha.0","esbuild-loader":"^2.15.1","react":"^17.0.2","typescript":"^4.4.2","util":"^0.12.4","webpack":"^5.51.1","webpack-cli":"^4.8.0"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************!*\
  !*** ./src/index.jspatpkg.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bang": () => (/* binding */ bang),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _objects_for__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects/for */ "./src/objects/for.ts");
/* harmony import */ var _objects_for_in__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects/for-in */ "./src/objects/for-in.ts");
/* harmony import */ var _objects_if__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/if */ "./src/objects/if.ts");
/* harmony import */ var _objects_bang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/bang */ "./src/objects/bang.ts");
/* harmony import */ var _objects_call__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./objects/call */ "./src/objects/call.ts");
/* harmony import */ var _objects_delay__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./objects/delay */ "./src/objects/delay.ts");
/* harmony import */ var _objects_metro__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./objects/metro */ "./src/objects/metro.ts");
/* harmony import */ var _objects_dget__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./objects/dget */ "./src/objects/dget.ts");
/* harmony import */ var _objects_gate__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./objects/gate */ "./src/objects/gate.ts");
/* harmony import */ var _objects_get__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./objects/get */ "./src/objects/get.ts");
/* harmony import */ var _objects_collect__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./objects/collect */ "./src/objects/collect.ts");
/* harmony import */ var _objects_lambda__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./objects/lambda */ "./src/objects/lambda.ts");
/* harmony import */ var _objects_loadbang__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./objects/loadbang */ "./src/objects/loadbang.ts");
/* harmony import */ var _objects_obj__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./objects/obj */ "./src/objects/obj.ts");
/* harmony import */ var _objects_arr__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./objects/arr */ "./src/objects/arr.ts");
/* harmony import */ var _objects_print__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./objects/print */ "./src/objects/print.ts");
/* harmony import */ var _objects_sel__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./objects/sel */ "./src/objects/sel.ts");
/* harmony import */ var _objects_set__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./objects/set */ "./src/objects/set.ts");
/* harmony import */ var _objects_thispatcher__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./objects/thispatcher */ "./src/objects/thispatcher.ts");
/* harmony import */ var _objects_v__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./objects/v */ "./src/objects/v.ts");
/* harmony import */ var _objects___WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./objects/_ */ "./src/objects/_.ts");
/* harmony import */ var _objects_unloadbang__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./objects/unloadbang */ "./src/objects/unloadbang.ts");
/* harmony import */ var _objects_line__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./objects/line */ "./src/objects/line.ts");
/* harmony import */ var _ui_bang__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./ui/bang */ "./src/ui/bang.tsx");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./sdk */ "./src/sdk.ts");
/* harmony import */ var _objects_change__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./objects/change */ "./src/objects/change.ts");


























class bang extends (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_bang__WEBPACK_IMPORTED_MODULE_3__["default"]) {
}
bang.UI = _ui_bang__WEBPACK_IMPORTED_MODULE_23__["default"];
const obj = (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_obj__WEBPACK_IMPORTED_MODULE_13__["default"]);
const arr = (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_arr__WEBPACK_IMPORTED_MODULE_14__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => {
  return {
    print: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_print__WEBPACK_IMPORTED_MODULE_15__["default"]),
    for: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_for__WEBPACK_IMPORTED_MODULE_0__["default"]),
    "for-in": (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_for_in__WEBPACK_IMPORTED_MODULE_1__["default"]),
    if: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_if__WEBPACK_IMPORTED_MODULE_2__["default"]),
    gate: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_gate__WEBPACK_IMPORTED_MODULE_8__["default"]),
    sel: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_sel__WEBPACK_IMPORTED_MODULE_16__["default"]),
    obj,
    "{}": obj,
    arr,
    "[]": arr,
    set: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_set__WEBPACK_IMPORTED_MODULE_17__["default"]),
    get: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_get__WEBPACK_IMPORTED_MODULE_9__["default"]),
    collect: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_collect__WEBPACK_IMPORTED_MODULE_10__["default"]),
    dget: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_dget__WEBPACK_IMPORTED_MODULE_7__["default"]),
    call: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_call__WEBPACK_IMPORTED_MODULE_4__["default"]),
    v: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_v__WEBPACK_IMPORTED_MODULE_19__["default"]),
    _: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects___WEBPACK_IMPORTED_MODULE_20__["default"]),
    lambda: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_lambda__WEBPACK_IMPORTED_MODULE_11__["default"]),
    bang,
    loadbang: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_loadbang__WEBPACK_IMPORTED_MODULE_12__["default"]),
    unloadbang: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_unloadbang__WEBPACK_IMPORTED_MODULE_21__["default"]),
    delay: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_delay__WEBPACK_IMPORTED_MODULE_5__["default"]),
    metro: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_metro__WEBPACK_IMPORTED_MODULE_6__["default"]),
    line: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_line__WEBPACK_IMPORTED_MODULE_22__["default"]),
    thispatcher: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_thispatcher__WEBPACK_IMPORTED_MODULE_18__["default"]),
    change: (0,_sdk__WEBPACK_IMPORTED_MODULE_24__.generateDefaultObject)(_objects_change__WEBPACK_IMPORTED_MODULE_25__["default"])
  };
});

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.jspatpkg.js.map