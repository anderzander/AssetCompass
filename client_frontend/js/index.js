import {ElementBuilder, ParentChildBuilder} from './builders.js';


document.getElementById('addBoxSymbol').addEventListener('click', function () {
    fetch('/user/status', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        }

    })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                location.href = 'newAsset.html';
            }
            return response.json()
        })
        .then(data => {
            if (data.admin) {
                location.href = 'admin.html';
            } else {
                location.href = 'newAsset.html';
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
});


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

function switchAssetBox(arrayForSwitching) {

    fetch(`/asset/switch`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arrayForSwitching)
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
            element1ForSwitch = Object.assign({}, asset);
            element1ForSwitch.id = asset.id;
            console.log(asset.id.toString())
        })
        .listener("dragover", (e) => {
            e.preventDefault();
            element2OriginalId = asset.id
            element2ForSwitch = Object.assign({}, asset);
            element2ForSwitch.id = asset.id
            console.log(asset.id.toString())
        })
        .listener("drop", (e) => {
            e.preventDefault()
            console.log("drop")
            const elementOld1 = document.getElementById(element1OriginalId);
            const elementOld2 = document.getElementById(element2OriginalId);
            elementOld1.id = "old1"
            elementOld2.id = "old2"

            appendAsset(element1ForSwitch, element, elementOld2)
            appendAsset(element2ForSwitch, element, elementOld1)

            elementOld1.remove();
            elementOld2.remove();
            const arrayOfTowIdsForSwitching = []
            arrayOfTowIdsForSwitching.push(element1OriginalId, element2OriginalId)
            switchAssetBox(arrayOfTowIdsForSwitching)
            console.log(arrayOfTowIdsForSwitching);
        })
        .append(new ElementBuilder("img")
            .with("src", "assets/images/X_Symbol.png")
            .class("removeSymbol")
            .listener("click", () => deleteAssetBox(asset.id)))
        .append(new ElementBuilder("img")
            .with("src", "assets/images/menu.png")
            .class("menuSymbol")
            .listener("click", () => {
                location.href = 'assetEdit.html'
            }))
        .append(new ElementBuilder("div").class("logo-Container")
            .append(new ElementBuilder("img")
                .with("src", asset.logo)
                .class("assetLogo")))
        .append(new ElementBuilder("h1").text(asset.name).class("box-text-content"))
        .append(new ElementBuilder("h2").text("€" + asset.price).class("box-text-content"))
        .append(new ElementBuilder("div")
            .class("chartInBoxes")
            .append(new ElementBuilder("canvas")
                .id("chart" + asset.id)))
        .insertBefore(element, insertBefore)

    //time out is important then cart can't be loaded if the canvas DOM element doesn't exist
    setTimeout(() => {
        addChartForCryptoBox("chart" + asset.id, asset.historicalDate, asset.historicalPrice);
    }, 500);
}

function appendNews(article, element) {
    new ElementBuilder("div")
        .class('newsBox')
        .append(new ElementBuilder("div").class("newsPicContainer")
            .append(new ElementBuilder("img").class("newsPic")
                .with("src", article.image)))
        .append(new ElementBuilder("h4").text(article.title).class("h4ForNews"))
        .append(new ElementBuilder("p").text(article.description).class("descriptionForNews"))
        .append(new ElementBuilder("a").text("Link to article").href(article.url).class("linkUrl"))
        .appendTo(element)
}

function loadAssets() {
    console.log("loading assets in index.js(line127)")
    fetch('/assets')
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                console.log("in if statment loadAssets")
                loadNews()
            }
            if (response.status === 200) {
                return response.json()
            }
        })
        .then(data => {
            const container = document.querySelector('.container');
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const asset = data[key];
                    appendAsset(asset, container, document.getElementById('addBox'))
                }
            }

            const logButton = document.querySelector('.loginButton');
            logButton.textContent = "Logout"
            logButton.addEventListener('click', () => {
                if (logButton.textContent === "Logout") {
                    eraseCookie('token');
                    logButton.textContent = "Login";
                }
            });


        })
        .catch(error => console.error('Error fetching data:', error));
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

function loadNews() {
    fetch('/assets/news')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.container');
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const article = data[key];
                    appendNews(article, container)
                }
            }


        })
        .catch(error => console.error('Error fetching data:', error));
}


window.onload = (event) => {
    console.log("loading assets in index.js(line158)")
    loadAssets();
};

//chart
function addChartForCryptoBox(chartName, date, price) {

    if (!Array.isArray(date) || !Array.isArray(price) || date.length === 0 || price.length === 0) {
        console.error("Date or price array is not defined or empty: " + chartName);
        return;
    }

    const xValues = date;
    const yValues = price;
    var color;

    //if price at the start of the array is lower at the end of the array chart is red else green
    if (yValues[0] < yValues[(yValues.length) - 1]) {
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

