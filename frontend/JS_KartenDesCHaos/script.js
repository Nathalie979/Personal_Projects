//Reflexion ist im Überordner in einem Word-Dokument zu finden
"use strict";
//Variablenerstellung
let playerName, life, strength, magic, discards, turn, maxTurn, gameOmen;
let cardStat;
let cardCopy;
let omenCopy;

// Jede Karte besteht aus [Titel, Beschreibung, Wirkung, Bild, Stats, Anzahl der Karte im Deck] 10 Karten gesamt
const cards = [
    [
        "Fluch der Müdigkeit",
        "Ein Schleier aus Erschöpfung legt sich über dich.",
        "Du erhältst Magie -1",
        "Bilder/card_placeholder.png",
        {magic: -1},
        2
    ],
    [
        "Licht der Erkenntnis",
        "Ein helles Leuchten durchdringt deinen Geist.",
        "Du erhältst Magie +2",
        "Bilder/card_placeholder.png",
        {magic: +2},
        2
    ],
    [
        "Stille der Leere",
        "Alles wird ruhig. Zu ruhig.",
        "Nichts passiert – und doch alles.",
        "Bilder/card_placeholder.png",
        {},
        2
    ],
    [
        "Verlorene Erinnerung",
        "Du erinnerst dich.... oder doch nicht?",
        "Du erhältst Stärke -1",
        "Bilder/card_placeholder.png",
        {strength: -1},
        2
    ],
    [
        "Blutiger Schwur",
        "Macht hat ihren Preis.",
        "Du erhältst Stärke +4, Leben -3",
        "Bilder/card_placeholder.png",
        {strength: +4, life: -3},
        2
    ],
    [
        "Schimmer der Klarheit",
        "Plötzlich ist alles ganz klar.",
        "Du erhältst Magie +3",
        "Bilder/card_placeholder.png",
        {magic: +3},
        2
    ],
    [
        "Stimme aus der Tiefe",
        "Etwas will dich lenken",
        "Du erhältst Leben +1",
        "Bilder/card_placeholder.png",
        {life: +1},
        2
    ],
    [
        "Kraft der Ahnen",
        "Die Seelen deiner Vorfahren stärken dich.",
        "Du erhältst Stärke +2, Magie +1",
        "Bilder/card_placeholder.png",
        {strength: +2, magic: +1},
        2

    ],
    [
        "Der Preis des Wissens",
        "Wissen kostet - und du zahlst gern.",
        "Du erhältst Magie +2, Leben -1",
        "Bilder/card_placeholder.png",
        {magic: +2, life: -1},
        2
    ],
    [//soll nur 1x gezogen werden können
        "Zeit des Innehaltens",
        "Du reflektierst über deinen bisherigen Weg. Gefällt dir was du siehst?",
        "Du erhältst Abwurf +1",
        "Bilder/card_placeholder.png",
        {discards: +1},
        1
    ]


];
// die Omen für die Endereignisse
const strengthOmen = [
    ["Du vernimmst ein Grollen in der Ferne."],
    ["Die Luft bebt vor Kraft – doch du fühlst dich zerbrechlich."],
    ["Du siehst deine eigene Gestalt im Spiegel – verzerrt und schwach."],
    ["Dein ganzer Körper fühlt sich schwer an."],
    ["Ein Schrei ertönt in deinem Inneren. Er klingt wie dein eigener."]
];
const magicOmen = [
    ["Schatten flüstern dir Wissen zu – doch du verstehst nichts."],
    ["Du vergisst, wie du hierhergekommen bist."],
    ["Ein Symbol erscheint vor deinem inneren Auge. Dann verbrennt es."],
    ["Schatten flüstern dir Wissen zu – doch du verstehst nichts."],
    ["Etwas flüstert dir zu: 'Du willst nicht mehr. Du kannst nicht mehr. Du hältst das alles nicht mehr aus.'"]

];
const curseOmen = [
    ["Die Welt kippt. Alles schwankt. Du hältst dich mit Mühe auf den Beinen."],
    ["Du fühlst dich zu leicht. Oder doch zu schwer?"],
    ["Du wirst geblendet. Kurz darauf herrscht vollkommene Dunkelheit."],
    ["Du entdeckst ein Staubkorn, das perfekt in der Luft zu schweben scheint. Nichts was du tust, bringt es in Bewegung."],
    ["Die Welt fühlt sich falsch an. Du bist dir nicht sicher, ob du noch du bist."]
];

