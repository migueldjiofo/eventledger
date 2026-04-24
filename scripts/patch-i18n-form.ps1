$AppPath = "C:\Users\migue\Projets\eventledger\src\App.jsx"

if (!(Test-Path $AppPath)) {
  Write-Host "ERREUR: App.jsx introuvable: $AppPath" -ForegroundColor Red
  exit 1
}

$code = Get-Content $AppPath -Raw -Encoding UTF8

# Sauvegarde automatique
$backup = "$AppPath.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item $AppPath $backup
Write-Host "Backup créé: $backup" -ForegroundColor Green

# Remplacements formulaire
$replacements = @{
  '"Modifier l’événement"' = "{t.editEvent}"
  '"Créer un événement"' = "{t.createEvent}"
  '"Nom de l’événement"' = "{t.eventName}"
  '"Lieu"' = "{t.location}"
  '"Organisateur"' = "{t.organizer}"
  '"Lien PayPal, ex. https://paypal.me/nom"' = "{t.paypalLink}"
  '"Lien Revolut, ex. https://revolut.me/nom"' = "{t.revolutLink}"
  '"Compte bancaire / N26"' = "{t.bankAccount}"
  '"Nom du titulaire du compte"' = "{t.bankOwner}"
  '"IBAN"' = "{t.iban}"
  '"BIC (optionnel mais recommandé)"' = "{t.bic}"
  '"Motif du paiement, ex. Entrée soirée"' = "{t.bankReason}"
  '"Enregistrer les modifications"' = "{t.saveChanges}"
  '"Enregistrer l’événement"' = "{t.saveEvent}"
}

foreach ($key in $replacements.Keys) {
  $code = $code.Replace($key, $replacements[$key])
}

# Ajouter t dans EventForm si pas déjà présent
$code = $code.Replace(
  "function EventForm({ form, updateForm, saveEvent, close, editing })",
  "function EventForm({ form, updateForm, saveEvent, close, editing, t })"
)

# Passer t au composant EventForm
$code = $code.Replace(
  "editing={!!editingEvent}",
  "editing={!!editingEvent}`n            t={t}"
)

$code = $code.Replace(
  "editing={true}",
  "editing={true}`n              t={t}"
)

Set-Content $AppPath $code -Encoding UTF8

Write-Host "Patch i18n formulaire appliqué avec succès." -ForegroundColor Cyan
Write-Host "Relance ensuite: npm run dev" -ForegroundColor Yellow