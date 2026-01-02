# Mastermind – Python Konsolenspiel

## Projektkontext
Dieses Projekt ist eine **Python-Studienarbeit** und setzt das klassische Spielprinzip von **Mastermind** als **Konsolenanwendung** um.

Der Fokus liegt auf **Programmstruktur, Kontrollflüssen, Funktionen, Listenverarbeitung und Benutzereingaben**.  
Es handelt sich **nicht** um ein grafisches Spiel oder ein kommerzielles Produkt.

---

## Aufgabenstellung
Umsetzung eines textbasierten Mastermind-Spiels mit:
- zufällig generierter Zahlenkombination
- mehreren Schwierigkeitsstufen
- begrenzter Rundenzahl
- Feedback in Form von Hinweisen (rot / weiß)

Zusätzlich sollte das Spiel modular aufgebaut und erweiterbar sein.

---

## Projektziel
- Anwendung grundlegender Python-Konzepte
- saubere Trennung von Spiellogik und Ein-/Ausgabe
- Einsatz von Funktionen zur Strukturierung
- Umgang mit Listen und Schleifen
- robuste Eingabevalidierung
- Verwaltung von Spielzuständen

---

## Meine Leistungen

### Spiellogik
- Generierung von Zahlenkombinationen abhängig vom Schwierigkeitsgrad
- Auswertung der Spielzüge mittels roter und weißer Hinweise
- Gewinn- und Verlustbedingungen
- Begrenzung der maximalen Spielrunden

---

### Spielmodi
- **Normal:** Zahlen 1–8, keine Duplikate  
- **Schwer:** Zahlen 1–8, eine Zahl kann doppelt vorkommen  
- **Hölle:** Zahlen 1–9, eine Zahl kann doppelt vorkommen  

---

### Benutzerinteraktion
- textbasiertes Hauptmenü
- Eingabevalidierung mit Fehlermeldungen
- Anzeige vorheriger Runden
- optionale Spielregelerklärung
- Debug-Modus zur Entwicklungsunterstützung

---

### Highscore-System
- getrennte Highscores pro Schwierigkeitsgrad
- Speicherung der besten Ergebnisse (Top 5)
- Sortierung der Highscores nach benötigten Runden

---

## Technischer Fokus
- Python (Konsolenanwendung)
- Funktionen und Kontrollstrukturen
- Listen und Kopien zur Zustandsverwaltung
- Schleifen und Bedingungen
- Fehlerbehandlung (`try / except`)
- einfache Sortierlogik (Bubble Sort)
- optionale Textformatierung im Terminal

---

## Projektstruktur
- `mastermind.py` – vollständige Spiellogik, Menüführung und Highscore-Verwaltung

---

## Hinweis zur Einordnung
Dieses Projekt ist eine **lernorientierte Python-Anwendung**.  
Der Schwerpunkt liegt auf **Logik und Struktur**, nicht auf grafischer Darstellung oder Performance.

---

## Projektstatus
Abgeschlossen.
