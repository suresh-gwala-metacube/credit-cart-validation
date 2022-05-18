const chai = window.chai
const expect = chai.expect

describe('validCreditCard', () => {
  it('Should check if credit card number is valid or not', () => {
    expect(validCreditCard('4111111111111111')).to.deep.equal(true)
    expect(validCreditCard('4111111111111')).to.deep.equal(false)
    expect(validCreditCard('4012888888881881')).to.deep.equal(true)
    expect(validCreditCard('378282246310005')).to.deep.equal(true)
    expect(validCreditCard('6011111111111117')).to.deep.equal(true)
    expect(validCreditCard('5105105105105100')).to.deep.equal(true)
    expect(validCreditCard('5105105105105106')).to.deep.equal(false)
    expect(validCreditCard('9111111111111111')).to.deep.equal(false)
  })
})