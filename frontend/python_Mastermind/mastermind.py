import random
from colored import fg, bg, attr #um Text zu stylen
#gestylter Text
text_bold = attr("bold")
text_reset = attr("reset")
text_mainMenu = bg("blue") + fg("white")
text_error = fg("red")
text_bgError = bg("red")
text_highlight = bg("green")


#Variablen
continuePlaying = True
turns = 8 #Anzahl Spielrunden
global debugMode
debugMode = False

# Listen
allUserGuesses = []
allRedTips = []
allWhiteTips = []

# Listen für Highscores (sollen NICHT nach jedem Spiel resetten)
HighscoresNormal = []
HighscoresHard =  []
HighscoresHell = []


###Start der Funktionen

#Horizontale Linie drucken
def horizontalLine():
    print("_________________________________________________________________________\n")

#kleines Feuerwerk wenn man gewinnt
def winCelebration():
    print("                                            .''.       ")
    print("                .''.      .        *''*    :_\\/_:     . ")
    print("                :_\\/_:   _\\(/_  .:.*_\\/_*   : /\\ :  .'.:.'.")
    print("            .''.: /\\ :   ./)\\   ':'* /\\ * :  '..'.  -=:o:=-")
    print("            :_\\/_:'.:::.    ' *''*    * '.\\'/.' _\\(/_'.':'.'")
    print("            : /\\ : :::::     *_\\/_*     -= o =-  /)\\    '  *")
    print("            '..'  ':::'     * /\\ *     .'/.\\'.   '")
    print("                *            *..*         :")
    print("                    *")
    print("                    *")

#Spielregeln erklären
def gameRules():
    print(f" \n\t\t {text_mainMenu} Spielregeln {text_reset}\n\n")
    print("Das Ziel des Spieles ist, in möglichst wenigen Schritten eine Computergenerierte Kombination zu knacken.")
    print(f"\n\n{text_highlight}Generelle Spielregeln:{text_reset}\n")
    print("Der Computer generiert die 4-Stellige Kombination, die Zahlen zwischen 1 und 8 beinhaltet.")
    print("Jede Zahl kann nur einmal vorkommen.")
    print("Hast du nach 8 Zügen die Kombination noch immer nicht geknackt, hast du das Spiel verloren.\n")
    print("Nach Eingabe deines Rateversuchs erhältst du Tipps, wie nahe dran du an der richtigen Kombination bist.\n")
    print("Weißer Tipp: enthält die Zahl von 1-4. Bekommst du weiße Tips, bedeutet das, das eine Zahl stimmt, aber sich an der falschen Position befindet.")
    print("Roter Tipp: enthält die Zahl von 1-4. Bekommst du rote Tips, bdeutet das, dass eine richtige Zahl sich an der richtigen Position befindet.\n")
    print("Hast du die Kombination vor Ablauf der 8 Runden geknackt, hast du gewonnen.")
    print(f"\n\n{text_highlight}Änderungen im Schweren Modus:{text_reset}\n")
    print("In diesem Modus kann es sein, dass eine Zahl doppelt vorkommt.")
    print(f"\n\n{text_highlight}Änderungen im Hölle Modus:{text_reset}\n")
    print("In diesem Modus kommt zu einer möglichen doppelten Zahl auch noch dazu, dass Zahlen zwischen 1 und 9 möglich sind.")
    horizontalLine()

#Initialize -> um beim nächsten Spiel die Listen frisch zu machen
def init():
    allUserGuesses = []
    allRedTips = []
    allWhiteTips = []
    return allUserGuesses, allRedTips, allWhiteTips

def startDebugMode():
    global debugMode
    debugMode = True

def stopDebugMode():
    global debugMode
    debugMode = False

