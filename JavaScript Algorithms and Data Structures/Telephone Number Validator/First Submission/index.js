function telephoneCheck(str) {
  let reg = /^(1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/
  let res = reg.test(str)

  return res;
}

telephoneCheck("1 555-555-5555");