const drawCardButton = document.getElementById("draw"); //Fehler: das D bei ID gehört kleingeschrieben
const discardCardButton = document.getElementById("discard");
const applyEffectButton = document.getElementById("apply");
const rulesButton = document.getElementById("rules");

rulesButton.addEventListener("click", function () {
    customPrompt("🃏 Spielanleitung – Karten des Chaos", ruleText, [
        {
            label: "Schließen",
            onClick: () => {
                console.log("Regeln geschlossen");
            }
        }
    ]);
});

drawCardButton.addEventListener("click", function () {
    //karten einblenden
    document.getElementById("card").style.display = "block";
    document.getElementById("discard").style.display = "inline-block";
    //zeigt eine zufällige Karte aus dem Deck an
    drawCard();
});

discardCardButton.addEventListener("click", function () {
    if (discards > 0) {
        const cardContainer = document.getElementById("card");
        //sorgt dafür, dass der pulse-effekt beendet wird
        cardContainer.classList.remove("pulse-effekt");

        // 1. Seitliche Dreh-Animation starten
        cardContainer.classList.remove("wegwerf-effekt");
        void cardContainer.offsetHeight;
        cardContainer.classList.add("wegwerf-effekt");
        // 2. Nach Ende der Animation neue Karte anzeigen
        setTimeout(() => {
            cardContainer.classList.remove("wegwerf-effekt");
            drawCard();
            discards--;
            updatePlayerInfo();
        }, 600);
    }
    updatePlayerInfo();
});

applyEffectButton.addEventListener("click", function () {
    applyEffect();
    //nach dem 3. & 7. Zug erhält man Tips in Form von Omen (wenn man nicht in derselben Runde verliert)
    if (life !== 0) {
        if (turn === 3 || turn === 7) {
            //random Omen aus dem aktuellen Omen rausnehmen (nur 1x pro Spiel)
            const chance = Math.floor(Math.random() * omenCopy.length);
            const omenText = omenCopy[chance][0];
            if (turn === 3) {
                customPrompt("Du nimmst etwas wahr – nur ganz kurz.", omenText, [
                    {
                        label: "OK",
                        onClick: () => {
                            console.log("Omen Zug 3 geschlossen");
                        }
                    }
                ]);
            } else if (turn === 7) {
                customPrompt("Ein flüchtiger Moment voller Bedeutung.", omenText, [
                    {
                        label: "OK",
                        onClick: () => {
                            console.log("Omen Zug 7 geschlossen");
                        }
                    }
                ]);
            }
            omenCopy.splice(chance, 1);
        }
    }
    updatePlayerInfo();
})

//Start-game - Funktion + Namensabfrage
document.getElementById("startGame").addEventListener("click", () => {
    document.getElementById("startGame").style.display = "none";
    document.getElementById("introText").style.display = "none";
    nameInput();
});
const startGame = function (name) {
    playerName = name;// 1. bekommt den Namen aus der NameInput-Funktion
    life = 5; // 2. Setzt die Werte des Spielers auf die BasisWerte
    strength = 0;
    magic = 0;
    discards = 3;
    turn = 0;
    maxTurn = 10;
    gameOmen = "";//Omen resetten
    discardCardButton.disabled = false; //Button aktiv stellen
    cardCopy = []; //die kopierten Karten vor jedem Start leeren
    cardCopy = cards.map(card => [card[0],card[1],card[2],card[3],{...card[4]}, card[5]]); //klont den Array, um ihn verändern zu können
    randomizeOmen(); //3. Das finale Ereignis wird jetzt festgelegt

    //4. Spielerwerte + Button zum Kartenziehen eingeblendet -> danach die erste Karte
    document.getElementById("playerInfo").style.display = "inline";
    document.getElementById("draw").style.display = "inline-block";
    updatePlayerInfo();
}

