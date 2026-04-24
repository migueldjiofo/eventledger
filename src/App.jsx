import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Plus,
  CalendarDays,
  MapPin,
  User,
  WalletCards,
  X,
  ArrowLeft,
  CheckCircle2,
  Banknote,
  Pencil,
  Trash2,
  Landmark,
  ReceiptText,
} from "lucide-react";
import "./index.css";

const translations = {
  fr: {
	createEvent: "Créer un événement",
	editEvent: "Modifier l’événement",
	eventName: "Nom de l’événement",
	location: "Lieu",
	organizer: "Organisateur",
	paypalLink: "Lien PayPal",
	revolutLink: "Lien Revolut",
	bankAccount: "Compte bancaire / N26",
	bankOwner: "Nom du titulaire du compte",
	iban: "IBAN",
	bic: "BIC",
	bankReason: "Motif du paiement",
	saveEvent: "Enregistrer l’événement",
	saveChanges: "Enregistrer les modifications",
    subtitle: "Event Finance Tool",
    description:
      "Gestion des paiements, dépenses et bilans financiers après événement.",
    newEvent: "Nouvel événement",
    recentEvents: "Événements récents",
    noEvent: "Aucun événement créé",
    noEventText:
      "{t.noEventText}",
    globalSummary: "{t.globalSummary}",
    events: "{t.events}",
    confirmedTotal: "{t.confirmedTotal}",
    paymentLogic: "{t.paymentLogic}",
    paymentLogicText:
      "{t.paymentLogicText}",
    open: "Ouvrir",
    edit: "Modifier",
    delete: "Supprimer",
    unknownPlace: "Lieu non renseigné",
    unknownOrganizer: "Organisateur non renseigné",
	back: "Retour aux événements",
	event: "Événement",
	edit: "Modifier",
	delete: "Supprimer",
	qrPayment: "Paiement QR",
	amountToPay: "Montant à payer",
	paymentMethod: "Méthode de paiement",
	generateQR: "Générer le QR Code",
	confirmPayment: "Confirmer : paiement bien reçu",
	cashEnd: "Cash fin d’événement",
	expenses: "Dépenses",
	financialReport: "Bilan financier",
	totalIncome: "Total recettes",
	totalExpenses: "Total dépenses",
	profit: "Bénéfice / Perte",
  },
  de: {
	createEvent: "Veranstaltung erstellen",
	editEvent: "Veranstaltung bearbeiten",
	eventName: "Veranstaltungsname",
	location: "Ort",
	organizer: "Veranstalter",
	paypalLink: "PayPal-Link",
	revolutLink: "Revolut-Link",
	bankAccount: "Bankkonto / N26",
	bankOwner: "Kontoinhaber",
	iban: "IBAN",
	bic: "BIC",
	bankReason: "Verwendungszweck",
	saveEvent: "Veranstaltung speichern",
	saveChanges: "Änderungen speichern",
    subtitle: "Event-Finanztool",
    description:
      "Verwaltung von Zahlungen, Ausgaben und Finanzabrechnungen nach Veranstaltungen.",
    newEvent: "Neue Veranstaltung",
    recentEvents: "Letzte Veranstaltungen",
    noEvent: "Keine Veranstaltung erstellt",
    noEventText:
      "Erstelle deine erste Veranstaltung, um QR-Codes für PayPal, Revolut oder Banküberweisung zu generieren.",
    globalSummary: "Gesamtübersicht",
    events: "Veranstaltungen",
    confirmedTotal: "Bestätigter Gesamtbetrag",
    paymentLogic: "Zahlungslogik",
    paymentLogicText:
      "Zahlungen werden erst nach manueller Bestätigung durch die verantwortliche Person in der App erfasst.",
    open: "Öffnen",
    edit: "Bearbeiten",
    delete: "Löschen",
    unknownPlace: "Ort nicht angegeben",
    unknownOrganizer: "Veranstalter nicht angegeben",
	back: "Zurück zu den Veranstaltungen",
	event: "Veranstaltung",
	edit: "Bearbeiten",
	delete: "Löschen",
	qrPayment: "QR-Zahlung",
	amountToPay: "Zu zahlender Betrag",
	paymentMethod: "Zahlungsmethode",
	generateQR: "QR-Code generieren",
	confirmPayment: "Bestätigen: Zahlung erhalten",
	cashEnd: "Kasse am Ende",
	expenses: "Ausgaben",
	financialReport: "Finanzübersicht",
	totalIncome: "Gesamteinnahmen",
	totalExpenses: "Gesamtausgaben",
	profit: "Gewinn / Verlust",
  },
  en: {
	createEvent: "Create event",
	editEvent: "Edit event",
	eventName: "Event name",
	location: "Location",
	organizer: "Organizer",
	paypalLink: "PayPal link",
	revolutLink: "Revolut link",
	bankAccount: "Bank account / N26",
	bankOwner: "Account holder",
	iban: "IBAN",
	bic: "BIC",
	bankReason: "Payment reason",
	saveEvent: "Save event",
	saveChanges: "Save changes",
    subtitle: "Event Finance Tool",
    description:
      "Manage payments, expenses and post-event financial reports.",
    newEvent: "New event",
    recentEvents: "Recent events",
    noEvent: "No event created",
    noEventText:
      "Create your first event to generate PayPal, Revolut or bank QR codes.",
    globalSummary: "Global summary",
    events: "Events",
    confirmedTotal: "Confirmed total",
    paymentLogic: "Payment logic",
    paymentLogicText:
      "Payments are listed only after manual confirmation by the person responsible for the app.",
    open: "Open",
    edit: "Edit",
    delete: "Delete",
    unknownPlace: "Location not provided",
    unknownOrganizer: "Organizer not provided",
	back: "Back to events",
	event: "Event",
	edit: "Edit",
	delete: "Delete",
	qrPayment: "QR Payment",
	amountToPay: "Amount to pay",
	paymentMethod: "Payment method",
	generateQR: "Generate QR Code",
	confirmPayment: "Confirm: payment received",
	cashEnd: "End cash",
	expenses: "Expenses",
	financialReport: "Financial report",
	totalIncome: "Total income",
	totalExpenses: "Total expenses",
	profit: "Profit / Loss",
  },
};

