HTML Architecture.
a texfield that takes input of the task
a checkbox which shows completeion or uncompletion state of task
a button to add task into the list
ul -> contains li 
task with checkbox to mark complete or uncomplete the task

JS Architecture.
    array of objects -> [ { text: "Meeting with HR", isCompleted: false}, 
                         {second task}, 
                         {...so on}
                        ]

the js append func add task to array -> ar.append(text, )

functions: 
    saveTodo -> save the tasks in local storage (same as ios swift data local storage)
    createTodoNode -> creates the li (list of todo) in the ul 
    addTodo -> add todo to the array and then runs render func
    renderTodo -> renders the global array of todo into the DOM

