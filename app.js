// Storage Controller
const StorageCtrl = (function(ItemCtrl){
  // Public methods
  return {
    storeList: function(listItem){
  
      let items
      // Check if there is item in ls
      if(localStorage.getItem('listItems') === null){
        items = []
        // push new list item
        items.push(listItem)
        // Set back to ls
        localStorage.setItem('listItems', JSON.stringify(items))
      } else {
        items = JSON.parse(localStorage.getItem('listItems'))
        // push new list item
        items.push(listItem)
        // Set back to ls
        localStorage.setItem('listItems', JSON.stringify(items))
      }
    },
    updateListFromStorage: function(updatedListItems){
      localStorage.removeItem('listItems')
      // re-set storage with ItemCtrl.logData().items
      localStorage.setItem('listItems', JSON.stringify(updatedListItems))
    },
    updateWishListFromStorage: function(updatedWishListItems){
      localStorage.removeItem('wishListItems')
      // re-set storage with ItemCtrl.logData().items
      localStorage.setItem('wishListItems', JSON.stringify(updatedWishListItems))
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('listItems') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('listItems'));
      }
      return items;
    },
    getWishItemsFromStorage: function(){
      let wishItems;
      if(localStorage.getItem('wishListItems') === null){
        wishItems = [];
      } else {
        wishItems = JSON.parse(localStorage.getItem('wishListItems'));
      }
      return wishItems;
    },
    deleteListFromStorage: function(listId){
      // Get items from storage
      let items = JSON.parse(localStorage.getItem('listItems'))

      // splice the selected ID
      items.forEach(function(item, index){
        if(item.id === listId){
          items.splice(index, 1)
        }
      })
      // Set back in LS
      localStorage.setItem('listItems', JSON.stringify(items))
    }
  }
})() 

// ======================================== Budget Item Controller
const ItemCtrl = (function(StorageCtrl){
  // Constructor for main list
  const BudgetList = function(id, listName, savePercentage, spendPercentage){
    this.id = id
    this.listName = listName
    this.savePercentage = savePercentage
    this.spendPercentage = spendPercentage
    this.income = []
    this.expense = []
    this.totalBalance = 0
    this.totalExpense = 0
    this.totalIncome = 0
  }

  // Constructor for Wish List Item
  const WishList = function(id, itemName, price, description){
    this.id = id
    this.name = itemName
    this.price = price
    this.description = description
  }

  // Constructor for Income / Expense Object
  const IncomeExpenseItem = function(id, title, amount){
    this.id = id
    this.title = title
    this.amount = amount
  }

  // Data Structure - Initial State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    wishItems: StorageCtrl.getWishItemsFromStorage(),
    currentItem: null,
    currentIncomeExpense: null
  }


  ///////////////////// PUBLIC METHODS - ItemCtrl
  return {
    logData: function(){
      return data
    },
    getItems: function(){
      return data.items
    },
    getWishItems: function(){
      return data.wishItems
    },
    getWishItemById: function(selectedId){
      let found = null
      // Loop through items to find by Id
      data.wishItems.forEach(function(item){
        if(item.id === selectedId){
          found = item
        }
      })
      return found
    },
    createIncomeExpenseItem: function(name, amount){
      // Generate unique ID
      let ID, newIncomeExpenseItem
      
      // Loop through items to determine which budget list item to manipulate
      data.items.forEach(function(listItem){
        if(listItem.id === data.currentItem.id){
          // Check which is being added (income / expense)
          if(data.currentIncomeExpense === 'income'){
            // Create ID
            if(listItem.income.length > 0){
              ID = listItem.income[listItem.income.length - 1].id + 1
              newIncomeExpenseItem = new IncomeExpenseItem(ID, name, amount)
              listItem.income.push(newIncomeExpenseItem)
            } else {
              ID = 0
              newIncomeExpenseItem = new IncomeExpenseItem(ID, name, amount)
              listItem.income.push(newIncomeExpenseItem)
            }
          } else if (data.currentIncomeExpense === 'expense'){
            // Create ID
            if(listItem.expense.length > 0){
              ID = listItem.expense[listItem.expense.length - 1].id + 1
              newIncomeExpenseItem = new IncomeExpenseItem(ID, name, amount)
              listItem.expense.push(newIncomeExpenseItem)
            } else {
              ID = 0
              newIncomeExpenseItem = new IncomeExpenseItem(ID, name, amount)
              listItem.expense.push(newIncomeExpenseItem)
            }
          }
        }
      })
      return newIncomeExpenseItem
    },
    getTotalIncomeExpense: function(incomeExpenseArr){
      let totalIncomeExpenseAmount = 0
      incomeExpenseArr.forEach(function(incomeExpenseItem){
        totalIncomeExpenseAmount += incomeExpenseItem.amount
      })
      totalIncomeExpenseAmount = parseFloat(totalIncomeExpenseAmount)
      totalIncomeExpenseAmount = totalIncomeExpenseAmount.toFixed(2)
      totalIncomeExpenseAmount = parseFloat(totalIncomeExpenseAmount)
      return totalIncomeExpenseAmount
    },
    getTotalBalance: function(totalIncome, totalExpense){  
      let totalBalanceAmount = totalIncome - totalExpense
      totalBalanceAmount = parseFloat(totalBalanceAmount)
      totalBalanceAmount = totalBalanceAmount.toFixed(2)
      totalBalanceAmount = parseFloat(totalBalanceAmount)
      return totalBalanceAmount
    },
    getAmountToSaveSpend: function(totalIncome, savePercent){
      let amountToSaveSpend = (totalIncome * (savePercent/100)).toFixed(2)
      return amountToSaveSpend
    },
    getItemById: function(selectedId){
      let found = null
      // Loop through items to find by Id
      data.items.forEach(function(item){
        if(item.id === selectedId){
          found = item
        }
      })
      return found
    },
    getIncomeExpenseItemById: function(type, selectedListItemID, selectedIncomeExpenseID){
      let foundIncomeExpenseItem = null
      if(type === 'income'){
        // Loop through items to find by Id
        data.items.forEach(function(item){
          if(item.id === selectedListItemID){
            item.income.forEach(function(incomeItem){
              if(incomeItem.id === selectedIncomeExpenseID){
                foundIncomeExpenseItem = incomeItem
              }
            })
          }
        })
    } else if (type === 'expense'){
      // Loop through items to find by Id
      data.items.forEach(function(item){
        if(item.id === selectedListItemID){
          item.expense.forEach(function(expenseItem){
            if(expenseItem.id === selectedIncomeExpenseID){
              foundIncomeExpenseItem = expenseItem
            }
          })
        }
      })
    }
      return foundIncomeExpenseItem
    },
    setCurrentIncomeExpense: function(incomeExpenseItemToEdit){
      data.currentIncomeExpense = incomeExpenseItemToEdit
    },
    getCurrentIncomeExpense: function(){
      return data.currentIncomeExpense
    },
    deleteIncomeExpenseItem: function(type, selectedList, selectedIncomeExpenseItem){
      // Get the list ID
      const selectedListID = selectedList.id
      // Loop through data.items to find the selected list
      data.items.forEach(function(listItem){
        if(listItem.id === selectedListID){
          // Check whether you are removing income or expense
          if(type === 'income'){
            // loop through income arr and delete specific income item
            listItem.income.forEach(function(incomeItem, index){
              if(incomeItem.id === selectedIncomeExpenseItem.id){
                listItem.income.splice(index, 1)
              }
            })
          } else if (type === 'expense'){
            // loop through expense arr and delete specific expense item
            listItem.expense.forEach(function(expenseItem, index){
              if(expenseItem.id === selectedIncomeExpenseItem.id){
                listItem.expense.splice(index, 1)
              }
            })
          }
        }
      })

    },
    setCurrentItem: function(itemToEdit){
      data.currentItem = itemToEdit
    },
    getCurrentItem: function(){
      return data.currentItem
    },
    updateListName: function(newListName){
      let found = null
      // find the List to update name through matching currentItem
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.listName = newListName
          found = item
        }
      })
      return found 
    },
    updateSaveSpendPercentage: function(newSaveSpendPercent, type){
      let found = null
      // Find the list to update the savePercentage through currentItem.id
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          const oppositePercentage = 100 - newSaveSpendPercent
          if(type === 'save'){
            item.spendPercentage = oppositePercentage
            item.savePercentage = newSaveSpendPercent
          } else if(type === 'spend') {
            item.spendPercentage = newSaveSpendPercent
            item.savePercentage = oppositePercentage
          }
          found = item
        }
      })
      return found
    },
    addWishListItem: function(name, price, description){
       // Generate unique ID
       let ID
       if(data.wishItems.length > 0){
         ID = data.wishItems[data.wishItems.length - 1].id + 1 // get the last index's ID as reference and add 1 to get latest ID
       } else {
         ID = 0
       }
       // Create new Wish List Item
       const newWishListItem = new WishList(ID, name, price, description)
       // Add to data structure
       data.wishItems.push(newWishListItem)
       return newWishListItem
    },
    updateWishListItem: function(name, price, description){
      let updatedWishItem
      // find the wish list item to edit by current item
      data.wishItems.forEach(function(wishItem){
        if(wishItem.id === data.currentItem.id){
          wishItem.name = name
          wishItem.price = price
          wishItem.description = description
          updatedWishItem = wishItem
        }
      })

      return updatedWishItem
    },
    updateIncomeExpenseItem: function(type, newTitle, newAmount){
      let foundIncomeExpenseItem = null
      const newAmountConverted = parseFloat(newAmount)
      if(type === 'income'){
        // Loop through list items first to select which list to search for income item to update
        data.items.forEach(function(listItem){
          if(listItem.id === data.currentItem.id){
            // loop through listItem.income and find the right income item to update
            listItem.income.forEach(function(incomeItem){
              if(incomeItem.id === data.currentIncomeExpense.id){
                incomeItem.title = newTitle
                incomeItem.amount = newAmountConverted
                foundIncomeExpenseItem = incomeItem
              }
            })
          }
        })
      } else if(type === 'expense') {
        // Loop through list items first to select which list to search for income item to update
        data.items.forEach(function(listItem){
          if(listItem.id === data.currentItem.id){
            // loop through listItem.expense and find the right expense item to update
            listItem.expense.forEach(function(expenseItem){
              if(expenseItem.id === data.currentIncomeExpense.id){
                expenseItem.title = newTitle
                expenseItem.amount = newAmountConverted
                foundIncomeExpenseItem = expenseItem
              }
            })
          }
        })
      }
      return foundIncomeExpenseItem
    },
    deleteWishItem: function(){
      // delete the currentItem by ID
      data.wishItems.forEach(function(item, index){
        if(item.id === data.currentItem.id){
          data.wishItems.splice(index, 1)
        }
      })
    },
    deleteList: function(){
      // delete the currentItem by ID
      data.items.forEach(function(item, index){
        if(item.id === data.currentItem.id){
          data.items.splice(index, 1)
        }
      })
    },
    addList: function(name, saveAmount, spendAmount){
      // Generate unique ID
      let ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1 // get the last index's ID as reference and add 1 to get latest ID
      } else {
        ID = 0
      }
      // Create new Budget List
      const newList = new BudgetList(ID, name, saveAmount, spendAmount)
      // Add to data structure
      data.items.push(newList)
      return newList
    }
  }

})(StorageCtrl)

