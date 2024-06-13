import {ElementBuilder, ParentChildBuilder} from './builders.js';


//add a new Box
function buildBox() {
    var newBox = document.createElement('div');
    newBox.className = 'box';

    new ElementBuilder("img")
        .with("src", "assets/images/X_Symbol.png")
        .class("removeSymbol")
        .listener("click", () => newBox.remove())
        .appendTo(newBox);

    new ElementBuilder("img")
        .with("src", "assets/images/menu.png")
        .class("menuSymbol")
        .listener("click", () => location.href = 'assetEdit.html')
        .appendTo(newBox);

    return newBox
}

document.getElementById('addBoxSymbol').addEventListener('click', function () {
    location.href = 'newAsset.html'
})

//delete Box
function deleteAssetBox(id) {
    document.getElementById(id).remove()

    fetch(`/asset/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // If the response is in JSON format
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



var element1ForSwitch = null;
var element1OriginalId = null;
var element2ForSwitch = null;
var element2OriginalId = null;


function appendAsset(asset, element, insertBefore) {
    new ElementBuilder("div")
        .id(asset.id).class("box")
        .with("draggable", "true")
        .listener("dragstart", () => {
            element1OriginalId = asset.id;
            element1ForSwitch = Object.assign({},asset);
            element1ForSwitch.id = asset.id + "temp";
            console.log(asset.id.toString())
        })
        .listener("dragover", (e) => {
            e.preventDefault();
            element2OriginalId = asset.id
            element2ForSwitch = Object.assign({},asset);
            element2ForSwitch.id = asset.id + "temp"
            console.log(asset.id.toString())
        })
        .listener("drop", (e) => {
            e.preventDefault()
            console.log("drop")
            appendAsset(element1ForSwitch, element, document.getElementById(element2OriginalId))
            appendAsset(element2ForSwitch, element, document.getElementById(element1OriginalId))

            document.getElementById(element1OriginalId).remove();
            document.getElementById(element2OriginalId).remove();

            //todo neue elemente haben Id + "temp" wieder auf original id zurücksetzen!!!!!!;
            //todo element in richtiger reihenfolge Serverseitig speichern damit reihenfolge beim reload erhalten bleibt!!
        })
        .append(new ElementBuilder("img")
            .with("src", "assets/images/X_Symbol.png")
            .class("removeSymbol")
            .listener("click", () => deleteAssetBox(asset.id)))
        .append(new ElementBuilder("img")
            .with("src", "assets/images/menu.png")
            .class("menuSymbol")
            .listener("click", () => location.href = 'assetEdit.html'))
        .append(new ElementBuilder("div").class("logo-Container")
            .append(new ElementBuilder("img")
                .with("src", asset.logo)
                .class("assetLogo")))
        .append(new ElementBuilder("h1").text(asset.name).class("box-text-content"))
        .append(new ElementBuilder("h2").text("€" + asset.price).class("box-text-content"))
        .append(new ElementBuilder("canvas").id("chart" + asset.id))
        .insertBefore(element, insertBefore)

    //time out is important then cart can't be loaded if the canvas DOM element doesn't exist
    setTimeout(() => {
        addChartForCryptoBox("chart" + asset.id, asset.historicalDate, asset.historicalPrice);
    }, 500);
}

function loadAssets() {
    fetch('/assets')
        .then(response => response.json())
        .then(data => {
            console.log(data.BTC);
            const container = document.querySelector('.container');
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const asset = data[key];
                    appendAsset(asset, container, document.getElementById('addBox'))
                }
            }


        })
        .catch(error => console.error('Error fetching data:', error));
}

window.onload = (event) => {
    loadAssets();
};

//chart
function addChartForCryptoBox(chartName, date, price) {
    const xValues = date;
    const yValues = price;
    var color;

    //if price at the start of the array is lower at the end of the array chart is red else green
    if (price[0] < price[(price.length) - 1]) {
        color = "rgb(67,150,74)"
    } else {
        color = "rgb(229,1,35)"
    }

    new Chart(document.getElementById(chartName).getContext('2d'), {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: color,
                borderColor: color,
                data: yValues,
                pointRadius: 2
            }]
        },
        options: {
            legend: {display: false},
            scales: {
                xAxes: [{
                    gridLines: {display: false},
                    ticks: {display: false}
                }],
                yAxes: [{
                    ticks: {display: false},
                    gridLines: {display: false}
                }]
            },
            layout: {
                padding: {
                    left: 8,
                    right: 20,
                    bottom: 20,
                    top: 20
                }
            }
        }
    });
}
