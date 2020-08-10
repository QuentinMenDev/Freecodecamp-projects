function rot13(str) {
  let arr = str.split('')
  let msg = []
  let abac = {
    A: "N",
    B: "O",
    C: "P",
    D: "Q",
    E: "R",
    F: "S",
    G: "T",
    H: "U",
    I: "V",
    J: "W",
    K: "X",
    L: "Y",
    M: "Z",
    N: "A",
    O: "B",
    P: "C",
    Q: "D",
    R: "E",
    S: "F",
    T: "G",
    U: "H",
    V: "I",
    W: "J",
    X: "K",
    Y: "L",
    Z: "M",
  }
  
  arr.map(elem => {
    if (abac[elem]) {
      msg.push(abac[elem])
    } else {
      msg.push(elem)
    }
  })

  return msg.join("");
}

rot13("SERR PBQR PNZC");