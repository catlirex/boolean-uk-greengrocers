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

  cartItems :[
    // {
    //   id: "001-beetroot",
    //   quantity: 1
    //   },
    // {
    //   id: "002-carrot",
    //   quantity: 1
    //   }

  ]
  
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

  for (item of state.cartItems){
    renderCartItem(item)
  }
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

    state.cartItems.push(cartItem)

    return cartItem
}

function updateProduct(updatedProduct){
  for (oldItem of state.items){
    if (oldItem.id === updatedProduct.id){
      oldItem = updatedProduct
    }
  }

  renderAllCartItems(updatedProduct)
}

function updateCartItem(updatedItem){
  let itemIndex = state.cartItems.findIndex(function(object){
    return object.id === updatedItem.id
  })
    state.cartItems[itemIndex] = updatedItem

  let itemLi = document.getElementById(`${updatedItem.id}`)
  itemLi.remove()


  if(updatedItem.quantity >= 1){
    renderCartItem(updatedItem)  
  }
}


renderAllCartItems()
renderAllProducts()