// Beach gear items 
const beachGearItems = [
    { item_name: 'Beach Chair', item_price: 3.50 },
    { item_name: 'Beach Umbrella', item_price: 5 },
    { item_name: 'Beach Towel', item_price: 1 },
    { item_name: 'Ice Chest (Small)', item_price: 5 },
    { item_name: 'Ice Chest (Large)', item_price: 8 },
    { item_name: 'Beach Bag (Over-Shoulder-Style(Full))', item_price: 5 },
    { item_name: 'Beach Wagon/Cart', item_price: 8 },
    { item_name: 'Radio', item_price: 2 },
    { item_name: 'Trash Bag (Full)-(w/Disposal)', item_price: 5 },
    { item_name: 'Beach "Layout" Mat', item_price: 2 },
    { item_name: 'Beach Toys (In Bag/Container)', item_price: 3 },
    { item_name: 'Beach Tent(Delivery w/Setup)', item_price: 10 },
    { item_name: 'Beach Tent(Delivery Only/No-Setup)', item_price: 5 },
    { item_name: 'Beach Canopy (4 Post/Leg-Style (Delivery w/Setup))', item_price: 15 },
    { item_name: 'Beach Canopy (4 Post/Leg-Style (Delivery Only/No-Setup))', item_price: 8 },
    { item_name: 'Beach Tent(Pickup w/Takedown)', item_price: 10 },
    { item_name: 'Beach Tent(Pickup Only/No-Takedown)', item_price: 5 },
    { item_name: 'Beach Canopy (4 Post/Leg-Style (Pickup w/Takedown))', item_price: 15 },
    { item_name: 'Beach Canopy (4 Post/Leg-Style (Pickup Only/No-Takedown))', item_price: 8 }

    // Add more items here...
  ];
  
  // Function to populate the beach gear dropdown
  function populateBeachGearDropdown() {
    console.log('Populating beach gear dropdown...'); //  line for debugging   REMOVE AFTER TESTING!!!!!!!!!!!!!!!!!!!!
  
    const beachGearDropdown = document.getElementById('beachGearItem');
  
    beachGearItems.forEach(item => {
      const option = new Option(item.item_name, item.item_name);
      beachGearDropdown.appendChild(option);
    });
  }
  
  // Function to update the quantity options based on the selected item
  function updateQuantityOptions() {
    const beachGearDropdown = document.getElementById('beachGearItem');
    const quantitySelect = document.getElementById('quantitySelect');
    const selectedItem = beachGearItems.find(item => item.item_name === beachGearDropdown.value);
  
    quantitySelect.innerHTML = ''; // Clear existing options
  
    if (selectedItem) {
      quantitySelect.disabled = false;
      for (let i = 1; i <= 10; i++) {
        const option = new Option(i.toString(), i.toString());
        quantitySelect.appendChild(option);
      }
    } else {
      quantitySelect.disabled = true;
    }
  }
  
  // Function to add the selected item to the cart
  function addToCart() {
    const beachGearDropdown = document.getElementById('beachGearItem');
    const quantitySelect = document.getElementById('quantitySelect');
    const cartItemsList = document.getElementById('cartItems');
  
    const selectedItem = beachGearItems.find(item => item.item_name === beachGearDropdown.value);
    const quantity = quantitySelect.value;
  
    if (selectedItem && quantity) {
      // Check if the item is already in the cart
      const existingCartItem = document.querySelector(`[data-item-name="${selectedItem.item_name}"]`);
      if (existingCartItem) {
        // If the item is already in the cart, update its quantity
        const existingQuantity = parseInt(existingCartItem.querySelector('.cart-item-quantity').textContent);
        const newQuantity = existingQuantity + parseInt(quantity);
        existingCartItem.querySelector('.cart-item-quantity').textContent = newQuantity;
      } else {
        // If the item is not in the cart, create a new list item for the cart
        const cartItem = document.createElement('li');
        cartItem.dataset.itemName = selectedItem.item_name;
        cartItem.innerHTML = `
          <span class="cart-item-name">${selectedItem.item_name}</span>
          <span class="cart-item-quantity">${quantity}</span>
          <span class="cart-item-price">$${selectedItem.item_price * quantity}</span>
          <button class="cart-item-edit" onclick="editCartItemQuantity(this)">Edit</button>
          <button class="cart-item-delete" onclick="deleteCartItem(this)">Delete</button>
        `;
        cartItemsList.appendChild(cartItem);
      }
  
      // Call the function to update the total price
      updateCartTotal();
    }
  }
  
  // Function to remove an item from the cart
