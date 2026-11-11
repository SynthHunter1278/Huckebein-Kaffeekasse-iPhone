# Hans Huckebein Kaffeekasse – überarbeitete Testversion

## Installation / Veröffentlichung
1. ZIP entpacken.
2. Alle Dateien und Ordnerinhalte in das bestehende GitHub-Repository hochladen (vorher Repository sichern).
3. GitHub Pages wie bisher aus dem Hauptverzeichnis veröffentlichen.
4. Die App über die GitHub-Pages-Adresse öffnen – nicht direkt als `file://`.
5. Auf iPhone/Android im Browser „Zum Home-Bildschirm“ / „App installieren“ wählen.

## Zugangscode
Der gemeinsame vierstellige Freischaltcode lautet: **5831**. Trage ihn an die Kollegen weiter, die die App benutzen sollen. Er wird auf jedem Gerät einmal eingegeben. Die Freischaltung wird lokal gespeichert. „Gerät abmelden“ entfernt nur die Freischaltung; Guthaben und Buchungen bleiben auf dem Gerät.

**Sicherheitsgrenze:** Diese Version hat absichtlich keinen Server. Deshalb kann ein Zugangsschutz im Browser nicht wie eine serverseitige Anmeldung geschützt werden. Ein technisch versierter Besucher kann den Code-Prüfmechanismus umgehen oder lokalen Speicher ändern. Der Code ist eine Hürde gegen zufällige Besucher, kein Schutz gegen gezielte Manipulation. Der Code sollte nicht als Schutz für Geldbeträge oder vertrauliche Daten verstanden werden.

Nach der Rückkehr aus PayPal aktualisiert die App die öffentliche `config.json` erneut und blendet einen vorbereiteten Aufladecode direkt ein. Nach erfolgreichem Einlösen wird der Code aus dem Eingabefeld und dem lokalen Zwischenspeicher entfernt.

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

## Hinweise zur Admin-Korrektur
- Der Adminbereich lädt `config.json` zuerst über die GitHub-Contents-API und übernimmt dabei die aktuelle Datei-SHA.
- Die Speichern-Schaltfläche bleibt gesperrt, wenn das Einlesen der vorhandenen Datei fehlschlägt. Dadurch werden leere oder unvollständige Formularwerte nicht versehentlich über die Live-Konfiguration geschrieben.
- Vorübergehende Netzwerk-/GitHub-Fehler beim Lesen werden bis zu drei Mal erneut versucht. HTTP-Fehler (z. B. ungültiger Token, fehlende Berechtigung oder falscher Dateipfad) werden mit einer konkreteren Meldung angezeigt.
- Bei einer CORS-/Netzwerkfehlermeldung bitte die Admin-Seite über die veröffentlichte GitHub-Pages-Adresse öffnen (nicht per `file://`), die Verbindung prüfen und die Seite neu laden. Ein Browser-Add-on oder ein Unternehmensnetzwerk kann API-Aufrufe ebenfalls blockieren.
