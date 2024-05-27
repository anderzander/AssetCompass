
module.exports = function() {
    console.log('index.js wird ausgeführt');
};

document.addEventListener('DOMContentLoaded', function() {
    // URL der API für Wetterdaten
    const apiUrl = 'curl https://api.coingecko.com/api/v3/ping?x_cg_demo_api_key=CG-k3fULmPbLAn5cvmjpiPe6X8a';

    // Eine HTTP-Anfrage an die API senden
    fetch(apiUrl)
        .then(response => response.json()) // Konvertiert die Antwort in JSON
        .then(data => {
            // Daten verarbeiten und auf der Seite anzeigen
            const weatherDataElement = document.getElementById('weatherData');
            weatherDataElement.innerHTML = `<p>Temperature: ${data.temperature} °C</p>
                                            <p>Humidity: ${data.humidity}%</p>`;
        })
        .catch(error => console.error('Error fetching data:', error));
});