function nameInput() {
    const welcomeField = document.getElementById("infoScreen");

    const label = document.createElement("label");
    label.textContent = "Wie lautet dein Name?";
    welcomeField.appendChild(label);

    const input = document.createElement("input");
    input.type = "text";
    input.id = "nameInput";
    welcomeField.appendChild(input);

    const button = document.createElement("button");
    button.textContent = "Bestätigen";
    button.addEventListener("click", () => {
        const name = input.value.trim();
        label.remove();
        input.remove();
        button.remove(); // Eingabe wieder entfernen
        if (name) {
            startGame(name); // Spiel mit Spielernamen starten
        } else {
            startGame("anonymer Spieler"); // Spiel mit dem Name "anonymer Spieler" starten
        }
    });
    welcomeField.appendChild(button);
}

function randomizeOmen() { //wählt zu Beginn des Spieles das Endereignis aus und steuert die Omen (Tips), die man im Spielverlauf erhält
    let random = Math.floor(Math.random() * (3)) + 1;
    if (random === 1) {
        gameOmen = strengthOmen;
    } else if (random === 2) {
        gameOmen = magicOmen;
    } else if (random === 3) {
        gameOmen = curseOmen;
    }
    omenCopy = [...gameOmen];
}

function increaseTurn() {
    if (turn < maxTurn) {
        turn++;
        updatePlayerInfo();
    }
}

function drawCard() {
    const index = Math.floor(Math.random() * cardCopy.length); // Fehler: math statt Math
    const card = cardCopy[index];
    const effect = card[4];
    cardStat = effect;
    console.log(`Kartenanzahl vorher: ${card[5]}`);
    console.log(`Länge Array vorher: ${cardCopy.length}`);
    //jedes Mal, wenn eine Karte gezogen wird, wird sie aus dem Deck entfernt (sie wird entweder weggeworfen oder verwendet)
    card[5]--;
    if (card[5] <= 0) {
        cardCopy.splice(index, 1); // Entfernt die Karte aus dem kopierten Deck, damit sie nicht mehr gezogen werden kann
    }
    console.log(`Kartenanzahl danach: ${card[5]}`);
    console.log(`Länge Array nachher: ${cardCopy.length}`);

    document.getElementById("cardTitle").innerText = card[0];
    document.getElementById("cardDescription").innerText = card[1];
    document.getElementById("cardEffect").innerText = card[2];
    document.getElementById("cardImg").src = card[3];

    // Animation hinzufügen
    const cardContainer = document.getElementById("card");
    cardContainer.classList.remove("magische-karte");
    void cardContainer.offsetWidth;
    cardContainer.classList.add("magische-karte");
    //"Ziehe eine Karte ausblenden" und "Karte anwenden" einblenden
    document.getElementById("draw").style.display = "none";
    document.getElementById("apply").style.display = "block";
    updatePlayerInfo();
}

function applyEffect() {
    console.log(cardStat);
    if (cardStat) {
        if (cardStat.life) life += cardStat.life;
        if (cardStat.strength) strength += cardStat.strength;
        if (cardStat.magic) magic += cardStat.magic;
        if (cardStat.discards) discards += cardStat.discards;
    }
    increaseTurn();
    updatePlayerInfo();

    // ✨ Animation beim Anwenden
    const cardContainer = document.getElementById("card");
    cardContainer.classList.remove("pulse-effekt");
    void cardContainer.offsetHeight;
    cardContainer.classList.add("pulse-effekt");

    // die nächste Karte einblenden
    drawCard();
}

