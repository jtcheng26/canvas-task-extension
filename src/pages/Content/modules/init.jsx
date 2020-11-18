import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'

export default function run() {
  let counter = 0;

  function findContainer() {
    counter++
    let container = document.getElementsByClassName("Sidebar__TodoListContainer")
    if (container.length > 0) {
      clearInterval(interval)
      container = container[0]
      while (container.firstChild)
        container.removeChild(container.lastChild)
      createSidebar(container)
    } else if (counter >= 300) {
      clearInterval(interval)
    }
  }

  function createSidebar(container) {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      container
    );
    //container.appendChild(document.createTextNode("Hello"))
  }
  let interval = setInterval(findContainer, 10)
}
