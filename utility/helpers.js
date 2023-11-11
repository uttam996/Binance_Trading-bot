
const calcuratePercentage = (price,percentage) => {
    // convert to number 
    price = +price
    percentage = +percentage
    return Number(price- (price * percentage) / 100) ;

}

console.log(calcuratePercentage("100", "8"))

module.exports = { calcuratePercentage };