function updatePlayerInfo() {
    document.getElementById("playerInfo").innerText =
        `🧙‍♂️ Willkommen, ${playerName}!\n\n❤️ Leben: ${life} | 🛡️ Stärke: ${strength}  | 🔮 Magie: ${magic} \n\n Zug: ${turn}/${maxTurn} | 🗑️ Abwürfe: ${discards}`;
    document.body.style.backgroundImage = "url('Bilder/background.png')"; //neues Hintergrundbild setzen

    if (discards > 0) {
        const cardContainer = document.getElementById("card");
        //Button funktional stellen, falls später abwürfe noch dazukommen (es gibt 1 Karte)
        discardCardButton.disabled = false;
    } else {
        //Button ausgrauen und unfunktional machen
        discardCardButton.disabled = true;
    }

    //nach dem letzten Zug (10.) kommt das Finale
    if (life > 0) { //falls im letzten Zug Leben auf 0
        if (turn === maxTurn) {
            GameEndWindow(); // alles ausblenden

            const endScreen = document.getElementById("endOfGame");
            endScreen.innerHTML = "";
            endScreen.style.display = "block";

            //Relevante Infos einblenden
            const h2 = document.createElement("h2");
            h2.textContent = "Die Zeit der Entscheidung ist gekommen...";
            endScreen.appendChild(h2);

            //gameOmen 1 = der Drache (testet Stärke) Stärke >= 5 Sieg | Stärke 3-4 verwundet überleben | Stärke < 3 Niederlage
            if (gameOmen === strengthOmen) {
                gameResult(gameOmen,
                    "Bilder/EndereignisDrache_card.png",
                    "Ein gewaltiger Drache erhebt sich vor dir. Deine Stärke wird über dein Schicksal entscheiden...",
                    "Du stehst da. Der Drache liegt am Boden.\n Du weißt nicht, wie du es geschafft hast. Deine Hände zittern, dein Körper brennt. Aber du hast durchgehalten. Vielleicht war es Glück. Vielleicht Wut. Es spielt keine Rolle – du bist noch da, und das zählt.",
                    "Du kämpfst tapfer gegen den Drachen, wirst aber schwer verwundet. Du überlebst – mit Narben kommst du davon und einer Geschichte, die dir vermutlich niemand glauben wird.",
                    "Deine Kräfte reichen nicht aus. Der Drache ist zu schnell. Zu stark. Plötzlich wird alles dunkel.",
                    strength
                )
            }
            //gameOmen 2 = Die Prüfung des Geistes (testet Magie) Magie >= 5 Sieg | Magie 3-4 verwundet überleben | Magie < 3 Niederlage
            if (gameOmen === magicOmen) {
                gameResult(gameOmen,
                    "Bilder/EndereignisMagie_card.png",
                    "Du befindest dich plötzlich in völliger Dunkelheit. Eine Stimme in deinem Kopf flüstert: 'Nur wer seinen Geist meistert, wird bestehen...'",
                    "Deine Gedanken sind klar wie Kristall. Du bestehst die Prüfung des Geistes mit Leichtigkeit. Weisheit erfüllt dich.",
                    "Dein Geist schwankt – Visionen, Stimmen, Zweifel. Doch du hältst stand. Du überlebst, verwirrt, aber verändert.",
                    "Deine Gedanken zerfallen wie Staub im Wind. Die Prüfung des Geistes überfordert dich – und du gehst darin unter.",
                    magic
                )
            }
            //gameOmen 3 = Der Fluch der Leere (testet Balance) Magie und Stärke ≥ 4 → Sieg | Eine Eigenschaft < 2 → Niederlage | Sonst → Überleben mit Konsequenzen
            if (gameOmen === curseOmen) {
                gameResult(gameOmen,
                    "Bilder/EndereignisFluch_card.png",
                    "Ein Riss öffnet sich in der Wirklichkeit. Schwarze Stille strömt heraus und umhüllt dich. Gedanken verblassen, Sinne lösen sich auf. Der Fluch der Leere prüft dein Gleichgewicht – und deinen Willen, weiterzugehen.",
                    "Du balancierst auf dem schmalen Grat zwischen Licht und Dunkelheit – und bleibst standhaft. Die Leere erkennt deine innere Harmonie und weicht vor dir zurück. Du hast nicht nur überlebt – du hast gemeistert, was viele zerbrochen hätte.",
                    "Du taumelst durch die Schatten, verlierst das Gefühl für Zeit und Richtung. Doch irgendwo in dir brennt ein Rest Klarheit. Es reicht, um den Weg zurück zu finden. Die Leere lässt dich gehen – verändert, aber lebendig.",
                    "Die Leere zerlegt dich Stück für Stück.\n Du spürst, wie deine Gedanken zerrinnen. Kein Schmerz. Kein Trost. Nur das Gefühl, dass etwas Wichtiges verloren geht – du selbst. Als alles verstummt, bleibt nichts zurück.",
                    magic, strength
                )
            }
        }
    }
    //-> Stats können nicht unter 0 fallen
    if (life < 0) {
        life = 0;
    }
    if (magic < 0) {
        magic = 0;
    }
    if (strength < 0) {
        strength = 0;
    }
    //-> Leben <=0 === Tod
    if (life === 0) {
        GameEndWindow(); //alles ausblenden
        //Endscreen einblenden
        const endScreen = document.getElementById("endOfGame");
        endScreen.innerHTML = "";
        endScreen.style.display = "block";

        //Überschrift des Endes einblenden
        const h2 = document.createElement("h2");
        h2.textContent = "Du hast es leider nicht bis zum Ende geschafft...";
        endScreen.appendChild(h2);
        newGameBtn(); //Button neues Spiel einblenden
    }
}

