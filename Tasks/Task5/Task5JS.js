function MyFunction(){
// https://studfile.net/preview/8823644/page:7/
    // https://studfile.net/preview/8823644/page:7/
    // все формулы брала из сайта выше
    let R = document.getElementById("R").value;
    let L = document.getElementById("L").value;
    let E = document.getElementById("E").value;


    let t = [];
    let Connect = [];
    let Disconnect = [];

    for(let i = 0; i < 100; i+=0.0001)
    {
        t.push(i);
        Connect.push(E/R*(1-Math.exp(-R/L*i)));
        Disconnect.push(E/R*Math.exp(-R/L*i));

        if (E/R*Math.exp(-R/L*i) < 0.00001)
            break;
    }

    let layout_1 = {
        title: {
            text: 'График I(t) при замыкании цепи',
            style: {
                color: '#fdfdfd',
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: 'lighter'
            }
        },
        xaxis: {
            title: 'Время t (c)'
        },
        yaxis: {
            title: 'I(t), А'
        }
    };

    let layout_2 = {
        title: {
            text: 'График I(t) при размыкании цепи',
            style: {
                color: '#fdfdfd',
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: 'lighter'
            }
        },
        xaxis: {
            title: 'Время t (c)'
        },
        yaxis: {
            title: 'I(t), А'
        }
    };

    Plotly.newPlot(
        "myDiv_1",
        [{
            mode: 'lines',
            type: 'scatter',
            x: t,
            y: Connect,
            line: {
                color: '#683aa4' // Цвет линии - фиолетовый
            }
        }],
        layout_1
    );

    Plotly.newPlot(
        "myDiv_2",
        [{
            mode: 'lines',
            type: 'scatter',
            x: t,
            y: Disconnect,
            line: {
                color: '#00b713' // Цвет линии - фиолетовый
            }
        }],
        layout_2
    );

    return false;
}
