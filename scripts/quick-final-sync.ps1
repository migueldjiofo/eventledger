$Project = "C:\Users\migue\Projets\eventledger"
$App = "$Project\src\App.jsx"

cd $Project

if (!(Test-Path $App)) {
  Write-Host "ERREUR: App.jsx introuvable" -ForegroundColor Red
  exit 1
}

$backup = "$App.backup_final_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item $App $backup
Write-Host "Backup créé: $backup" -ForegroundColor Green

$code = Get-Content $App -Raw -Encoding UTF8

# 1) registerPayment déjà compatible Supabase normalement
$code = $code -replace 'payment\.eventId', 'payment.event_id'
$code = $code -replace 'payment\.createdAt', 'payment.created_at'

# 2) Sync expenses: remplacer addExpense
$code = [regex]::Replace($code, 'function addExpense\(e\) \{[\s\S]*?\n  \}', @'
async function addExpense(e) {
    e.preventDefault();

    if (!selectedEvent) return;

    const value = Number(expenseForm.amount);

    if (!value || value <= 0) {
      alert("Veuillez entrer un montant de dépense valide.");
      return;
    }

    const payload = {
      event_id: selectedEvent.id,
      category: expenseForm.category,
      detail: expenseForm.detail,
      amount: value,
      paid: expenseForm.paid,
    };

    const { data, error } = await supabase
      .from("expenses")
      .insert([payload])
      .select();

    if (error) {
      console.error("Erreur dépense Supabase:", error);
      alert(error.message);
      return;
    }

    const newExpense = data[0];

    setExpenses((prev) => [newExpense, ...prev]);

    setExpenseForm({
      category: "DJ",
      detail: "",
      amount: "",
      paid: true,
    });
  }
'@)

# 3) Sync deleteExpense
$code = [regex]::Replace($code, 'function deleteExpense\(expenseId\) \{[\s\S]*?\n  \}', @'
async function deleteExpense(expenseId) {
    const confirmed = window.confirm("Supprimer cette dépense ?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expenseId);

    if (error) {
      console.error("Erreur suppression dépense Supabase:", error);
      alert(error.message);
      return;
    }

    setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
  }
'@)

# 4) event_id pour expenses
$code = $code -replace 'expense\.eventId', 'expense.event_id'

# 5) created_at pour expenses/payments si besoin
$code = $code -replace 'expense\.createdAt', 'expense.created_at'

# 6) Désactiver sauvegarde localStorage automatique sans casser le chargement local existant
$code = [regex]::Replace($code, 'useEffect\(\(\) => \{\s*if \(!isLoaded\) return;[\s\S]*?localStorage\.setItem\("eventledger_cashData", JSON\.stringify\(cashData\)\);\s*\}, \[isLoaded, events, payments, expenses, cashData\]\);', @'
useEffect(() => {
    // Cloud mode: Supabase is now the source of truth.
    // localStorage persistence disabled to avoid device-specific conflicts.
  }, [isLoaded, events, payments, expenses, cashData]);
'@)

Set-Content $App $code -Encoding UTF8

Write-Host "Patch appliqué." -ForegroundColor Cyan

Write-Host "Test build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "ERREUR: build échoué. Restaure le backup si nécessaire:" -ForegroundColor Red
  Write-Host $backup -ForegroundColor Red
  exit 1
}

Write-Host "Build OK." -ForegroundColor Green

git add .
git commit -m "final sync expenses and cloud mode"
git push

Write-Host "Push OK. Va sur Vercel et attends le redeploiement Ready." -ForegroundColor Green
Write-Host "Teste ensuite l'app sur PC + iPad avec le dernier lien Vercel." -ForegroundColor Cyan