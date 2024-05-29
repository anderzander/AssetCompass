

function convert(){
    const xhr = new XMLHttpRequest();

    xhr.onload = function (){
        if (xhr.status === 200) {
            var amount = document.getElementById('converterBTC').value;
            var convertedValue = document.getElementById('output')
            var bitcoinValue = JSON.parse(xhr.responseText)
            convertedValue.innerText = (bitcoinValue.EUR * amount).toFixed(2) + " €";
        } else {
            const error = 'Error in loadCurrency()'
            return error;
        }
    }

    const url = new URL("/currency", location.href)

    xhr.open("GET", url)
    xhr.send()
}



