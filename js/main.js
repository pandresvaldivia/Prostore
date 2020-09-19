import { UI, Form, productItems } from "./modules/classes.js";

const myInterface = new UI();
const myForm = new Form();

document.querySelector("submit").addEventListener("click", e => {
    e.preventDefault();

    myForm.completeForm();
});

productItems.addEventListener("click", e => {
    myInterface.deleteProduct(e);
});

document.addEventListener("DOMContentLoaded", () => {
    myInterface.cleanList(productItems);
    myInterface.countProducts();
    myForm.resetForm();
    myInterface.printStoredProducts();
});

price.addEventListener("keypress", e => {
    myForm.validatePrice(e);
});

price.addEventListener("blur", e => {
    myForm.completePrice(e.target);
});
