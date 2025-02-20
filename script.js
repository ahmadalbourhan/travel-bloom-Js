document.addEventListener("DOMContentLoaded", function () {
  // Get DOM element references
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchBtn");
  const clearButton = document.getElementById("clearBtn");
  const resultsContainer = document.getElementById("results");

  let apiData = {};

  // Hide results container initially
  resultsContainer.style.display = "none";

  // Fetch travel recommendation data from the JSON file
  fetch("travel_recommendation_api.json")
    .then((response) => response.json())
    .then((data) => {
      apiData = data;
      console.log("API data loaded:", apiData);
    })
    .catch((error) => {
      console.error("Error fetching recommendations:", error);
    });

  // Search button event listener
  searchButton.addEventListener("click", function () {
    console.log("Search button clicked.");
    const query = searchInput.value.trim().toLowerCase();
    if (query === "") {
      alert("Please enter a keyword.");
      return;
    }

    // Get recommendations based on the query
    const filteredResults = searchRecommendations(query);
    displayResults(filteredResults);
  });

  // Clear button event listener
  clearButton.addEventListener("click", function () {
    console.log("Clear button clicked.");
    resultsContainer.innerHTML = "";
    searchInput.value = "";
    resultsContainer.style.display = "none"; // Hide results container
  });

  // Function to search recommendations based on keyword
  function searchRecommendations(query) {
    let results = [];

    // Check for direct keyword matches in categories
    if (query.includes("beach")) {
      results = apiData.beaches || [];
    } else if (query.includes("temple")) {
      results = apiData.temples || [];
    } else if (query.includes("country")) {
      // Combine all cities from every country
      (apiData.countries || []).forEach((country) => {
        if (country.cities && Array.isArray(country.cities)) {
          results = results.concat(country.cities);
        }
      });
    } else {
      // Fallback: search across all items (beaches, temples, and cities)
      let allItems = [];
      allItems = allItems.concat(apiData.beaches || [], apiData.temples || []);
      (apiData.countries || []).forEach((country) => {
        if (country.cities && Array.isArray(country.cities)) {
          allItems = allItems.concat(country.cities);
        }
      });

      results = allItems.filter((item) => {
        return (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      });
    }

    return results;
  }

  // Function to display results on the page
  function displayResults(items) {
    resultsContainer.innerHTML = "";

    if (items.length === 0) {
      resultsContainer.innerHTML = "<p>No recommendations found.</p>";
    } else {
      items.forEach((item) => {
        // Create a card element for each recommendation
        const card = document.createElement("div");
        card.className = "recommendation-card";
        card.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.name}" />
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <button>visit</button>
        `;
        resultsContainer.appendChild(card);
      });
    }

    // Show results container
    resultsContainer.style.display = "block";
  }
});
