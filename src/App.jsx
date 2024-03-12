import { useState, useEffect } from 'react'

import './App.css'

const sleep = ms => new Promise(r => setTimeout(r, ms));

const RADtoDEG = (rad) => {
  return (rad * (180 / Math.PI))
}

const DEGtoRAD = (deg) => {
  return (deg * (Math.PI / 180))
}

const HSBToRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
};

var rotation = 4 * Math.PI * Math.random()
var debounce = false
let sound = true

function App() {

  const [list, setList] = useState([{ name: '1', id: crypto.randomUUID() }, { name: '2', id: crypto.randomUUID() }, { name: '3', id: crypto.randomUUID() }, { name: '4', id: crypto.randomUUID() }])
  const [input, setInput] = useState('')
  const [winner, setWinner] = useState('')
  const [winners, setWinners] = useState([])

  useEffect(() => {
    wheel()
  })

  function wheel() {
    const ctx = document.getElementsByClassName('wheel')[0].getContext('2d')
    ctx.reset()

    ctx.fillStyle = '#545454'
    ctx.beginPath()
    ctx.arc(300, 300, 300, 0, 2 * Math.PI)
    ctx.fill()

    for (let i in list) {
      var rgb = HSBToRGB((i / list.length) * 360, 93, 83)
      ctx.fillStyle = `rgb(
        ${rgb[0]},
        ${rgb[1]},
        ${rgb[2]}
      )`
      ctx.beginPath()

      ctx.moveTo(300, 300)
      ctx.arc(300, 300, 300, (2 * (i / list.length)) * Math.PI + rotation, 2 * Math.PI + rotation, false)
      ctx.fill()
    }
    for (let i in list) {
      ctx.textAlign = 'center'
      ctx.font = `${(100 / Math.sqrt(list[i].name.toString().length * 2)) * (4 / list.length)}px cursive`
      ctx.fillStyle = 'white'
      ctx.fillText(list[i].name.toString(), 200 * Math.cos((2 * (i / list.length)) * Math.PI + (rotation) + ((Math.PI) / list.length)) + 300, 200 * Math.sin((2 * (i / list.length)) * Math.PI + (rotation) + ((Math.PI) / list.length)) + 300)
    }

    ctx.fillStyle = '#f0f0f0'
    ctx.beginPath()
    ctx.arc(300, 300, 40, 0, 2 * Math.PI)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(625, 280)
    ctx.lineTo(625, 320)
    ctx.lineTo(585, 300)
    ctx.lineTo(625, 280)
    ctx.fill()
  }

  const rotate = async (e) => {
    if (!debounce) {
      if (list.length) {
        debounce = !debounce

        document.getElementById('winner').className = ''
        document.getElementsByClassName('results')[0].className = 'results'
        document.getElementsByClassName('clear-winners')[0].className = 'clear-winners inactive'
        document.getElementById('clear-entries').className = 'inactive'
        e.target.className = 'start-rotation inactive'

        let rot = 0
        let goal = 0.5//Math.min(Math.max(Math.random(), 0.4), 0.65)

        let quad = findQuadrant(rotation)
        while (rot < goal) {
          let temp = findQuadrant(rotation)
          if (temp != quad) {
            if (sound) {
              const audio = new Audio('http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3')
              audio.type = 'audio/mp3'
              audio.volume = 0.3
              await audio.play()
            }
            quad = findQuadrant(rotation)
            setWinner(findWinner(rotation))
          }

          rotation += rot
          wheel()
          await sleep(1)
          rot += 0.005 //* Math.random()
        }
        rot = goal
        while (rot > 0) {
          let temp = findQuadrant(rotation)
          if (temp != quad) {
            if (sound) {
              const audio = new Audio('http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3')
              audio.type = 'audio/mp3'
              audio.volume = 0.3
              await audio.play()
            }
            quad = findQuadrant(rotation)
            setWinner(findWinner(rotation))
          }

          rotation += rot
          wheel()
          await sleep(10)
          rot -= 0.0025 * Math.random()
        }

        while (rotation > 2 * Math.PI) {
          rotation = rotation - (2 * Math.PI)
        }
        setWinner(findWinner(rotation))
        setWinners([...winners, {
          name: findWinner(rotation),
          id: crypto.randomUUID()
        }])

        const audio = new Audio('win.mp3')
        audio.type = 'audio/mp3'
        audio.volume = 0.175
        await audio.play()

        document.getElementById('winner').className = 'chosen'
        document.getElementsByClassName('results')[0].className = 'results chose'
        document.getElementsByClassName('clear-winners')[0].className = 'clear-winners'
        document.getElementById('clear-entries').className = ''
        e.target.className = 'start-rotation'
        debounce = !debounce
      }
    }
  }

  const findQuadrant = (rotation) => {
    return Math.floor(rotation / (Math.PI / (list.length / 2)))
  }

  const findWinner = (rotation) => {
    while (rotation > 2 * Math.PI) {
      rotation = rotation - (2 * Math.PI)
    }
    return list[Math.abs(Math.floor(rotation / (Math.PI / (list.length / 2))) - (list.length - 1))].name
  }

  window.onload = () => {
    wheel()
  }

  document.onvisibilitychange = () => {
    if (document.visibilityState == 'visible') {
      sound = true
    } else {
      sound = false
    }
  }

  function handleInput(e) {
    if (!debounce) {
      setInput(e.target.value)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!debounce) {
      setList([...list, {
        name: input,
        id: crypto.randomUUID()
      }])
      wheel()
    }
  }

  function handleRemove(index) {
    if (!debounce) {
      setList(list.filter(elem => {
        return elem.id != index
      }))
    }
  }

  function findInstancesOf(name) {
    let count = 0

    list.forEach((elem, index) => {
      if (elem.name == name) {
        count += 1
      }
    })

    return count
  }

  return (
    <>
      <h1>Test your luck</h1>
      <div className='main'>
        <div>
          <div className='results'>
            <div className='links'></div>

            <div className='current-winner'>
              <h1>Chosen:</h1>
              <label id='winner'>{winner ? winner : 'none'}</label>
            </div>

            <div className='winners'>
              <h1>All time winners:</h1>
              <ol>
                {winners.map(winner => {
                  return <li key={winner.id}>{winner.name}</li>
                })}
              </ol>
            </div>
            <button className='clear-winners' onClick={() => { if (!debounce) { setWinners([]) } }}>Clear the Winners list</button>

          </div>
        </div>
        <div className='wheel-container'>
          <button className='start-rotation' onClick={rotate}>Rotate</button>
          <canvas className='wheel' width={625} height={600}></canvas>
        </div>
        <div className='inputbox'>
          <div className='listbox'>

            Entries: {list.length}
            <ul className='list'>
              {list.map(elem => {
                return (<li className='listitem' key={elem.id}>
                  <div>{elem.name}</div>
                  <div>{Math.round((findInstancesOf(elem.name) / list.length) * 100)}%</div>
                  <button className='danger' onClick={() => { handleRemove(elem.id) }}>X</button>
                </li>)
              })}
            </ul>
            <button id='clear-entries' onClick={() => { if (!debounce) { setList([]) } }}>Clear all entries</button>
          </div>
          <form onSubmit={handleSubmit}>
            <input type='text' className='input' placeholder='Type entry' onChange={handleInput} />
            <button>Add</button>
            <p>Warning! Large amounts of entries might cause lag</p>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
