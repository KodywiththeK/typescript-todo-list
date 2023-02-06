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
      id: this.todoList.length,
      content: target.value,
      isDone: false,
    });
    target.value = '';
    this.render();
  }

  removeTodo(selectedId: Todo['id']) {
    this.todoList = this.todoList.filter((todo) => todo.id !== selectedId)
    this.todoList.map((item, index) => item.id = index)
    this.render()
  }

  updateCheckbox(selectedId: Todo['id']) {
    this.todoList.map((todo) => {
      if(todo.id === selectedId) {
        todo.isDone = !todo.isDone
      }
    })
    this.render()
  }

  updateTodo(event: MouseEventInit, selectedId: Todo['id']) {
    const target = <HTMLInputElement>(event as MouseEvent).target
    this.todoList.map((todo) => {
      if(todo.id === selectedId) {
        todo.content = target.innerText
      }
    })
    this.render()
  }

  filterTodo(event: MouseEventInit) {
    const target = <HTMLButtonElement>(event as MouseEvent).target
    const buttonNodes = document.querySelectorAll('.btn')
    buttonNodes?.forEach((node) => {
        node.classList.remove('active')
    })
    target.classList.add('active')
    this.render()
  }

  generateTodoList(todo:Todo) {
    const containerEl = makeDOMwithProperties('div', {class: 'item'})
    const divEl = makeDOMwithProperties('div', {id: `${todo.id}`, class: "item__div"})
    const inputEl = makeDOMwithProperties('input', {type: 'checkbox'})
    todo.isDone && inputEl.setAttribute('checked', '')
    const contentEl = makeDOMwithProperties('div', {class: `content ${todo.isDone && 'checked'}`, contentEditable: 'true'})
    contentEl.innerText = todo.content
    const buttonEl = makeDOMwithProperties('button', {class: 'delete'})
    buttonEl.innerText = "X"
    appendChildrenList(divEl, [inputEl, contentEl, buttonEl])
    containerEl.appendChild(divEl)
    
    buttonEl?.addEventListener('click', () => this.removeTodo(todo.id))
    inputEl?.addEventListener('change', () => this.updateCheckbox(todo.id))
    contentEl?.addEventListener('blur', () => this.updateTodo(event as MouseEvent, todo.id))
    
    return containerEl;
  }

  filterStatus (todoList: Todo[]) {
    const activeTodo = document.querySelector('.active') as HTMLButtonElement;
    let todoListComponent:HTMLElement[] = []
    if(activeTodo.className.includes('complete')) {
      const newArr = todoList.filter((todo) => todo.isDone === true) 
      todoListComponent = newArr.map((todo) => this.generateTodoList(todo)) 
    } 
    if(activeTodo.className.includes('not-complete')) {
      const newArr = todoList.filter((todo) => todo.isDone === false) 
      todoListComponent = newArr.map((todo) => this.generateTodoList(todo)) 
    }
    if(activeTodo.className.includes('all')) {
      todoListComponent = todoList.map((todo) => this.generateTodoList(todo)) 
    }
    return todoListComponent;
  }

  render() {
    const todoListEl = document.querySelector('.todo-items');
    const todoCount = document.querySelector('#todo-count') as HTMLSpanElement;
    todoCount.innerText = String(this.todoList.length)
    todoListEl?.replaceChildren(...this.filterStatus(this.todoList))
  }
}
const todoApp = new TodoApp();
todoApp.render();