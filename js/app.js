window.onload = function () {
    const elswitch = document.getElementById('switch');
    elswitch.checked = false

    elswitch.addEventListener('change', function (ev) {
        if (elswitch.checked) {
            playSfx('switchsfx')
            enableNavigation()
            menuHome()
        } /*else {
            document.getElementById('switchsfx').pause();
        }*/
    }, false);
}

window.addEventListener('keydown', function (ev) {

    if (ev.key == 'F1') {
        toggleAdmin()
    }

    console.log(`is admin: ${context.is_admin}`)
})

var typewriter_i = 0;
var typewriter_txt = 'Lorem ipsum typing effect!'; /* The text */
var typewriter_speed = 30; /* The speed/duration of the effect in milliseconds */
var typewriter_el = null;
var typewriter_then = null;
var typewriter_sequence = [];
var navigation_enabled = false;
var is_admin = false;

var context = {
    is_admin: false,
    lock_docking_bay_1: true,
    lock_docking_bay_2: false,
    lock_mineshaft: false,
    showers: [false, false, false, false, false],
    life_support: true,
    self_destruct: false,
    self_destruct_confirm: [true, true, false]
}

function toggleAdmin() {
    const admin_el = document.getElementById('admin')
    context.is_admin = !context.is_admin
    if (context.is_admin) {
        admin_el.style.color = '#0f0'
        admin_el.innerHTML = 'ADMIN'
    } else {
        admin_el.style.color = '#000'
        admin_el.innerHTML = 'GUEST'
    }
}

function playSfx(name) {
    document.getElementById(name).play()
}

function stopSfx(name) {
    document.getElementById(name).pause()
    document.getElementById(name).currentTime = 0
}

function enableNavigation() {
    navigation_enabled = true;
    stopSfx('readsfx')
}

function disableNavigation() {
    navigation_enabled = false;
    // TODO. trovare un posto migliore
    playSfx('readsfx')
}

function typeWriter() {
    if (typewriter_i < typewriter_txt.length) {
        typewriter_el.innerHTML += typewriter_txt.charAt(typewriter_i);
        typewriter_i++;
        setTimeout(typeWriter, typewriter_speed);
    } else if (typewriter_then != null) {
        typewriter_then()
    } else if (typewriter_sequence.length > 0) {
        typewriter_sequence.shift()();
    }
}

function showError(text) {
    document.getElementById('error').innerHTML = text
    document.getElementById('error').style.visibility = "visible"
    disableNavigation()
    setTimeout(() => {
        document.getElementById('error').style.visibility = "hidden"
        enableNavigation()
    }, 4000)
}

function createTypeWriterMenu(menu, text, onclick, then = null) {
    typewriter_i = 0;
    typewriter_txt = text;
    typewriter_then = then;
    let li = document.createElement('li')
    let a = document.createElement('a')
    a.href = "#"
    a.onclick = onclick
    li.appendChild(a)
    typewriter_el = a
    menu.appendChild(li)
    typeWriter()
}

function createTypeWriterText(menu, text, style, then = null) {
    typewriter_i = 0
    typewriter_txt = text
    typewriter_then = then
    let li = document.createElement('li')
    li.style = style
    typewriter_el = li
    menu.appendChild(li)
    typeWriter()
}

function typeWriterSequence(functions) {
    typewriter_sequence = functions
    typewriter_then = null
    typewriter_sequence.shift()();
}

// HOME
const menuHome = function () {
    if (navigation_enabled === false)
        return

    let menu = document.getElementById('menu');
    menu.innerHTML = ""

    setTimeout(function () {
        disableNavigation();
        typeWriterSequence([
            () => { createTypeWriterMenu(menu, "- DIAGNOSTICA", menuDiagnostics) },
            () => { createTypeWriterMenu(menu, "- REGISTRO", menuSchedule) },
            () => { createTypeWriterMenu(menu, "- CONTROLLI", menuControls) },
            () => { createTypeWriterMenu(menu, "- PERSONALE", menuRoster) },
            () => { createTypeWriterMenu(menu, "- COMUNICAZIONI", menuComms) },
            enableNavigation
        ])
    }, 200);
}


