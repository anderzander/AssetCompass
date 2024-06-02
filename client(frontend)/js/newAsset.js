import {ElementBuilder} from "./builders.js";

function appendAsset(asset, element) {
    new ElementBuilder("div").id(asset.id).class("box").listener('click', () => addAssetToIndexHTML(asset.id))
        .append(new ElementBuilder("div").class("logo-Container")
            .append(new ElementBuilder("img")
                .with("src", asset.logo)
                .class("assetLogo")))
        .append(new ElementBuilder("h1").text(asset.name).class("box-text-content"))
        .append(new ElementBuilder("h2").text("€" + asset.price).class("box-text-content"))
        .appendTo(element)
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/assets/all')
        .then(response => response.json())
        .then(data => {
            console.log(data.BTC);
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

function addAssetToIndexHTML(id){
    fetch(`/asset/${id}`, {
        method: 'POST',
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