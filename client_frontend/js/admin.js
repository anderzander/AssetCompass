import {ElementBuilder, addChartForCryptoBox, setUserNameAndToggleLoginButton} from "./builders.js";


function appendAsset(asset, element) {
    const mainDiv = new ElementBuilder("div")

    mainDiv
        .class("adminAsset")
        .append(new ElementBuilder("div").class("adminLogoContainer").append(new ElementBuilder("div").class("logo-Container")
            .append(new ElementBuilder("img")
                .with("src", asset.logo)
                .class("assetLogo"))))

        .append(new ElementBuilder("p").text("ID: " + asset.id).class("assetInfo"))
        .append(new ElementBuilder("p").text("NAME: " + asset.name).class("assetInfo"))
        .append(new ElementBuilder("p").text("TYP: " + asset.asset).class("assetInfo"))
        .append(new ElementBuilder("p").text("PRICE: " + asset.price).class("assetInfo"))
        .append(new ElementBuilder("button")
            .text("ADD")
            .class("adminAddButton").listener('click', function () {
                addAssetForUser(asset.id);
                mainDiv.element.style.backgroundColor = "green";
            }))
        .appendTo(element);

    const arrayAssetsAlreadyInUse = sessionStorage.getItem("userArray")

    if (arrayAssetsAlreadyInUse.includes(asset.id)){
        mainDiv.element.style.backgroundColor = "green";
    }

}

document.addEventListener('DOMContentLoaded', function () {
    const assetsAlreadyInUse = null;
    fetch('/assets/all')
        .then(response => {
            if (response.status === 401) { //if no user then login
                window.location.href = '/login.html';
            } else {
                return response.json();
            }
        })
        .then(data => {

            const container = document.querySelector('.adminContainer');
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
function addAssetForUser(id) {
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
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


document.addEventListener('DOMContentLoaded', (event) => {
    setUserNameAndToggleLoginButton();
});