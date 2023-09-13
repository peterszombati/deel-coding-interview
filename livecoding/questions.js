const a = (b) => {
    return (c) => c + b
}

const d = a('0')
// what these console logs will print out
console.log(d('5'))
console.log(a('10')('5'))