//Funktion zur Auswertung des Spielergebnisses
function gameResult(gameOmen, img, finaleTextString, resultWin, resultMiddle, resultLose, skill1, skill2) {
    const endScreen = document.getElementById("endOfGame");
    const finaleText = document.createElement("p");
    const bild = document.createElement("img");

    bild.src = img;
    finaleText.textContent = finaleTextString;
    endScreen.appendChild(bild);
    endScreen.appendChild(finaleText);

    const showResultBtn = document.createElement("button");
    showResultBtn.textContent = "Prüfung antreten";
    endScreen.appendChild(showResultBtn);
    showResultBtn.addEventListener("click", function () {
        //zuerst noch den Endscreen leeren
        endScreen.innerHTML = "";
        //die Überschrift
        const ueberschriftErgebnis = document.createElement("h2");
        endScreen.appendChild(ueberschriftErgebnis);

        const ergebnis = document.createElement("p");
        if (gameOmen === curseOmen) {
            //Fluch-Omen
            if (skill1 >= 5 && skill2 >= 5) {
                ergebnis.textContent = resultWin;
                ueberschriftErgebnis.textContent = "Du siegst!";
            } else if (skill1 < 3 || skill2 < 3) {
                ergebnis.textContent = resultLose;
                ueberschriftErgebnis.textContent = "Du verlierst!";
            } else {
                ergebnis.textContent = resultMiddle;
                ueberschriftErgebnis.textContent = "Du überlebst";
            }
            //Magie und Stärke ≥ 7 → Sieg
        } else {
            if (skill1 >= 7) {
                ergebnis.textContent = resultWin;
                ueberschriftErgebnis.textContent = "Du siegst!";
            } else if (skill1 >= 3) {
                ergebnis.textContent = resultMiddle;
                ueberschriftErgebnis.textContent = "Du überlebst!";
            } else {
                ergebnis.textContent = resultLose;
                ueberschriftErgebnis.textContent = "Du verlierst!";
            }
        }

        endScreen.appendChild(ergebnis);
        newGameBtn();
    })
}

