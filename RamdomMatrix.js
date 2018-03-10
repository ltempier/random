'use strict';

const Jimp = require('jimp');
const Matrix = require('./Matrix');

class RamdomMatrix {

    constructor() {
        this.n = 10;
        this.index = 0;
        this.matrices = [];

        this.lastRandomNumber = null;
        this.init(10)
    }

    init(length) {
        this.matrices = [];
        for (let i = 0; i < length; i++) {
            this.matrices.push(new Matrix(200, 200))
        }
    }


    addRandomNumber(number) {
        if (number < 0 || number >= this.n)
            throw new Error(`${number} not in range 0-${this.n - 1}`);

        if (this.lastRandomNumber !== null) {

            [this.matrices[this.index - 1], this.matrices[this.index]].forEach((matrix) => {
                if (matrix) {
                    let from = {
                        i: computeMatrixProjection(this.lastRandomNumber, matrix, this.n),
                        j: 0
                    };
                    let to = {
                        i: computeMatrixProjection(number, matrix, this.n),
                        j: matrix.height - 1
                    };
                    matrix.line(from, to)
                }
            });

            this.index += 1;
            if (this.index > this.matrices.length)
                this.index = 0
        }
        this.lastRandomNumber = number;

        function computeMatrixProjection(number, matrix, n) {
            return Math.round((number + 1) * (matrix.width / (n + 1)))
        }
    }

    draw(filePath, callback) {

        let width = 0, height = 0;
        this.matrices.forEach(function (matrix) {
            height += matrix.height;
            if (matrix.width > width)
                width = matrix.width
        });

        new Jimp(width, height, (err, image) => {

            let offset = 0;
            this.matrices.forEach(function (matrix) {
                matrix.minify();
                const max = matrix.getMax(); //255
                for (let j = 0; j < matrix.height; j++) {
                    for (let i = 0; i < matrix.width; i++) {

                        const value = matrix.get(i, j) * 255 / max;
                        image.setPixelColor(Jimp.rgbaToInt(0, 0, 0, value), i, j + offset)

                    }
                }
                offset += matrix.height
            });

            image
                .resize(800, 800)
                .write(filePath, callback)
        });
    }
}

module.exports = RamdomMatrix;
