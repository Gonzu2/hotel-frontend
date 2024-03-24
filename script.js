let rooms;

window.onload = async function () {
  try {
    const response = await fetch("http://localhost:4001/api/v1/rooms");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    rooms = data.availableRooms;
    const roomContainer = document.querySelector(".room-container");
    rooms.forEach((room) => {
      const li = document.createElement("li");
      li.classList.add("room");

      li.innerHTML = `
          <ul class="room-info">
            <li class="room-number">Room number: ${room.number}</li>
            <li class="room-capacity">Capacity: ${room.capacity}</li>
          </ul>
          <ul class="room-info-2">
            <li class="room-wifi">Wifi: ${room.wifi ? "True" : "False"}</li>
            <li class="room-parking">Parking: ${
              room.parking ? "True" : "False"
            }</li>
          </ul>
          <img src="${
            room.room_image
          }" alt="room image" width="auto" height="150px">
          <button class="button" data-room-number="${
            room.number
          }" onclick="moreInfo(event)">More info</button>
        `;

      roomContainer.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};

async function moreInfo(e) {
  e.preventDefault();

  let overlay = document.getElementById("overlay");

  overlay.style.display = "block";

  const roomNumber = e.target.getAttribute("data-room-number");
  const foundRoom = rooms.find((room) => room.number === roomNumber);

  let popupContent = document.getElementById("popup-content");

  popupContent.innerHTML = `
    <ul class="popup-nav">
        <li>Available</li>
        <li>${foundRoom.price} Eur</li>
    </ul>
    <ul class="popup-room-info">
        <li>Room number - ${foundRoom.number}</li>
        <li>Capacity - ${foundRoom.capacity}</li>
    </ul>
    <ul class="popup-room-info-2">
        <li ><ul class="room-services"><li>Wifi - ${foundRoom.wifi}</li><li>Parking - ${foundRoom.parking}</li><li>Breakfast - ${foundRoom.breakfast}</li></ul></li>
        <li><img id="popup-room-image" src="${foundRoom.room_image}" alt="room image"></li>
        <li><button class="button" style="width:50%; font-size:24px;" onclick="reserve(event,${roomNumber});">Reserve</button></li>
    </ul>
  `;
}

async function closeOverlay(e) {
  e.preventDefault();
  let overlay = document.getElementById("overlay");

  overlay.style.display = "none";
}

async function reserve(e, roomNumber) {
  e.preventDefault();

  let overlay = document.getElementById("overlay");
  let popupContent = document.getElementById("popup-content");

  popupContent.innerHTML = `
  <ul class="reserve-form-container">
  <li><h3>Please enter your details</h3></li>
  <li>
    <form action="/" id="reservation-form" method="POST">
      <label for="name">Name:</label><br />
      <input type="text" id="name" name="name" required/><br />

      <label for="address">Address:</label><br />
      <input type="text" id="address" name="address" required /><br />

      <label for="date_from">Check-in Date:</label><br />
      <input type="date" id="date_from" name="date_from" required /><br />

      <label for="date_to">Check-out Date:</label><br />
      <input type="date" id="date_to" name="date_to" required /><br />

      <label for="zip_code">Zip Code:</label><br />
      <input type="text" id="zip_code" name="zip_code" required /><br />

      <label for="city">City:</label><br />
      <input type="text" id="city" name="city" required/><br /><br />

      <input type="submit" class="button" style="height: 50px; font-size: 18px;" value="Reserve" />
    </form>
  </li>
</ul>
  `;
}

const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");
const clearButton = document.getElementById("clearButton");

// Function to show/hide clear button based on input values
function toggleClearButton() {
  if (checkinInput.value !== "" || checkoutInput.value !== "") {
    clearButton.style.display = "block";
  } else {
    clearButton.style.display = "none";
  }
}

checkinInput.addEventListener("input", function () {
  toggleClearButton();
  checkRoomAvailability();
});
checkoutInput.addEventListener("input", function () {
  toggleClearButton();
  checkRoomAvailability();
});

async function checkRoomAvailability() {
  let checkinDate = new Date(checkinInput.value);
  let checkoutDate = new Date(checkoutInput.value);

  if (checkinDate !== "") {
    checkinDate = checkinDate.toISOString();
  }
  if (checkoutDate !== "") {
    checkoutDate = checkoutDate.toISOString();
  }

  if (checkinDate !== "" && checkoutDate !== "") {
    try {
      const response = await fetch(
        `http://localhost:4001/api/v1/rooms/availability/checkin/${checkinDate}/checkout/${checkoutDate}`
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      rooms = data.availableRooms;
      const roomContainer = document.querySelector(".room-container");

      roomContainer.innerHTML = "";

      rooms.forEach((room) => {
        const li = document.createElement("li");
        li.classList.add("room");

        li.innerHTML = `
              <ul class="room-info">
                <li class="room-number">Room number: ${room.number}</li>
                <li class="room-capacity">Capacity: ${room.capacity}</li>
              </ul>
              <ul class="room-info-2">
                <li class="room-wifi">Wifi: ${room.wifi ? "True" : "False"}</li>
                <li class="room-parking">Parking: ${
                  room.parking ? "True" : "False"
                }</li>
              </ul>
              <img src="${
                room.room_image
              }" alt="room image" width="auto" height="150px">
              <button class="button" data-room-number="${
                room.number
              }" onclick="moreInfo(event)">More info</button>
            `;

        roomContainer.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching or processing data:", error);
    }
  }
}



// Add event listener to clear button to clear inputs and hide button
clearButton.addEventListener("click", () => {
  checkinInput.value = "";
  checkoutInput.value = "";
  toggleClearButton();
});
