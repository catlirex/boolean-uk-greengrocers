let state = {
  products:[
    {
      id: "001-beetroot",
      name: "beetroot",
      price: 0.35
      },
    {
      id: "002-carrot",
      name: "carrot",
      price: 1
    },
    {
      id: "003-apple",
      name: "apple",
      price: 0.5
    },
    {
      id: "004-apricot",
      name: "apricot",
      price: 0.5
    },
    {
      id: "005-avocado",
      name: "avocado",
      price: 0.9
    },
    {
      id: "006-bananas",
      name: "bananas",
      price: 0.7
    },
    {
      id: "007-bell-pepper",
      name: "bell-pepper",
      price: 0.3
    },
    
    {
      id: "008-berry",
      name: "berry",
      price: 1.5
    },
    {
      id: "009-blueberry",
      name: "blueberry",
      price: 1.5
    },
    {
      id: "010-eggplant",
      name: "eggplant",
      price: 0.8
    },
  ],

  cartItems :[]
  
};

function renderAllProducts(){
  for (product of state.products){
    renderProduct(product)
  }
}

function renderProduct(product){
  let itemUl = document.querySelector(".store--item-list")
  let productLi = document.createElement("li")
  itemUl.append(productLi)

  let productImgDiv = document.createElement("div")
  productImgDiv.setAttribute("class","store--item-icon")

  let productImg = document.createElement("img")
  productImg.setAttribute("src", `assets/icons/${product.id}.svg`)
  productImg.setAttribute("alt", product.name)
  productImgDiv.append(productImg)

  let addBtn = document.createElement("button")
  addBtn.innerText = "Add to cart"

  productLi.append(productImgDiv, addBtn)

  addBtn.addEventListener("click", function(event){
    event.preventDefault()

    let itemIndex = checkExistCart(product)

    if (itemIndex === -1){
    newCartItem = addNewProductToCart(product)
    renderCartItem(newCartItem)
    updateTotal()
    }
    else{
    
      addQuantity(product)
    }

  })

}

function addQuantity(product){
  let updatedCartItem = state.cartItems.find(function(item){
    return item.id === product.id
  })

  updatedCartItem.quantity ++
 
  updateCartItem(updatedCartItem)
  
}

function minusQuantity(product){
  let updatedCartItem = state.cartItems.find(function(item){
    return item.id === product.id
  })

  updatedCartItem.quantity --
 
  updateCartItem(updatedCartItem)
  
}

function renderAllCartItems(){
  getServerCart()
  .then(function(serverCart){
    state.cartItems = serverCart

    state.cartItems.map(renderCartItem)
    
  })

}

function renderCartItem(cartItem){
  let cartUl = document.querySelector(".cart--item-list")
  let cartLi = document.createElement("li")
  cartLi.setAttribute("id", cartItem.id)
  cartUl.append(cartLi)

  let productDetail = state.products.find(function(product){
    return product.id === cartItem.id
  })

  let cartItemImg = document.createElement("img")
  cartItemImg.setAttribute("class", "cart--item-icon")
  cartItemImg.setAttribute("src", `assets/icons/${cartItem.id}.svg`)
  cartItemImg.setAttribute("alt", productDetail.name)

  let itemName = document.createElement("p")
  itemName.innerText = productDetail.name

  let minusBtn = document.createElement("button")
  minusBtn.setAttribute("class","quantity-btn remove-btn center")
  minusBtn.innerText = "-"
  minusBtn.addEventListener("click", function(event){
    event.preventDefault()
    minusQuantity(cartItem)
  })

  let plusBtn = document.createElement("button")
  plusBtn.setAttribute("class","quantity-btn remove-btn center")
  plusBtn.innerText = "+"
  plusBtn.addEventListener("click", function(event){
    event.preventDefault()
    addQuantity(cartItem)
  })

  let quantitySpan = document.createElement("span")
  quantitySpan.setAttribute("class", "quantity-text center")
  quantitySpan.innerText = cartItem.quantity

  cartLi.append(cartItemImg, itemName, minusBtn, quantitySpan, plusBtn)
}

function checkExistCart(product){
  const itemIndex = state.cartItems.findIndex(function(cartItem){
    return cartItem.id === product.id
  })

  return itemIndex
}

function addNewProductToCart(product){
    let cartItem = {
      id: product.id,
      quantity: 1
      }

    postItemToServer(cartItem)
      .then(function(serverItem){
        state.cartItems.push(serverItem)
      })
      .then(function(){
        updateTotal()
      })

      
    
    return cartItem
}

function updateCartItem(updatedItem){
  let itemIndex = state.cartItems.findIndex(function(object){
    return object.id === updatedItem.id
    })
  let itemLi = document.getElementById(`${updatedItem.id}`)

  if(updatedItem.quantity >= 1){  
    patchCartItemToServer(updatedItem)
    .then(function(serverItem){
        
        state.cartItems[itemIndex] = serverItem
    
        let itemQuantity = itemLi.querySelector(".quantity-text")
        itemQuantity.innerText = serverItem.quantity
    })
    .then(function(){
      updateTotal()
    })
  }
  if(updatedItem.quantity === 0 ){
      delItemFromServer(updatedItem)
        .then(function(){
          state.cartItems.splice(itemIndex)
          itemLi.remove()
          updateTotal()
        })
    }
}

function updateTotal(){
  let totalEl = document.querySelector(".total-number")
  
  let totalPrice = 0

  for(item of state.cartItems){
  
    let productDetail = state.products.find(function(product){
      return product.id === item.id
    })
    
    totalPrice = totalPrice + productDetail.price * item.quantity
  }

  totalEl.innerText = `£${totalPrice.toFixed(2)}`

}

function getServerCart(){
  return fetch("http://localhost:3000/cartItems")
    .then(function(response){
        return response.json()
    })
    .catch((error) => {
        console.log(error)
        alert("There is something wrong.....")
    });
}


function postItemToServer(item){
return  fetch(`http://localhost:3000/cartItems/`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(item)
    })
    .then(response => response.json())
    .catch((error) => {
      console.log(error)
      alert("There is something wrong.....")
    });  
    

}

function patchCartItemToServer(item){
  
 return fetch(`http://localhost:3000/cartItems/${item.id}`, {
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(item)
    })
    .then(response => response.json())
    .catch((error) => {
      console.log(error)
      alert("There is something wrong.....")
    });  
    
}

function delItemFromServer(item){
 return fetch(`http://localhost:3000/cartItems/${item.id}`, {
        method:"DELETE"
    })
    .catch((error) => {
      console.log(error)
      alert("There is something wrong.....")
    }); 
}

// function emptyServerCart(){
// return  fetch("http://localhost:3000/cartItems")
//     .then(response => response.json())
//     .then(function(oldItemsArray){
//       for (oldItem of oldItemsArray){
//         delItemFromServer(oldItem)
//       }
//     })
//     .catch((error) => {
//         console.log(error)
//         alert("There is something wrong.....")
//       });
// }

  renderAllProducts()
  renderAllCartItems()
  




