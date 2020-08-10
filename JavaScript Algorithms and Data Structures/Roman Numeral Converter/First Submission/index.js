function convertToRoman(num) {
  let nbr = ''
  let roman = []
  let abac = [
    ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
    ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
    ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'],
    ['', 'M', 'MM', 'MMM']
  ]

  roman[3] = Math.floor(num/1000)
  roman[2] = Math.floor(num%1000/100)
  roman[1] = Math.floor(num%1000%100/10)
  roman[0] = Math.floor(num%1000%100%10)

  for (let i = roman.length - 1 ; i >= 0 ; i--) {
    nbr += abac[i][roman[i]]
  }

 return nbr;
}

convertToRoman(29);