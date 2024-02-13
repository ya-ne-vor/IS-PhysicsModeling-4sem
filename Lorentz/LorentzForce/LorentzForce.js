function MyFunction(){
    var AmountCharge = document.getElementById("AmountCharge").value;

    var ChargeSign= document.getElementById("ChargeSign").value;

    var Induction= document.getElementById("Induction").value;

    var SpeedCharge= document.getElementById("SpeedCharge").value;

    var AngleBetween= document.getElementById("AngleBetween").value;

    var chargeSign = (ChargeSign === 'neg') ? -1 : 1;

    var x = [];
    var y = [];
    var z = [];
    var _color = [];

    var Radius = SpeedCharge/(AmountCharge * Induction * Math.cos(AngleBetween * Math.PI / 180)); // радиус движения частицы
    var Deviation = SpeedCharge * ((1/30)/(SpeedCharge * Math.cos(AngleBetween * Math.PI / 180) / Radius)) * Math.sin(AngleBetween * Math.PI / 180);

    var pointCount = 1000;

    for(var i = 0; i < pointCount; i++)
    {
        x.push(Radius * Math.cos(i * chargeSign / 30));
        y.push(Radius * Math.sin(i * chargeSign / 30));
        z.push(i * chargeSign * Deviation);
        _color.push(i * 10)
    }

    // использую библиотеку для 3d изуализации, придания линии цвета и т.д.
    Plotly.newPlot("myDiv", [{
        mode: 'lines',
        type: 'scatter3d',
        x: x,
        y: y,
        z: z,
        opacity: 1,
        line: {
            width: 10,
            color: _color,
            colorscale: 'Rainbow'}
    }]);

    return false;
}
