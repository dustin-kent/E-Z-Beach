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

    // Add more items here if needed...
  ];
  
  // Function to populate the beach gear dropdown
  function populateBeachGearDropdown() {
    console.log('Populating beach gear dropdown...'); // Debugging message
  
    const beachGearDropdown = document.getElementById('beachGearItem');
  
    beachGearItems.forEach(item => {
      const option = new Option(item.item_name, item.item_name);
      beachGearDropdown.appendChild(option);
    });
    
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Call the function after the DOM has loaded
    populateBeachGearDropdown();
  });
    
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
        const existingCartItem = document.querySelector(`[data-item-name="${selectedItem.item_name}"]`);
        if (existingCartItem) {
            const existingQuantity = parseInt(existingCartItem.querySelector('.cart-item-quantity').textContent);
            const newQuantity = existingQuantity + parseInt(quantity);
            existingCartItem.querySelector('.cart-item-quantity').textContent = newQuantity;
        } else {
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

        // Update the hidden input field with cart items data
        const cartItemsInput = document.getElementById('cartItemsInput');
        const cartItemsData = Array.from(cartItemsList.children).map(cartItem => {
            const itemName = cartItem.dataset.itemName;
            const itemQuantity = parseInt(cartItem.querySelector('.cart-item-quantity').textContent);
            return { item_name: itemName, quantity: itemQuantity };
        });
        cartItemsInput.value = JSON.stringify(cartItemsData);

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

    // Update the hidden input field
    const cartTotalInput = document.getElementById('cartTotalInput');
    cartTotalInput.value = total.toFixed(2); // Store the total as a string
}

 // Section for scheduling locations.  I changed so much on this that it works with it, but doesnt without it.  Leaving alone!!!!!
const pickupSetupRadio = document.getElementById('pickupSetup');
const takedownDropOffRadio = document.getElementById('takedownDropOff');
const pickupLocationFields = document.getElementById('pickupLocationFields');
const dropOffLocationFields = document.getElementById('dropOffLocationFields');
const pickupResidenceFields = document.getElementById('pickupResidenceFields');
const pickupVehicleFields = document.getElementById('pickupVehicleFields');
const dropOffResidenceFields = document.getElementById('dropOffResidenceFields');
const dropOffVehicleFields = document.getElementById('dropOffVehicleFields');

pickupSetupRadio.addEventListener('change', () => {
    if (pickupSetupRadio.checked) {
        pickupLocationFields.style.display = 'block';
        dropOffLocationFields.style.display = 'none';
        pickupResidenceFields.style.display = 'none';
        pickupVehicleFields.style.display = 'none';
        dropOffResidenceFields.style.display = 'none';
        dropOffVehicleFields.style.display = 'none';
    }
});

takedownDropOffRadio.addEventListener('change', () => {
    if (takedownDropOffRadio.checked) {
        pickupLocationFields.style.display = 'none';
        dropOffLocationFields.style.display = 'block';
        pickupResidenceFields.style.display = 'none';
        pickupVehicleFields.style.display = 'none';
        dropOffResidenceFields.style.display = 'none';
        dropOffVehicleFields.style.display = 'none';
    }
});

const pickupResidenceRadio = document.getElementById('pickupResidence');
const pickupVehicleRadio = document.getElementById('pickupVehicle');
const dropOffResidenceRadio = document.getElementById('dropOffResidenceRadio');
const dropOffVehicleRadio = document.getElementById('dropOffVehicleRadio');
const dropOffResidenceInputFields = document.getElementById('dropOffResidenceFields'); 
const dropOffVehicleInputFields = document.getElementById('dropOffVehicleFields'); 

pickupResidenceRadio.addEventListener('change', () => {
    if (pickupResidenceRadio.checked) {
        pickupResidenceFields.style.display = 'block';
        pickupVehicleFields.style.display = 'none';
    } else {
        pickupResidenceFields.style.display = 'none';
    }
});

pickupVehicleRadio.addEventListener('change', () => {
    if (pickupVehicleRadio.checked) {
        pickupVehicleFields.style.display = 'block';
        pickupResidenceFields.style.display = 'block';
    } else {
        pickupVehicleFields.style.display = 'none';
    }
});

dropOffResidenceRadio.addEventListener('change', () => {
    dropOffResidenceInputFields.style.display = dropOffResidenceRadio.checked ? 'block' : 'none';
    dropOffVehicleInputFields.style.display = 'none';
});

dropOffVehicleRadio.addEventListener('change', () => {
    dropOffVehicleInputFields.style.display = dropOffVehicleRadio.checked ? 'block' : 'none';
    dropOffResidenceInputFields.style.display = dropOffVehicleRadio.checked ? 'block' : 'none';
});

// Call the function to update the total price of the cart on page load
updateCartTotal();