//alles ausblenden, was nach Spielende nicht mehr benötigt wird
function GameEndWindow() {
    document.getElementById("card").style.display = "none";
    document.getElementById("apply").style.display = "none";
    document.getElementById("discard").style.display = "none";
}

function newGameBtn() {
    const endScreen = document.getElementById("endOfGame");
    const restartButton = document.createElement("button");
    restartButton.textContent = "Neues Spiel";
    endScreen.appendChild(restartButton);
    restartButton.addEventListener("click", () => {
        //
        document.body.style.backgroundImage = "url('Bilder/newGame_background.png')";
        document.getElementById("endOfGame").style.display = "none";
        document.getElementById("playerInfo").style.display = "none";
        document.getElementById("introText").style.display = "block";
        document.getElementById("startGame").style.display = "inline-block";
    })
}

function customPrompt(title, text, buttons) {
    document.getElementById("customPromptText").innerText = text;
    document.getElementById("customPromptTitle").innerText = title;

    const buttonContainer = document.getElementById("customPromptButtons");
    buttonContainer.innerHTML = "";

    buttons.forEach(btn => {
        const button = document.createElement("button");
        button.innerText = btn.label;
        button.addEventListener("click", () => {
            document.getElementById("customPrompt").style.display = "none";
            btn.onClick();
        });
        buttonContainer.appendChild(button);
    });

    document.getElementById("customPrompt").style.display = "flex";
}

const ruleText = `🎯 Ziel des Spiels

In Karten des Chaos stellst du dich einer Reihe zufälliger Begegnungen.
Du ziehst Karten, entscheidest über ihr Schicksal und baust dabei deine Werte auf –
immer mit Blick auf das große Finale, das über deinen Ausgang entscheidet.

Ziel ist es, das Spiel zu überstehen und am Ende bestmöglich auf die finale Prüfung vorbereitet zu sein.

🎮 So funktioniert das Spiel

    Du spielst 10 Runden.
    In jeder Runde ziehst du eine Karte.
    Die Karte hat eine Wirkung – sie kann alle deine Werte positiv oder negativ beeinflussen-

    Nach dem Ziehen entscheidest du:

        ✅ Einsetzen: Die Wirkung wird sofort ausgeführt.
        🗑️ Abwerfen: Du ignorierst die Karte.

    Zwischendurch erscheinen Omen, die Hinweise auf das mögliche Finale geben – mehr oder weniger hilfreich.
    Nach der letzten Karte tritt ein zufälliges Finale ein, das deine Werte prüft.

🧙‍♂️ Deine Werte

Zu Spielbeginn hast du:

    ❤️ Leben: 5
    🛡️ Stärke: 0
    🔮 Magie: 0
    🗑️ Abwürfe: 3

Die Abwürfe gelten nicht als Spielzug, aber die Karte wird aus dem Deck entfernt.
Die Karten, die du einsetzt, beeinflussen diese Werte. 

🔮 Die Omen

Während des Spiels erscheinen kryptische Hinweise auf das mögliche Finale.
Sie können dir helfen, dich vorzubereiten – oder dich bewusst in die Irre führen.
Was du daraus machst, liegt bei dir.

💥 Das Finale

Am Ende erwartet dich ein zufällig gewähltes finales Ereignis.
Dort wird geprüft, ob du mit deinen Entscheidungen gut vorbereitet bist:

🐲 Der Drache → Testet deine Stärke  
🧠 Die Prüfung des Geistes → Testet deine Magie  
💀 Der Fluch der Leere → Testet Balance zwischen Stärke und Magie


🏁 Spielende

Das Spiel endet nach dem Finale.
Ob du gesiegt, überlebt oder verloren hast –
jede Partie erzählt ihre eigene kleine Geschichte.

🧾 Tipp

Denk gut nach, welche Karten du einsetzt und welche du lieber abwirfst –
du hast nur begrenzt Kontrolle über das Chaos.`;