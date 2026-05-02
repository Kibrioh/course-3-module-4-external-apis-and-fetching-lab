// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

// Get references to DOM elements
const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

// Function to fetch weather alerts from the API
async function fetchWeatherAlerts(state) {
  try {
    // Make request to the weather API using the provided state
    const response = await fetch(
      `${weatherApi}${state.toUpperCase()}`
    );

    // Throw an error if the response is not successful
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Parse the response JSON
    const data = await response.json();

    // Clear any previous error message and hide the error container
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");

    // Display the alerts in the DOM
    displayAlerts(data);

  } catch (error) {
    // Log the error message to the console for debugging
    console.log(error.message);

    // Show the error message in the error container
    errorMessage.textContent = error.message;
    errorMessage.classList.remove("hidden");
  }
}

// Function to display alerts in the DOM
function displayAlerts(data) {
  // Clear any previous alert content
  alertsDisplay.innerHTML = "";

  // Check if data structure is valid
  if (!data || !data.features) {
    alertsDisplay.textContent = "No alert data available.";
    return;
  }

  // Extract alerts and count
  const alerts = data.features;
  const count = alerts.length;

  // Use API title if available, otherwise fallback text
  const title = data.title || "Current alerts";

  // Create and display summary message
  const summary = document.createElement("h2");
  summary.textContent = `${title}: ${count}`;
  alertsDisplay.appendChild(summary);

  // Handle case where there are no alerts
  if (count === 0) {
    const noAlerts = document.createElement("p");
    noAlerts.textContent = "No active alerts for this state.";
    alertsDisplay.appendChild(noAlerts);
    return;
  }

  // Create a list to hold alert headlines
  const list = document.createElement("ul");

  // Loop through alerts and display each headline
  alerts.forEach(alert => {
    const headline = alert?.properties?.headline || "No headline available";

    const listItem = document.createElement("li");
    listItem.textContent = headline;

    list.appendChild(listItem);
  });

  // Add the list to the DOM
  alertsDisplay.appendChild(list);
}

// Add click event listener to the button
fetchButton.addEventListener("click", () => {
  const state = stateInput.value.trim();

  // Handle empty input as an error
  if (!state) {
    const error = new Error("Please enter a state abbreviation.");

    errorMessage.textContent = error.message;
    errorMessage.classList.remove("hidden");
    return;
  }

  // Call the fetch function with user input
  fetchWeatherAlerts(state);

  // Clear the input field after clicking the button
  stateInput.value = "";
});