// Vérification si l'objet existe
 if (stockOrder) {
    let arrayPrice = new Object();
    let total = 0
     //Pour chaque objet je vais les afficher avec le nom, la couleur, l'image, le prix et la quantité
     stockOrder.forEach(function (a) {


        fetch(`http://localhost:3000/api/products/${a.id}`)
            .then(function(response) {
             if (response.ok) {
                 return response.json();
             }
         }).then(function (product){
                    arrayPrice[a.id] = product.price
                    document.querySelector('#cart__items').innerHTML += `
                       <article class="cart__item" data-id="${a.id}" data-color="${a.color}">
                        <div class="cart__item__img">
                          <img src="${product.imageUrl}" alt="${product.altTxt}">
                        </div>
                        <div class="cart__item__content">
                          <div class="cart__item__content__description">
                            <h2>${product.name}</h2>
                            <p>${a.color}</p>
                            <p>${product.price}€</p>
                          </div>
                          <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                              <p>Qté : ${a.quantity} </p>
                              <input type="number" class="itemQuantity" name="itemQuantity" min="-100" max="100" value="0">
                            </div>
                            <div class="cart__item__content__settings__delete">
                              <p class="deleteItem">Supprimer</p>
                            </div>
                          </div>
                        </div>
                      </article>
                    `

            total += parseInt(a.quantity)*parseInt(product.price)
            console.log(total)
            showTotalprice(total)

            // Sélectionner les quantités / modifier la valeur et l'envoyer à la fonction updateToStockOrder
            let selectQuantity = document.querySelectorAll('.itemQuantity')

            Array.from(selectQuantity).forEach(function (item) {
                item.addEventListener("change", function (e) {
                    let article = item.closest('article')
                    let personnalId = {
                        id : article.dataset.id,
                        color : article.dataset.color,
                        quantity : item.value,
                        personnalId : article.dataset.id+article.dataset.color
                    }
                    let elementQuantity = this.previousElementSibling
                    let elementPrice = this.parentNode.parentNode.parentNode.firstElementChild.lastElementChild.innerHTML
                    let regex = new RegExp('["€"]')
                    let replacePrice = elementPrice.replace(regex, '')
                    console.log(total)

                    updateToStockOrder(personnalId, elementQuantity, replacePrice, total)

                })
            })



            // Sélectionner le produit que l'on souhaite supprimer et appeler la fonction removeToStockOrder
            let selectProduct = document.querySelectorAll(".deleteItem")

            selectProduct.forEach(function (item){
                item.addEventListener("click", function (e) {
                    let article = item.closest(':not(div):not(p)')
                    let personnalId = article.dataset.id+article.dataset.color

                    removeToStockOrder(personnalId)
                    article.style.display = "none";
                })
            })
         console.log(total)
         })
     })

 } else {
     //Si aucun objet est trouvé on fait une alert
     alert('Aucune page trouvé')
 }

// REGEX
// Initialisation de la variable textError
let textError = ""

//Vérification des caractère
const regexName = new RegExp('["{@&/[}{()*%$£€:;!?#,-<>~°._+1-9}]', 'g')
const regexAddress = new RegExp('["{@#&/[}{()*%$£€:;!?+<>~°_}]', 'g')
const regexEmail = new RegExp('["{#&/[}{()*%$£€:;!?+<>~°}]', 'g')

// Récupération des ID pour l'event
let firstName = document.querySelector('#firstName')
let lastName = document.querySelector('#lastName')
let address = document.querySelector('#address')
let city = document.querySelector('#city')
let email = document.querySelector('#email')

//Condition pour utiliser la fonction avec l'envoi du type, du regex et du message d'erreur
if (firstName) {
    textError = "Veuillez entrer un prénom valide"
    validForm(firstName, regexName, textError)
}
if (lastName) {
    textError = "Veuillez entrer un nom valide"
    validForm(lastName, regexName, textError)
}
if (address){
    textError = "Veuillez entrer une adresse valide"
    validForm(address, regexAddress, textError)
}
if (city) {
    textError = "Veuillez entrer une ville valide"
    validForm(city, regexName, textError)
}
if (email) {
    textError = "Veuillez entrer une adresse mail valide"
    validForm(email, regexEmail, textError)
}

const validIsForm = () => {
    if (firstName.value !== "" && lastName.value !== "" && address.value !== "" && city.value !== "" && email.value !== "") {
        if (!regexName.test(firstName.value) && !regexName.test(lastName.value) && !regexAddress.test(address.value) && !regexName.test(city.value) && !regexEmail.test(email.value) ) {
            return true
        }
    }
}


 //Event pour envoyer les infos personnelles
 document.querySelector('.cart__order__form').addEventListener('submit', function (event) {
     event.preventDefault()

     if (validIsForm() === true) {
         let personnalData = {
             contact : {
                 firstName : firstName.value,
                 lastName : lastName.value,
                 address : address.value,
                 city : city.value,
                 email : email.value,
             },
             products : stockOrder,
         }
            console.log(personnalData)
         //Le fetch avec la méthode POST, qui accpete les .json, le body avec notre personnalData en Json
         fetch('http://localhost:3000/api/products/order', {
             method: 'POST',
             headers: {
                 Accept : "application.json",
                 "Content-Type" : "application/json"
             },
             body: JSON.stringify(personnalData),
             cache: "default",
         })
             .then((response) => response.json())
     }
 })










