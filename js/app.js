
import { navGuard, navGuardAdmin } from './navlock.js';
import context from './ctx.js';
import {
    delay,
    getEmptyMenu,
    createImageElement,
    playSfx,
    getConfirmationStr,
    getAirlockStatus,
    getOnOffStatus,
    showError,
    isSelfDestructActivated,
    isLifeSupportOff
} from './utils.js'
import { createTypeWriterMenu, createTypeWriterText } from './typewriter.js';
import { scheduleData, rosterData } from './data.js';

window.onload = function () {
    const elswitch = document.getElementById('switch');
    elswitch.checked = false

    elswitch.addEventListener('change', async function (ev) {
        if (elswitch.checked) {
            playSfx('switchsfx')
            await delay(1000)
            await menuHome()
        }
    }, false);

    const eladmin = document.getElementById('admin')
    eladmin.addEventListener('click', function(ev) {
        toggleAdmin()
        console.log(`is admin: ${context.is_admin}`)
    })
}

window.addEventListener('keydown', function (ev) {
    if (ev.key == 'F6') {
        toggleAdmin()
        console.log(`is admin: ${context.is_admin}`)
    }   
})


// HOME
const menuHome = async function () {
    await navGuard(async () => {
        const menu = getEmptyMenu()
        await createTypeWriterMenu(menu, "- DIAGNOSTICA", menuDiagnostics)
        await createTypeWriterMenu(menu, "- REGISTRO", menuSchedule)
        await createTypeWriterMenu(menu, "- CONTROLLI", menuControls)
        await createTypeWriterMenu(menu, "- PERSONALE", menuRoster)
        await createTypeWriterMenu(menu, "- COMUNICAZIONI", menuComms)
    })
}

// HOME -> DIAGNOSTICA
const menuDiagnostics = async function () {
    await navGuard(async () => {
        const menu = getEmptyMenu()
        await createTypeWriterMenu(menu, "- MAPPA", menuMap)
        await createTypeWriterMenu(menu, "- STATO", menuStatus)
        await createTypeWriterMenu(menu, "< INDIETRO", menuHome)
    })
}

// HOME -> DIAGNOSTICA -> MAPPA
const menuMap = async function () {
    await navGuard(async () => {
        const menu = getEmptyMenu()
        const img = createImageElement('img/map.png', 'stationmap')
        menu.appendChild(img)
        await createTypeWriterMenu(menu, "< INDIETRO", menuDiagnostics)
    })
}

// HOME -> DIAGNOSTICA -> STATO
const menuStatus = async function () {
    await navGuard(async () => {
        const menu = getEmptyMenu()
        await createTypeWriterText(menu, "SYSTEM CHECK...", `font-size: 90%`)
        await createTypeWriterText(menu, "ATTENZIONE: FILTRI DELL'ARIA SOSTITUITI 455 GIORNI FA", `color: yellow; font-size: 90%`)
        await createTypeWriterText(menu, "ATTENZIONE: DOCCIA N.5 FUORI SERVIZIO DA 1 GIORNO", `color: red; font-size: 90%`)
        await createTypeWriterText(menu, "ATTENZIONE: ULTIMA MANUTENZIONE ASCENSORE MINIERA 455 GIORNI FA", `color: yellow; font-size: 90%`)
        await createTypeWriterText(menu, "ATTENZIONE: FLUSSO ARIA 82% (NON OTTIMO: SOSTITUIRE FILTRI E CONTROLLARE OSTRUZIONI CONDOTTI)", `color: red; font-size: 90%`)
        if (!isLifeSupportOff() && !isSelfDestructActivated()) {
            await createTypeWriterText(menu, "[TUTTI I SISTEMI OPERANO IN CONDIZIONI ACCETTABILI]", `font-size: 90%`)
        } else {
            if (isLifeSupportOff())
                await createTypeWriterText(menu, "ATTENZIONE: SUPPORTO VITALE DISATTIVATO!", `color: red; font-size: 90%`)
            if (isSelfDestructActivated())
                await createTypeWriterText(menu, "ATTENZIONE: SEQUENZA DI AUTO DISTRUZIONE ATTIVATA!", `color: red; font-size: 90%`)            
        }
        await createTypeWriterMenu(menu, "< INDIETRO", menuDiagnostics)
    })
}

