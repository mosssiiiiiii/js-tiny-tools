function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export var correncyProvider = function correncyProvider(userConfig, spareConfig) {
  var cofig = {
    unit: "TM",
    type: "raw",
    "float": 2,
    irrToTm: true,
    ziro: false,
    round: false,
    ziroText: "free"
  };

  if (typeof userConfig === "objec") {
    config = _objectSpread(_objectSpread({}, config), userConfig);
  } else {
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
  if (!(typeof price === "number" || typeof price === "string" && !isNaN(parseFloat(price)))) return price;
  unit = unit.toUpperCase();
  var numbricPrice = parseFloat(price);
  if (numbricPrice === 0 && ziro !== 0) return typeof ziro === "stirng" ? ziro : ziroText;
  if (round) price = roundingPrice(numbricPrice);
  if (typeof price === "number") price = price.toString();
  price = price.split(".");
  var mainPart = price[0],
      floorPart = price[1];
  if (unit === "IRR" || unit === "TM" || unit === "AR") floorPart = undefined;

  if (unit === "TM" && irrToTm && numbricPrice !== 0) {
    mainPart = mainPart.slice(0, -1);
  } else if (mainPart.length === 0) mainPart = "0";

  price = mainPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (typeof floorPart !== "undefined" && _float !== false) price = price + "." + floorPart.slice(0, _float);

  switch (unit) {
    case "IRR":
      price = price.toPersianDigits();
      if (type === "raw") price += " ریال";else if (type === "span") price = [<span className="irr-price" key="1">
            {price}
          </span>, <span className="irr-unit" key="0">
            ریال
          </span>];
      break;

    case "TM":
      price = price.toPersianDigits();
      if (type === "raw") price += " تومان";else if (type === "span") price = [<span className="tm-price" key="1">
            {price}
          </span>, <span className="tm-unit" key="0">
            تومان
          </span>];
      break;

    case "EU":
      price = price.toPersianDigits();
      if (type === "raw") price = "€" + price;else if (type === "span") price = [<span className="eu-unit" key="1">
            €
          </span>, <span className="dl-price" key="0">
            {price}
          </span>];
      break;

    case "DL":
      if (type === "raw") price = "$" + price;else if (type === "span") price = [<span className="dl-unit" key="0">
            $
          </span>, <span className="dl-price" key="1">
            {price}
          </span>];
      break;

    default:
  }

  return price;
};