// --------------------------- UI Controller
const UICtrl = (function(ItemCtrl){
  //////////////////////////////////// PUBLIC METHODS
  return {
    populateWishList: function(wishItems){
      let html = ''
      const ul = document.querySelector('#wishlist')
      wishItems.forEach(function(item){
        html += `
        <li id="wishItem-${item.id}" class="flex items-center space-x-5">
          <div class="flex space-x-2">
            <i class="fa-solid wishRemove fa-xmark text-ice hover:cursor-pointer hover:scale-125"></i>
            <i class="fa-solid wishEdit fa-pencil text-xs text-ice hover:cursor-pointer hover:scale-125"></i>
          </div>
          <div class="flex justify-between w-full">
            <div class="flex flex-col space-y-0">
              <span for="wish-0" class="text-plain text-lg font-medium">${item.name}</span>
              <p class="text-xs text-ice ">${item.description}</p>
            </div>
            <p class="text-ice font-medium text-xl">₱<span id="php" class="ml-1 text-plain">${item.price}</span></p>
          </div>
        </li>
        `
        ul.innerHTML = html
      })
    },
    populateBudgetList: function(items){
      let html = ''
      const ul = document.querySelector('#budget-list')
      items.forEach(function(items){
        async function loadItemsList(){
          html += `
            <li id="list-${items.id}" class="mainListItem">
              <div class="p-3 title bg-blueGrey rounded-md text-plain font-sans flex justify-between items-center font-medium capitalize hover:bg-slateHov hover:cursor-pointer transition delay-75 ">
              <span>${items.listName}</span>
              <i class="edit fa-solid fa-pencil text-ice text-xs hover:cursor-pointer mr-2 hover:scale-125 transition delay-75"></i>
              </div>
              <div class="p-5 flex flex-col space-y-4 rounded-md bg-lightSlate mt-1">
                <div class="flex flex-col">
                  <div class="flex w-full flex-col scale-90 space-y-2">
                    <div class="flex items-center text-2xl font-extrabold justify-center text-plain p-5 bg-blueGrey scale-90 rounded-lg">
                      <span class="savePercentage mr-1 ">${items.savePercentage}%</span> =
                      <span class="ml-5">₱</span><span class="saveAmount font-medium ml-1"></span>
                    </div>
                    <div class="flex space-x-3 items-center justify-center">
                      <span class="text-plain text-md font-semibold">Save</span>       
                      <i class="editSave fa-solid fa-pencil text-ice text-xs hover:scale-125 hover:cursor-pointer"></i>    
                  </div>
                </div>
                  <div class="flex w-full flex-col scale-90 space-y-2">
                    <div class="flex items-center text-2xl font-extrabold justify-center text-plain p-5 scale-90 rounded-lg bg-blueGrey">
                      <span class="spendPercentage mr-1 ">${items.spendPercentage}%</span> =
                      <span class="ml-5">₱</span><span class="spendAmount font-medium ml-1"></span>
                    </div>
                    <div class="flex space-x-3 items-center justify-center">
                      <span class="text-plain text-md font-semibold">Spend</span>           
                      <i class="editSpend fa-solid fa-pencil text-ice text-xs hover:scale-125 hover:cursor-pointer"></i>
                  </div>
                </div> 
              </div>

              <!-- Income -->

              <div class="flex flex-col space-y-4">
                <div class="p-3 bg-blueGrey rounded-md text-plain text-center font-extrabold capitalize text-lg">Income</div>  
                <div class="flex flex-col space-y-4 px-3">
                  <ul id="incomeList-${items.id}" class="space-y-1"></ul>
                  <div class="flex justify-between">
                    <div class="flex space-x-2 items-center">
                      <div class="bg-success addIncome rounded-full flex items-center justify-center h-7 w-7 p-1 scale-75 hover:bg-successHov hover:cursor-pointer">
                        <i class="fa-solid addIncome fa-plus text-plain text-xs"></i>
                      </div>
                      <span class="text-ice addIncome text-md font-semibold hover:cursor-pointer">add income</span>
                    </div>
                    <div class="text-2xl">
                      <span class="text-success mr-1">₱</span><span id="totalIncome-${items.id}" class="text-plain">7600</span>
                    </div>
                </div>
                </div>
              </div>

              <!-- Expenses -->

              <div class="flex flex-col space-y-4">
                <div class="p-3 bg-blueGrey rounded-md text-plain text-center font-extrabold capitalize text-lg">Expenses</div>
                <div class="flex flex-col space-y-4 px-3">
                  <ul id="expenseList-${items.id}" class="space-y-1"></ul>
                  <div class="flex justify-between">
                    <div class="flex space-x-2 items-center">
                      <div class="bg-error addExpense rounded-full flex items-center justify-center h-7 w-7 p-1 scale-75 hover:bg-errorHov hover:cursor-pointer">
                        <i class="fa-solid addExpense fa-plus text-plain text-xs"></i>
                      </div>
                      <span class="text-ice addExpense text-md font-semibold hover:cursor-pointer">add expense</span>
                    </div>
                    <div class="text-2xl">
                      <span class="text-error mr-1">₱</span><span id="totalExpense-${items.id}" class="text-plain"></span>
                    </div>
                  </div>
                </div>           
              </div>

              <!-- Total Balance -->

              <div class="h-3 bg-blueGrey rounded-md"></div>
              <div class="flex justify-between font-medium text-plain">
                <span class="font-extrabold text-xl">Total Balance</span>
                <div class="text-2xl">
                <span class="text-success mr-1">₱</span><span id="totalBalance-${items.id}"></span>
                </div>
              </div>
              </div>
            </li>
        `
        }

        // Wait for the above to load first to generate the <ul> ids before proceding to looping through income and expense
        loadItemsList().then(function(){
          const incomeList = document.querySelector(`#incomeList-${items.id}`)
          const expenseList = document.querySelector(`#expenseList-${items.id}`)
          let expenseItems = ''
          let incomeItems = ''

          // Loop through income List Items
          items.income.forEach(function(incomeItem){
            incomeItems += `
              <li id="income-${incomeItem.id}" class="incomeListItem flex justify-between font-medium text-plain">
                <span>${incomeItem.title}</span>
                <div class="flex space-x-3">
                  <p class="text-success">₱<span class="text-plain ml-1">${incomeItem.amount}</span></p>
                  <i class="editIncome fa-solid fa-pencil text-ice text-xs hover:cursor-pointer hover:scale-125"></i>
                </div>
              </li>
            `    
          })

          // Loop through expense List Items
          items.expense.forEach(function(expenseItem){
            expenseItems += `
              <li id="expense-${expenseItem.id}" class="expenseListItem flex justify-between font-medium text-plain">
                <span>${expenseItem.title}</span>
                <div class="flex space-x-3">
                  <p class="text-error">₱<span class="text-plain ml-1">${expenseItem.amount}</span></p>
                  <i class="editExpense fa-solid fa-pencil text-ice text-xs hover:cursor-pointer hover:scale-125"></i>
                </div>
              </li>
            `
          })
          // Append to respective <ul> => the income list items and expense list items generated 
          incomeList.innerHTML = incomeItems
          expenseList.innerHTML = expenseItems
          // Update Totals
          UICtrl.updateTotals(items)
        })
      })
      // Insert to <ul>
      ul.innerHTML = html

    },
    addWishItemToUI: function(newWishItem){
      const li = document.createElement('li')
      li.className = 'flex items-center space-x-5'
      li.id =  `wishItem-${newWishItem.id}`
      li.innerHTML = `
          <div class="flex space-x-2">
            <i class="fa-solid wishRemove fa-xmark text-ice hover:cursor-pointer hover:scale-125"></i>
            <i class="fa-solid wishEdit fa-pencil text-xs text-ice hover:cursor-pointer hover:scale-125"></i>
        </div>
        <div class="flex justify-between w-full">
          <div class="flex flex-col space-y-0">
            <span for="wish-0" class="text-plain text-lg font-medium">${newWishItem.name}</span>
            <p class="text-xs text-ice ">${newWishItem.description}</p>
          </div>
          <p class="text-ice font-medium text-xl">₱<span id="php" class="ml-1 text-plain">${newWishItem.price}</span></p>
        </div>
      `
      // Insert list to <ul>
      const ul = document.querySelector('#wishlist')
      ul.insertAdjacentElement('beforeend', li)
    },
    addListItem: function(addedList){
      const li = document.createElement('li')
      li.className = "mainListItem"
      li.id = `list-${addedList.id}`
      li.innerHTML = `
          <div class="p-3 title bg-blueGrey rounded-md text-plain font-sans flex justify-between items-center font-medium capitalize hover:bg-slateHov hover:cursor-pointer transition delay-75 ">
          <span>${addedList.listName}</span>
          <i class="edit fa-solid fa-pencil text-ice text-xs hover:cursor-pointer mr-2 hover:scale-125 transition delay-75"></i>
          </div>
          <div class="p-5 flex flex-col space-y-4 rounded-md bg-lightSlate mt-1">
            <div class="flex flex-col">
              <div class="flex w-full flex-col scale-90 space-y-2">
                <div class="flex items-center text-2xl font-extrabold justify-center text-plain p-5 bg-blueGrey scale-90 rounded-lg">
                  <span class="savePercentage mr-1 ">${addedList.savePercentage}%</span> =
                  <span class="ml-5">₱</span><span class="saveAmount font-medium ml-1">0.00</span>
                </div>
                <div class="flex space-x-3 items-center justify-center">
                  <span class="text-plain text-md font-semibold">Save</span>   
                  <i class="editSave fa-solid fa-pencil text-ice text-xs hover:scale-125 hover:cursor-pointer"></i>
              </div>
            </div>
              <div class="flex w-full flex-col scale-90 space-y-2">
                <div class="flex items-center text-2xl font-extrabold justify-center text-plain p-5 scale-90 rounded-lg bg-blueGrey">
                  <span class="spendPercentage mr-1 ">${addedList.spendPercentage}%</span> =
                  <span class="ml-5">₱</span><span class="spendAmount font-medium ml-1">0.00</span>
                </div>
                <div class="flex space-x-3 items-center justify-center">
                  <span class="text-plain text-md font-semibold">Spend</span>
                  <i class="editSpend fa-solid fa-pencil text-ice text-xs hover:scale-125 hover:cursor-pointer"></i>
              </div>
            </div> 
          </div>

          <!-- Income -->

          <div class="flex flex-col space-y-4">
            <div class="p-3 bg-blueGrey rounded-md text-plain text-center font-extrabold capitalize text-lg">Income</div>
            <div class="flex flex-col space-y-4 px-3">
              <ul id="incomeList-${addedList.id}" class="space-y-1"></ul>
              <div class="flex justify-between">
                <div class="flex space-x-2 items-center">
                  <div class="bg-success addIncome rounded-full flex items-center justify-center h-7 w-7 p-1 scale-75 hover:bg-successHov hover:cursor-pointer">
                    <i class="addIncome fa-solid fa-pencil text-plain text-xs"></i>
                  </div>
                  <span class="text-ice addIncome text-md font-semibold hover:cursor-pointer">add income</span>
                </div>
                <div class="text-2xl">
                  <span class="text-success mr-1">₱</span><span id="totalIncome-${addedList.id}" class="text-plain">${addedList.totalIncome}</span>
                </div>
            </div>
            </div>
          </div>

          <!-- Expenses -->

          <div class="flex flex-col space-y-4">
            <div class="p-3 bg-blueGrey rounded-md text-plain text-center font-extrabold capitalize text-lg">Expenses</div>
            
            <div class="flex flex-col space-y-4 px-3">
              <ul id="expenseList-${addedList.id}" class="space-y-1"></ul>
              <div class="flex justify-between">
                <div class="flex space-x-2 items-center">
                  <div class="bg-error addExpense rounded-full flex items-center justify-center h-7 w-7 p-1 scale-75 hover:bg-errorHov hover:cursor-pointer">
                    <i class="fa-solid addExpense fa-pencil text-plain text-xs"></i>
                  </div>
                  <span class="text-ice addExpense text-md font-semibold hover:cursor-pointer">add expense</span>
                </div>
                <div class="text-2xl">
                  <span class="text-error mr-1">₱</span><span id="totalExpense-${addedList.id}" class="text-plain">${addedList.totalExpense}</span>
                </div>
              </div>
            </div>           
          </div>

          <!-- Total Balance -->

          <div class="h-3 bg-blueGrey rounded-md"></div>
          <div class="flex justify-between font-medium text-plain">
            <span class="font-extrabold text-xl">Total Balance</span>
            <div class="text-2xl">
            <span class="text-success mr-1">₱</span><span id="totalBalance-${addedList.id}">${addedList.totalBalance}</span>
            </div>
          </div>
          </div>
      `
      // Insert list to <ul>
      const ul = document.querySelector('#budget-list')
      ul.insertAdjacentElement('beforeend', li)
    },
    updateUIWishItem: function(updatedWishItem){
      // get current item's id
      const currentWishItemId = ItemCtrl.getCurrentItem().id
      // get wish item element to update
      const wishItemLi = document.getElementById(`wishItem-${currentWishItemId}`)
      // traverse DOM and change textContent
      // Update Item Name
      wishItemLi.lastElementChild.firstElementChild.firstElementChild.textContent = updatedWishItem.name
      // Update Item Description
      wishItemLi.lastElementChild.firstElementChild.lastElementChild.textContent = updatedWishItem.description
      // Update Item Price
      wishItemLi.lastElementChild.lastElementChild.firstElementChild.textContent = updatedWishItem.price
    },
    updateUIListName: function(updatedItem){
      let listItems = document.querySelectorAll('.mainListItem')
      listItems = Array.from(listItems)
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id')
        if(itemID === `list-${updatedItem.id}`){
          const listTitle = document.querySelector(`#list-${updatedItem.id}`).firstElementChild.firstElementChild
          // Change the title to updated title
          listTitle.textContent = updatedItem.listName
        }
      })
    },
    updateUISaveSpendPercentage: function(updatedSavePercentageList){
      let listItems = document.querySelectorAll('.mainListItem')
      listItems = Array.from(listItems)
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id')
        if(itemID === `list-${updatedSavePercentageList.id}`){
          // get the save percentage part within the UI
          const savePercentElement = document.querySelector(`#list-${updatedSavePercentageList.id}`).firstElementChild.nextElementSibling.firstElementChild.firstElementChild.firstElementChild.firstElementChild
          // get the spend percentage part within the UI
          const spendPercentElement = document.querySelector(`#list-${updatedSavePercentageList.id}`).firstElementChild.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.firstElementChild
          // change text content = spend percent
          spendPercentElement.textContent = `${updatedSavePercentageList.spendPercentage}%`
          // change text content = save percent
          savePercentElement.textContent = `${updatedSavePercentageList.savePercentage}%`
          // Recalculate the Spend and Save Amount
          const updatedAmountToSave = ItemCtrl.getAmountToSaveSpend(updatedSavePercentageList.totalIncome, updatedSavePercentageList.savePercentage)
          const updatedAmountToSpend = ItemCtrl.getAmountToSaveSpend(updatedSavePercentageList.totalIncome, updatedSavePercentageList.spendPercentage)
          // Insert to UI the updated Amount to save
          const newAmountToSave = savePercentElement.nextElementSibling.nextElementSibling
          newAmountToSave.textContent = updatedAmountToSave
          // Insert to UI the updated Amount to spend
          const newAmountToSpend = spendPercentElement.nextElementSibling.nextElementSibling
          newAmountToSpend.textContent = updatedAmountToSpend
        }
      })
    },
    updateUIIncomeExpenseItem: function(type, updatedIncomeExpenseItem){
      let listItems = document.querySelectorAll('.mainListItem')
      listItems = Array.from(listItems)
      // Get the currentItem
      const selectedList = ItemCtrl.getCurrentItem()
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id')
        if(itemID === `list-${selectedList.id}`){
          // Check if this is an income item or expense item to edit
          if(type === 'income'){
            // Get the income item part in UI to edit (find through ID)
            let incomeItems = document.querySelectorAll(`#${itemID} .incomeListItem`)
            incomeItems = Array.from(incomeItems)
            // find the item to edit through updatedIncomeExpenseItem.id
            incomeItems.forEach(function(incomeListItem){
              if(incomeListItem.getAttribute('id') === `income-${updatedIncomeExpenseItem.id}`){
                // Change textContent
                incomeListItem.firstElementChild.textContent = updatedIncomeExpenseItem.title
                incomeListItem.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.textContent = updatedIncomeExpenseItem.amount
              }
            })
          } else if(type === 'expense') {
            let expenseItems = document.querySelectorAll(`#${itemID} .expenseListItem`)
            expenseItems = Array.from(expenseItems)
            // find the item to edit through updatedIncomeExpenseItem.id
            expenseItems.forEach(function(expenseListItem){
              if(expenseListItem.getAttribute('id') === `expense-${updatedIncomeExpenseItem.id}`){
                // Change textContent
                expenseListItem.firstElementChild.textContent = updatedIncomeExpenseItem.title
                expenseListItem.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.textContent = updatedIncomeExpenseItem.amount
              }
            })
          }
            // get the ID of currentItem
            const currentItemID = ItemCtrl.getCurrentItem().id
            // get all list items
            const listItemsDataStructure = ItemCtrl.logData().items
            // loop through items arr and find the list item you've just updated with income / expense
            listItemsDataStructure.forEach(function(listItem){
              if(listItem.id === currentItemID){
                // Update totals
                UICtrl.updateTotals(listItem)
              }
            })
        }
      })
    },
    removeWishItemFromUI: function(){
      const currentItemId = ItemCtrl.getCurrentItem().id
      document.querySelector(`#wishItem-${currentItemId}`).remove()
    },
    deleteListFromUI: function(){
      const currentItemId = ItemCtrl.getCurrentItem().id
      let listItems = document.querySelectorAll('.mainListItem')
      listItems = Array.from(listItems)
      listItems.forEach(function(item){
        if(item.getAttribute('id') === `list-${currentItemId}`){
          item.remove()
        }
      })
    },
    addIncomeExpenseItemToUI: function(incomeExpenseItem){
      // check first which to add (income or expense)
      const type = ItemCtrl.getCurrentIncomeExpense()
      const li = document.createElement('li')
      // Get the selected list ID
      const selectedListID = ItemCtrl.getCurrentItem().id
      if(type === 'income'){
        // Get the specific income list
        const ul = document.querySelector(`#incomeList-${selectedListID}`)
        li.className = 'incomeListItem flex justify-between font-medium text-plain'
        li.id = `income-${incomeExpenseItem.id}`
        li.innerHTML = `
          <span>${incomeExpenseItem.title}</span>
          <div class="flex space-x-3">
            <p class="text-success">₱<span class="text-plain ml-1">${incomeExpenseItem.amount}</span></p>
            <i class="editIncome fa-solid fa-pencil text-ice text-xs hover:cursor-pointer hover:scale-125"></i>
          </div>
        `
        // Insert to <ul>
        ul.insertAdjacentElement('beforeend', li)
      } else if (type === 'expense'){
        // Get the specific income list
        const ul = document.querySelector(`#expenseList-${selectedListID}`)
        li.className = 'expenseListItem flex justify-between font-medium text-plain'
        li.id = `expense-${incomeExpenseItem.id}`
        li.innerHTML = `
          <span>${incomeExpenseItem.title}</span>
          <div class="flex space-x-3">
            <p class="text-error">₱<span class="text-plain ml-1">${incomeExpenseItem.amount}</span></p>
            <i class="editExpense fa-solid fa-pencil text-ice text-xs hover:cursor-pointer hover:scale-125"></i>
          </div>
        `
        // Insert to <ul>
        ul.insertAdjacentElement('beforeend', li)
      }
      // loop through items arr and find the list item you've just deleted with income / expense
      const listItemsDataStructure = ItemCtrl.logData().items
      listItemsDataStructure.forEach(function(listItem){
        if(listItem.id === selectedListID){
          // Update totals
          UICtrl.updateTotals(listItem)
        }
      })
    },
    removeIncomeExpenseUI: function(type, selectedList, selectedIncomeExpenseItem){
      const currentItemId = selectedList.id
      // Grab the current list from UI
      const currentListElement = document.querySelector(`#list-${currentItemId}`)
      // Determine which to delete (income / expense item)
      if(type === 'income'){
        // remove specific income item
        currentListElement.querySelector(`#income-${selectedIncomeExpenseItem.id}`).remove()
      } else if (type === 'expense'){
        // remove specific expense item
        currentListElement.querySelector(`#expense-${selectedIncomeExpenseItem.id}`).remove()
      }
      // loop through items arr and find the list item you've just deleted with income / expense
      const listItemsDataStructure = ItemCtrl.logData().items
      listItemsDataStructure.forEach(function(listItem){
        if(listItem.id === selectedList.id){
          // Update totals
          UICtrl.updateTotals(listItem)
        }
      })
    },
    updateTotals: function(listItem){
      // Calculate the total income
      const totalIncomeAmount = ItemCtrl.getTotalIncomeExpense(listItem.income)
      // set to data structure
      listItem.totalIncome = totalIncomeAmount
      // get the total expense
      const totalExpenseAmount = ItemCtrl.getTotalIncomeExpense(listItem.expense)       
      // set to data structure
      listItem.totalExpense = totalExpenseAmount
      // Insert Total Income to DOM
      document.querySelector(`#totalIncome-${listItem.id}`).textContent = totalIncomeAmount
      // Insert Total Expense to DOM
      document.querySelector(`#totalExpense-${listItem.id}`).textContent = totalExpenseAmount
      // -------- Recalculate total Balance
      const totalBalanceAmount = ItemCtrl.getTotalBalance(totalIncomeAmount, totalExpenseAmount)
      // Set total balance to data structure
      listItem.totalBalance = totalBalanceAmount
      // Check if total balance is negative and change the Money sign color to red if it is
      if(totalBalanceAmount < 0){
          document.querySelector(`#totalBalance-${listItem.id}`).previousElementSibling.classList.replace('text-success', 'text-error')
      } else {
          document.querySelector(`#totalBalance-${listItem.id}`).previousElementSibling.classList.replace('text-error', 'text-success')
      }
      // Get Total Balance DOM Selector and change textContent
      document.querySelector(`#totalBalance-${listItem.id}`).textContent = totalBalanceAmount
      // Compute save amount from save percentage and total income
      const amountToSave = ItemCtrl.getAmountToSaveSpend(totalIncomeAmount, listItem.savePercentage)
      // Insert amount to save to DOM
      document.querySelector(`#list-${listItem.id} .saveAmount`).textContent = amountToSave
      // Compute spend amount from spend percentage and total income
      const amountToSpend = ItemCtrl.getAmountToSaveSpend(totalIncomeAmount, listItem.spendPercentage)
      // Insert amount to spend to DOM
      document.querySelector(`#list-${listItem.id} .spendAmount`).textContent = amountToSpend
    },
    openAddListModal: async function(){
      const modal = document.createElement('div')
      modal.className = 'fixed p-5 top-0 left-0 bg-blueBg/70 h-[100%] w-[100%] flex justify-center'
      modal.id = 'add-list-modal'
      modal.innerHTML = `
          <div class="flex flex-col rounded-xl w-[450px] h-fit bg-plain">
            <div class="flex bg-slateHov p-5 justify-between text-plain rounded-t-md">
              <span class="font-extrabold text-xl">Add budget list</span>
              <i class="fa-solid text-plain text-2xl fa-circle-xmark hover:scale-110 hover:cursor-pointer"></i>
            </div>
            <div class="flex flex-col rounded-b-md bg-plain space-y-10 p-10">
              <div class="space-y-5">
                <div class="flex flex-col space-y-1">
                  <span class="font-extrabold text-blueText">Name</span>
                  <input placeholder="Budget List" type="text" id="list-name" class="px-5 py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none" required>
                </div>
                <div class="flex justify-between">
                  <div class="flex flex-col space-y-1">
                    <span class="font-extrabold text-blueText">Amount to save</span>
                    <div class="flex space-x-4 items-center">
                      <input id="save-amount" placeholder="25" type="number" class="px-5 w-[100px] py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none" required>
                      <span class="text-xl font-extrabold text-blueText">%</span>
                    </div>
                  </div>
                  <div class="flex flex-col space-y-1">
                    <span class="font-extrabold text-blueText">Amount to spend</span>
                    <div class="flex space-x-4 items-center">
                      <input id="spend-amount" placeholder="75" type="number" class="px-5 w-[100px] py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none" required>
                      <span class="text-xl font-extrabold text-blueText">%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col space-y-3">
                <p class="text-sm font-medium text-blueText"><span class="font-extrabold">Amount to save:</span> this is the ideal percentage you should save from your total Income.</p>
                <p class="text-sm font-medium text-blueText"><span class="font-extrabold">Amount to spend:</span> this is the ideal percentage you are allowed to spend from your total Income.</p>
              </div>
                <div>
                <button id="save-btn" class="rounded-md px-10 text-plain py-2 w-full font-extrabold uppercase text-md bg-success hover:bg-successHov hover:cursor-pointer">add</button>
                </div>
            </div>
          </div>
      `
      // Insert modal to body
      document.body.insertAdjacentElement('beforeend', modal)
    },
    openAddIncomeExpenseModal: async function(type){
      let modalTitle, amountField
      if(type === 'income'){
        modalTitle = "Add Income item"
        amountField = "Income Amount"
      } else if (type === 'expense'){
        modalTitle = "Add Expense item"
        amountField = "Expense Amount"
      }
      const modal = document.createElement('div')
      modal.className = 'fixed p-5 top-0 left-0 bg-blueBg/70 h-[100%] w-[100%] flex justify-center'
      modal.id = 'add-income-expense-item'
      modal.innerHTML = `
      <div class="flex flex-col rounded-xl w-[450px] h-fit bg-plain">
          <div class="flex bg-slateHov p-5 justify-between text-plain rounded-t-md">
            <span class="font-extrabold text-xl">${modalTitle}</span>
            <i class="fa-solid text-plain text-2xl fa-circle-xmark hover:scale-110 hover:cursor-pointer"></i>
          </div>
          <div class="flex flex-col rounded-b-md bg-plain space-y-5 p-10">
            <div class="flex flex-col space-y-1">
              <span class="font-extrabold text-blueText">Name</span>
              <input placeholder="Item Name" id="income-expense-name" type="text" class="px-5 py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none" required>
            </div>
            <div class="flex flex-col space-y-1">
              <span class="font-extrabold text-blueText">${amountField}</span>
              <div class="flex space-x-4 items-center">
                <span class="text-xl font-extrabold text-blueText">₱</span>
                <input placeholder="15000" type="number" id="income-expense-amount" class="px-5 w-full py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none" required>
              </div>
              <p class="text-sm font-extrabold text-blueText">Note:<span class="ml-4 font-medium">Do not put commas, spaces, or dashes on the Amount field</span></p>
            </div>
            <div>
              <button id="save-btn" class="rounded-md px-10 text-plain py-2 w-full font-extrabold uppercase text-md bg-success hover:bg-successHov hover:cursor-pointer">add</button>
            </div>      
          </div>
        </div>
      `
      // Insert modal to body
      document.body.insertAdjacentElement('beforeend', modal)
    },
    openEditSavePercentageModal: async function(){
      const modal = document.createElement('div')
      modal.className = 'fixed p-5 top-0 left-0 bg-blueBg/70 h-[100%] w-[100%] flex justify-center'
      modal.id = 'save-spend-modal'
      modal.innerHTML = `
        <div class="flex flex-col rounded-xl w-[350px] h-fit bg-plain">
        <div class="flex bg-slateHov p-5 justify-between text-plain rounded-t-md">
          <span class="font-extrabold text-xl">Edit amount to save</span>
          <i class="fa-solid text-plain text-2xl fa-circle-xmark hover:scale-110 hover:cursor-pointer"></i>
        </div>
        <div class="flex flex-col rounded-b-md items-center bg-plain space-y-5 p-10">
          <div class="flex space-x-4 items-center">
            <input id="save-percentage" required placeholder="25" type="number" class="px-5 w-[100px] py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none">
            <span class="text-xl font-extrabold text-blueText">%</span>  
          </div>
          <div>
            <button id="save-btn" class="rounded-md px-10 w-full text-plain py-2 font-extrabold uppercase text-md bg-success hover:bg-successHov hover:cursor-pointer">save</button>
          </div>
        </div>
      </div>
      `
       // Insert modal to body
       document.body.insertAdjacentElement('beforeend', modal)
    },
    openEditSpendPercentageModal: async function(modalType){
      const modal = document.createElement('div')
      modal.className = 'fixed p-5 top-0 left-0 bg-blueBg/70 h-[100%] w-[100%] flex justify-center'
      modal.id = 'save-spend-modal'
      modal.innerHTML = `
        <div class="flex flex-col rounded-xl w-[350px] h-fit bg-plain">
        <div class="flex bg-slateHov p-5 justify-between text-plain rounded-t-md">
          <span class="font-extrabold text-xl">${modalType.title}</span>
          <i class="fa-solid text-plain text-2xl fa-circle-xmark hover:scale-110 hover:cursor-pointer"></i>
        </div>
        <div class="flex flex-col rounded-b-md items-center bg-plain space-y-5 p-10">
          <div class="flex space-x-4 items-center">
            <input id="${modalType.idAttr}" required placeholder="25" type="number" class="px-5 w-[100px] py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none">
            <span class="text-xl font-extrabold text-blueText">%</span>
          </div>
          <div>
            <button id="save-btn" class="rounded-md px-10 w-full text-plain py-2 font-extrabold uppercase text-md bg-success hover:bg-successHov hover:cursor-pointer">save</button>
          </div>
        </div>
      </div>
      `
       // Insert modal to body
       document.body.insertAdjacentElement('beforeend', modal)
    },
    openEditAddWishItemModal: async function(modalTitle){
      const modal = document.createElement('div')
      modal.className = 'fixed p-5 top-0 left-0 bg-blueBg/70 h-[100%] w-[100%] flex justify-center'
      modal.id = 'wish-modal'
      modal.innerHTML = `
      <div class="flex flex-col rounded-xl w-[450px] h-fit bg-plain">
      <div class="flex bg-slateHov p-5 justify-between text-plain rounded-t-md">
        <span class="font-extrabold text-xl">${modalTitle}</span>
        <i class="fa-solid text-plain text-2xl fa-circle-xmark hover:scale-110 hover:cursor-pointer"></i>
      </div>
      <div class="flex flex-col rounded-b-md bg-plain space-y-10 p-10">
        <div class="space-y-5">
  
          <div class="flex flex-col space-y-1">
            <span class="font-extrabold text-blueText">Name</span>
            <input placeholder="Item" type="text" id="wish-name" class="px-5 py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none">
          </div>
          
       
            <div class="flex flex-col space-y-1">
              <span class="font-extrabold text-blueText">Price</span>
              <div class="flex space-x-4 items-center">
                <span class="text-xl font-extrabold text-blueText">₱</span>
                <input id="wish-price" placeholder="500" type="number" class="px-5 w-full py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none">
              </div>
            </div>
  
            <div class="flex flex-col space-y-1">
              <span class="font-extrabold text-blueText">Description (Optional)</span>
              <textarea id="wish-description" rows="2" class="px-5 w-full py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none"></textarea>
            </div>
      
        </div>
        <p class="text-sm font-extrabold text-blueText">Note:<span class="ml-4 font-medium">Do not put commas, spaces, or dashes on the Price field</span></p>
        <div>
          <button id="save-btn" class="rounded-md px-10 text-plain py-2 w-full font-extrabold uppercase text-md bg-success hover:bg-successHov hover:cursor-pointer">Save</button>
        </div>
      </div>
    </div>
      `
       // Insert modal to body
       document.body.insertAdjacentElement('beforeend', modal)
    },
    openEditIncomeExpenseItemModal: async function(modalTitle, fieldTitle){
      const modal = document.createElement('div')
      modal.className = 'fixed p-5 top-0 left-0 bg-blueBg/70 h-[100%] w-[100%] flex justify-center'
      modal.id = 'income-expense-modal'
      modal.innerHTML = `
        <div class="flex flex-col rounded-xl w-[450px] h-fit bg-plain">
          <div class="flex bg-slateHov p-5 justify-between text-plain rounded-t-md">
            <span class="font-extrabold text-xl">${modalTitle}</span>
            <i class="fa-solid text-plain text-2xl fa-circle-xmark hover:scale-110 hover:cursor-pointer"></i>
          </div>
          <div class="flex flex-col rounded-b-md bg-plain space-y-5 p-10">
            <div class="flex flex-col space-y-1">
              <span class="font-extrabold text-blueText">Name</span>
              <input id="income-expense-item-title" type="text" class="px-5 py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none" required>
            </div>  
            <div class="flex flex-col space-y-1">
              <span class="font-extrabold text-blueText">${fieldTitle}</span>
              <div class="flex space-x-4 items-center">
                <span class="text-xl font-extrabold text-blueText">₱</span>
                <input id="income-expense-item-amount" type="number" class="px-5 w-full py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none" required>
              </div>
              <p class="text-sm font-extrabold text-blueText">Note:<span class="ml-4 font-medium">Do not put commas, spaces, or dashes on the Amount field</span></p>
            </div>
            <div class="flex space-x-4">
              <button id="save-btn" class="rounded-md px-10 text-plain py-2 font-extrabold uppercase text-md bg-success hover:bg-successHov hover:cursor-pointer">save</button>
              <button id="delete-income-expense-item" class="rounded-md px-10 text-plain py-2 font-extrabold uppercase text-md bg-error hover:bg-errorHov hover:cursor-pointer">delete item</button>
            </div>
          </div>
        </div>
      `
      // Insert modal to body
       document.body.insertAdjacentElement('beforeend', modal)
    },
    openEditListNameModal: async function(){
      const modal = document.createElement('div')
      modal.className = 'fixed p-5 top-0 left-0 bg-blueBg/70 h-[100%] w-[100%] flex justify-center'
      modal.id = 'listName-modal'
      modal.innerHTML = `
      <div class="flex flex-col rounded-xl w-[450px] mt-[150px] h-fit bg-plain">
          <div class="flex bg-slateHov p-5 justify-between text-plain rounded-t-md">
            <span class="font-extrabold text-xl">Edit budget list name</span>
            <i class="fa-solid text-plain text-2xl fa-circle-xmark hover:scale-110 hover:cursor-pointer"></i>
          </div>
          <div class="flex flex-col rounded-b-md bg-plain space-y-10 p-10">
            <input id="list-name" placeholder="Budget List" type="text" class="px-5 py-3 rounded-md text-md text-blueText placeholder:text-slateHov/3 focus:outline-none border-none" required>
            <div class="flex space-x-4">
              <button id="save-btn" class="rounded-md px-10 text-plain py-2 font-extrabold uppercase text-md bg-success hover:bg-successHov hover:cursor-pointer">save</button>
              <button id="delete-main-list" class="rounded-md px-10 text-plain py-2 font-extrabold uppercase text-md bg-error hover:bg-errorHov hover:cursor-pointer">delete list</button>
            </div>
          </div>
        </div>
      `
      // Insert modal to body
      document.body.insertAdjacentElement('beforeend', modal)
    }
  }
})(ItemCtrl)


