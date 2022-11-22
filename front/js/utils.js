//stock order est le tableau json qui détient notre Localstorage
let stockOrder = []
let totalQuantity = 0

const showTotal = (totalQuantity) => {
    let showTotalQuantity = document.querySelector('#totalQuantity')

    if(showTotalQuantity) {
        showTotalQuantity.innerHTML = totalQuantity
    }
}
const showTotalPrice = (totalPrice) => {
    let showTotalPrice = document.getElementById('totalPrice').innerText = totalPrice
}

if (localStorage.getItem("Command") !== null && localStorage.getItem("Command") !== 'null') {
    stockOrder = JSON.parse(localStorage.getItem("Command"))

    for(let i = 0; i < stockOrder.length; i++) {
        totalQuantity += parseInt(stockOrder[i].quantity)
    }
    showTotal(totalQuantity)
}

//fonction pour sauvegarder le localstorage
const saveStorage = (stockOrder) => {
    localStorage.setItem("Command", JSON.stringify(stockOrder))
}

//fonction pour modifier le stockorder en ajoutant des produits / modifiant la quantité
const updateToStockOrder = (order, targetDiv, price, total) => {
    totalQuantity += parseInt(order.quantity)
    total += parseInt(price)

    let exist = 0
    let newQuantity = 0

    for(let i = 0; i < stockOrder.length; i++) {
        if (order.personnalId === stockOrder[i].personnalId) {
            stockOrder[i].quantity = parseInt(stockOrder[i].quantity) + parseInt(order.quantity)
            exist = 1
            newQuantity = stockOrder[i].quantity
        }
    }
    if (exist === 0) {
        stockOrder.push(order)
        newQuantity = order.quantity
    }

    saveStorage(stockOrder)

    //Afficher la quantité d'articles en temps réel
    showTotal(totalQuantity)

    //S'il y a "targetDiv" alors on appel la fonction showQuantity
    if(targetDiv) {
        showQuantity(targetDiv, newQuantity)
    }

    //S'il y a "total" on appel la fonction showTotalPrice
    if(total){
        showTotalPrice(total)
    }
    return total
}

const showQuantity = (targetDiv, newQuantity) => {
    targetDiv.innerHTML = `Qté : ${newQuantity}`
}

//on supprime l'élement voulu du stockorder puis on sauvegarde
const removeToStockOrder = (personnalId, total, totalDel, Qty) => {

    // Gérer la quantité total
    totalQuantity -= parseInt(Qty)

    // Gérer le prix total
    total -= parseInt(totalDel)

    for (let i = 0; i < stockOrder.length; i++) {

        if (stockOrder[i].personnalId === personnalId) {
            stockOrder.splice(i, 1)

            //Sauvegarder le storage
            saveStorage(stockOrder)

            //Afficher le prix actualisé en temps réel
            showTotalPrice(total)


            //Afficher la quantité d'articles en temps réel
            showTotal(totalQuantity)

            return total
        }
    }
}

const validEmail = (string) => {

    if(string == "") return false;

    let regexFunc = new RegExp('["{#&/[}{()*%$£€:;!?+<>~°}]', 'g');
    if(!regexFunc.test(string)) {
        return true;
    } else {
        return false;
    }
}

const validText = (string, number = false) => {

    if(string == "") return false;
    if(string.length < 4) return false;
    let rule;
    if(number == false) {
        rule = '["{@&/[}{()*%$£€:;!?#,-<>~°._+1-9}]'; // number refused
    } else {
       rule = '["{@#&/[}{()*%$£€:;!?+<>~°_}]'; // number accepted
    }

    let regexFunc = new RegExp(rule, 'g');
    if(!regexFunc.test(string)) {
        return true;
    } else {
        return false;
    }
}
