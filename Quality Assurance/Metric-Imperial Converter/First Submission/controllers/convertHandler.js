/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.getNum = function(input) {
    let firstLetterIndex = input.indexOf(input.match(/[a-zA-Z]/))

    if (firstLetterIndex === 0) {
      return 1
    } else if (firstLetterIndex === -1) {
      return eval(input)
    }
    
    let transit = input.slice(0, firstLetterIndex)
    
    const secondFraction = transit.indexOf('/', transit.indexOf('/') + 1)
    if (secondFraction > 0) return {error: "invalid number"}
    const secondMult = transit.indexOf('*', transit.indexOf('*') + 1)
    if (secondMult > 0) return {error: "invalid number"}
    const secondAdd = transit.indexOf('+', transit.indexOf('+') + 1)
    if (secondAdd > 0) return {error: "invalid number"}
    const secondSub = transit.indexOf('-', transit.indexOf('-') + 1)
    if (secondSub > 0) return {error: "invalid number"}
    const secondCom = transit.indexOf('.', transit.indexOf('.') + 1)
    if (secondCom > 0) return {error: "invalid number"}

    return Math.round(eval(transit) * 10**5) / 10**5

  };
  
  this.getUnit = function(input) {
    const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg', 'GAL', 'L', 'MI', 'KM', 'LBS', 'KG', 'Kg, Km']
    let firstLetterIndex = input.indexOf(input.match(/[a-zA-Z]/))
    
    if (firstLetterIndex === -1) return {error: "no unit registered"}

    const unit = input.slice(firstLetterIndex)
    const validUnit = validUnits.includes(unit)
    
    return validUnit ? unit : {error: 'invalid unit'}
  };
  
  this.getReturnUnit = function(initUnit) {
    const unitLowerCase = initUnit.toLowerCase()
    const units = {
      gal: 'l',
      l: 'gal',
      mi: 'km',
      km: 'mi',
      lbs: 'kg',
      kg: 'lbs'
    }
    
    return units[unitLowerCase];
  };

  this.spellOutUnit = function(unit) {
    const unitLowerCase = unit.toLowerCase()
    const units = {
      gal: 'gallon',
      l: 'liter',
      mi: 'mile',
      km: 'kilometer',
      lbs: 'pound',
      kg: 'kilogram'
    }
    return units[unitLowerCase];
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    
    const convertTable = {
      gal: galToL,
      l: 1 / galToL,
      mi: miToKm,
      km: 1 / miToKm,
      lbs: lbsToKg,
      kg: 1 / lbsToKg
    };
    
    return Math.round(initNum * convertTable[initUnit.toLowerCase()] * 10**5)/10**5
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) { 
    return initNum + ' ' + this.spellOutUnit(initUnit) + ' converts to ' + returnNum + ' ' + this.spellOutUnit(returnUnit);
  };
  
}

module.exports = ConvertHandler;