// HOME -> DIAGNOSTICA
const menuDiagnostics = function () {
    if (navigation_enabled === false)
        return
    let menu = document.getElementById('menu');
    menu.innerHTML = ""

    setTimeout(function () {
        disableNavigation();
        typeWriterSequence([
            () => { createTypeWriterMenu(menu, "- MAPPA", menuMap) },
            () => { createTypeWriterMenu(menu, "- STATO", menuStatus) },
            () => { createTypeWriterMenu(menu, "< INDIETRO", menuHome) },
            enableNavigation
        ])
    }, 200);
}

// HOME -> DIAGNOSTICA -> MAPPA
const menuMap = function () {
    if (navigation_enabled === false)
        return

    let img = document.createElement('img')
    img.src = 'img/map.png'
    img.classList.add('stationmap')

    let menu = document.getElementById('menu');
    menu.innerHTML = ``
    menu.appendChild(img)    

    setTimeout(function () {
        disableNavigation();
        typeWriterSequence([
            () => { createTypeWriterMenu(menu, "< INDIETRO", menuDiagnostics) },
            enableNavigation
        ])
    }, 200);    
}

// HOME -> DIAGNOSTICA -> STATO
const menuStatus = function () {
    if (navigation_enabled === false)
        return
    let menu = document.getElementById('menu');
    menu.innerHTML = "";
    menu.style = "font-size: 70%;"

    setTimeout(function () {
        disableNavigation();
        typeWriterSequence([
            () => { createTypeWriterText(menu, "SYSTEM CHECK...") },
            () => { createTypeWriterText(menu, "ATTENZIONE: FILTRI DELL'ARIA SOSTITUITI 455 GIORNI FA", `color: yellow`) },
            () => { createTypeWriterText(menu, "ATTENZIONE: DOCCIA N.5 FUORI SERVIZIO DA 1 GIORNO", `color: red`) },
            () => { createTypeWriterText(menu, "ATTENZIONE: ULTIMA MANUTENZIONE ASCENSORE MINIERA 455 GIORNI FA", `color: yellow`) },
            () => { createTypeWriterText(menu, "ATTENZIONE: FLUSSO ARIA 82% (NON OTTIMO: SOSTITUIRE FILTRI E CONTROLLARE OSTRUZIONI CONDOTTI)", `color: red`) },
            () => { createTypeWriterText(menu, "[TUTTI I SISTEMI OPERANO IN CONDIZIONI ACCETTABILI]") },
            () => { createTypeWriterText(menu, " ") },
            () => { createTypeWriterMenu(menu, "< INDIETRO", menuDiagnostics) },
            enableNavigation
        ])
    }, 200);
}

// HOME -> REGISTRO
const menuSchedule = function () {
    if (navigation_enabled === false)
        return
    let menu = document.getElementById('menu');
    menu.innerHTML = `
    <table>
<tr>
  <th>Data</th>
  <th>Nave</th>
  <th>Operazione</th>
  <th>Luogo</th>
  <th>Stato</th>
</tr>
<tr>
  <td>666-07-02</td>
  <td>IMV THE TEMPEST</td>
  <td>RIFORNIM.</td>
  <td>BAIA 2</td>
  <td>ATTRAC.</td>
</tr>
<tr>
  <td>666-06-04</td>
  <td>RSV THE HERACLES</td>
  <td>RESEARCH</td>
  <td>BAIA 1</td>
  <td>ATTRAC.</td>
</tr>
<tr>
  <td>666-06-02</td>
  <td>CTV HORN OV PLENTY</td>
  <td>RIFORNIM.</td>
  <td>BAIA 2</td>
  <td>PARTITO</td>
</tr>
<tr>
  <td>666-06-01</td>
  <td>CTV HORN OV PLENTY</td>
  <td>RIFORNIM.</td>
  <td>BAIA 2</td>
  <td>ATTRAC.</td>
</tr>
<tr>
  <td>666-05-02</td>
  <td>MV VASQUEZ XV</td>
  <td>RITIRO</td>
  <td>BAIA 1</td>
  <td>PARTITO</td>
</tr>
<tr>
  <td>666-05-01</td>
  <td>MV VASQUEZ XV</td>
  <td>RITIRO</td>
  <td>BAIA 1</td>
  <td>ATTRAC.</td>
</tr>
<tr>
  <td>666-04-02</td>
  <td>CTV HORN OV PLENTY</td>
  <td>RIFORNIM.</td>
  <td>BAIA 2</td>
  <td>PARTITO</td>
</tr>
<tr>
  <td>666-04-01</td>
  <td>CTV HORN OV PLENTY</td>
  <td>RIFORNIM.</td>
  <td>BAIA 2</td>
  <td>ATTRAC.</td>
</tr>
<tr>
  <td>666-06-02</td>
  <td>MV VAZQUEZ XV</td>
  <td>RITIRO</td>
  <td>BAIA 1</td>
  <td>PARTITO</td>
</tr>
<tr>
  <td>666-06-01</td>
  <td>MV VAZQUEZ XV</td>
  <td>RITIRO</td>
  <td>BAIA 1</td>
  <td>ATTRAC.</td>
</tr>
    </table>
    `;

    createTypeWriterMenu(menu, "< INDIETRO", menuHome)
}

