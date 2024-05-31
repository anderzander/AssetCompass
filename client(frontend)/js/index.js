

function convert(){
    fetch('http://localhost:3000/currency')
        .then(response => response.json())
        .then(data => {
            var amount = document.getElementById('converterBTC').value;
            var convertedValue = document.getElementById('output')
            var bitcoinValue = data;
            convertedValue.innerText = (bitcoinValue.EUR * amount).toFixed(2) + " €";
        })
        .catch(error => console.error('Error fetching data:', error));
}



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
document.getElementById('converterBTC').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
    }
});

document.getElementById('converterBTC').addEventListener('input', function(event) {
    convert();
});

//add a new Box
document.getElementById('addBox').addEventListener('click', function (){
    var newBox = document.createElement('div');
    newBox.className = 'box';

    var newBoxTitle = document.createElement('h2');
    newBoxTitle.textContent = 'New Box';
    newBox.appendChild(newBoxTitle);

    var removeButton = document.createElement('button');
    removeButton.textContent = 'REMOVE'
    removeButton.addEventListener('click', function (){
        newBox.remove();
    })
    newBox.appendChild(removeButton);

    var newBoxContent = document.createElement('p');
    newBoxContent.textContent = 'Content for the new box goes here.';
    newBox.appendChild(newBoxContent);

    var container = document.querySelector('.container');
    var addBox = document.getElementById('addBox');

    container.insertBefore(newBox, addBox);
})