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

export const correncyProvider = (userConfig, spareConfig) => {
  let config = {
    unit: "TM",
    type: "raw",
    float: 2,
    irrToTm: true,
    ziro: false,
    round: false,
    ziroText: "free", //you can pass for example these string words: "رایگان" , "Gratis" , "مجانا" , "Frei"
  };

  //short or full config
  if (typeof userConfig === "objec") {
    config = {
      ...config,
      ...userConfig,
    };
  } else {
    config.price = userConfig;
    if (typeof spareConfig === "string") config.unit = spareConfig;
    else if (spareConfig === false) config.irrToTm = false;
  }

  // access to variable
  let { price, unit, type, float, ziro, irrToTm, round } = config;

  // validaton
  if (
    !(
      typeof price === "number" ||
      (typeof price === "string" && !isNaN(parseFloat(price)))
    )
  )
    return price; // reject invalid price (just number and number as string is valid)

  unit = unit.toUpperCase();
  const numbricPrice = parseFloat(price);

  if (numbricPrice === 0 && ziro !== 0)
    return typeof ziro === "stirng" ? ziro : ziroText;

  // remove 3 digits at end of price number (we call it endPart)
  // and If these digits are more than zero then One is added to the original number.
  if (round) price = roundingPrice(numbricPrice);

  // convert price number to string
  if (typeof price === "number") price = price.toString();

  // mainPart & floorPart
  // split price part to price[0] is main part and price[1] if floor part is exist .
  // exp: 122.34 => main:122 & floor:34
  price = price.split(".");
  let mainPart = price[0],
    floorPart = price[1];

  // remove float part in 'IRR' & 'tm' unit(has not float part)
  if (unit === "IRR" || unit === "TM" || unit === "AR") floorPart = undefined;

  // convert iranian rial to tuman
  // remove end number.
  // exp: 12000 IRR => 1200 T
  if (unit === "TM" && irrToTm && numbricPrice !== 0) {
    mainPart = mainPart.slice(0, -1);
    //if(mainPart.length === 0) mainPart = "0"
  } else if (mainPart.length === 0) mainPart = "0";

  // splite price with ','
  price = mainPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // when we have floor part
  if (typeof floorPart !== "undefined" && float !== false)
    price = price + "." + floorPart.slice(0, float);

  // set unit
  switch (unit) {
    case "IRR":
      price = price.toPersianDigits();
      if (type === "raw") price += " ریال";
      else if (type === "span")
        price = [
          <span className="irr-price" key="1">
            {price}
          </span>,
          <span className="irr-unit" key="0">
            ریال
          </span>,
        ];
      break;
    //----------------------------------------
    case "TM":
      price = price.toPersianDigits();
      if (type === "raw") price += " تومان";
      else if (type === "span")
        price = [
          <span className="tm-price" key="1">
            {price}
          </span>,
          <span className="tm-unit" key="0">
            تومان
          </span>,
        ];
      break;
    //----------------------------------------
    case "EU":
      price = price.toPersianDigits();
      if (type === "raw") price = "€" + price;
      else if (type === "span")
        price = [
          <span className="eu-unit" key="1">
            €
          </span>,
          <span className="dl-price" key="0">
            {price}
          </span>,
        ];
      break;
    //----------------------------------------
    case "DL":
      if (type === "raw") price = "$" + price;
      else if (type === "span")
        price = [
          <span className="dl-unit" key="0">
            $
          </span>,
          <span className="dl-price" key="1">
            {price}
          </span>,
        ];
      break;
    default:
  }

  return price;
};
