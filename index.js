'use strict';


const _ = require('lodash');
const Matrix = require('./RamdomMatrix');


let ma = new Matrix()

for (let i = 0; i < 1000000; i++) {
    const r = _.random(ma.n - 1);
    ma.addRandomNumber(r)
}

ma.draw('file.png', function () {
    console.log('done')
})