function deleteCartItem(item) {
    const cartItem = item.parentNode;
    const itemName = cartItem.dataset.itemName;
    const itemPrice = beachGearItems.find(item => item.item_name === itemName).item_price;
    const quantityElement = cartItem.querySelector('.cart-item-quantity');
    const itemQuantity = parseInt(quantityElement.textContent);
  
    if (itemQuantity > 1) {
      // If the quantity is more than 1, decrease the quantity by 1
      quantityElement.textContent = itemQuantity - 1;
    } else {
      // If the quantity is 1, remove the cart item from the list
      cartItem.remove();
    }
  
    // Update the cart item's price
    const priceElement = cartItem.querySelector('.cart-item-price');
    priceElement.textContent = `$${itemPrice * (itemQuantity - 1)}`;
  
    // Call the function to update the total price
    updateCartTotal();
  }
  
  
  // Function to edit the quantity of an item in the cart
function editCartItemQuantity(item) {
    const quantity = parseInt(prompt('Enter the new quantity:'));
    if (!isNaN(quantity) && quantity >= 0) {
      const cartItem = item.parentNode;
      const itemName = cartItem.dataset.itemName;
      const itemPrice = beachGearItems.find(item => item.item_name === itemName).item_price;
  
      if (quantity === 0) {
        // If the quantity is 0, remove the cart item from the list
        cartItem.remove();
      } else {
        // Update the cart item's quantity and price
        const quantityElement = cartItem.querySelector('.cart-item-quantity');
        quantityElement.textContent = quantity;
        const priceElement = cartItem.querySelector('.cart-item-price');
        priceElement.textContent = `$${itemPrice * quantity}`;
      }
  
      // Call the function to update the total price
      updateCartTotal();
    }
  }
  
  
  // Function to update the total price of the cart
  function updateCartTotal() {
    const cartItems = document.querySelectorAll('#cartItems li');
    let total = 0;
  
    cartItems.forEach(item => {
      const itemName = item.dataset.itemName;
      const itemPrice = beachGearItems.find(item => item.item_name === itemName).item_price;
      const itemQuantity = parseInt(item.querySelector('.cart-item-quantity').textContent);
      total += itemPrice * itemQuantity;
    });
  
    const cartTotalElement = document.getElementById('cartTotal');
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
  }

    const residenceFields = document.getElementById('residenceFields');
    const vehicleFields = document.getElementById('vehicleFields');
    const residenceRadio = document.getElementById('residence');
    const vehicleRadio = document.getElementById('vehicle');
    const beachFields = document.getElementById('beachFields');
    const beachRadio = document.getElementById('beach');

    residenceRadio.addEventListener('change', () => {
        residenceFields.style.display = 'block';
        vehicleFields.style.display = 'none';
        beachFields.style.display = 'none';
    });

    vehicleRadio.addEventListener('change', () => {
        vehicleFields.style.display = 'block';
        residenceFields.style.display = 'none';
        beachFields.style.display = 'none';
    });

    beachRadio.addEventListener('change', () => {
        beachFields.style.display = 'block';
        residenceFields.style.display = 'none';
        vehicleFields.style.display = 'none';
    });

    // Function to handle visibility of the beach drop-off sections
function handleBeachDropOffSelection() {
    const beachDropOffResidenceRadio = document.getElementById('beachDropOffResidence');
    const beachDropOffVehicleRadio = document.getElementById('beachDropOffVehicle');
    const beachDropOffResidenceFields = document.getElementById('beachDropOffResidenceFields');
    const beachDropOffVehicleFields = document.getElementById('beachDropOffVehicleFields');

    beachDropOffResidenceRadio.addEventListener('change', () => {
        if (beachDropOffResidenceRadio.checked) {
            beachDropOffResidenceFields.style.display = 'block';
            beachDropOffVehicleFields.style.display = 'none';
        }
    });

    beachDropOffVehicleRadio.addEventListener('change', () => {
        if (beachDropOffVehicleRadio.checked) {
            beachDropOffVehicleFields.style.display = 'block';
            beachDropOffResidenceFields.style.display = 'none';
        }
    });
}

// Call the function to handle beach drop-off selections
handleBeachDropOffSelection();

  
  // Call the function to populate the beach gear dropdown on page load
  populateBeachGearDropdown();
  
  // Call the function to update the total price of the cart on page load
  updateCartTotal();
  