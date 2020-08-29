// Have module for different purposes to achieve seperartion of concern
// 3 modules UIController, MainController, BudgetController Must make them private using IIFE

// var newFile = require('check.js');
// var exp = import('./check.js');
// console.log(trial());
// console.log(exp.trial());
//Kind DataBase For Our App! 
var BudgetController = (function () {
    // 1. Store the data which is required for our app in a smart way and return it to UI/view model
    // 2. Calculate Budget percentage and send to main controller
    // 3. Calculate Differences between Earnings and Expenditure
    var Expenses = function (id, description, value) { //Function  Constructor for objects of Expenses 
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expenses.prototype.percentageCalc = function (totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expenses.prototype.getPercentag = function () {
        return this.percentage;
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
        },
        budget: 0,
        percentage: 0
    }

    //Find sums of expense/incomes
    var calcSums = function (type) {
        var Sum = 0;
        data.allitems[type].forEach(function (elem) {
            // console.log("item:", elem.value);
            Sum = Sum + elem.value;
            // console.log("Sumasd: ", Sum);
        });
        // console.log("Sums of " + type + " : " + Sum);
        data.total[type] = Sum;
        // return data.total[type];
    }

    return {
        addItem: function (type, des, val) {
            var newData, ID;
            var len = data.allitems[type].length;
            //update id on the basis of lastitemid+1
            if (len > 0) {
                ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
                // console.log(data.allitems[type][len - 1].id + 1);
            } else {
                ID = 0;
            }
            // console.log(ID)
            if (type === 'exp') {
                newData = new Expenses(ID, des, val);
            } else if (type === 'inc') {
                newData = new Income(ID, des, val);

            }
            data.allitems[type].push(newData);
            // data.total[type] = Number(data.total[type]) + Number(newData.value);
            // console.log(data);
            return newData;
        },
        calcBudget: function () {
            // calculate total expenses and incomes
            calcSums("exp");
            calcSums("inc");
            // calculate budget income - expenses
            data.budget = data.total.inc - data.total.exp;
            // calculate the %
            if (data.total.inc > 0) {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        calcPercentages: function () {

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExpense: data.total.exp,
                percentage: data.percentage
            }
        },
        deleteData: function (ID, type) {
            //find particular data
            var deleted = data.allitems[type].splice(ID, 1);

            //remove it from data
            // this.calcBudget();
            // this.updateBudget();
        }
    }
})();


var UIController = (function () {

    var clstring = {
        btn: ".add__btn",
        intype: ".add__type",
        description: ".add__description",
        value: ".add__value",
        budgetVal: ".budget__value",
        budgetIncome: ".budget__income--value",
        budgetExpense: ".budget__expenses--value",
        budgetPercentage: ".budget__expenses--percentage",
        deleteItem: ".container"
    };


    return ({
        getClassStrings: function () {
            return clstring;
        },

        takeInput: function () {
            return ({
                type: document.querySelector(clstring.intype).value, //value ==> inc+ / exp-
                description: document.querySelector(clstring.description).value,
                value: parseFloat(document.querySelector(clstring.value).value)
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
            // console.log(newItem);
            if (typeOfData === "inc") {

                var html = `<div class="income__list"><div class="item clearfix" id="inc-${newItem.id}"><div class="item__description">${newItem.description}</div>
                            <div class="right clearfix"><div class="item__value">+ ${newItem.value}</div><div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>`
                element = ".income__list"

            } else {
                var html = `<div class="item clearfix" id="exp-${newItem.id}">
                    <div class="item__description">${newItem.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">- ${newItem.value}</div>
                        <div class="item__percentage"></div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`

                element = ".expenses__list";
            }

            document.querySelector(element).innerHTML += html;
        },
        displayBudget: function (budgetData) {
            // console.log(budgetData);
            document.querySelector(clstring.budgetVal).textContent = budgetData.budget;
            document.querySelector(clstring.budgetIncome).textContent = "+ " + budgetData.totalInc;
            document.querySelector(clstring.budgetExpense).textContent = "- " + budgetData.totalExpense;
            if (budgetData.totalExpense > 0) {
                document.querySelector(clstring.budgetPercentage).textContent = budgetData.percentage + " %";
            } else {
                document.querySelector(clstring.budgetPercentage).textContent = "___";
            }

        },
        displayAfterRemoveData: function (ID, type) {
            // console.log('.' + type + '-' + ID);
            document.querySelector('#' + type + '-' + ID).remove();
        }
    });

})();


var MainController = (function (budgetcntrl, uicntrl) {
    //To interact with BudgetController and UIController and Handeling Event
    var classString = uicntrl.getClassStrings();

    var updateBudget = function () {
        //calculate Budget
        budgetcntrl.calcBudget();
        //return Budget
        var newBudget = budgetcntrl.getBudget();
        //display to the UI 
        // console.log(newBudget);
        uicntrl.displayBudget(newBudget);
    };

    var updatePercentages = function () {
        // 1. Calculate Percentages
        budgetcntrl.calcPercentages();

        // 2. Read percentages data

        // 3. Update percentages in the UI
        // ui.addPercentages();
    };

    var ctrlAddItems = function () {
        // Get the Field input data
        var inputs = uicntrl.takeInput();
        // var pattern = /^[a-zA-Z]{10,20} $/
        if (inputs.description !== "" && !isNaN(inputs.value)) {
            // Add the Item to BudgetController
            var newData = budgetcntrl.addItem(inputs.type, inputs.description, inputs.value);
            // console.log(newData);
            // Add the Item to the UI
            uicntrl.displayData(newData, inputs.type);
            // Clear input fields 
            uicntrl.clearFields();
            // Calculate the budget
            // console.log(budgetcntrl.getData());
            updateBudget();
            updatePercentages();
        }

        // var Data = budgetcntrl.getData();

        // Display the UI    
    }
    var ctrlDeleteItems = (e) => {
        var targetID, splitID, ID;
        targetID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        // console.log(targetID);
        if (targetID) {
            splitID = targetID.split('-');
            // console.log(splitID[1]);
            type = splitID[0];
            ID = splitID[1];
            //1. Delete item from DS
            budgetcntrl.deleteData(ID, type);
            //2. REmove from UI 
            uicntrl.displayAfterRemoveData(ID, type);
            // 3.Show updated Budget
            updateBudget();
        }
    };

    return {
        setListener: function () {
            uicntrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExpense: 0,
                percentage: 0

            })
            document.querySelector(classString.btn).addEventListener('click', ctrlAddItems);
            document.addEventListener('keypress', function (e) {
                if (e.keyCode === 13) {
                    ctrlAddItems();
                }
                // console.log(e);
            });
            document.querySelector(classString.deleteItem).addEventListener('click', ctrlDeleteItems);

        }
    }


})(BudgetController, UIController);

var init = MainController.setListener;
init();