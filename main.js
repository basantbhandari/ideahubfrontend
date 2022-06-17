var updateMenu = document.getElementById("container__wrapper__body__item__container__item__updateMenu");
updateMenu.style.display = "none";
var textArea__update = document.getElementById("update__textarea");
var updateBtn = document.getElementById("update__submit__btn");




function eventListenerOnItemAdd(){
    // lets add onclick event items
var items = document.getElementsByClassName("container__wrapper__body__item__container__item"); 
for(let i = 0; i < items.length; i++){
    items[i].addEventListener("click", function(){
        textArea__update.innerText = items[i].name;
        displayIdeaUpdateMenu(items[i], items[i].id);
    })
}
}

function displayIdeaUpdateMenu(item, key){
    var ideaUpdateMenu = document.getElementById("container__wrapper__body__item__container__item__updateMenu");
    ideaUpdateMenu.style.display = "block";
    textArea__update.innerHTML = `${item.innerText}`;

    //  onChange event on text area
    let myIdea__update;
    textArea__update.onchange = function(){
        myIdea__update  = this.value;
    }

    // onclick event on update btn
    updateBtn.onclick = function(){
        var ideaUpdateMenu = document.getElementById("container__wrapper__body__item__container__item__updateMenu");
        ideaUpdateMenu.style.display = "none";
        var myData = {
            name: myIdea__update,
            time: new Date(),
            isProgress: false,
            isDone: false,
            isDeleted: false,
            isCanceled: false,
            isMissed: false,
            isLate: false
        }
        myData = JSON.parse(JSON.stringify(myData));

        updateTodoItem(myData, key).then(function(){
            todosContainer.innerHTML = "";
            readTodoAll().then(function(){
                console.log("read todo all");
            }).catch(function(err){
                console.log(err);
            });
        }).catch(function(err){
            console.log(err);
        })


    }

}

// get the todos container
var todosContainer = document.getElementsByClassName("container__wrapper__body__item__container")[0];
// create todo item div element
function createTodoItemDiv(myData, key){
        var myTodoElement = document.createElement("div");
        myTodoElement.classList.add("container__wrapper__body__item__container__item");
        myTodoElement.setAttribute("id", key);
        myTodoElement.innerHTML = `<p> ${myData} </p>`;
        todosContainer.appendChild(myTodoElement);
}




// onchange event on text area
var myIdea;
var textArea = document.getElementById("textarea");
textArea.onchange = function(){
    myIdea  = this.value;
}
// onclick event on submit btn
var submitBtn = document.getElementById("submit__btn");
submitBtn.onclick = function(){
    var myData = {
        name: myIdea,
        time: new Date(),
        isProgress: false,
        isDone: false,
        isDeleted: false,
        isCanceled: false,
        isMissed: false,
        isLate: false
        }
    createTodoItem(myData).then(function(){
        console.log("success");
        todosContainer.innerHTML = "";
        readTodoAll();
    }).catch(function(err){
        console.log(err);
    })


}














// create function to create a todo item using async await
async function createTodoItem(myData){
    var response = await fetch("http://localhost:3000/create_todo/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(myData)
    
    });
    // error handling
    if(!response.ok){
        throw new Error("Something went wrong");
    }
    var data = await response.json();
}



// create function to read a todo item using async await
async function readTodoAll(){
    var response = await fetch("http://localhost:3000/read_todos/");
    // error handling
    if(!response.ok){
        throw new Error("Something went wrong");
    }
    var data = await response.json();
    Object.keys(data).forEach(function(key){
        createTodoItemDiv(data[key].name, key);
    }) 
    eventListenerOnItemAdd();
}

readTodoAll().then(function(){
    console.log("read");
    eventListenerOnItemAdd();
}).catch(function(err){
    console.log(err);
});

// function to update a todo item using async await
async function updateTodoItem(myData, key){
    var response = await fetch(`http://localhost:3000/update_todo/${key}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(myData)
    
    });
    // error handling
    if(!response.ok){
        throw new Error("Something went wrong");
    }
    try{
        var data = await response.json();
        console.log(data);
    }catch(err){
        console.log("my error"+err);
    }
}

// function to delete a todo item using async await
async function deleteTodoItem(key){
    var response = await fetch(`http://localhost:3000/delete_todo/${key}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    // error handling
    if(!response.ok){
        throw new Error("Something went wrong");
    }
    try{
        var data = await response.json();
    }catch(err){
        console.log("my error"+err);
    }
}
