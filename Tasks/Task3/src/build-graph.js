class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const ConstKcoefficient = (1.256637 *  Math.pow(10, -6) * Math.PI) / 2 * Math.PI

function NormalizeInDegree(angle) {
    while (angle >= 360) {
        angle -= 360;
    }

    while (angle < 0) {
        angle += 360;
    }

    return angle;
}

function angleOfInclination(angle) {
    return NormalizeInDegree(360 - (90 + angle));
}

/* Нормализация угла гарантирует, что угол находится в нужном диапазоне */
function NormalizeInRadians(angle) {
    while (angle >= 2 * Math.PI) {
        angle -= 2 * Math.PI;
    }

    while (angle < 0) {
        angle += 2 * Math.PI;
    }

    return angle;
}



class Vector {
    constructor(radian, length) {
        this.radian = NormalizeInRadians(radian);

        this.length = length;
    }

    rotation90(amperage) {
        let newAngle;

        if (amperage >= 0) {
            newAngle = this.radian + Math.PI / 2;
        } else {
            newAngle = this.radian - Math.PI / 2;
        }

        this.radian = NormalizeInRadians(newAngle)
    }

    AddedV(vectors) {
        let totalX = 0;
        let totalY = 0;

        for (let vector of vectors) {
            totalX += Math.cos(vector.radian) * vector.length;
            totalY += Math.sin(vector.radian) * vector.length;
        }

        this.radian = NormalizeInRadians(Math.atan2(totalY, totalX));
        this.length = Math.sqrt(totalX ** 2 + totalY ** 2);
    }
}

class Current {
    constructor(amperage, point) {
        this.amperage = amperage;
        this.point = point;
    }
}

function countDist(firstPoint, secondPoint) {
    return Math.sqrt((secondPoint.x - firstPoint.x) ** 2 + (secondPoint.y - firstPoint.y) ** 2);
}

function scalarB(amperage, dist) {
    if (dist === 0) {
        return 0;
    }

    return ConstKcoefficient * (Math.abs(amperage) / dist);
}

function generatePoints(n, currents) {
    const maximum = 100
    let step = maximum / n
    const pointsSet = new Set();

    currents.forEach(current => {
        const {x, y} = current.point;
        pointsSet.add(`${x},${y}`);
    });

    const points = [];

    for (let x = 0; x <= maximum; x += step) {
        for (let y = 0; y <= maximum; y += step) {
            if (!pointsSet.has(`${x},${y}`)) {
                points.push(new Point(x, y));
            }
        }
    }
    return points;
}

function findMaximumAndMinimumLength(vectorData) {
    vectorData.sort((a, b) => a[2] - b[2]);

    const trimmedLength = Math.floor(vectorData.length * 0.01); // Удаляем по 1% с начала и конца
    const trimmedData = vectorData.slice(trimmedLength, -trimmedLength);

    let minLength = trimmedData[0][2];
    let maxLength = trimmedData[trimmedData.length - 1][2];

    return {min: minLength, max: maxLength};
}


function colorizeVectorByLength(maxMinLength, length) {
    const colors =
        ["#ee83ff", "#7a61ec", "#75a8f5",
            "#ff7965", "#f700ff", "#00ff00",
            "#ff30ae", "#5bff6d", "#ff2424"];

    const proportions = [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 0.9, 1];

    let colorCoeff = (length - maxMinLength.min) / (maxMinLength.max - maxMinLength.min);

    for (let i = 0; i < proportions.length; ++i) {
        if (colorCoeff <= proportions[i]) {
            return colors[i];
        }
    }

    return colors[colors.length - 1];
}


function FunctionMagneticField(dataOfTheGraph) {
    let currents = []
    for (const data of dataOfTheGraph.currents) {
        currents.push(new Current(data.amperage, new Point(data.coordinates[0], data.coordinates[1])));
    }

    const pointsArray = generatePoints(dataOfTheGraph.vectorsCount, currents);
    let vectorsData = []

    for (let point of pointsArray) {
        let vectors = []

        for (let current of currents) {
            let vector = new Vector(
                Math.atan2(point.y - current.point.y, point.x - current.point.x),
                scalarB(current.amperage, countDist(current.point, point)));

            vector.rotation90(current.amperage);
            vectors.push(vector);
        }

        let finalVector = new Vector(0, 1)
        finalVector.AddedV(vectors)

        vectorsData.push([point.x, point.y, finalVector.length, angleOfInclination(finalVector.radian * (180 / Math.PI))])
    }

    let currentsData = []
    for (const current of currents) {
        currentsData.push([current.point.x, current.point.y, current.amperage])
    }

    let maxMin = findMaximumAndMinimumLength(vectorsData)

    for (const vector of vectorsData) {
        const lengthIndex = 2;

        vector.push(colorizeVectorByLength(maxMin, vector[lengthIndex]));
        vector.push(vector[lengthIndex]);

        vector[lengthIndex] = 1;
    }

/* просто подключает библиотеку для визуализации. Highcharts — библиотека для создания чартов написанная на JavaScript, позволяет легко добавлять интерактивные, анимированные графики на сайт или в веб-приложение */

    Highcharts.chart('graph', {
        chart: {
            backgroundColor: '#212529'
        },
        title: {
            text: 'Линии магнитного поля в двумерном пространстве',
            style: {
                color: '#fdfdfd',
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: 'lighter'
            }
        },

        xAxis: {
            min: 0,
            max: 100,
            gridLineWidth: 1,
            labels: {
                style: {
                    color: '#fdfdfd'
                }
            }
        },

        yAxis: {
            min: 0,
            max: 100,
            gridLineWidth: 1,
            labels: {
                style: {
                    color: '#fdfdfd'
                }
            }
        },

        legend: {
            itemStyle: {
                color: '#fdfdfd'
            }
        },
        tooltip: {
            formatter: function () {
                if (this.series.type === 'vector') {
                    return '<b>Start X: ' + this.point.x + '<br>Start Y: ' + this.point.y +
                        '<br>Direction: ' + this.point.direction + '°' +
                        '<br>Scalar: ' + this.point.scalar + ' T';
                } else if (this.series.type === 'scatter') {
                    const amperageIndex = 2;
                    return '<b>X: ' + this.point.x + '<br>Y: ' + this.point.y +
                        '<br>Amperage: ' + currentsData[this.point.index][amperageIndex];
                }
            }
        },

        plotOptions: {
            series: {
                turboThreshold: (dataOfTheGraph.vectorsCount + 1) ** 2,
                states: {
                    inactive: {
                        opacity: 1
                    },
                },
            },
            vector: {
                rotationOrigin: "start",
                vectorLength: dataOfTheGraph.vectorLength,
            }
        },

        series: [
            {
                type: 'vector',
                name: 'Magnetic field',
                keys: ['x', 'y', 'length', 'direction', 'color', 'scalar'],
                colorKey: 'scalar',
                data: vectorsData,
                showInLegend: true
            },
            {
                type: 'scatter',
                name: 'Currents',
                color: 'red',
                data: currentsData,
                marker: {
                    symbol: 'circle', radius: 6
                },
                showInLegend: true
            },
        ]
    });
}


const defaultGraphData = {
    currents: [
        {amperage: -1, coordinates: [30, 70]},
        {amperage: 1, coordinates:  [30, 70]},
        {amperage: 1, coordinates: [70, 30]},
        {amperage: -1, coordinates: [70, 30]},
    ],
    vectorsCount: 60,
    vectorLength: 15,
};

FunctionMagneticField(defaultGraphData)