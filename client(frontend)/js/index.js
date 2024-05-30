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
