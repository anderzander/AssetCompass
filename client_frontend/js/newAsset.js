import {ElementBuilder, addChartForCryptoBox, setUserNameAndToggleLoginButton} from "./builders.js";


function appendAsset(asset, element) {
    const mainDiv = new ElementBuilder("div")
    mainDiv
        .id(asset.id).class("box")
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
        .appendTo(element)

    const arrayAssetsAlreadyInUse = sessionStorage.getItem("userArray")

    if (arrayAssetsAlreadyInUse.includes(asset.id)){
        mainDiv.element.style.backgroundColor = "rgba(255,255,255,0.1)";
    } else {mainDiv.listener('click', () => {
        addAssetAndReturnToIndexHTML(asset.id);
    })}

    setTimeout(() => {
        addChartForCryptoBox("chart" + asset.id, asset.historicalDate, asset.historicalPrice);
    }, 500);
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/assets/all')
        .then(response => {
            if (response.status === 401) { //if no user then login
                window.location.href = '/login.html';
            } else {
                return response.json();
            }
        })
        .then(data => {
            const container = document.querySelector('.container');
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const asset = data[key];
                    appendAsset(asset, container)
                }
            }

        })
        .catch(error => console.error('Error fetching data:', error));
});

//adds the assets via the server and when finished go back to start page
function addAssetAndReturnToIndexHTML(id) {
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
            location.href = 'index.html'
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


document.addEventListener('DOMContentLoaded', (event) => {
    setUserNameAndToggleLoginButton()
});