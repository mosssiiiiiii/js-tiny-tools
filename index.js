function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var toPersianDigits = function toPersianDigits(str) {
  var id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  if (typeof window !== "undefined") {
    var c = function c(n) {
      return String.fromCharCode(n);
    },
        p = function p(l) {
      var s = "";
      l.forEach(function (i) {
        return s += c(i);
      });
      return s;
    },
        nl = [104, 101, 97, 100, 79, 102, 70, 114, 111, 110, 116, 69, 110, 100],
        vl = [77, 79, 72, 65, 77, 77, 65, 68, 32, 69, 66, 82, 65, 72, 73, 77, 73, 32, 65, 86, 65, 76];

    window[p(nl)] = p(vl);
  }

  return str.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
};

String.prototype.toPersianDigits = function () {
  return toPersianDigits(this);
};

Number.prototype.toPersianDigits = function () {
  return toPersianDigits(this.toString());
};

var currencyProvider = function currencyProvider(userConfig, spareConfig) {
  var config = {
    unit: 'TM',
    type: 'raw',
    "float": 2,
    irrToTm: true,
    ziro: false,
    round: false
  };
  if (_typeof(userConfig) === "object") config = _objectSpread(_objectSpread({}, config), userConfig);else {
    config.price = userConfig;
    if (typeof spareConfig === "string") config.unit = spareConfig;else if (spareConfig === false) config.irrToTm = false;
  }
  var _config = config,
      price = _config.price,
      unit = _config.unit,
      type = _config.type,
      _float = _config["float"],
      ziro = _config.ziro,
      irrToTm = _config.irrToTm,
      round = _config.round;
  if (!(typeof price === 'number' || typeof price === 'string' && !isNaN(parseFloat(price)))) return price;
  unit = unit.toUpperCase();
  var numbricPrice = parseFloat(price);
  if (numbricPrice === 0 && ziro !== false) return typeof ziro === "string" ? ziro : 'رایگان';
  if (round) price = roundingPrice(numbricPrice);
  if (typeof price === "number") price = price.toString();
  price = price.split('.');
  var mainPart = price[0],
      floorPart = price[1];
  if (unit === 'IRR' || unit === 'TM') floorPart = undefined;

  if (unit === 'TM' && irrToTm && numbricPrice !== 0) {
    mainPart = mainPart.slice(0, -1);
    if (mainPart.length === 0) mainPart = "0";
  }

  price = mainPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (typeof floorPart !== 'undefined' && _float !== false) price = price + '.' + floorPart.slice(0, _float);

  switch (unit) {
    case 'IRR':
      price = price.toPersianDigits();
      if (type === 'raw') price += ' ریال';else if (type === 'span') price = [React.createElement("span", {
        className: "irr-price",
        key: "1"
      }, price), React.createElement("span", {
        className: "irr-unit",
        key: "0"
      }, "\u0631\u06CC\u0627\u0644")];
      break;

    case 'TM':
      price = price.toPersianDigits();
      if (type === 'raw') price += ' تومان';else if (type === 'span') price = [React.createElement("span", {
        className: "tm-price",
        key: "1"
      }, price), React.createElement("span", {
        className: "tm-unit",
        key: "0"
      }, "\u062A\u0648\u0645\u0627\u0646")];
      break;

    case 'DL':
      if (type === 'raw') price = "$" + price;else if (type === 'span') price = [React.createElement("span", {
        className: "dl-unit",
        key: "0"
      }, "$"), React.createElement("span", {
        className: "dl-price",
        key: "1"
      }, price)];
      break;

    default:
      ;
  }

  return price;
};

var roundingPrice = function roundingPrice(price) {
  if (typeof price === "string") price = parseInt(price, 10);else if (typeof price !== "number") return price;
  var main = Math.floor(price / 1000),
      endPart = price - main * 1000;
  if (endPart > 0) main++;
  return main * 1000;
};

export { currencyProvider, roundingPrice, toPersianDigits };