#generiert die Kombination zum Knacken abhängig vom gewählten Schwierigkeitsgrad
# 1... Normal Mode
# 2... Hard Mode
# 3... Hell Mode
def generateCombination(gameMode):
    COMList = []  # zurücksetzen
    if gameMode == 1:
        #Kombination wird generiert für Normalen Schwierigkeitsgrad | keine doppelten Zahlen!
        COMList = random.sample(range(1,8), 4) 
    elif gameMode == 2:
        #Kombination wird generiert für Schweren Schwierigkeitsgrad | EINE Zahl kann doppelt sein!
        COMList = random.sample(range(1,8),3)
        COMList.append(random.randint(1,8))
        random.shuffle(COMList) 
    elif gameMode == 3:
        #Kombination wird generiert für Hölle Schwierigkeitsgrad | EINE Zahl kann doppelt sein & der Kombination kann aus Zahlen zwischen 1 & 9 bestehen
        COMList = random.sample(range(1,9),3)
        COMList.append(random.randint(1,9))
        random.shuffle(COMList)  
    
    if debugMode == True:
        print(f"{text_bgError}COM:{COMList}{text_reset}")                                                       ##Zum debuggen!
    print("Die Kombination wurde generiert, viel Spaß beim Tüfteln!\n\n")
    return COMList

def validateGuess(guess, gameMode):
    if gameMode == 3:
        if 1 <= guess <= 9:
            return True
        else:
            print(f"\n{text_error}Bitte gib eine Zahl zwischen 1 und 9 ein. {text_reset}\n")
            return False
    else:
        if 1 <= guess <= 8:
            return True
        else:
            print(f"\n{text_error}Bitte gib eine Zahl zwischen 1 und 8 ein. {text_reset}\n")
            return False

def getUserGuess(i, gameMode):
    while True:
        try:
            guess = int(input(f"Bitte Zahl {i + 1} eingeben:"))
            if validateGuess(guess, gameMode):
                return guess
        except ValueError:
            print(f"\n{text_error}Ungültige Eingabe. Bitte gib eine Zahl zwischen 1 und 8 ein.{text_reset}\n")

def confirmGuess(UserGuessList):
    while True:
        try:
            print("Deine eingegebenen Zahlen sind:", UserGuessList)
            print("\nMöchtest du diesen Tip so abgeben?")
            print("1. Ja")
            print("2. Nein, nochmal neu eingeben")
            guessComplete = int(input())
            if guessComplete == 1:
                return True
            elif guessComplete == 2:
                return False
            else:
                print(f"{text_error}Bitte gib 1 oder 2 ein, um deine gewünschte Option auszuwählen.{text_reset}\n")
        except ValueError:
            print(f"{text_error}Ungültige Eingabe. Bitte gib 1 oder 2 ein, um deine gewünschte Option auszuwählen.{text_reset}\n")

#Gibt die Anzahl der roten und weißen Tips aus
def countTips(UserGuessList, COMList, turn):
    #zurücksetzen der Werte
    whiteTips = 0
    redTips = 0
    tempCOMList = COMList.copy()  # Kopie erstellen, um Werte zu "verbrauchen"
    
    # Zuerst die roten Tips zählen |danach alle Werte entfernen die hier gezählt wurden 
    for i in range(len(UserGuessList)):
        if UserGuessList[i] == tempCOMList[i]:
            redTips += 1
            tempCOMList[i] = None  # gezählten Wert entfernen (um doppelzählung zu vermeiden)
    
    # Danach die weißen Tipps zählen (korrekte Werte an falschen Positionen)
    for i in range(len(UserGuessList)):
        if UserGuessList[i] in tempCOMList:
            whiteTips += 1
            tempCOMList[tempCOMList.index(UserGuessList[i])] = None  # gezählten Wert entfernen (um doppelzählung zu vermeiden)
    #In der letzten Spielrunde keine Hinweise mehr anzeigen
    if turn < 9 and redTips < 4:
        horizontalLine()
        print("Alles klar, hier sind deine Hinweise: ")
        print("Weiße Tips:", whiteTips)
        print("Rote Tips:", redTips)
    return whiteTips, redTips



