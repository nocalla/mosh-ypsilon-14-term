import { delay } from './utils.js'

class Typewriter {
    constructor(element, text, speed) {
        this.element = element;
        this.text = text;
        this.speed = speed ?? 30;
    }

    async exec() {
        for (let i = 0; i < this.text.length; i++) {
            this.element.innerHTML += this.text.charAt(i);
            await delay(this.speed)
        }
    }
}

const createTypeWriterMenu = async function (menu, text, onclick) {
    let li = document.createElement('li')
    let a = document.createElement('a')
    a.href = "#"
    a.onclick = onclick
    li.appendChild(a)
    menu.appendChild(li)

    const tw = new Typewriter(a, text)
    await tw.exec()
}

const createTypeWriterText = async function (menu, text, {style = null, speed = 30}={}) {
    let li = document.createElement('li')
    if (style)
        li.style = style
    menu.appendChild(li)

    const tw = new Typewriter(li, text, speed)
    await tw.exec()
}

export {
    createTypeWriterMenu,
    createTypeWriterText
}