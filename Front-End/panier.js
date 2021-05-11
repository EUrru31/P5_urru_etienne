//Variable contenant les produits dans le localStorage
let panier = JSON.parse(localStorage.getItem("panier"));

// injecter les produits dans le panier

if (panier === null) {
    console.log("panier vide");
} else {
    for (const teddy of panier) {
        addProductToSummary(teddy);
    }
}

function addProductToSummary(teddy) {
    const templateElt = document.getElementById("row-template");
    const cloneElt = document.importNode(templateElt.content, true);

    cloneElt.getElementById("article").textContent = teddy.teddiesName;
    cloneElt.getElementById("couleur").textContent = teddy.teddiesColor;
    cloneElt.getElementById("quantité").textContent = teddy.teddiesQuant;
    cloneElt.getElementById("prix").textContent = teddy.teddiesPrice;

    document.getElementById("cart-tablebody").appendChild(cloneElt);
}

// Calcule du total (reste à enlever le symbole € car probleme dans l'addition)

const prices = [];

for (teddy of panier) {
    const price = panier.teddiesPrice;
    const total = parseInt(price);
    prices.push(total);
}

const reducer = (accumulator, currentValue) => accumulator + currentValue;
const totalPrice = prices.reduce(reducer, 0);

const cartPrice = (document.getElementById("total").innerText = totalPrice);

// Controle du formulaire

let form = document.querySelector("#loginForm");

form.email.addEventListener("change", function () {
    validEmail(this);
});

const validEmail = function (inputEmail) {
    let emailRegExp = new RegExp(
        "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-zA-Z]{2,10}$",
        "g"
    );

    // Récupération de la balise small
    let small = inputEmail.nextElementSibling;

    // Test de l'expression régulière

    if (emailRegExp.test(inputEmail.value)) {
        small.innerHTML = "Adresse Valide";
        small.classList.remove("text-danger");
        small.classList.add("text-success");
        return true;
    } else {
        small.innerHTML = "Adresse Non-valide";
        small.classList.remove("text-success");
        small.classList.add("text-danger");
        return false;
    }
};

// Envoie du formulaire au localStorage pour page de confirmation

const confirmOrder = document.getElementById("orderCommand");

confirmOrder.addEventListener("click", (e) => {
    e.preventDefault();

    if (!validEmail(form.email)) {
        alert("email invalide");
        return;
    }

    const customerInformations = {
        lastName: document.getElementById("lastName").value,
        firstName: document.getElementById("firstName").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
    };

    const idsArray = panier.map((teddy) => teddy.teddiesID);

    fetch("http://localhost:3000/api/teddies/order", {
        method: "post",
        header: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contact: customerInformations,
            products: idsArray,
        }),
    })
        .then(function (httpResponse) {
            return httpResponse.json();
        })
        .then(function (httpResponse) {
            window.location.href = "confirmation.html";
            localStorage.removeItem("panier");
        });
});

// Vider le panier
function emptyCart() {
    const emptyCart = document.getElementById("emptyCart");
    emptyCart.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("panier");
        alert("Panier vidé");
        window.location.href = "index.html";
    });
}

emptyCart();

// Nombre de produit dans le localStorage
let countCart = JSON.parse(localStorage.getItem("panier"));

// Remplissage du nombre de produit dans le panier

countCartNumber();
function countCartNumber() {
    if (countCart != null) {
        document.getElementById("cartQuant").innerText = countCart.length;
    } else {
        document.getElementById("cartQuant").innerText = "0";
    }
}
