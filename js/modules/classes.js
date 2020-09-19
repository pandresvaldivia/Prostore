const productName = document.getElementById("product-name");
const price = document.getElementById("price");
const date = document.getElementById("date");
const formContainer = document.getElementById("form-container");
export const productItems = document.getElementById("product-list");
let productList = [];

class Product {
    constructor(name, price, date) {
        this.id = Date.now();
        this.name = name;
        this.price = price;
        this.date = date;
    }
}

export class UI {
    addProduct(product) {
        const newElement = document.createElement("tr");
        newElement.id = product.id;
        newElement.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.date}</td>
            <td><a href="#" class="delete-button"><img src="assets/trash.svg"></a></td>
            `;

        productItems.appendChild(newElement);

        this.countProducts();
    }

    deleteStoredProduct(element) {
        const productId = element.parentElement.parentElement.parentElement.id;
        const productList = this.getStoredProducts().filter(e => e.id != productId);

        localStorage.setItem("myProducts", JSON.stringify(productList));
    }

    deleteProduct(product) {
        const ui = new UI();

        product.preventDefault();

        if (product.target.parentElement.classList.contains("delete-button")) {
            product.target.parentElement.parentElement.parentElement.remove();
            this.countProducts();
        }

        this.deleteStoredProduct(product.target);
    }

    countProducts() {
        if (document.querySelectorAll(".delete-button").length == 0) {
            const newElement = document.createElement("tr");
            newElement.innerHTML = `
        <td colspan=4 id="empty-list">
            No hay productos
        </td>
        `;

            productItems.appendChild(newElement);

            return true;
        } else if (document.getElementById("empty-list")) {
            productItems.children[0].remove();
            return false;
        }
    }

    storeProducts(product) {
        productList = [...(this.getStoredProducts() || []), product];

        localStorage.setItem("myProducts", JSON.stringify(productList));
    }

    getStoredProducts() {
        const productsArray = localStorage.getItem("myProducts");

        return JSON.parse(productsArray);
    }

    printStoredProducts() {
        for (const product of this.getStoredProducts() || []) {
            this.addProduct(product);
        }
    }

    cleanList() {
        while (productItems.firstChild) {
            productItems.firstChild.remove();
        }
    }
}

export class Form {
    currentDate() {
        const date = new Date();

        const day = date.getDate();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }

    resetForm() {
        document.getElementById("productForm").reset();
        date.value = this.currentDate();
    }

    showMessages(content, type) {
        if (!document.querySelector(".materialert")) {
            const message = document.createElement("div");
            message.classList.add("materialert", type);
            message.textContent = content;
            formContainer.appendChild(message);

            setTimeout(() => {
                document.querySelector(".materialert").remove();
            }, 1500);
        }
    }

    completeForm() {
        const _price = price.value;
        const _name = productName.value.trim();
        const _date = date.value;

        if (_name !== "" && _price !== "" && _date !== "") {
            const product = new Product(_name, _price, _date);

            const myInterface = new UI();

            myInterface.addProduct(product);

            myInterface.storeProducts(product);

            this.showMessages("Producto agregado", "success");

            this.resetForm();

            date.value = this.currentDate();
        } else {
            this.showMessages("Campos incompletos", "error");
        }
    }

    validatePrice(e) {
        const keyValue = e.key;

        if (!e.target.value && (keyValue == 0 || keyValue == ".")) {
            e.preventDefault();
        } else {
            if (!/[0-9.]/.test(keyValue)) {
                e.preventDefault();
            } else {
                if (/[0-9]{1,2}[.]/.test(e.target.value) && keyValue == ".") {
                    e.preventDefault();
                } else if (/[0-9]{1,2}[.]/.test(e.target.value)) {
                    if (/[0-9]{1,2}[.][0-9]{2}/.test(e.target.value)) {
                        e.preventDefault();
                    }
                } else if (/[0-9]{3}/.test(e.target.value) && keyValue != ".") {
                    e.target.value += ".";

                    if (/[0-9]{3}[.][0-9]{2}/.test(e.target.value)) {
                        e.preventDefault();
                    }
                }
            }
        }
    }

    completePrice(inputPrice) {
        if (inputPrice.value) {
            if (inputPrice.value.indexOf(".") >= 0) {
                const zeros = 3 - inputPrice.value.slice(inputPrice.value.indexOf(".")).length;

                inputPrice.value += "0".repeat(zeros);
            } else {
                inputPrice.value += ".00";
            }
        }
    }
}