// HOME -> REGISTRO
const menuSchedule = async function () {
    await navGuard(async () => {
        let menu = getEmptyMenu()
        menu.innerHTML = scheduleData
        await createTypeWriterMenu(menu, "< INDIETRO", menuHome)
    })
}

// HOME -> CONTROLLI
const menuControls = async function () {
    await navGuard(async () => {
        const menu = getEmptyMenu()
        await createTypeWriterMenu(menu, "- PORTELLONI", menuAirlocks)
        await createTypeWriterMenu(menu, "- DOCCE", menuShowers)
        await createTypeWriterMenu(menu, "- SISTEMA [A]", menuSystem)
        await createTypeWriterMenu(menu, "< INDIETRO", menuHome)
    })
}

// HOME -> CONTROLLI -> PORTELLONI
const menuAirlocks = async function () {
    await navGuard(async () => {
        const menu = getEmptyMenu()
        await createTypeWriterMenu(menu, `- BAIA 1 [${getAirlockStatus(context.lock_docking_bay_1)}]`, toggleAirlock1)
        await createTypeWriterMenu(menu, `- BAIA 2 [${getAirlockStatus(context.lock_docking_bay_2)}]`, toggleAirlock2)
        await createTypeWriterMenu(menu, `- ASCENSORE MINIERA [${getAirlockStatus(context.lock_mineshaft)}]`, toggleMineshaft)
        await createTypeWriterMenu(menu, "< INDIETRO", menuControls)
    })
}

// HOME -> CONTROLLI -> DOCCE
const menuShowers = async function () {
    await navGuard(async () => {
        const menu = getEmptyMenu()
        for (let i = 0; i < context.showers.length; i++) {
            const s = context.showers[i]
            await createTypeWriterMenu(menu, `- DOCCIA ${i + 1} [${getOnOffStatus(s)}]`, () => toggleShower(i))
        }
        await createTypeWriterMenu(menu, "< INDIETRO", menuControls)
    })
}

// HOME -> CONTROLLI -> SISTEMA [A]
// Questo menu' necessita dei permessi di admin
const menuSystem = async function () {
    await navGuardAdmin(async () => {
        const menu = getEmptyMenu()
        await createTypeWriterText(menu, `[ACCESSO CONSENTITO, BENTORNATA, SONYA]`, `color: green`)
        await createTypeWriterMenu(menu, `- SUPPORTO VITALE`, menuLifeSupport)
        await createTypeWriterMenu(menu, `- AUTO DISTRUZIONE`, menuSelfDestruct)
        await createTypeWriterMenu(menu, "< INDIETRO", menuControls)
    })
}

// HOME -> CONTROLLI -> SISTEMA [A] -> SUPPORTO VITALE
const menuLifeSupport = async function () {
    await navGuardAdmin(async () => {
        const menu = getEmptyMenu()
        if (isLifeSupportOff())
            await createTypeWriterText(menu, `[ATTENZIONE: SUPPORTO VITALE DISATTIVATO]`, `color: red`)
            
        await createTypeWriterMenu(menu, `- SUPPORTO VITALE [${getOnOffStatus(context.life_support)}]`, menuDisableLifeSupport)
        await createTypeWriterMenu(menu, "< INDIETRO", menuControls)
    })
}

const menuDisableLifeSupport = async function () {
    await navGuardAdmin(async () => {
        if (context.life_support === true) {
            const menu = getEmptyMenu()
            await createTypeWriterText(
                menu,
                `[ATTENZIONE, DISABILITARE IL SUPPORTO VITALE SENZA AUTORIZZAZIONE È CONTRO LE POLICY DI SICUREZZA. ASSICURATEVI DI COMPILARE IL MODULO 077-X24 IN OGNI SUO CAMPO E INVIARLO AL SUPERVISORE.]`,
                `color: red`)
            await createTypeWriterMenu(menu, "- CONFERMA", () => { context.life_support = false; menuLifeSupport() })
            await createTypeWriterMenu(menu, "< INDIETRO", menuControls)
        } else {
            context.life_support = true
            menuLifeSupport()
        }
    })
}

