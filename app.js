// Have module for different purposes to achieve seperartion of concern
// 3 modules UIController, MainController, BudgetController Must make them private using IIFE


//Kind DataBase For Our App! 
var BudgetController = (function () {
    // 1. Store the data which is required for our app in a smart way and return it to UI/view model
    // 2. Calculate Budget percentage and send to main controller
    // 3. Calculate Differences between Earnings and Expenditure
    var Expenses = function (id, description, value) { //Function  Constructor for objects of Expenses 
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function (id, description, value) { //Function Constructor for objects of Income
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //Storing Data!!!!
    var data = {
        allitems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function (type, des, val) {
            var newData, ID;
            var len = data.allitems[type].length;
            //update id on the basis of lastitemid+1
            if (len > 0) {
                ID = data.allitems[type][len - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                newData = new Expenses(ID, des, val);
            } else if (type === 'inc') {
                newData = new Income(ID, des, val);

            }

            data.allitems[type].push(newData);
            data.total[type] = Number(data.total[type]) + Number(newData.value);
            // console.log(data);
            return newData;
        },
        getData: function () {
            return data;
        }
    }
})();


var UIController = (function () {

    var clstring = {
        btn: ".add__btn",
        intype: ".add__type",
        description: ".add__description",
        value: ".add__value"
    };


    return ({
        getClassStrings: function () {
            return clstring;
        },

        takeInput: function () {
            return ({
                type: document.querySelector(clstring.intype).value, //value ==> inc+ / exp-
                description: document.querySelector(clstring.description).value,
                value: document.querySelector(clstring.value).value
            });
        },

        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(clstring.description + ', ' + clstring.value);
            // console.log(fields);
            fieldsArr = Array.prototype.slice.call(fields);
            // console.log(fieldsArr);
            fieldsArr.forEach(element => {
                element.value = "";
            });
            document.querySelector(clstring.description).focus();
        },

        displayData: function (newItem, typeOfData) {
            var element;
            if (typeOfData === "inc") {

                var html = `<div class="income__list"><div class="item clearfix" id="income-0"><div class="item__description">${newItem.description}</div>
                            <div class="right clearfix"><div class="item__value">+ ${newItem.value}</div><div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>`
                element = ".income__list"

            } else {
                var html = `<div class="item clearfix" id="expense-0">
                    <div class="item__description">${newItem.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">- ${newItem.value}</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`

                element = ".expenses__list";
            }

            document.querySelector(element).innerHTML += html;
        }
    });

})();


var MainController = (function (budgetcntrl, uicntrl) {
    //To interact with BudgetController and UIController and Handeling Event
    var classString = uicntrl.getClassStrings();

    var ctrlAddItems = function () {
        // Get the Field input data
        var inputs = uicntrl.takeInput();
        // Add the Item to BudgetController
        var newData = budgetcntrl.addItem(inputs.type, inputs.description, inputs.value);
        // Clear input fields 
        uicntrl.clearFields();
        // Calculate the budget
        var Data = budgetcntrl.getData();
        // Add the Item to the UI
        uicntrl.displayData(newData, inputs.type);
        // Display the UI    
    }

    return {
        init: function () {
            document.querySelector(classString.btn).addEventListener('click', ctrlAddItems);
            document.addEventListener('keypress', function (e) {
                if (e.keyCode === 13) {
                    ctrlAddItems();
                }
                // console.log(e);
            });

        }
    }


})(BudgetController, UIController);

var init = MainController.init;
init();