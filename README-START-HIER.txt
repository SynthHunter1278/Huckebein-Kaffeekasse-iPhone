# Hans Huckebein Kaffeekasse – überarbeitete Testversion

## Installation / Veröffentlichung
1. ZIP entpacken.
2. Alle Dateien und Ordnerinhalte in das bestehende GitHub-Repository hochladen (vorher Repository sichern).
3. GitHub Pages wie bisher aus dem Hauptverzeichnis veröffentlichen.
4. Die App über die GitHub-Pages-Adresse öffnen – nicht direkt als `file://`.
5. Auf iPhone/Android im Browser „Zum Home-Bildschirm“ / „App installieren“ wählen.

## Zugangscode
Den gemeinsamen Freischaltcode erhältst du separat in der Chat-Antwort. Trage ihn an die Kollegen weiter, die die App benutzen sollen. Er wird auf jedem Gerät einmal eingegeben. Die Freischaltung wird lokal gespeichert. „Gerät abmelden“ entfernt nur die Freischaltung; Guthaben und Buchungen bleiben auf dem Gerät.

**Sicherheitsgrenze:** Diese Version hat absichtlich keinen Server. Deshalb kann ein Zugangsschutz im Browser nicht wie eine serverseitige Anmeldung geschützt werden. Ein technisch versierter Besucher kann den Code-Prüfmechanismus umgehen oder lokalen Speicher ändern. Der Code ist eine Hürde gegen zufällige Besucher, kein Schutz gegen gezielte Manipulation. Der Code sollte nicht als Schutz für Geldbeträge oder vertrauliche Daten verstanden werden.

## Guthaben / Daten
- Guthaben, Name, verwendete Codes und Frühstücksbuchung bleiben lokal im Browser bzw. auf dem jeweiligen Gerät.
- Es gibt keine Synchronisation zwischen Geräten und keine zentrale Wiederherstellung.
- Browserdaten löschen kann Guthaben und Buchungsverlauf löschen.
- Die bestehende Aufladecode-Logik ist weiterhin eine lokale Prüflogik und kann ohne Server nicht gegen Code-Erzeugung oder Mehrfachverwendung auf verschiedenen Geräten abgesichert werden.

## Adminbereich
`admin.html` separat öffnen. Der Adminbereich fragt nach einem GitHub Fine-grained Personal Access Token. Der Token wird nur im Arbeitsspeicher der geöffneten Admin-Seite gehalten und nicht in `localStorage` gespeichert.

Benötigte Token-Berechtigung für genau dieses Repository: **Contents: Read and write**. Den Token niemals in `index.html`, `config.json` oder in ein öffentliches GitHub-Repository eintragen.

Der Adminbereich schreibt weiterhin die Datei `config.json` über die GitHub-API. Die API-Adresse und das Konfigurationsschema wurden korrigiert.

## Getestete Ausgangswerte
Die vorhandenen Preise und EmailJS-/PayPal-Einstellungen wurden aus dem ursprünglichen Projekt übernommen. E-Mail-Versand und PayPal-Zahlung müssen nach dem Upload mit einer echten Testbuchung geprüft werden; diese externen Dienste können nicht allein durch einen lokalen Quellcode-Test bestätigt werden.
