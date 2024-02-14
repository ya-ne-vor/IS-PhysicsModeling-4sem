const mu_0 = 12.56 * 10 ** (-7);

function MagneticFieldInduction(RadiusCoils, Dist, CurrentValue, NumberTurns) {
    return (mu_0 * CurrentValue * NumberTurns * (RadiusCoils ** 2)) / (2 * ((RadiusCoils ** 2) + (Dist ** 2)) ** (3 / 2));
}

function MyFunction(){

    var RadiusCoils = document.getElementById("RadiusCoils").value;
    var NumberTurns = document.getElementById("NumberTurns").value;
    var CurrentValue = document.getElementById("CurrentValue").value;

    // 2d
    var x = [];
    var y = [];

    var i_start = - (RadiusCoils + 1);
    var i_end = RadiusCoils + 1;


    for(var i = i_start; i < i_end; i += 0.0001)
    {
        x.push(i);
        y.push(MagneticFieldInduction(RadiusCoils, Math.abs(RadiusCoils - i), CurrentValue, NumberTurns)
            + MagneticFieldInduction(RadiusCoils, Math.abs(i), CurrentValue, NumberTurns));
    }

    var data = [{
        x: x,
        y: y,
        mode: 'lines',
        line: {
            color: 'rgb(178, 102, 255)',
            width: 2
        }
    }];

    var layout = {
        title: 'Зависимость магнитной индукции поля от координаты x',
        titlefont: {
            size: 20,
            color: 'black'
        },
        yaxis: {
            title: 'B, Тл',
            titlefont: {
                size: 18,
                color: 'black'
            },
            showticklabels: true,
            tickangle: 0,
            tickfont: {
                size: 18,
                color: 'black'
            },
            exponentformat: 'e',
            showexponent: 'all'
        },
        xaxis: {
            title: 'x, м',
            titlefont: {
                size: 18,
                color: 'black'
            },
            showticklabels: true,
            tickangle: 'auto',
            tickfont: {
                size: 18,
                color: 'black'
            }
        }
    };

    Plotly.newPlot("myDiv", data, layout);
    return false;
}
