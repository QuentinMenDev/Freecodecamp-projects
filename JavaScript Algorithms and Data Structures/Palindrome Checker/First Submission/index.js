function palindrome(str) {
  let arr = str.toLowerCase().replace(/[\W_]/g, "").split('')

  for (let i = 0 ; i < arr.length/2 ; i++) {
    if (arr[i] !== arr[arr.length-1-i]) return false
  }
  
  return true;
}

palindrome("_eye");