// HOME -> CONTROLLI
const menuControls = function () {
    if (navigation_enabled === false)
        return
    let menu = document.getElementById('menu');
    menu.innerHTML = ""

    setTimeout(function () {
        disableNavigation();
        typeWriterSequence([
            () => { createTypeWriterMenu(menu, "- PORTELLONI", menuAirlocks) },
            () => { createTypeWriterMenu(menu, "- DOCCE", menuShowers) },
            () => { createTypeWriterMenu(menu, "- SISTEMA [A]", menuSystem) },
            () => { createTypeWriterMenu(menu, "< INDIETRO", menuHome) },
            enableNavigation
        ])
    }, 200);
}

const getAirlockStatus = function (flag) {
    return flag ? "CHIUSO" : "APERTO"
}

const toggleAirlock1 = function (flag) {
    //context.lock_docking_bay_1 = !context.lock_docking_bay_1
    //menuAirlocks()
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

// HOME -> CONTROLLI -> PORTELLONI
const menuAirlocks = function () {
    if (navigation_enabled === false)
        return
    let menu = document.getElementById('menu');
    menu.innerHTML = ""

    setTimeout(function () {
        disableNavigation();
        typeWriterSequence([
            () => { createTypeWriterMenu(menu, `- BAIA 1 [${getAirlockStatus(context.lock_docking_bay_1)}]`, toggleAirlock1) },
            () => { createTypeWriterMenu(menu, `- BAIA 2 [${getAirlockStatus(context.lock_docking_bay_2)}]`, toggleAirlock2) },
            () => { createTypeWriterMenu(menu, `- ASCENSORE MINIERA [${getAirlockStatus(context.lock_mineshaft)}]`, toggleMineshaft) },
            () => { createTypeWriterMenu(menu, "< INDIETRO", menuControls) },
            enableNavigation
        ])
    }, 200);
}

const getOnOffStatus = function (flag) {
    return flag ? "ON" : "OFF"
}

const toggleShower = function (index) {
    if (index === 4) {
        // questa doccia non funziona
        showError("[DOCCIA 5 FUORI SERVIZIO.]")
        playSfx('errorsfx').play()
    } else {
        context.showers[index] = !context.showers[index]
        menuShowers()
    }
}

// HOME -> CONTROLLI -> DOCCE
const menuShowers = function () {
    if (navigation_enabled === false)
        return
    let menu = document.getElementById('menu');
    menu.innerHTML = ""

    let showers = context.showers.map(
        (v, i) => {
            return () => createTypeWriterMenu(menu, `- DOCCIA ${i + 1} [${getOnOffStatus(v)}]`, () => toggleShower(i))
        }
    )

    showers.push(() => { createTypeWriterMenu(menu, "< INDIETRO", menuControls) })
    showers.push(enableNavigation)

    setTimeout(function () {
        disableNavigation();
        typeWriterSequence(showers)
    }, 200);
}

// HOME -> CONTROLLI -> SISTEMA [A]
// Questo menu' necessita dei permessi di admin
const menuSystem = function () {
    if (navigation_enabled === false)
        return
    if (context.is_admin === false) {
        showError("[ACCESSO VIETATO, RICHIESTO BADGE AMMINISTRATORE]")
        playSfx('errorsfx')
        return
    }

    let menu = document.getElementById('menu');
    menu.innerHTML = ""

    setTimeout(function () {
        disableNavigation();
        typeWriterSequence([
            () => { createTypeWriterText(menu, `[ACCESSO CONSENTITO, BENTORNATA, SONYA]`, `color: green`) },
            () => { createTypeWriterMenu(menu, `- SUPPORTO VITALE`, menuLifeSupport) },
            () => { createTypeWriterMenu(menu, `- AUTO DISTRUZIONE`, menuSelfDestruct) },
            () => { createTypeWriterMenu(menu, "< INDIETRO", menuControls) },
            enableNavigation
        ])
    }, 200);
}

// HOME -> CONTROLLI -> SISTEMA [A] -> SUPPORTO VITALE
const menuLifeSupport = function () {
    if (navigation_enabled === false)
        return

    if (context.is_admin === false) {
        showError("[ACCESSO VIETATO, RICHIESTO BADGE AMMINISTRATORE]")
        playSfx('errorsfx')
        return
    }

    let menu = document.getElementById('menu');
    menu.innerHTML = ""

    setTimeout(function () {
        disableNavigation();
        typeWriterSequence([
            () => { createTypeWriterMenu(menu, `- SUPPORTO VITALE [${getOnOffStatus(context.life_support)}]`, menuDisableLifeSupport) },
            () => { createTypeWriterMenu(menu, "< INDIETRO", menuControls) },
            enableNavigation
        ])
    }, 200);
}

const menuDisableLifeSupport = function () {
    if (navigation_enabled === false)
        return

    if (context.is_admin === false) {
        showError("[ACCESSO VIETATO, RICHIESTO BADGE AMMINISTRATORE]")
        playSfx('errorsfx')
        return
    }

    if (context.life_support === true) {

        let menu = document.getElementById('menu');
        menu.innerHTML = ""

        setTimeout(function () {
            disableNavigation();
            typeWriterSequence([
                () => { createTypeWriterText(menu, 
                    `[ATTENZIONE, DISABILITARE IL SUPPORTO VITALE SENZA AUTORIZZAZIONE È CONTRO LE POLICY DI SICUREZZA. ASSICURATEVI DI COMPILARE IL MODULO 077-X24 IN OGNI SUO CAMPO E INVIARLO AL SUPERVISORE.]`, 
                    `color: red`)
                     },
                () => { createTypeWriterMenu(menu, "CONFERMA", () => {context.life_support = false; menuLifeSupport()}) },
                () => { createTypeWriterMenu(menu, "< INDIETRO", menuControls) },
                enableNavigation
            ])
        }, 200);
    } else {
        context.life_support = true
        menuLifeSupport()
    }
}

function getConfirmationStr(flag) {
    return flag ? "x" : " "
}

function toggleSelfDestructConfirm(index) {
    context.self_destruct_confirm[index] = !context.self_destruct_confirm[index]
    menuSelfDestruct()
}

// HOME -> CONTROLLI -> SISTEMA [A] -> AUTO DISTRUZIONE
const menuSelfDestruct = function () {
    if (navigation_enabled === false)
        return

    if (context.is_admin === false) {
        showError("[ACCESSO VIETATO, RICHIESTO BADGE AMMINISTRATORE]")
        playSfx('errorsfx')
        return
    }

    let menu = document.getElementById('menu');
    menu.innerHTML = ""    

    if (context.self_destruct_confirm.every((x) => x === true)) {

        setTimeout(function () {
            disableNavigation();
            typeWriterSequence([
                () => { createTypeWriterText(menu, 
                    `[SEQUENZA AUTO DISTRUZIONE ATTIVATA. LA STAZIONE DETONERÀ IN 10 MINUTI. ABBANDONARE LA STAZIONE.]`, 
                    `color: red`)
                        },
                () => { createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[0])}]`, () => toggleSelfDestructConfirm(0)) },
                () => { createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[1])}]`, () => toggleSelfDestructConfirm(1)) },
                () => { createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[2])}]`, () => toggleSelfDestructConfirm(2)) },
                () => { createTypeWriterMenu(menu, "< INDIETRO", menuControls) },
                enableNavigation
            ])
            playSfx('selfdestructsfx')
        }, 200);

        return
    }

    setTimeout(function () {
        disableNavigation();
        typeWriterSequence([
            () => { createTypeWriterText(menu, 
                `[ATTENZIONE, IL PROCESSO DI AUTODISTRUZIONE DETONERÀ LA STAZIONE ENTRO 10 MINUTI. SE CONFERMATO IL PROCESSO DIVENTERÀ IRREVERSIBILE DOPO 5 MINUTI.]`, 
                `color: red`)
                    },
            () => { createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[0])}]`, () => toggleSelfDestructConfirm(0)) },
            () => { createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[1])}]`, () => toggleSelfDestructConfirm(1)) },
            () => { createTypeWriterMenu(menu, `CONFERMA [${getConfirmationStr(context.self_destruct_confirm[2])}]`, () => toggleSelfDestructConfirm(2)) },
            () => { createTypeWriterMenu(menu, "< INDIETRO", menuControls) },
            enableNavigation
        ])
    }, 200);
    
}

// HOME -> PERSONALE
const menuRoster = function () {
    if (navigation_enabled === false)
        return
    let menu = document.getElementById('menu');
    menu.innerHTML = `
    <table>
