import {ElementBuilder, ParentChildBuilder} from './builders.js';

// function convert() {
//     fetch('/currency')
//         .then(response => response.json())
//         .then(data => {
//             var amount = document.getElementById('converterBTC').value;
//             var convertedValue = document.getElementById('output')
//             var bitcoinValue = data;
//             convertedValue.innerText = (bitcoinValue * amount).toFixed(2) + " €";
//         })
//         .catch(error => console.error('Error fetching data:', error));
// }


document.addEventListener('DOMContentLoaded', () => {
    fetch('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD,JPY,EUR&api_key=db34a3799a2813ae847aa1145cdd903b1b7fc3aec63c1c1a1eec59435ca95c4c')
        .then(response => response.json())
        .then(data => {
            const boxTitle = document.getElementById('box-1-title');
            const boxContent = document.getElementById('box-1-content');

            // Update Title
            boxTitle.textContent = 'BNB Prices';

            // Update Content
            boxContent.innerHTML = `
                <p>USD: ${data.USD}</p>
                <p>JPY: ${data.JPY}</p>
                <p>EUR: ${data.EUR}</p>
            `;
        })
        .catch(error => console.error('Error fetching data:', error));
});


// Trigger convert button click on Enter key press in the input field
document.getElementById('converterBTC').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
    }
});
// document.getElementById('converterBTC').addEventListener('input',  () => {
//     convert();
// });
// document.addEventListener('DOMContentLoaded', () => { convert()});


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
    var container = document.querySelector('.container');
    var addBox = document.getElementById('addBox');

    container.insertBefore(buildBox(), addBox);
})

function appendAsset(asset, element) {
    new ElementBuilder("div").id(asset.id).class("box")
        .append(new ElementBuilder("img")
            .with("src", "assets/images/X_Symbol.png")
            .class("removeSymbol")
            .listener("click", () => document.getElementById(asset.id).remove()))
        .append(new ElementBuilder("img")
            .with("src", "assets/images/menu.png")
            .class("menuSymbol")
            .listener("click", () => location.href = 'assetEdit.html'))
        .append(new ElementBuilder("img").with("src", asset.logo))
        .append(new ElementBuilder("h1").text(asset.name))
        .append(new ElementBuilder("p").text(asset.price))
        .insertBefore(element, document.getElementById('addBox'))
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/assets')
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

