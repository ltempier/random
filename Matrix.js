'use strict';

const Jimp = require('jimp');

class Matrix {

    constructor(width, height) {

        if (isNaN(width) || isNaN(height))
            throw new Error('need width & height');

        this.width = width;
        this.height = height;

        this.init()
    }

    init() {
        this.data = [];
        for (let j = 0; j < this.height; j++) {
            let buffer = [];
            for (let i = 0; i < this.width; i++)
                buffer.push(0)
            this.data.push(buffer)
        }
    }

    get(i, j) {
        this.checkSize(i, j);
        return this.data[j][i]
    }

    set(i, j, value) {
        this.checkSize(i, j);
        this.data[j][i] = value;
    }

    increment(i, j) {
        this.checkSize(i, j);
        this.data[j][i] += 1
    }

    getMin() {
        let min = 0;
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++)
                if (this.data[j][i] < min)
                    min = this.data[j][i]
        }
        return min
    }

    getMax(length) {
        let max = [...new Array(length || 1)];
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {

                max.some((maxValue, maxIdx) => {
                    const value = this.get(i, j);
                    if (value > (maxValue || 0)) {
                        max[maxIdx] = value;
                        return true
                    }
                    return false
                })
            }
        }

        if (arguments.matrixLength === 0)
            return max[0];
        return max
    }


    checkSize(i, j) {

        if (isNaN(i))
            throw new Error('i isNan');
        else if (i >= this.width)
            throw new Error('i >= Matrix.width');
        else if (i < 0)
            throw new Error('i < 0');

        if (isNaN(j))
            throw new Error('j isNan');
        else if (j >= this.height)
            throw new Error('j >= Matrix.height');
        else if (j < 0)
            throw new Error('j < 0')
    }

    minify() {
        let min = this.getMin();
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++)
                this.data[j][i] -= min
        }
    }

    line(from, to) {
        this.checkSize(from.i, from.j);
        this.checkSize(to.i, to.j);

        if (to.i === from.i) {
            for (let j = from.j; j <= to.j; j++)
                this.increment(from.i, j);
        } else {
            let a = (to.j - from.j) / (to.i - from.i);
            let b = from.j - a * from.i;
            let old = null;

            if (this.width >= this.height) {
                for (let i = from.i; i <= to.i; i++) {
                    let j = Math.round(a * i + b);
                    if (j !== old) {
                        this.increment(i, j);
                        old = j
                    }
                }
            } else if (a !== 0) {
                for (let j = from.j; j <= to.j; j++) {
                    let i = Math.round((j - b) / a);
                    if (i !== old) {
                        this.increment(i, j);
                        old = i
                    }
                }
            }
        }
    }

    draw(filePath, callback) {
        this.minify();
        const max = this.getMax(); //255

        new Jimp(this.width, this.height, (err, image) => {

            for (let j = 0; j < this.height; j++) {
                for (let i = 0; i < this.width; i++) {
                    const value = this.get(i, j) * 255 / max;

                    image.setPixelColor(Jimp.rgbaToInt(value, 0, 0, 255), i, j)
                }
            }

            image
                // .resize(800, 800)
                .write(filePath, callback)
        });
    }

}


module.exports = Matrix;


