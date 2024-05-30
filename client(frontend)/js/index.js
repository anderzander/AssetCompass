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

window.onload = function (){
    convert()
}

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

// Trigger convert button click on Enter key press in the input field
document.getElementById('converterBTC').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
    }
});

document.getElementById('converterBTC').addEventListener('input', function(event) {
    convert();
});