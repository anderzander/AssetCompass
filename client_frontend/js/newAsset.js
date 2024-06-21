import {ElementBuilder} from "./builders.js";

function appendAsset(asset, element) {
    new ElementBuilder("div")
        .id(asset.id).class("box")
        .listener('click', () => {
            addAssetAndReturnToIndexHTML(asset.id);
           })
        .append(new ElementBuilder("div").class("logo-Container")
            .append(new ElementBuilder("img")
                .with("src", asset.logo)
                .class("assetLogo")))
        .append(new ElementBuilder("h1").text(asset.name).class("box-text-content"))
        .append(new ElementBuilder("h2").text("€" + asset.price).class("box-text-content"))
        .append(new ElementBuilder("canvas").id("chart" + asset.id))
        .appendTo(element)

    setTimeout(() => {
        addChartForCryptoBox("chart" + asset.id, asset.historicalDate, asset.historicalPrice);
    }, 500);
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/assets/all')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.container');
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const asset = data[key];
                    appendAsset(asset,container)
                }
            }


        })
        .catch(error => console.error('Error fetching data:', error));
});

//adds the assets via the server and when finished go back to start page
function addAssetAndReturnToIndexHTML(id){
    fetch(`/asset/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
                if (response.status === 403) {
                    const popup = document.getElementById('popup');
                    popup.style.display = 'flex';
                }

            if (!response.ok) {
                const popup = document.getElementById('popup');
                popup.style.display = 'flex';
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // If the response is in JSON format
        })
        .then(data => {
            console.log('Success:', data);
            location.href='index.html'
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function addChartForCryptoBox(chartName, date, price) {

    if (!Array.isArray(date) || !Array.isArray(price) || date.length === 0 || price.length === 0) {
        console.error("Date or price array is not defined or empty: " + chartName);
        return;
    }

    const xValues = date;
    const yValues = price;
    var color;

    //if price at the start of the array is lower at the end of the array chart is red else green
    if (yValues[0] < yValues[(yValues.length) - 1]){
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

document.addEventListener('DOMContentLoaded', (event) => {
    const popup = document.getElementById('popup');
    const closeBtn = document.querySelector('.close-btn');

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    });
});