// HOME -> CONTROLLI -> SISTEMA [A] -> AUTO DISTRUZIONE
const menuSelfDestruct = async function () {
    await navGuardAdmin(async () => {
        const menu = getEmptyMenu()
        if (isSelfDestructActivated()) {
            await createTypeWriterText(menu,
                `[SEQUENZA AUTO DISTRUZIONE ATTIVATA. LA STAZIONE DETONERÀ IN 10 MINUTI. ABBANDONARE LA STAZIONE.]`,
                `color: red`)
            await createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[0])}]`, () => toggleSelfDestructConfirm(0))
            await createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[1])}]`, () => toggleSelfDestructConfirm(1))
            await createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[2])}]`, () => toggleSelfDestructConfirm(2))
            await createTypeWriterMenu(menu, "< INDIETRO", menuControls)
        } else {
            await createTypeWriterText(menu,
                `[ATTENZIONE, IL PROCESSO DI AUTODISTRUZIONE DETONERÀ LA STAZIONE DOPO 10 MINUTI DALL'ATTIVAZIONE. SE CONFERMATO IL PROCESSO DIVENTERÀ IRREVERSIBILE DOPO 5 MINUTI.]`,
                `color: red`)
            await createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[0])}]`, () => toggleSelfDestructConfirm(0))
            await createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[1])}]`, () => toggleSelfDestructConfirm(1))
            await createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[2])}]`, () => toggleSelfDestructConfirm(2))
            await createTypeWriterMenu(menu, "< INDIETRO", menuControls)
        }
    })
}

// HOME -> PERSONALE
const menuRoster = async function () {
    await navGuard(async () => {
        const menu = getEmptyMenu()
        menu.innerHTML = rosterData
        await createTypeWriterMenu(menu, "< INDIETRO", menuHome)
    })
}

// HOME -> COMUNICAZIONI
const menuComms = async function () {
    await navGuard(async () => {
        const menu = getEmptyMenu()
        await createTypeWriterText(menu, `SCANSIONE NAVI IN PROSSIMITÀ...`)
        await createTypeWriterMenu(menu, `- CONTATTO RSV THE HERACLES`)
        await createTypeWriterMenu(menu, `- CONTATTO IMV THE TEMPEST`)
        await createTypeWriterMenu(menu, "< INDIETRO", menuHome)
    })
}

// HELPERS
const toggleAirlock1 = function (flag) {
    showError("BLOCCO MANUALE IN FUNZIONE. DISINSERIRE BLOCCO MANUALE.")
}

const toggleAirlock2 = function (flag) {
    context.lock_docking_bay_2 = !context.lock_docking_bay_2
    playSfx('airlocksfx')
    menuAirlocks()
}

const toggleMineshaft = function (flag) {
    context.lock_mineshaft = !context.lock_mineshaft
    playSfx('airlocksfx')
    menuAirlocks()
}

const toggleShower = function (index) {
    if (index === 4) {
        // questa doccia non funziona
        showError("[DOCCIA 5 FUORI SERVIZIO.]")
    } else {
        context.showers[index] = !context.showers[index]
        menuShowers()
    }
}

const toggleAdmin = function () {
    const admin_el = document.getElementById('admin')
    context.is_admin = !context.is_admin
    if (context.is_admin) {
        admin_el.style.color = '#0f0'
        admin_el.innerHTML = 'ADMIN'
    } else {
        admin_el.style.color = '#000'
        admin_el.innerHTML = 'GUEST'
    }

    navigator.vibrate(200); // vibrate for 200ms
}

const toggleSelfDestructConfirm = function (index) {
    context.self_destruct_confirm[index] = !context.self_destruct_confirm[index]

    if (isSelfDestructActivated()) {
        navigator.vibrate([
            100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30, 100,
          ]); // Vibrate 'SOS' in Morse.        
    } else {
        navigator.vibrate(200); // vibrate for 200ms
    }

    menuSelfDestruct()
}
//