import "./style.css";

interface Todo {
  id: number;
  content: string;
  isDone: boolean;
}
const makeDOMwithProperties = (domType:string, propertyMap:{[key:string]:string}) => {
  const dom = document.createElement(domType);
  Object.keys(propertyMap).forEach((key) => {
    dom.setAttribute(key, propertyMap[key])
  });
  return dom;
}
const appendChildrenList = (target:HTMLElement, childrenList:HTMLElement[]) => {
  if(!Array.isArray(childrenList)) return;
  childrenList.forEach((children) => {
    target.appendChild(children);
  })
};

class TodoApp {
  todoList: Todo[] = [];
  constructor() {
    this.initEvent();
  }

  initEvent (){
    const inputEl = document.querySelector('#todo-input');
    const controlEl = document.querySelector('.control')

    inputEl?.addEventListener('keydown', this.addTodo.bind(this))
    controlEl?.addEventListener('click', this.filterTodo.bind(this) )
  }

  
  addTodo (event:KeyboardEventInit) {
    const target = <HTMLInputElement>(event as KeyboardEvent).target;
    if(!target.value || event.key !== 'Enter' || event.isComposing) {
      return;
    }
    this.todoList.push({
      id: this.todoList.length + 1,
      content: target.value,
      isDone: false,
    });
    target.value = '';
    this.render(this.todoList);
  }

  removeTodo(event:MouseEventInit) {
    const target = <HTMLButtonElement>(event as MouseEvent).target
    const item = target.parentNode
    console.log((item as HTMLDivElement).id)
    this.todoList = this.todoList.filter((todo) => todo.id !== Number((item as HTMLDivElement).id))
    this.render(this.todoList)
  }

  updateCheckbox(event: MouseEventInit) {
    const target = <HTMLInputElement>(event as MouseEvent).target
    const item = target.parentNode
    this.todoList.map((todo) => {
      if(todo.id === Number((item as HTMLDivElement).id)) {
        todo.isDone = !todo.isDone
      }
    })
    this.render(this.todoList)
  }

  updateTodo(event: MouseEventInit) {
    const target = <HTMLInputElement>(event as MouseEvent).target
    const item = target.parentNode
    this.todoList.map((todo) => {
      if(todo.id === Number((item as HTMLDivElement).id)) {
        todo.content = target.innerText
      }
    })
    this.render(this.todoList)
  }

  filterTodo(event: MouseEventInit) {
    const target = <HTMLButtonElement>(event as MouseEvent).target
    const buttonNodes = document.querySelectorAll('.btn')
    buttonNodes?.forEach((node) => {
        node.classList.remove('active')
    })
    target.classList.add('active')
    this.render(this.todoList)
  }



  getTodoList() {
    return this.todoList;
  }

  generateTodoList(todo:Todo) {
    const containerEl = makeDOMwithProperties('div', {class: 'item'})
    
    // const todoTemplate = `
    //   <div id='${todo.id}' class="item__div">
    //     <input type='checkbox' ${todo.isDone && 'checked'} />
    //     <div class = 'content ${todo.isDone && 'checked'}' contentEditable> ${todo.content} </div>
    //     <button class = 'delete'> X </button>
    //   </div>`;
    const divEl = makeDOMwithProperties('div', {id: `${todo.id}`, class: "item__div"})
    const inputEl = makeDOMwithProperties('input', {type: 'checkbox'})
    todo.isDone && inputEl.setAttribute('checked', '')
    const contentEl = makeDOMwithProperties('div', {class: `content ${todo.isDone && 'checked'}`, contentEditable: 'true'})
    contentEl.innerText = todo.content
    const buttonEl = makeDOMwithProperties('button', {class: 'delete'})
    buttonEl.innerText = "X"
    appendChildrenList(divEl, [inputEl, contentEl, buttonEl])
    containerEl.appendChild(divEl)
      
    
    buttonEl?.addEventListener('click', () => this.removeTodo(event as MouseEvent))
    inputEl?.addEventListener('click', () => this.updateCheckbox(event as MouseEvent))
    contentEl?.addEventListener('blur', () => this.updateTodo(event as MouseEvent))
    
    return containerEl;
  }

  render(todoList: Todo[] = []) {
    const todoListEl = document.querySelector('.todo-items');
    const todoCount = document.querySelector('#todo-count') as HTMLSpanElement;
    const activeTodo = document.querySelector('.active') as HTMLButtonElement;
    // const fragment = document.createDocumentFragment();
    // fragment.append(...todoListComponent);
    // todoListEl?.appendChild(fragment)
    // const todoListComponent = todoList.map((todo) => this.generateTodoList(todo))
    let todoListComponent:HTMLElement[] = []
    if(activeTodo.className.includes('all')) {
      todoListComponent = todoList.map((todo) => this.generateTodoList(todo)) 
    }
    if(activeTodo.className.includes('complete')) {
      const newArr = todoList.filter((todo) => todo.isDone === true) 
      todoListComponent = newArr.map((todo) => this.generateTodoList(todo)) 
    } 
    if(activeTodo.className.includes('not-complete')) {
      const newArr = todoList.filter((todo) => todo.isDone === false) 
      todoListComponent = newArr.map((todo) => this.generateTodoList(todo)) 
    }
    todoCount.innerText = String(todoList.length)
    todoListEl?.replaceChildren(...todoListComponent)
  }
}
const todoApp = new TodoApp();
todoApp.render();