def showHighscore(Highscores, gameMode):                                
    if gameMode == 1:
        print(f" {text_highlight} Highscores normaler Modus {text_reset}\n")
        if len(Highscores) == 0:
            print("Spiele den normalen Modus um hier einen Highscore zu erzielen!\n")
    elif gameMode == 2:
        print(f"\n {text_highlight} Highscores schwerer Modus {text_reset}\n")
        if len(Highscores) == 0:
            print("Spiele den schweren Modus um hier einen Highscore zu erzielen!\n")
    elif gameMode == 3:
        print(f"\n {text_highlight} Highscores hölle Modus {text_reset}\n")
        if len(Highscores) == 0:
            print("Spiele den hölle Modus um hier einen Highscore zu erzielen!\n")
    #Bubble-sort
    n = len(Highscores)
    swap = True
    while swap:
        swap = False
        for i in range(n-1):
            if Highscores[i][1] > Highscores[i+1][1]:
                Highscores[i], Highscores[i + 1] = Highscores[i + 1], Highscores[i]
                swap = True
    #alle ELemente über 5 entfernen:
    while len(Highscores) > 5:
        Highscores.pop()
    #Formatierung und Ausgabe
    for i, (name, runden) in enumerate(Highscores, start=1):
        print(f"{i}. Platz:  {name} - {runden} Runden")

#Highscores aufruf aus Hauptmenü
def highscores():
    print(f"\n\t\t {text_mainMenu} Highscores {text_reset}\n\n")
    showHighscore(HighscoresNormal, 1)
    showHighscore(HighscoresHard, 2)
    showHighscore(HighscoresHell, 3)
    horizontalLine()
    mainMenu(continuePlaying)

def saveHighscore(userName, turn, gameMode, HighscoresNormal, HighscoresHard, HighscoresHell):
    if gameMode == 1:
        newScore = (userName, turn)
        HighscoresNormal.append(newScore)
    elif gameMode == 2:
        newScore = (userName, turn)
        HighscoresHard.append(newScore)    
    elif gameMode == 3:
        newScore = (userName, turn)
        HighscoresHell.append(newScore) 
   


def printGameMode(gameMode):
    """Zeigt die Spielmodus-Informationen basierend auf dem gameMode an."""
    if gameMode == 1:
        print(f" \n\t {text_mainMenu} Spielmodus: Normal {text_reset}\n\n")
    elif gameMode == 2:
        print(f" \n\t {text_mainMenu} Spielmodus: Schwer {text_reset}\n\n")
        print("In diesem Modus kann es sein, dass eine Zahl in der Kombination zwei Mal vorkommt")
    elif gameMode == 3:
        print(f" \n\t {text_mainMenu} Spielmodus: Hölle {text_reset}\n\n")
        print("In diesem Modus kann es sein, dass eine Zahl in der Kombination zwei Mal vorkommt.")
        print("Zusätzlich können nun in der Kombination Zahlen zwischen 1 und 9 enthalten sein. Viel Glück!")

def printPreviousRounds(allUserGuesses, allWhiteTips, allRedTips):
    """Zeigt die vorherigen Runden und deren Ergebnisse an."""
    print(f"Deine bisherigen Versuche:\n")
    for round in range(len(allUserGuesses)):
        print(round+1, ". Runde: ", allUserGuesses[round], " \t Weiße Tips: ", allWhiteTips[round], " \t Rote Tips: ", allRedTips[round] )
    print("")

def getUserInput(gameMode):
    """Hauptfunktion für die Benutzereingabe, die die obigen Funktionen verwendet."""
    tryAgain = True
    while tryAgain:
        print("Bitte gib deinen Tip ab:")
        UserGuessList = []
        for i in range(4):
            guess = getUserGuess(i, gameMode)
            UserGuessList.append(guess)
        print("")  
        
        # Bestätigung des Tipps
        if confirmGuess(UserGuessList):
            tryAgain = False
            print("")
        else:
            print("Bitte gib nochmal deinen Tip ab.")
            
    return UserGuessList

def checkForWin(redTips, turn):
    if redTips == 4:
        if turn <= 2:
            print(f"Herzlichen Glückwunsch! Du hast die Kombination in {turn - 1} Runde geknackt!\n")
        else:
            print(f"Herzlichen Glückwunsch! Du hast die Kombination in {turn - 1} Runden geknackt!\n")
        winCelebration() 
        return True
    return False

def askForUsername(turn, gameMode):
    name = False
    while not name: 
        userName = str(input("\nBitte gib deinen Namen für die Highscore-Liste ein (bis zu 9 Zeichen möglich): "))
        if len(userName) > 0 and len(userName) < 10:
            saveHighscore(userName, turn - 1, gameMode, HighscoresNormal, HighscoresHard, HighscoresHell)
            print("\n\n")
            horizontalLine()
            name = True
        else:
            print(f"\n{text_error}Bitte wähle einen Usernamen, der zwischen 1 und 9 Zeichen hat{text_reset}\n") 