// App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl){

  const loadEventListeners = function(){
    // Listen to Add spreadsheet
    document.body.addEventListener('click', addList)
    // Edit List Name Event
    document.body.addEventListener('click', updateListName)
    // Listen to edit Save / Spend Percentage
    document.body.addEventListener('click', editSaveSpendPercentage)
    // Listen to edit Income / Expense Item
    document.body.addEventListener('click', editIncomeExpenseItem)
    // Listen to add Income / Expense item
    document.body.addEventListener('click', addIncomeExpenseItem)
    // Listen to wish item remove
    document.body.addEventListener('click', removeWishItem)
    // Listen to edit wish item
    document.body.addEventListener('click', editWishItem)
    // Listen to add wish item
    document.body.addEventListener('click', addWishItem)


  }

  function addWishItem(e){
    if(e.target.classList.contains('addWishItem')){
      // Open modal for adding Wish item
      UICtrl.openEditAddWishItemModal('Add wishlist item').then(function(){
        // Listen to save button click
        document.querySelector('#save-btn').addEventListener('click', submitEdittedData)
        // Listen to Close modal
        document.querySelector('.fa-circle-xmark').addEventListener('click', exitModal) 
        document.querySelector('.fixed').addEventListener('click', function(e){
          if(e.target.classList.contains('fixed')){
            exitModal()
          }
        }) 
      })
    }
  }
  
  function editWishItem(e){
    if(e.target.classList.contains('wishEdit')){
      // get wish item ID
      let wishElementId = e.target.parentElement.parentElement.getAttribute('id')
      wishElementId = wishElementId.split('-')
      wishElementId = parseInt(wishElementId[1])
      // Get the wish item from data structure based on wishElementId
      const selectedWishItem = ItemCtrl.getWishItemById(wishElementId)
      // Set as currentItem
      ItemCtrl.setCurrentItem(selectedWishItem)
      // Open Edit Wish Item Modal
      UICtrl.openEditAddWishItemModal('Edit wishlist item').then(function(){
        // Get input field for list name and insert current item title
        const wishNameInput = document.querySelector('#wish-name')
        wishNameInput.value = ItemCtrl.getCurrentItem().name
        const wishPriceInput = document.querySelector('#wish-price')
        wishPriceInput.value = ItemCtrl.getCurrentItem().price
        const wishDescInput = document.querySelector('#wish-description')
        wishDescInput.value = ItemCtrl.getCurrentItem().description
        // Listen to save button click
        document.querySelector('#save-btn').addEventListener('click', submitEdittedData)
        // Listen to Close modal
        document.querySelector('.fa-circle-xmark').addEventListener('click', exitModal) 
        document.querySelector('.fixed').addEventListener('click', function(e){
          if(e.target.classList.contains('fixed')){
            exitModal()
          }
        }) 
      })

    }
  }

  function removeWishItem(e){
    if(e.target.classList.contains('wishRemove')){
      // Get the wish item ID from UI
      let wishElementId = e.target.parentElement.parentElement.getAttribute('id')
      wishElementId = wishElementId.split('-')
      wishElementId = parseInt(wishElementId[1])
      
      // Get the wish item from data structure based on wishElementId
      const selectedWishItem = ItemCtrl.getWishItemById(wishElementId)

      // Set as currentItem
      ItemCtrl.setCurrentItem(selectedWishItem)

      // remove item on data structure
      ItemCtrl.deleteWishItem()

      // remove item on UI
      UICtrl.removeWishItemFromUI()

      // Get updated wish items arr
      const updatedWishListItems = ItemCtrl.getWishItems()

      // remove item on Local storage
      StorageCtrl.updateWishListFromStorage(updatedWishListItems)


    }
  }

  const loadExhcangeRates = function() {
    // API call
    const getPHP = async function(){
      var myHeaders = new Headers();
      myHeaders.append("apikey", "FOHlN6BIRfPZi2xdnj0dv32EFua8RiNh"); // 250 req / month
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
      };
      const response = await fetch("https://api.apilayer.com/exchangerates_data/convert?to=PHP&from=USD&amount=1", requestOptions)
      const convertedPHPData = await response.json()
      return convertedPHPData
    }

    getPHP().then(function(convertedPHPData){
      // Round off
      const rate = convertedPHPData.result
      const roundedRate = rate.toFixed(2)
      // Append data to DOM
      document.getElementById('php').textContent = roundedRate
    }).catch(function(error){
      console.log('Something went wrong');
      console.log(error);
      document.getElementById('php').textContent = '404 Error'
    })
  }

  // ====================================== Event Listener Callbacks
  function addList(e){
    if(e.target.classList.contains('addList')){
      // Open modal for adding Spreadsheet
      UICtrl.openAddListModal().then(function(){
        // Listen to 'Add' btn click
        document.querySelector('#save-btn').addEventListener('click', submitEdittedData)
        // Listen to input blur for amount to save / spend
        document.getElementById('save-amount').addEventListener('blur', blurInput)
        document.getElementById('spend-amount').addEventListener('blur', blurInput)
        // Listen to Close modal
        document.querySelector('.fa-circle-xmark').addEventListener('click', exitModal)
        document.querySelector('.fixed').addEventListener('click', function(e){
          if(e.target.classList.contains('fixed')){
            exitModal()
          }
        })
      })
    }
  }
  // ====================================================
  function blurInput(e){
    // get the input value
    let inputValue = e.target.value
    // convert to number
    inputValue = parseFloat(inputValue)
    if(inputValue < 0 || inputValue > 100 || isNaN(inputValue)){
      console.log('Don\'t put these values!');
    } else {
      // append respective value to other field
      const otherInputValue = 100 - inputValue
      // check where to append this
      if(e.target.id === 'spend-amount'){
        document.getElementById('save-amount').value = otherInputValue
      } else if (e.target.id === 'save-amount'){
        document.getElementById('spend-amount').value = otherInputValue
      }
    }
  }
  // ====================================================
  function updateListName(e){
    e.preventDefault()
    if(e.target.classList.contains('edit')){
      // get the ID of the main list
      const mainList = e.target.parentElement.parentElement.id
      // split the id by (-) to get the ID itself
      const mainListArr = mainList.split('-')
      const mainListId = parseInt(mainListArr[1])
      // Get selected item to edit from data structure
      const itemToEdit = ItemCtrl.getItemById(mainListId)
      // set the matched item to current item
      ItemCtrl.setCurrentItem(itemToEdit)
      // Open Edit List Name Modal
      UICtrl.openEditListNameModal().then(function(){
        // Get input field for list name and insert current item title
        const listNameInput = document.querySelector('#list-name')
        listNameInput.value = ItemCtrl.getCurrentItem().listName
        // Listen to save button click
        document.querySelector('#save-btn').addEventListener('click', submitEdittedData)
        // Listen to Delete List
        document.querySelector('#delete-main-list').addEventListener('click', deleteList)
        // Listen to Close modal
        document.querySelector('.fa-circle-xmark').addEventListener('click', exitModal) 
        document.querySelector('.fixed').addEventListener('click', function(e){
          if(e.target.classList.contains('fixed')){
            exitModal()
          }
        })  
      })
    }
  } 
  // ====================================================
  function editSaveSpendPercentage(e){
    e.preventDefault()
    if(e.target.classList.contains('editSpend') || e.target.classList.contains('editSave')){
      //  get the list ID
      const mainListID = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id')
      const mainListIDArr = mainListID.split('-')
      const selectedID = parseInt(mainListIDArr[1])
      // get the item from data structure
      const selectedList = ItemCtrl.getItemById(selectedID)
      // set current Item
      ItemCtrl.setCurrentItem(selectedList)
      // Open Edit Spend Percentage Modal
      let modalType
      if(e.target.classList.contains('editSpend')){
        modalType = {
          title: 'Edit amount to spend',
          idAttr: 'spend-percentage'
        }
      } else if (e.target.classList.contains('editSave')){
        modalType = {
          title: 'Edit amount to save',
          idAttr: 'save-percentage'
        }
      }
      UICtrl.openEditSpendPercentageModal(modalType).then(function(){
        // get input field
        let percentageInput
        if(e.target.classList.contains('editSpend')){
          percentageInput = document.querySelector('#spend-percentage')
          percentageInput.value = ItemCtrl.getCurrentItem().spendPercentage
        } else if (e.target.classList.contains('editSave')){
          percentageInput = document.querySelector('#save-percentage')
          percentageInput.value = ItemCtrl.getCurrentItem().savePercentage
        }
        // Listen to save button click
        document.querySelector('#save-btn').addEventListener('click', submitEdittedData)
        // Listen to Close modal
        document.querySelector('.fa-circle-xmark').addEventListener('click', exitModal)
        document.querySelector('.fixed').addEventListener('click', function(e){
          if(e.target.classList.contains('fixed')){
            exitModal()
          }
        })
      })
    }
  }
  // ====================================================
  function addIncomeExpenseItem(e){
    e.preventDefault()
    if(e.target.classList.contains('addIncome') || e.target.classList.contains('addExpense')){
      let mainListID
      // Check first which element you have clicked
      if(e.target.parentElement.classList.contains('space-x-2')){
        // Get the main list ID from UI
        mainListID = e.target.parentElement.parentElement.previousElementSibling.getAttribute('id')
      } else {
        // Get the main list ID from UI
        mainListID = e.target.parentElement.parentElement.parentElement.previousElementSibling.getAttribute('id')
      }
      // split into Arr to get just the pure ID
      const idArr = mainListID.split('-')
      // get the index containing ID (converted to number)
      const selectedListID = parseInt(idArr[1])
      // Get selected list from data structure
      const selectedList = ItemCtrl.getItemById(selectedListID)
      // Set the selected list as current item
      ItemCtrl.setCurrentItem(selectedList)
      let type
      if(e.target.classList.contains('addIncome')){
        // Set the currentIncomeExpense as 'income' to know that this is an income item to add
        ItemCtrl.setCurrentIncomeExpense('income')
        type = 'income'
      } else if (e.target.classList.contains('addExpense')){
        // Set the currentIncomeExpense as 'expense' to know that this is an expense item to add
        ItemCtrl.setCurrentIncomeExpense('expense')
        type = 'expense'
      }
      // Open modal from UI
      UICtrl.openAddIncomeExpenseModal(type).then(function(){
        // Listen to save button click
        document.querySelector('#save-btn').addEventListener('click', submitAddedData)
        // Listen to Close modal
        document.querySelector('.fa-circle-xmark').addEventListener('click', exitModal)
        document.querySelector('.fixed').addEventListener('click', function(e){
          if(e.target.classList.contains('fixed')){
            exitModal()
          }
        })
      })
    }
  }
  // ====================================================
  function editIncomeExpenseItem(e){
    e.preventDefault()
    if(e.target.classList.contains('editExpense') || e.target.classList.contains('editIncome')){
      // Get the main list ID
      const mainListID = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id')
      // split into Arr to get just the pure ID
      const idArr = mainListID.split('-')
      // Get the index containing the ID # (make sure to convert to number)
      const selectedID = parseInt(idArr[1])
      // Get the list item from the data structure
      const selectedList = ItemCtrl.getItemById(selectedID)
      // Set the selected list as current item
      ItemCtrl.setCurrentItem(selectedList)
      // Get the ID of the expense item
      const incomeExpenseID = e.target.parentElement.parentElement.getAttribute('id')
      // split into Arr
      const incomeExpenseIDArr = incomeExpenseID.split('-')
      // Get the index containing the Id # (convert to NUMBER)
      const selectedIncomeExpenseID = parseInt(incomeExpenseIDArr[1])

      let selectedIncomeExpenseItem, title, fieldTitle
      if(e.target.classList.contains('editExpense')){
        // Get the index containing the ID # (convert to number)
        selectedIncomeExpenseItem = ItemCtrl.getIncomeExpenseItemById('expense', selectedID, selectedIncomeExpenseID)
        title = 'Edit expense item'
        fieldTitle = 'Expense Amount'
      } else if (e.target.classList.contains('editIncome')){
        selectedIncomeExpenseItem = ItemCtrl.getIncomeExpenseItemById('income',selectedID, selectedIncomeExpenseID)
        title = 'Edit income item'
        fieldTitle = 'Income Amount'
      }
      // Set selectedExpenseItem to currentIncomeExpense in data structure
      ItemCtrl.setCurrentIncomeExpense(selectedIncomeExpenseItem)
      // Open Edit Expense Modal    
      UICtrl.openEditIncomeExpenseItemModal(title, fieldTitle).then(function(){
        // Get input fields
        const incomeExpenseTitle = document.querySelector('#income-expense-item-title')
        const incomeExpenseAmount = document.querySelector('#income-expense-item-amount')
        // Insert as value the selected Income Item from currentIncomeExpense
        incomeExpenseTitle.value = ItemCtrl.getCurrentIncomeExpense().title
        incomeExpenseAmount.value = ItemCtrl.getCurrentIncomeExpense().amount
        // Listen to save button click
        document.querySelector('#save-btn').addEventListener('click', submitEdittedData)
        // Listen to delete Item click
        document.querySelector('#delete-income-expense-item').addEventListener('click', removeIncomeExpenseItem)
        // Listen to Close modal
        document.querySelector('.fa-circle-xmark').addEventListener('click', exitModal)
        document.querySelector('.fixed').addEventListener('click', function(e){
          if(e.target.classList.contains('fixed')){
            exitModal()
          }
        })
      })
    }
  }

  // ====================================================
  function removeIncomeExpenseItem(e){
    e.preventDefault()
    const modalAmountLabel = e.target.parentElement.previousElementSibling.firstElementChild
    let type
    if(modalAmountLabel.textContent === 'Income Amount'){
      type = 'income'
    } else if (modalAmountLabel.textContent === 'Expense Amount'){
      type = 'expense'
    }
    // Get currentItem and currentIncomeExpense 
    const selectedList = ItemCtrl.getCurrentItem()
    const selectedIncomeExpenseItem = ItemCtrl.getCurrentIncomeExpense()
    // Delete income item to data structure
    ItemCtrl.deleteIncomeExpenseItem(type, selectedList, selectedIncomeExpenseItem)
    // Delete to UI
    UICtrl.removeIncomeExpenseUI(type, selectedList, selectedIncomeExpenseItem)
    // Get updated items arr
    const updatedListItems = ItemCtrl.logData().items
    // update in Storage
    StorageCtrl.updateListFromStorage(updatedListItems)
    // Close modal
    exitModal()
  }
  ///////////////////////////////////////////////////////////////////////////////////
  function submitAddedData(e){
    e.preventDefault()
    // Get input field values
    let name = document.querySelector('#income-expense-name').value
    let amount = document.querySelector('#income-expense-amount').value
    // Make sure input is not null and converted in data type
    if(name === '' || amount === '' || amount < 0 || isNaN(amount) ){
      console.log('Don\'t put these values!!');
    } else {
      // convert to respective data type
      name = name.toString()
      amount = parseFloat(amount)
      amount = amount.toFixed(2)
      amount = parseFloat(amount)
      // Add to data structure
      const incomeExpenseItem = ItemCtrl.createIncomeExpenseItem(name, amount)
      // Add to UI
      UICtrl.addIncomeExpenseItemToUI(incomeExpenseItem)
      // Get updated items arr
      const updatedListItems = ItemCtrl.logData().items
      // update in Storage
      StorageCtrl.updateListFromStorage(updatedListItems)
      // Close Modal
      exitModal()
    }
  }

  function submitEdittedData(e){
    e.preventDefault()
    // check which modal is this through the modal title
    const modalName = e.target.parentElement.parentElement.previousElementSibling.firstElementChild.textContent
    if(modalName === 'Edit budget list name'){
      // Get the new value from input field
      const newListName = document.querySelector('#list-name').value
      // Error handle
      if(newListName === ''){
        console.log('Field is empty');
      } else {
        // update the list name in data structure
        const updatedList = ItemCtrl.updateListName(newListName)
        // update UI
        UICtrl.updateUIListName(updatedList)
        // Get updated items arr
        const updatedListItems = ItemCtrl.logData().items
        // update in Storage
        StorageCtrl.updateListFromStorage(updatedListItems)
        // Listen to close modal
        exitModal()
      }    
    }

    if(modalName === 'Edit wishlist item' || modalName === 'Add wishlist item'){
      // get values from input fields
      const wishNameInput = document.getElementById('wish-name').value
      const wishPriceInput = document.getElementById('wish-price').value
      const wishDescriptionInput = document.getElementById('wish-description').value

      // Error handling
      if(wishNameInput === '' || wishPriceInput === '' || wishPriceInput < 0 || isNaN(wishPriceInput)){
        console.log('Don\'t put these values!');
      }else{
        // convert price to number and fix decimals
        let wishPrice, wishName, wishDesc, wishItemNew
        wishName = wishNameInput.toString()
        wishPrice = parseFloat(wishPriceInput)
        wishPrice = wishPrice.toFixed(2)
        wishPrice = parseFloat(wishPrice)

        // conditional if there is a description, convert it to string as well
        if(wishDescriptionInput !== ''){
          wishDesc = wishDescriptionInput.toString()
        } else {
          wishDesc = ''
        }

        // determine whether this is an edit or add state
        if(modalName === 'Edit wishlist item'){
          // get the updatedWishListItem => create ItemCtrl method
          wishItemNew = ItemCtrl.updateWishListItem(wishName, wishPrice, wishDesc)
          // Update the UI
          UICtrl.updateUIWishItem(wishItemNew)
        } else if(modalName === 'Add wishlist item') {
          wishItemNew = ItemCtrl.addWishListItem(wishName, wishPrice, wishDesc)
          // add to UI
          UICtrl.addWishItemToUI(wishItemNew)
        }

        // Get updated items arr
        const updatedWishListItems = ItemCtrl.getWishItems()
        // update in Storage
        StorageCtrl.updateWishListFromStorage(updatedWishListItems)
        // Close Modal
        exitModal()
      }

    }
    // ----------------------------------
    if(modalName === 'Edit amount to save' || modalName === 'Edit amount to spend'){
      let newPercent, updatedPercentageList
      // get new save percent value from input field
      if(modalName === 'Edit amount to save'){
        newPercent = document.querySelector('#save-percentage').value
      } else if (modalName === 'Edit amount to spend'){
        newPercent = document.querySelector('#spend-percentage').value
      }
      if(newPercent === '' || newPercent > 100 || newPercent < 0){
        console.log('Don\'t put these values!');
      } else {
        // Convert to number
        newPercent = parseFloat(newPercent)
        // Update Save AND Spend percentage in data structure
        if(modalName === 'Edit amount to save'){
          updatedPercentageList = ItemCtrl.updateSaveSpendPercentage(newPercent, 'save')
        } else if(modalName === 'Edit amount to spend'){
          updatedPercentageList = ItemCtrl.updateSaveSpendPercentage(newPercent, 'spend')
        }
        // Update UI
        UICtrl.updateUISaveSpendPercentage(updatedPercentageList)
        // Get updated items arr
        const updatedListItems = ItemCtrl.logData().items
        // update in Storage
        StorageCtrl.updateListFromStorage(updatedListItems)
        // Close Modal
        exitModal()
      }
    }
    // ----------------------------------
    if(modalName === 'Edit income item' || modalName === 'Edit expense item'){
      // Get new title and amount values from input fields
        let newIncomeExpenseTitle = document.querySelector('#income-expense-item-title').value
        let newIncomeExpenseAmount = document.querySelector('#income-expense-item-amount').value
        // Make sure input fields are not empty
        if(newIncomeExpenseTitle === '' || newIncomeExpenseAmount === '' || newIncomeExpenseAmount < 0 || isNaN(newIncomeExpenseAmount)){
          console.log('Don\'t put these values!');
        } else {
          // convert to respective data types
          newIncomeExpenseTitle = newIncomeExpenseTitle.toString()
          newIncomeExpenseAmount = parseFloat(newIncomeExpenseAmount)
          newIncomeExpenseAmount = newIncomeExpenseAmount.toFixed(2)
          newIncomeExpenseAmount = parseFloat(newIncomeExpenseAmount)
          // Update Income / Expense item to data structure
          if(modalName === 'Edit income item'){
            const updatedIncomeItem = ItemCtrl.updateIncomeExpenseItem('income',newIncomeExpenseTitle, newIncomeExpenseAmount)
            // Update UI
            UICtrl.updateUIIncomeExpenseItem('income', updatedIncomeItem)
            // Get updated items arr
            const updatedListItems = ItemCtrl.logData().items
            // update in Storage
            StorageCtrl.updateListFromStorage(updatedListItems)
          } else if (modalName === 'Edit expense item'){
            const updatedExpenseItem = ItemCtrl.updateIncomeExpenseItem('expense',newIncomeExpenseTitle, newIncomeExpenseAmount)
            // Update UI
            UICtrl.updateUIIncomeExpenseItem('expense', updatedExpenseItem)
            // Get updated items arr
            const updatedListItems = ItemCtrl.logData().items
            // update in Storage
            StorageCtrl.updateListFromStorage(updatedListItems)
          }
          // Close Modal
          exitModal()
        }
    }
    // ----------------------------------
    if(modalName === 'Add budget list'){
      // Get new title and amount values from input fields
      let listName = document.querySelector('#list-name').value
      let saveAmount = document.querySelector('#save-amount').value
      let spendAmount = document.querySelector('#spend-amount').value
      // Convert to respective data types
      listName = listName.toString()
      saveAmount = parseFloat(saveAmount)
      spendAmount = parseFloat(spendAmount)
      // Make sure input fields are not empty
      if(listName === '' || saveAmount === '' || spendAmount < 0 || saveAmount > 100 || isNaN(saveAmount) || spendAmount > 100 || isNaN(spendAmount) || spendAmount === '' || saveAmount < 0){
        console.log('Don\'t put these values!');
      } else {
        // add list to data structure
        const addedList = ItemCtrl.addList(listName, saveAmount, spendAmount)
        // Add list to UI
        UICtrl.addListItem(addedList)
        // Store in localStorage
        StorageCtrl.storeList(addedList)
        // Close Modal
        exitModal()
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////
  function deleteList(e){
    e.preventDefault()  
    // Delete List from data structure
    ItemCtrl.deleteList()
    // Get currentItem Id
    const id = ItemCtrl.getCurrentItem().id
    // Delete from storage
    StorageCtrl.deleteListFromStorage(id)
    // Delete List from UI
    UICtrl.deleteListFromUI()
    // Close modal
    exitModal()
  }
  ///////////////////////////////////////////////////////////////////////////////////
  function exitModal(){
    document.querySelector('.fixed').remove()
  }

  // =============== PUBLIC METHODS
  return {
    init: function(){
      const items = ItemCtrl.getItems()
      const wishItems = ItemCtrl.getWishItems()
      UICtrl.populateBudgetList(items)
      UICtrl.populateWishList(wishItems)
      loadEventListeners()
      // Listen to minimize / maximize list
        document.body.addEventListener('click', (e) => {
          if(e.target.classList.contains('title')){
            e.target.nextElementSibling.classList.toggle('hidden')
          }
        })
        // Initially hide list contents
        if(items.length !== 0){
          const listContents = document.querySelectorAll('.title')
          listContents.forEach(function(item){
            // hide list contents
            item.nextElementSibling.classList.add('hidden')
          })
        }
      // Append full year to Footer
      const yearToday = new Date().getFullYear()
      document.getElementById('present-date').textContent = yearToday

      // Get date and time today
      const dateToday = new Date().toLocaleString()
      // append datetime to DOM
      document.getElementById('current-timestamp').textContent = dateToday
      // Fetch currency API
      loadExhcangeRates()
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl)

//////////////////////////////////// APP INITIALIZATION
App.init()