import {createCounter, maximum} from './counter.mjs'
import './style.css'

const counter = createCounter()
const count = document.querySelector('#count')
const increment = document.querySelector('#increment')
const decrement = document.querySelector('#decrement')
const reset = document.querySelector('#reset')
document.querySelector('#maximum').textContent = maximum

function render() {
  count.value = String(counter.value)
  decrement.disabled = counter.value === 0
  increment.disabled = counter.value === maximum
  reset.disabled = counter.value === 0
}

for (const [button, action] of [[increment, 'increment'], [decrement, 'decrement'], [reset, 'reset']]) {
  button.addEventListener('click', () => {
    counter.dispatch(action)
    render()
  })
}

render()