<tr>
  <th>Matricola</th>
  <th>Nome</th>
  <th>Ruolo</th>
</tr>
<tr>
  <td>01</td>
  <td>VERHOEVEN, SONYA</td>
  <td>TEAM LEADER</td>
</tr>
<tr>
  <td>02</td>
  <td>SINGH, ASHRAF</td>
  <td>MINATORE</td>
</tr>
<tr>
  <td>03</td>
  <td>DE BEERS, DANA</td>
  <td>CAPO TRIVELLATORE</td>
</tr>
<tr>
  <td>04</td>
  <td>HUIZINGA, JEROME</td>
  <td>ASST. TRIVELLATORE</td>
</tr>
<tr>
  <td>05</td>
  <td>TOBIN, ROSA</td>
  <td>INGEGNERE MINERARIO</td>
</tr>
<tr>
  <td>06</td>
  <td>MIKKELSEN, MICHAEL</td>
  <td>INGEGNERE MINERARIO</td>
</tr>
<tr>
  <td>07</td>
  <td>KANTARO, KENJI</td>
  <td>MAGAZZINIERE</td>
</tr>
<tr>
  <td>08</td>
  <td>OBOWE, MORGAN</td>
  <td>MAGAZZINIERE</td>
</tr>
<tr>
  <td>09</td>
  <td>KENBISHI, RIE</td>
  <td>PUTTER</td>
</tr>
<tr>
  <td>10</td>
  <td>-------</td>
  <td>N/A</td>
</tr>
    </table>
    `;

    createTypeWriterMenu(menu, "< INDIETRO", menuHome)
}

// HOME -> COMUNICAZIONI
const menuComms = function () {
    if (navigation_enabled === false)
        return
    let menu = document.getElementById('menu');
    menu.innerHTML = ``

    setTimeout(function () {
        disableNavigation();
        typeWriterSequence([
            () => { createTypeWriterText(menu, `SCANSIONE NAVI IN PROSSIMITÀ...`)},
            () => { createTypeWriterMenu(menu, `- CONTATTO RSV THE HERACLES`) },
            () => { createTypeWriterMenu(menu, `- CONTATTO IMV THE TEMPEST`) },
            () => { createTypeWriterMenu(menu, "< INDIETRO", menuHome) },
            enableNavigation
        ])
    }, 200);
}

