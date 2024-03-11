function MyFunction(){

    let R = document.getElementById("resistance").value;
    let W = document.getElementById("rotationFrequency").value;
    let B = document.getElementById("magneticInduction").value;


    let E = [];
    let I = [];
    let t = [];


    for(let i = 0; i < 10*Math.PI/W; i+=10*Math.PI/W/300)
    {
        t.push(i);
        E.push(B*W*Math.cos(W*i));
        I.push(B*W*Math.cos(W*i)/R);
    }

    let L1 = {
        title: 'ЭДС',
        xaxis: {
            title: 'Время, c'
        },
        yaxis: {
            title: 'ЭДС, В'
        }
    };

    let L2 = {
        title: 'ЭДС',
        xaxis: {
            title: 'Время, c'
        },
        yaxis: {
            title: 'Индукционный ток, А'
        }
    };

    Plotly.newPlot(
        "Graph1",
        [{
            mode: 'lines',
            type: 'scatter',
            x: t,
            y: E,
            line: {
                color: '#683aa4'
            }
        }],
        L1
    );

    Plotly.newPlot(
        "Graph2",
        [{
            mode: 'lines',
            type: 'scatter',
            x: t,
            y: I,
            line: {
                color: '#00b713'
            }
        }],
        L2
    );

    return false;
}