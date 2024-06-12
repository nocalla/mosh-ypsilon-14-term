import { delay } from './utils.js'

class Typewriter {
    constructor(element, text, speed = 30) {
        this.element = element;
        this.text = text;
        this.speed = speed;
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

const createTypeWriterText = async function (menu, text, style) {
    let li = document.createElement('li')
    li.style = style
    menu.appendChild(li)

    const tw = new Typewriter(li, text)
    await tw.exec()
}

export {
    createTypeWriterMenu,
    createTypeWriterText
}