def startGame(gameMode):
    printGameMode(gameMode)
    
    allUserGuesses, allWhiteTips, allRedTips = init()
    COMList = generateCombination(gameMode)
    turn = 1
    win = False
    while turn <= 8 and not win:
        
        # Ausgabe der vorherigen Runden
        print(f">Runde {turn} von {turns}<\n")
        turn += 1

        if turn > 2:
            printPreviousRounds(allUserGuesses, allWhiteTips, allRedTips)
        
        # User Input
        UserGuessList = getUserInput(gameMode)
        if debugMode == True:
            print(f"{text_bgError}COM:{COMList}{text_reset}")#für Debug
        
        # Speicherung des Userinput und der Tips in Liste
        whiteTips, redTips = countTips(UserGuessList, COMList, turn)
        allWhiteTips.append(whiteTips)
        allRedTips.append(redTips)
        allUserGuesses.append(UserGuessList)
        horizontalLine()
        
        # Wenn gewonnen
        win = checkForWin(redTips, turn)
        if win:
            askForUsername(turn, gameMode)  # Nach Benutzernamen fragen und Highscore speichern
    if not win:
        print("Du hast es leider nicht rechtzeitig geschafft. Mehr Glück beim nächsten Mal!")
        print(f"Der gesuchte Code wäre: {COMList} gewesen.")
    
    mainMenu(continuePlaying)

# Die Spielschwierigkeit auswählen
def gameDifficulty():
    print(f" \n\t {text_mainMenu} Schwierigkeitsstufen {text_reset}\n\n")
    while True:
        print("Bitte wähle deinen gewünschten Schwierigkeitsgrad aus:\n")
        print("1. Normal")
        print("2. Schwer")
        print("3. Hölle")
        print("4. Erklär mir den Unterschied")
        print("5. Zurück zum Hauptmenü")
        try:
            UserInput = int(input())
            horizontalLine()
            if UserInput == 1:
                startGame(1)
                break
            elif UserInput == 2:
                startGame(2)
                break
            elif UserInput == 3:
                startGame(3)
                break
            elif UserInput == 4:
                gameRules()
                gameDifficulty()
                break
            elif UserInput == 5:
                mainMenu(continuePlaying)
                break
            else:
                print(f"{text_error}Bitte gibt eine gültige Zahl ein (1,2,3,4,5).{text_reset}\n")
        except ValueError:
            horizontalLine()
            print(f"{text_error}Bitte gib einen gütligen Wert ein (1,2,3,4) um auszuwählen, was du tun möchtest{text_reset}\n") 

#Hauptmenü
def mainMenu(continuePlaying):
    print(f"\n\t\t {text_mainMenu} ~Hauptmenü~ {text_reset}\n\n")
    while True:
        print("Bitte wähle aus den folgenden Möglichkeiten aus:\n")
        print("1. Spielen")
        print("2. Spielregeln erklären")
        print("3. Highscores")
        print("4. Spiel beenden")
        #UserInput im Hauptmenü
        try:
            UserInput = int(input())
            horizontalLine()
            if UserInput == 1:
                gameDifficulty()
                break
            elif UserInput == 2:
                gameRules()
                mainMenu(continuePlaying)
                break
            elif UserInput == 3:
                highscores()
                break
            elif UserInput == 4:
                continuePlaying = False
                print("Bis zum nächsten Mal!\n")  
                break
            elif UserInput == 111:
                startDebugMode()
            elif UserInput == 333:
                stopDebugMode()
            else:
                print(f"{text_error}Bitte gibt eine gültige Zahl ein (1,2,3,4).{text_reset}\n")
        except ValueError:
            horizontalLine()
            print(f"{text_error}Bitte gib einen gütligen Wert ein (1,2,3,4) um auszuwählen, was du tun möchtest{text_reset}\n")      
    return continuePlaying  


#Hauptprogramm
print("\n")
print("  ____________________________________________________")
print(" |                                                    |")
print(f" |\t{text_bold}        Willkommen bei Mastermind!{text_reset}\t      |")
print(" |____________________________________________________|\n\n\n\n")

mainMenu(continuePlaying)
