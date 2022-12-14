// get "Id" from url
let params = (new URL(document.location)).searchParams;
let id = params.get('id');

// Data recovery from api
fetch(`http://localhost:3000/api/products/${id}`)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
                document.querySelector('title').innerHTML = value.name
                updateProduct(value)
                document.getElementById("addToCart").addEventListener("click", function (e) {
                    const order = {
                        color: document.querySelector('#colors').value,
                        quantity: document.querySelector('#quantity').value,
                        id: value._id,
                        personnalId: value._id+document.querySelector('#colors').value
                    }
                    if (order.quantity > 100 || order.quantity < 1) {
                        alert("Vous avez selectionné une mauvaise quantité");
                    } else if (order.color == "") {
                        alert("Veuillez sélectionner une couleur");
                    } else {
                        updateToStockOrder(order)
                    }
                })
    });
/**
 * Show selected product
 * @param value
 */
const updateProduct = function (value) {
        document.querySelector('.item').innerHTML = `
                <section class="item">
                  <article>
                    <div class="item__img">
                      <img src="${value.imageUrl}" alt="${value.altTxt}">
                    </div>
                    <div class="item__content">
        
                      <div class="item__content__titlePrice">
                        <h1 id="title">${value.name}</h1>
                        <p>Prix : <span id="price">${value.price}</span>€</p>
                      </div>
        
                      <div class="item__content__description">
                        <p class="item__content__description__title">Description :</p>
                        <p id="description"> ${value.description}</p>
                      </div>
        
                      <div class="item__content__settings">
                        <div class="item__content__settings__color">
                          <label for="color-select">Choisir une couleur :</label>
                          <select name="color-select" id="colors">
                              <option value="">--SVP, choisissez une couleur --</option>
                          </select>
                        </div>
        
                        <div class="item__content__settings__quantity">
                          <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                          <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
                        </div>
                      </div>
        
                      <div class="item__content__addButton">
                        <button id="addToCart">Ajouter au panier</button>
                      </div>
        
                    </div>
                  </article>
                </section>`
        // Add color to menu
        for (let i = 0; i < value.colors.length; i++) {
            document.querySelector("#colors").innerHTML += `
                     <option value="${value.colors[i]}">${value.colors[i]}</option>`
        }
    };