function App() {
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [cashData, setCashData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [language, setLanguage] = useState("fr");

  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState("paypal");
  const [showQR, setShowQR] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    category: "DJ",
    detail: "",
    amount: "",
    paid: true,
  });

  const emptyForm = {
    name: "",
    date: "",
    location: "",
    organizer: "",
    paypalLink: "",
    revolutLink: "",
    bankOwner: "",
    iban: "",
    bic: "",
    bankReason: "",
  };

  const [form, setForm] = useState(emptyForm);
  const t = translations[language] || translations.fr;

  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem("eventledger_events");
      const savedPayments = localStorage.getItem("eventledger_payments");
      const savedExpenses = localStorage.getItem("eventledger_expenses");
      const savedCashData = localStorage.getItem("eventledger_cashData");
	  const savedLanguage = localStorage.getItem("eventledger_language");

      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedPayments) setPayments(JSON.parse(savedPayments));
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      if (savedCashData) setCashData(JSON.parse(savedCashData));
	  if (savedLanguage) setLanguage(savedLanguage);
    } catch (error) {
      console.error("Erreur chargement localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);
  

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("eventledger_events", JSON.stringify(events));
    localStorage.setItem("eventledger_payments", JSON.stringify(payments));
    localStorage.setItem("eventledger_expenses", JSON.stringify(expenses));
    localStorage.setItem("eventledger_cashData", JSON.stringify(cashData));
	localStorage.setItem("eventledger_language", language);
  }, [isLoaded, events, payments, expenses, cashData, language]);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function openCreateForm() {
    setEditingEvent(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(event) {
    setEditingEvent(event);
    setForm({
      name: event.name || "",
      date: event.date || "",
      location: event.location || "",
      organizer: event.organizer || "",
      paypalLink: event.paypalLink || "",
      revolutLink: event.revolutLink || "",
      bankOwner: event.bankOwner || "",
      iban: event.iban || "",
      bic: event.bic || "",
      bankReason: event.bankReason || "",
    });
    setShowForm(true);
  }

  function saveEvent(e) {
    e.preventDefault();

    if (editingEvent) {
      const updatedEvent = {
        ...editingEvent,
        ...form,
        updatedAt: new Date().toISOString(),
      };

      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id ? updatedEvent : event
        )
      );

      if (selectedEvent?.id === editingEvent.id) {
        setSelectedEvent(updatedEvent);
      }
    } else {
      const newEvent = {
        id: Date.now(),
        ...form,
        createdAt: new Date().toISOString(),
      };

      setEvents((prev) => [newEvent, ...prev]);
      setCashData((prev) => ({
        ...prev,
        [newEvent.id]: { startCash: "", endCash: "" },
      }));
    }

    setForm(emptyForm);
    setEditingEvent(null);
    setShowForm(false);
  }

  function deleteEvent(eventId) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cet événement ? Cette action supprimera aussi ses paiements et dépenses associés."
    );

    if (!confirmed) return;

    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    setPayments((prev) => prev.filter((payment) => payment.eventId !== eventId));
    setExpenses((prev) => prev.filter((expense) => expense.eventId !== eventId));

    setCashData((prev) => {
      const copy = { ...prev };
      delete copy[eventId];
      return copy;
    });

    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null);
    }

    setShowQR(false);
  }

  function getFinalAmount() {
    return Number(customAmount || amount);
  }

  function formatEuro(value) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(value || 0);
  }

  function cleanUrl(url) {
    return String(url || "").trim().replace(/\/$/, "");
  }

  function normalizeAmount(value) {
    return String(value || "0").replace(",", ".");
  }

  function normalizeIban(value) {
    return String(value || "").replace(/\s/g, "").toUpperCase();
  }

  function normalizeBic(value) {
    return String(value || "").replace(/\s/g, "").toUpperCase();
  }

  function generateSepaQrText() {
    if (!selectedEvent) return "";

    const owner = selectedEvent.bankOwner?.trim();
    const iban = normalizeIban(selectedEvent.iban);
    const bic = normalizeBic(selectedEvent.bic);
    const reason =
      selectedEvent.bankReason?.trim() ||
      `Paiement ${selectedEvent.name || "événement"}`;
    const finalAmount = normalizeAmount(getFinalAmount());

    if (!owner || !iban) return "";

    return [
      "BCD",
      "002",
      "1",
      "SCT",
      bic,
      owner,
      iban,
      `EUR${finalAmount}`,
      "",
      "",
      reason,
      "",
    ].join("\n");
  }

  function generatePaymentLink() {
    const finalAmount = normalizeAmount(getFinalAmount());

    if (!selectedEvent) return "";

    if (method === "paypal") {
      const baseUrl = cleanUrl(selectedEvent.paypalLink);
      if (!baseUrl) return "";
      return `${baseUrl}/${finalAmount}EUR`;
    }

    if (method === "revolut") {
      const baseUrl = cleanUrl(selectedEvent.revolutLink);
      if (!baseUrl) return "";
      return baseUrl;
    }

    if (method === "bank") {
      return generateSepaQrText();
    }

    return "";
  }

  function getMethodLabel(value) {
    if (value === "paypal") return "PayPal";
    if (value === "revolut") return "Revolut";
    if (value === "bank") return "Banque";
    return value;
  }

  function registerPayment() {
    if (!selectedEvent) return;

    const value = getFinalAmount();

    if (!value || value <= 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }

    const confirmed = window.confirm(
      `Confirmer que le paiement de ${formatEuro(value)} via ${getMethodLabel(
        method
      )} a bien été reçu ?`
    );

    if (!confirmed) return;

    const newPayment = {
      id: Date.now(),
      eventId: selectedEvent.id,
      amount: value,
      method,
      confirmedByUser: true,
      createdAt: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);
    setShowQR(false);
  }

  function getEventPayments(eventId) {
    return payments.filter((payment) => payment.eventId === eventId);
  }

  function getTotalByMethod(eventId, paymentMethod) {
    return getEventPayments(eventId)
      .filter((payment) => payment.method === paymentMethod)
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
  }

  function getTotalDigital(eventId) {
    return getEventPayments(eventId).reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    );
  }

  function updateCash(eventId, field, value) {
    setCashData((prev) => ({
      ...prev,
      [eventId]: {
        ...(prev[eventId] || { startCash: "", endCash: "" }),
        [field]: value,
      },
    }));
  }

  function getCashStart(eventId) {
    return Number(cashData[eventId]?.startCash || 0);
  }

  function getCashEnd(eventId) {
    return Number(cashData[eventId]?.endCash || 0);
  }

  function getCashReceived(eventId) {
    return Math.max(getCashEnd(eventId) - getCashStart(eventId), 0);
  }

  function addExpense(e) {
    e.preventDefault();

    if (!selectedEvent) return;

    const value = Number(expenseForm.amount);

    if (!value || value <= 0) {
      alert("Veuillez entrer un montant de dépense valide.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      eventId: selectedEvent.id,
      category: expenseForm.category,
      detail: expenseForm.detail,
      amount: value,
      paid: expenseForm.paid,
      createdAt: new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);

    setExpenseForm({
      category: "DJ",
      detail: "",
      amount: "",
      paid: true,
    });
  }

  function deleteExpense(expenseId) {
    const confirmed = window.confirm("Supprimer cette dépense ?");
    if (!confirmed) return;

    setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
  }

  function getEventExpenses(eventId) {
    return expenses.filter((expense) => expense.eventId === eventId);
  }

  function getTotalExpenses(eventId) {
    return getEventExpenses(eventId).reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
  }

  const paymentLink = selectedEvent ? generatePaymentLink() : "";

  if (selectedEvent) {
    const eventPayments = getEventPayments(selectedEvent.id);
    const eventExpenses = getEventExpenses(selectedEvent.id);

    const paypalTotal = getTotalByMethod(selectedEvent.id, "paypal");
    const revolutTotal = getTotalByMethod(selectedEvent.id, "revolut");
    const bankTotal = getTotalByMethod(selectedEvent.id, "bank");
    const digitalTotal = getTotalDigital(selectedEvent.id);

    const cashStart = cashData[selectedEvent.id]?.startCash || "";
    const cashEnd = cashData[selectedEvent.id]?.endCash || "";
    const cashReceived = getCashReceived(selectedEvent.id);

    const totalIncome = digitalTotal + cashReceived;
    const totalExpenses = getTotalExpenses(selectedEvent.id);
    const netProfit = totalIncome - totalExpenses;

    return (
      <main className="min-h-screen bg-slate-100 text-slate-900">
        <section className="mx-auto max-w-6xl px-6 py-8">
          <button
            onClick={() => {
              setSelectedEvent(null);
              setShowQR(false);
            }}
            className="mb-6 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm"
          >
            <ArrowLeft size={18} />
            {t.back}
          </button>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                  {t.event}
                </p>
                <h1 className="mt-2 text-4xl font-bold">
                  {selectedEvent.name}
                </h1>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(selectedEvent)}
                  className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 font-semibold text-slate-700"
                >
                  <Pencil size={18} />
                  {t.edit}
                </button>

                <button
                  onClick={() => deleteEvent(selectedEvent.id)}
                  className="flex items-center gap-2 rounded-2xl bg-red-100 px-4 py-3 font-semibold text-red-700"
                >
                  <Trash2 size={18} />
                  {t.delete}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-slate-600 md:grid-cols-3">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-4">
                <CalendarDays size={18} />
                {selectedEvent.date}
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-4">
                <MapPin size={18} />
                {selectedEvent.location || "Lieu non renseigné"}
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-4">
                <User size={18} />
                {selectedEvent.organizer || "Organisateur non renseigné"}
              </div>
            </div>
          </section>

          {showForm && (
            <EventForm
              form={form}
              updateForm={updateForm}
              saveEvent={saveEvent}
              close={() => {
                setShowForm(false);
                setEditingEvent(null);
                setForm(emptyForm);
              }}
              editing={true}
              t={t}
              t={t}
              t={t}
              t={t}
            />
          )}

          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold">{t.qrPayment}</h2>

                <div className="space-y-6">
                  <div>
                    <p className="mb-2 font-semibold">{t.amountToPay}</p>

                    <div className="mb-3 flex flex-wrap gap-2">
                      {[5, 10, 15, 20, 24, 50, 100].map((value) => (
                        <button
                          key={value}
                          onClick={() => {
                            setAmount(value);
                            setCustomAmount("");
                            setShowQR(false);
                          }}
                          className={`rounded-xl px-4 py-2 font-semibold ${
                            amount === value && customAmount === ""
                              ? "bg-sky-500 text-white"
                              : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          {value} €
                        </button>
                      ))}
                    </div>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Montant libre : ex. 37, 72, 100..."
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setShowQR(false);
                      }}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg font-semibold outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <p className="mb-2 font-semibold">{t.paymentMethod}</p>

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => {
                          setMethod("paypal");
                          setShowQR(false);
                        }}
                        className={`rounded-2xl px-4 py-3 font-bold ${
                          method === "paypal"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        PayPal
                      </button>

                      <button
                        onClick={() => {
                          setMethod("revolut");
                          setShowQR(false);
                        }}
                        className={`rounded-2xl px-4 py-3 font-bold ${
                          method === "revolut"
                            ? "bg-purple-600 text-white"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        Revolut
                      </button>

                      <button
                        onClick={() => {
                          setMethod("bank");
                          setShowQR(false);
                        }}
                        className={`rounded-2xl px-4 py-3 font-bold ${
                          method === "bank"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        Banque
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowQR(true)}
                    disabled={!paymentLink}
                    className="w-full rounded-2xl bg-sky-500 py-4 text-lg font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {t.generateQR}
                  </button>

                  {showQR && (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {getMethodLabel(method)}
                      </p>

                      <p className="mt-2 text-4xl font-black">
                        {formatEuro(getFinalAmount())}
                      </p>

                      {method === "paypal" && (
                        <p className="mx-auto mt-3 max-w-md rounded-2xl bg-blue-50 p-3 text-sm font-semibold text-blue-700">
                          Merci d’utiliser exclusivement l’option PayPal
                          “Friends & Family / Freunde & Familie”.
                        </p>
                      )}

                      {method === "revolut" && (
                        <p className="mx-auto mt-3 max-w-md text-sm text-orange-600">
                          Revolut.me redirige vers la bonne personne, mais le
                          montant peut devoir être saisi manuellement.
                        </p>
                      )}

                      {method === "bank" && (
                        <p className="mx-auto mt-3 max-w-md rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                          QR SEPA bancaire : l’invité peut scanner avec une app
                          bancaire compatible.
                        </p>
                      )}

                      <div className="mt-6 flex justify-center">
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                          <QRCodeSVG value={paymentLink} size={240} />
                        </div>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap break-all text-sm text-slate-500">
                        {paymentLink}
                      </p>

                      <button
                        onClick={registerPayment}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white"
                      >
                        <CheckCircle2 size={20} />
                        {t.confirmPayment}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Banknote className="text-emerald-600" size={32} />
                  <div>
                    <h2 className="text-2xl font-bold">{t.cashEnd}</h2>
                    <p className="text-sm text-slate-500">
                      À remplir après comptage de la caisse.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Cash au début (€)"
                    value={cashStart}
                    onChange={(e) =>
                      updateCash(selectedEvent.id, "startCash", e.target.value)
                    }
                    className="rounded-xl border border-slate-300 px-4 py-3 text-lg font-semibold outline-none focus:border-emerald-400"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Cash à la fin (€)"
                    value={cashEnd}
                    onChange={(e) =>
                      updateCash(selectedEvent.id, "endCash", e.target.value)
                    }
                    className="rounded-xl border border-slate-300 px-4 py-3 text-lg font-semibold outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="mt-5 rounded-2xl bg-emerald-50 p-5">
                  <p className="text-sm font-semibold text-emerald-700">
                    Cash perçu
                  </p>
                  <p className="mt-1 text-3xl font-black text-emerald-800">
                    {formatEuro(cashReceived)}
                  </p>
                </div>
              </div>

              <ExpenseModule
				  expenseForm={expenseForm}
				  setExpenseForm={setExpenseForm}
				  addExpense={addExpense}
				  eventExpenses={eventExpenses}
				  deleteExpense={deleteExpense}
				  formatEuro={formatEuro}
				  t={t}
				/>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
                <h2 className="text-2xl font-bold">{t.financialReport}</h2>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <Stat label="PayPal" value={formatEuro(paypalTotal)} />
                  <Stat label="Revolut" value={formatEuro(revolutTotal)} />
                  <Stat label="Banque" value={formatEuro(bankTotal)} />
                  <Stat label="Cash" value={formatEuro(cashReceived)} />

                  <div className="col-span-2 rounded-2xl bg-sky-500 p-4">
                    <p className="text-sm text-sky-100">{t.totalIncome}</p>
                    <p className="mt-2 text-3xl font-black">
                      {formatEuro(totalIncome)}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-2xl bg-red-500 p-4">
                    <p className="text-sm text-red-100">{t.totalExpenses}</p>
                    <p className="mt-2 text-3xl font-black">
                      {formatEuro(totalExpenses)}
                    </p>
                  </div>

                  <div
                    className={`col-span-2 rounded-2xl p-4 ${
                      netProfit >= 0 ? "bg-emerald-500" : "bg-orange-500"
                    }`}
                  >
                    <p className="text-sm text-white/80">{t.profit}</p>
                    <p className="mt-2 text-4xl font-black">
                      {formatEuro(netProfit)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Paiements confirmés</h2>

                {eventPayments.length === 0 ? (
                  <p className="mt-4 text-slate-500">
                    Aucun paiement digital confirmé.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {eventPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                      >
                        <div>
                          <p className="font-bold">
                            {formatEuro(payment.amount)}
                          </p>
                          <p className="text-sm text-slate-500">
                            {getMethodLabel(payment.method)} · confirmé
                          </p>
                        </div>

                        <p className="text-sm text-slate-500">
                          {new Date(payment.createdAt).toLocaleTimeString(
                            "de-DE",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                  <Landmark size={22} />
                  Données bancaires
                </h2>
                <div className="space-y-3 text-sm">
                  <Info label="Titulaire" value={selectedEvent.bankOwner} />
                  <Info label={t.iban} value={selectedEvent.iban} />
                  <Info label="BIC" value={selectedEvent.bic} />
                  <Info label="Motif" value={selectedEvent.bankReason} />
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    );
  }

  const totalAllConfirmed = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
		  <div>
			<p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
			  {t.subtitle}
			</p>
			<h1 className="mt-2 text-4xl font-bold tracking-tight">
			  EventLedger
			</h1>
			<p className="mt-2 text-slate-500">
			  {t.description}
			</p>
		  </div>

		  <div className="flex items-center gap-3">
			<select
			  value={language}
			  onChange={(e) => setLanguage(e.target.value)}
			  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 outline-none"
			>
			  <option value="fr">Français</option>
			  <option value="de">Deutsch</option>
			  <option value="en">English</option>
			</select>

			<button
			  onClick={openCreateForm}
			  className="flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-200"
			>
			  <Plus size={20} />
			  {t.newEvent}
			</button>
		  </div>
		</header>

        {showForm && (
          <EventForm
            form={form}
            updateForm={updateForm}
            saveEvent={saveEvent}
            close={() => {
              setShowForm(false);
              setEditingEvent(null);
              setForm(emptyForm);
            }}
            editing={!!editingEvent}
            t={t}
            t={t}
            t={t}
            t={t}
          />
        )}

        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">{t.recentEvents}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">
                {events.length} événement{events.length > 1 ? "s" : ""}
              </span>
            </div>

            {events.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <CalendarDays className="mb-4 text-sky-500" size={52} />
                <h3 className="text-2xl font-bold">{t.noEvent}</h3>
                <p className="mt-2 max-w-md text-slate-500">
                  Crée ton premier événement pour générer des QR codes PayPal,
                  Revolut ou Banque.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <article
                    key={event.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{event.name}</h3>

                        <div className="mt-3 grid gap-2 text-sm text-slate-500">
                          <span className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            {event.date}
                          </span>

                          <span className="flex items-center gap-2">
                            <MapPin size={16} />
                            {event.location || t.unknownPlace}
                          </span>

                          <span className="flex items-center gap-2">
                            <User size={16} />
                            {event.organizer || t.unknownOrganizer}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowQR(false);
                          }}
                          className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white"
                        >
                          {t.open}
                        </button>

                        <button
                          onClick={() => openEditForm(event)}
                          className="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                          {t.edit}
                        </button>

                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="rounded-2xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700"
                        >
                          {t.delete}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">Résumé global</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Événements</p>
                  <p className="mt-2 text-2xl font-bold">{events.length}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Total confirmé</p>
                  <p className="mt-2 text-2xl font-bold">
                    {formatEuro(totalAllConfirmed)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
              <WalletCards className="mb-4 text-sky-300" size={40} />
              <h2 className="text-xl font-bold">Logique de paiement</h2>
              <p className="mt-3 text-slate-300">
                Les paiements sont listés uniquement après confirmation manuelle
                par la personne responsable de l’app.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function EventForm({ form, updateForm, saveEvent, close, editing, t }) {
  return (
    <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {editing ? t.saveChanges : t.saveEvent}
        </h2>

        <button
          onClick={close}
          className="rounded-full bg-slate-100 p-2 text-slate-500"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={saveEvent} className="grid gap-4 md:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={(e) => updateForm("name", e.target.value)}
          placeholder="Nom de l’événement"
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
        />

        <input
          required
          type="date"
          value={form.date}
          onChange={(e) => updateForm("date", e.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
        />

        <input
          value={form.location}
          onChange={(e) => updateForm("location", e.target.value)}
          placeholder={t.location}
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
        />

        <input
          value={form.organizer}
          onChange={(e) => updateForm("organizer", e.target.value)}
          placeholder={t.organizer}
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
        />

        <input
          value={form.paypalLink}
          onChange={(e) => updateForm("paypalLink", e.target.value)}
          placeholder={t.paypalLink}
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
        />

        <input
          value={form.revolutLink}
          onChange={(e) => updateForm("revolutLink", e.target.value)}
          placeholder={t.revolutLink}
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
        />

        <div className="md:col-span-2 mt-2 rounded-3xl bg-slate-50 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Landmark size={20} />
            Compte bancaire / N26
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.bankOwner}
              onChange={(e) => updateForm("bankOwner", e.target.value)}
              placeholder={t.bankOwner}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
            />

            <input
              value={form.iban}
              onChange={(e) => updateForm("iban", e.target.value)}
              placeholder={t.iban}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
            />

            <input
              value={form.bic}
              onChange={(e) => updateForm("bic", e.target.value)}
              placeholder="BIC (optionnel mais recommandé)"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
            />

            <input
              value={form.bankReason}
              onChange={(e) => updateForm("bankReason", e.target.value)}
              placeholder="Motif du paiement, ex. Entrée soirée"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <button className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white md:col-span-2">
          {editing ? t.saveChanges : t.saveEvent}
        </button>
      </form>
    </section>
  );
}

function ExpenseModule({
  expenseForm,
  setExpenseForm,
  addExpense,
  eventExpenses,
  deleteExpense,
  formatEuro,
  t,
}) {
  const categories = [
    "DJ",
    "Photographe / Vidéaste",
    "Sécurité",
    "Salle",
    "Matériel",
    "Transport",
    "Marketing",
    "Staff",
    "Autre",
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <ReceiptText className="text-red-600" size={32} />
        <div>
          <h2 className="text-2xl font-bold">{t.expenses}</h2>
          <p className="text-sm text-slate-500">
            Ajoute les DJs, la salle, la sécurité, le matériel et autres frais.
          </p>
        </div>
      </div>

      <form onSubmit={addExpense} className="grid gap-4 md:grid-cols-2">
        <select
          value={expenseForm.category}
          onChange={(e) =>
            setExpenseForm((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
          className="rounded-xl border border-slate-300 px-4 py-3 font-semibold outline-none focus:border-red-400"
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>

        <input
          value={expenseForm.detail}
          onChange={(e) =>
            setExpenseForm((prev) => ({
              ...prev,
              detail: e.target.value,
            }))
          }
          placeholder="Nom / détail, ex. DJ Bobby"
          className="rounded-xl border border-slate-300 px-4 py-3 font-semibold outline-none focus:border-red-400"
        />

        <input
          type="number"
          min="0"
          step="0.01"
          value={expenseForm.amount}
          onChange={(e) =>
            setExpenseForm((prev) => ({
              ...prev,
              amount: e.target.value,
            }))
          }
          placeholder="Montant (€)"
          className="rounded-xl border border-slate-300 px-4 py-3 font-semibold outline-none focus:border-red-400"
        />

        <select
          value={expenseForm.paid ? "paid" : "unpaid"}
          onChange={(e) =>
            setExpenseForm((prev) => ({
              ...prev,
              paid: e.target.value === "paid",
            }))
          }
          className="rounded-xl border border-slate-300 px-4 py-3 font-semibold outline-none focus:border-red-400"
        >
          <option value="paid">Payé</option>
          <option value="unpaid">Non payé</option>
        </select>

        <button className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white md:col-span-2">
          Ajouter la dépense
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-bold">Liste des dépenses</h3>

        {eventExpenses.length === 0 ? (
          <p className="mt-3 text-slate-500">Aucune dépense enregistrée.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {eventExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
              >
                <div>
                  <p className="font-bold">{formatEuro(expense.amount)}</p>
                  <p className="text-sm text-slate-500">
                    {expense.category}
                    {expense.detail ? ` · ${expense.detail}` : ""} ·{" "}
                    {expense.paid ? "payé" : "non payé"}
                  </p>
                </div>

                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="rounded-xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-700"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-all font-semibold text-slate-700">
        {value || "Non renseigné"}
      </p>
    </div>
  );
}

export default App;




