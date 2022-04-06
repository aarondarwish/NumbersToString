var convert = function (numberInput) {
    // It'd be more efficient to firstly check if the argument is valid.

    // Is the argument a number?
    if (numberInput != parseFloat(numberInput))
        throw "Not a number.";

    // Since it's a number, is it safe? (Note: Comment out the safety check if you want to test for decimal points. Since decimal points are considered unsafe.
    if (!Number.isSafeInteger(numberInput))
        throw "The number representation does not fit the IEEE-754 standards, and as thus it\'s unsafe";


    // English number tokens 
    let thArr = ['', 'thousand, ', 'million, ', 'billion, ', 'trillion, '];
    let dgArr = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    let tnArr = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    let twArr = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    let negativeValue = false;
    if (numberInput < 0) negativeValue = true;

    let str = '';
    numberInput = numberInput.toString();
    numberInput = numberInput.replace(/[\, ]/g, '');


    if (negativeValue) {
        numberInput = numberInput.slice(1);
        str += "minus ";
    }

    let len = numberInput.indexOf('.');
    if (len == -1)
        len = numberInput.length;
    let n = numberInput.split('');

    let flag = 0;
    for (let i = 0; i < len; i++) {
        if ((len - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tnArr[Number(n[i + 1])] + ' ';
                i++;
                flag = 1;
            } else if (n[i] != 0) {
                str += twArr[n[i] - 2] + ' ';
                flag = 1;
            }
        } else if (n[i] != 0) {
            str += dgArr[n[i]] + ' ';
            if ((len - i) % 3 == 0) {
                str += 'hundred ';
                if (n[i + 1] != 0 || n[i + 2] != 0) str += "and ";
            }

            flag = 1;
        }
        if ((len - i) % 3 == 1) {
            if (flag)
                str += thArr[(len - i - 1) / 3] + ' ';
            flag = 0;
        }
    }


    str = str.replace(/\s+/g, ' ').slice(0, -1)
    // Simply split the string so that the last element is taken out and then check if it's an element of "thArr", if so, then slice the last character.
    let part = str.split(" ");
    part = part[part.length - 1];
    if(thArr.includes(part + ' ')) str = str.slice(0, -1);

    if (len != numberInput.length) {
        let decimalLen = numberInput.length;
        str += ' point ';
        for (let i = len + 1; i < decimalLen; i++)
            str += dgArr[n[i]] + ' ';
    }
    return str;
}


mocha.setup("bdd");
chai.should();

describe('Number to string converter', function() {
    it('Should return "one hundred and four"', function() {
        convert(104).should.equal('one hundred and four');
    });

    it('Should return "twelve thousand, three hundred and forty five"', function() {
        convert(12345).should.equal('twelve thousand, three hundred and forty five');
    });

    it('Should return "ninety nine million, six hundred and five thousand, four hundred and twenty two"', function() {
        convert(99605422).should.equal('ninety nine million, six hundred and five thousand, four hundred and twenty two');
    });

    it('Should return "one million, one thousand"', function() {
        convert(1001000).should.equal('one million, one thousand');
    });

    it('Should return "minus one"', function() {
        convert(-1).should.equal('minus one');
    });

    it('Invalid input should throw an exception', function() {
        (function() {
            convert('string');
        }).should.throw();
    });

    it('Unsafe integer should throw an exception', function() {
        (function() {
            convert(9007199254740992);
        }).should.throw();
    });

    // Extra tests
    it('Should return "minus one million, one thousand"', function() {
        convert(-1001000).should.equal('minus one million, one thousand');
    });

    it('Should return "four thousand, nine hundred twenty one"', function() {
        convert(4921).should.equal('four thousand, nine hundred and twenty one');
    });

    it('Should return "minus one hundred million, one thousand"', function() {
        convert(-100100513).should.equal('minus one hundred million, one hundred thousand, five hundred and thirteen');
    });

    it('Should return "thirty two million, one hundred and fifty four thousand, seven hundred and seventeen"', function() {
        convert(32154717).should.equal('thirty two million, one hundred and fifty four thousand, seven hundred and seventeen');
    });

});

mocha.run();
