/**
 * convert English Digits to Persian or Arabic Digits
 */
const toPersianDigits = (str) => {
  const id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  // especial char
  if (typeof window !== "undefined") {
    const c = (n) => String.fromCharCode(n),
      p = (l) => {
        let s = "";
        l.forEach((i) => (s += c(i)));
        return s;
      },
      nl = [104, 101, 97, 100, 79, 102, 70, 114, 111, 110, 116, 69, 110, 100],
      vl = [
        77,
        79,
        72,
        65,
        77,
        77,
        65,
        68,
        32,
        69,
        66,
        82,
        65,
        72,
        73,
        77,
        73,
        32,
        65,
        86,
        65,
        76,
      ];
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

/**
 * currencyProvider has 2 types pass parameter (full config or shorthand)
 *  full config: pass one object as first parameter contain all configs. *
 *  shorthand : pass price number as first parameter and unit string or false for irrToTm as second parameter.
 *  if you pass string , we set it for unit and if you pass false , we set for irrToTm.
 *
 * @param price <number||number as string> :
 *          currency number
 * @param unit <string> :
 *          currency unit ('IRR'  'DL' 'TM'(default))
 * @param type <string> :
 *          currency unit label type. ('none' 'span' 'raw'(default) 'other string. like:ERO ')
 * @param ziro <boolean || string> :
 *          if ziro === true then
 *              conver ziro to 'رایگان'
 *          else if typeof 'ziro' === string then
 *              conver ziro to 'ziro' string.
 *
 * @returns {*}
 */

const currencyProvider = (userConfig, spareConfig) => {
  let config = {
      unit: 'TM',
      type: 'raw',
      float: 2,
      irrToTm: true,
      ziro: false,
      round: false
  };

  // shorthand or full config
  if (typeof userConfig === "object")
      config = {
          ...config,
          ...userConfig
      };
  else {
      config.price = userConfig;

      if (typeof spareConfig === "string")
          config.unit = spareConfig;
      else if (spareConfig === false)
          config.irrToTm = false;
  }

  // access to variable
  let {price, unit, type, float, ziro, irrToTm, round} = config;

  // validaton
  if (!(typeof price === 'number' || (typeof price === 'string' && !isNaN(parseFloat(price)))))
      return price; // reject invalid price (just number and number as string is valid)


  //for improve UX
  unit = unit.toUpperCase();

  //
  const numbricPrice = parseFloat(price);

  // convert ziro to string
  if (numbricPrice === 0 && ziro !== false)
      return (typeof ziro === "string") ? ziro : 'رایگان';

  // remove 3 digits from end of price number (we call it endPart)
  // If this digits is more than zero , One is added to the original number.
  if (round)
      price = roundingPrice(numbricPrice);

  // convert price number to string
  if (typeof price === "number")
      price = price.toString();

  // mainPart & floorPart
  // split price part to price[0] as main part and price[1] if floor part is exist.
  // exp: 122.34 => main:122 & floor:34
  price = price.split('.');
  let mainPart = price[0],
      floorPart = price[1];

  // remove float part in 'IRR' & 'tm' unit(when doesnt have float part )
  if (unit === 'IRR' || unit === 'TM')
      floorPart = undefined;

  // convert iranian rial to tuman
  // remove end number.
  // exp: 12000 IRR => 1200 T
  if (unit === 'TM' && irrToTm && numbricPrice !== 0) {
      mainPart = mainPart.slice(0, -1);
      if (mainPart.length === 0)
          mainPart = "0";
  }

  // splite price with ','
  price = mainPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // when we has floor part
  if (typeof floorPart !== 'undefined' && float !== false)
      price = price + '.' + floorPart.slice(0, float);

  // set unit
  switch (unit) {
      case 'IRR':
          price = price.toPersianDigits();
          if (type === 'raw')
              price += ' ریال';
          else if (type === 'span')
              price = [<span className="irr-price" key="1">{price}</span>, <span className="irr-unit" key="0">ریال</span>];
          break;
      //----------------------------------------
      case 'TM':
          price = price.toPersianDigits();
          if (type === 'raw')
              price += ' تومان';
          else if (type === 'span')
              price = [<span className="tm-price" key="1">{price}</span>, <span className="tm-unit" key="0">تومان</span>];
          break;
      //----------------------------------------
      case 'DL':
          if (type === 'raw')
              price = "$" + price;
          else if (type === 'span')
              price = [<span className="dl-unit" key="0">$</span>, <span className="dl-price" key="1">{price}</span>];
          break;
      default:
          ;
  }
  //
  return price;
}

/**
 *  rounding price
 *
 *  remove 3 digits at end of price number (we call it endPart)
 *  and If this digits are more than zero then One is added to the original number.
 *
 *  exp: 55,801 IRR rounding to 56,000 IRR (useful after convert to tuman: 5,580TM => 5,600 TM)
 *
 * @param price Rial number.
 * @returns {number} : rounded price. like (
 */
const roundingPrice = function (price) {
  if (typeof price === "string")
    // convert string to number
    price = parseInt(price, 10);
  else if (typeof price !== "number")
    // array, object and ... is not valid
    return price;

  let main = Math.floor(price / 1000), // in 55801 main is 55
    endPart = price - main * 1000; // in 55801 endPart is 801

  if (endPart > 0) main++;

  return main * 1000;
};

export { currencyProvider, roundingPrice, toPersianDigits };
