
const socket = io();

socket.emit("message", "hola soy el front");

// Category Select //
const categorySelect = document.getElementById("category");
const categories = ["", "Ropa Casual", "Ropa formal"];

categories.forEach((category) => {
  categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
});

//Cards de products

socket.on("products", (data) => {
  const container = document.getElementById("containerReal");
  
  const productsDelete = document.getElementById("productsDelete");

  
  productsDelete.innerHTML = "";


  container.innerHTML = "";
  data.forEach((element) => {
    productsDelete.innerHTML += `<option class="w-full" value="${element.id}">${element.title} - ${element.code}</option>`
    container.innerHTML += `
    <!-- Card Products -->
    <div class="flex min-h-[400px]">
        <div class="mx-auto px-5 ">
            <div class="max-w-xs cursor-pointer rounded-lg bg-white p-2 shadow duration-150 hover:scale-105 hover:shadow-md">
        
                <img class="w-full rounded-lg object-cover object-center" src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="product" />
                
                <p class="my-4 pl-4 font-bold text-gray-500">Product Name ${element.title}</p>
                <p value="${element.code}" class="codeProducts my-4 pl-4 font-bold text-gray-500">Code: ${element.code}</p>
      
                <div class="flex justify-between ">

                    <p class="ml-4 text-xl font-semibold text-gray-800 content-center">$${element.price}</p>
            
                    <button
                    value="${element.id}"
                    id="deleteProduct-btn"
                    onclick="deleteProduct()"
                    class="deleteProduct-btn mr-4 group relative px-8 py-2 overflow-hidden rounded-md bg-red-500 text-lg font-bold text-white">
                    Eliminar
                        <div class="absolute rotate-45 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-[3] group-hover:bg-white/30">
                        </div>
                    </button>

                </div>
    
            </div>
        </div>
    </div>`;
  });
  deleteProduct();
});

function deleteProduct() {
  const deleteProductBtn = document.getElementsByClassName("deleteProduct-btn");

  Array.from(deleteProductBtn).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.value;
      console.log("El ID es: " + id);

      socket.emit("deteleID", id);
    });
  });
}

function deleteProductByform(){
  const productsDelete = document.getElementById("productsDelete")
  deleteForm.addEventListener("submit", (e) => {
    e.preventDefault()
    
    socket.emit("deteleID", parseInt(productsDelete.value));
  })  
  
}


socket.on("products", (dataproducts) => {
  const code = document.getElementById("code");
  dataproducts.forEach((el) => {
    if (el.code == code.value) {
      return alert("El codigo ya existe");
    }
  });
  return;
});

const addProductForm = document.getElementById("form");

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));

  if (
    !data ||
    data.title === "" ||
    data.code === "" ||
    data.stock === "" ||
    data.price === "" ||
    data.category === "" ||
    data.thumbnails === "" ||
    data.description === ""
  ) {
    console.log("Error campos imcompletoss");
  }
  data.stock = parseInt(data.stock);
  data.price = parseInt(data.price);
  socket.emit("productData", data);

  console.log(JSON.stringify(data));
});
