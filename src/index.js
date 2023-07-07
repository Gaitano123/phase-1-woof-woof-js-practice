document.addEventListener('DOMContentLoaded', () => {

    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterButton = document.getElementById("good-dog-filter");

    let filterOn = false;

    fetch("http://localhost:3000/pups")
    .then(response => response.json())
    .then(pups => {
      pups.forEach(pup => {
        const pupSpan = document.createElement("span");
        pupSpan.textContent = pup.name;
        pupSpan.addEventListener("click", () => showPupInfo(pup));
        dogBar.appendChild(pupSpan);
      });
    });

  function showPupInfo(pup) {
    dogInfo.innerHTML = `
      <img src="${pup.image}" />
      <h2>${pup.name}</h2>
      <button>${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
    `;
    const toggleButton = dogInfo.querySelector("button");
    toggleButton.addEventListener("click", () => toggleGoodness(pup));
  }

  function toggleGoodness(pup) {
    pup.isGoodDog = !pup.isGoodDog;
    const toggleButton = dogInfo.querySelector("button");
    toggleButton.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";

    fetch(`http://localhost:3000/pups/${pup.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ isGoodDog: pup.isGoodDog })
    });
  }

  filterButton.addEventListener("click", () => {
    filterOn = !filterOn;
    filterButton.textContent = filterOn ? "Filter good dogs: ON" : "Filter good dogs: OFF";
    dogBar.innerHTML = "";


    fetch("http://localhost:3000/pups")
      .then(response => response.json())
      .then(pups => {
        if (filterOn) {
          pups = pups.filter(pup => pup.isGoodDog);
        }
        pups.forEach(pup => {
          const pupSpan = document.createElement("span");
          pupSpan.textContent = pup.name;
          pupSpan.addEventListener("click", () => showPupInfo(pup));
          dogBar.appendChild(pupSpan);
        });
      });
  });
})