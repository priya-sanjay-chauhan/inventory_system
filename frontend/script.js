document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    document.getElementById('add-product-form').addEventListener('submit', handleFormSubmit);
});

function validateForm() {
    let isValid = true;
  
    const name = document.getElementById('name').value.trim();
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      document.getElementById('name-error').textContent = "Name should only contain letters.";
      isValid = false;
    } else {
      document.getElementById('name-error').textContent = "";
    }
  
    const category = document.getElementById('category').value.trim();
    if (category && !/^[a-zA-Z\s]+$/.test(category)) {
      document.getElementById('category-error').textContent = "Category should only contain letters.";
      isValid = false;
    } else {
      document.getElementById('category-error').textContent = "";
    }
  

    const quantity = document.getElementById('quantity').value;
    if (!/^\d+$/.test(quantity) || parseInt(quantity) <= 0) {
      document.getElementById('quantity-error').textContent = "Quantity should be a positive number.";
      isValid = false;
    } else {
      document.getElementById('quantity-error').textContent = "";
    }
  
    const price = document.getElementById('price').value;
    if (!/^\d+(\.\d{1,2})?$/.test(price) || parseFloat(price) <= 0) {
      document.getElementById('price-error').textContent = "Price should be a positive number.";
      isValid = false;
    } else {
      document.getElementById('price-error').textContent = "";
    }
  
    const supplier = document.getElementById('supplier').value.trim();
    if (!/^[a-zA-Z\s]+$/.test(supplier)) {
      document.getElementById('supplier-error').textContent = "Supplier should only contain letters.";
      isValid = false;
    } else {
      document.getElementById('supplier-error').textContent = "";
    }
  
    return isValid;
  }
  
  // Handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();
  
    if (validateForm()) {
      const form = event.target;
      const productId = form.dataset.productId;
      const productData = getFormData(); 
  
      if (productId) {
        updateProduct(productId, productData);
    } else {
        addProduct(productData);
    }
    }
  }
  

// Display validation errors
function displayErrors(errors) {
    for (const key in errors) {
        document.getElementById(`${key}-error`).innerText = errors[key];
    }
}

// Clear error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => {
        element.innerText = '';
    });
}

// Fetch and display products
function fetchProducts() {
    fetch('http://localhost:5000/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.querySelector('#product-list tbody');
            productList.innerHTML = products.map(product => `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.quantity}</td>
                    <td>$${product.price}</td>
                    <td>${product.supplier}</td>
                    <td>
                        <button onclick="populateForm(${product.id}, '${product.name}', '${product.category}', ${product.quantity}, ${product.price}, '${product.supplier}')">Update</button>
                        <button onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Populate form for updating
function populateForm(id, name, category, quantity, price, supplier) {
    document.getElementById('name').value = name;
    document.getElementById('category').value = category;
    document.getElementById('quantity').value = quantity;
    document.getElementById('price').value = price;
    document.getElementById('supplier').value = supplier;

    const form = document.getElementById('add-product-form');
    form.dataset.productId = id; 
}

// Update product
function updateProduct(id, productData) {
    fetch(`http://localhost:5000/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        resetForm();
        fetchProducts(); 
    })
    .catch(error => console.error('Error updating product:', error));
}

// Add new product
function addProduct(productData) {
    fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        resetForm();
        fetchProducts();
    })
    .catch(error => console.error('Error adding product:', error));
}

// Get data from form inputs
function getFormData() {
    return {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        quantity: document.getElementById('quantity').value,
        price: document.getElementById('price').value,
        supplier: document.getElementById('supplier').value
    };
}

// Reset the form
function resetForm() {
    document.getElementById('add-product-form').reset();
    clearErrors();
    delete document.getElementById('add-product-form').dataset.productId; 
}

// Delete product
function deleteProduct(id) {
    fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchProducts(); 
        })
        .catch(error => console.error('Error deleting product:', error));
}
