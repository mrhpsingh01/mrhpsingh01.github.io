"use client";

import { useMemo, useReducer, useState, type ReactNode } from "react";
import { Building2, ClipboardList, CreditCard, FileText, Home, LayoutGrid, Users, Wrench } from "lucide-react";
import {
  SECTION_LABELS,
  SESSIONS,
  canMove,
  fullName,
  label,
  money,
  reducer,
  sectionsFor,
  seed,
  visible,
  type Db,
  type MaintenanceStatus,
  type PaymentMethod,
  type Priority,
  type Section,
  type Session,
} from "@/lib/coursework/property";
import { Btn, Panel, Segmented, Stat, TextField } from "../ui";

type View = "dashboard" | Section;

const ICONS: Record<Section, typeof Users> = {
  tenants: Users,
  employees: ClipboardList,
  owners: Building2,
  properties: Home,
  "rental-agreements": FileText,
  payments: CreditCard,
  "maintenance-requests": Wrench,
};

function Pill({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "strong" | "accent" }) {
  const styles = { plain: "border border-line-strong text-black font-semibold", strong: "bg-fg text-bg", accent: "bg-accent text-accent-fg" }[tone];
  return <span className={`inline-block whitespace-nowrap rounded-sm px-2 py-0.5 font-mono text-[0.6875rem] ${styles}`}>{children}</span>;
}

function statusTone(status: string): "plain" | "strong" | "accent" {
  if (["active", "completed"].includes(status)) return "accent";
  if (["terminated", "cancelled"].includes(status)) return "strong";
  return "plain";
}

interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
}

function Table<T extends { id: number }>({ columns, rows, caption, empty = "Nothing here yet." }: { columns: Column<T>[]; rows: T[]; caption: string; empty?: string }) {
  if (rows.length === 0) return <p className="rounded-lg border border-dashed border-line-strong p-6 text-center text-black font-medium">{empty}</p>;
  return (
    <div role="region" aria-label={`${caption} (scrollable table)`} tabIndex={0} className="overflow-x-auto rounded-lg border border-line bg-surface">
      <table className="w-full min-w-[36rem] border-collapse text-left text-[0.875rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line bg-sunken">
            {columns.map((c) => (
              <th key={c.header} scope="col" className="px-3 py-2.5 font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line last:border-b-0">
              {columns.map((c) => (
                <td key={c.header} className="px-3 py-2.5 align-top">
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PropertyManagement() {
  const [db, dispatch] = useReducer(reducer, undefined, seed);
  const [roleIndex, setRoleIndex] = useState(3);
  const [view, setView] = useState<View>("dashboard");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const session: Session = SESSIONS[roleIndex];
  const scope = useMemo(() => visible(db, session), [db, session]);
  const sections = sectionsFor(session.role);
  const currentView: View = view === "dashboard" || sections.includes(view) ? view : "dashboard";
  const staff = session.role === "admin" || session.role === "employee";

  const address = (id: number) => db.properties.find((p) => p.id === id)?.address ?? `property ${id}`;
  const tenantName = (id: number) => {
    const t = db.tenants.find((x) => x.id === id);
    return t ? fullName(t) : `tenant ${id}`;
  };
  const matches = (...fields: (string | number)[]) => !query.trim() || fields.join(" ").toLowerCase().includes(query.trim().toLowerCase());

  function say(message: string) {
    setToast(message);
  }

  function changeRole(index: number) {
    setRoleIndex(index);
    setView("dashboard");
    setQuery("");
    setToast("");
  }

  const openRequests = scope.requests.filter((r) => r.status === "pending" || r.status === "in_progress");
  const monthlyRent = scope.agreements.filter((a) => a.status === "active").reduce((sum, a) => sum + a.monthlyRent, 0);
  const myAgreement = scope.agreements.find((a) => a.status === "active");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Segmented
          label="Sign in as"
          value={String(roleIndex)}
          onChange={(v) => changeRole(Number(v))}
          options={SESSIONS.map((s, i) => ({ value: String(i), label: `${s.role[0].toUpperCase()}${s.role.slice(1)}` }))}
        />
        <p className="text-[0.875rem] text-black font-medium">
          Signed in as <strong className="font-semibold text-fg">{session.name}</strong> ({session.role})
        </p>
        <Btn onClick={() => { dispatch({ type: "reset" }); setToast("Demo data reset."); }}>Reset demo data</Btn>
      </div>

      <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-line-strong bg-bg lg:grid-cols-[13rem_1fr]">
        <nav aria-label="Property management sections" className="border-b border-line bg-sunken p-2 lg:border-b-0 lg:border-r">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            <li>
              <button type="button" onClick={() => setView("dashboard")} aria-current={currentView === "dashboard" ? "page" : undefined} className={`flex min-h-10 w-full items-center gap-2 whitespace-nowrap rounded-md px-3 text-left text-[0.875rem] ${currentView === "dashboard" ? "bg-accent text-accent-fg" : "hover:bg-tint"}`}>
                <LayoutGrid aria-hidden="true" size={16} />
                Dashboard
              </button>
            </li>
            {sections.map((section) => {
              const Icon = ICONS[section];
              return (
                <li key={section}>
                  <button type="button" onClick={() => { setView(section); setQuery(""); }} aria-current={currentView === section ? "page" : undefined} className={`flex min-h-10 w-full items-center gap-2 whitespace-nowrap rounded-md px-3 text-left text-[0.875rem] ${currentView === section ? "bg-accent text-accent-fg" : "hover:bg-tint"}`}>
                    <Icon aria-hidden="true" size={16} />
                    {SECTION_LABELS[section].label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 p-4 sm:p-6">
          {toast ? (
            <p role="status" className="mb-4 rounded-lg border border-accent bg-tint px-3 py-2 text-[0.875rem]">
              {toast}
            </p>
          ) : null}

          {currentView === "dashboard" ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-subtitle">Welcome back, {session.name.split(" ")[0]}</h4>
                <p className="text-[0.875rem] text-black font-medium">The tiles you see depend on your role.</p>
              </div>
              <ul aria-label="Dashboard sections" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {sections.map((section) => {
                  const Icon = ICONS[section];
                  return (
                    <li key={section}>
                      <button type="button" onClick={() => setView(section)} className="flex h-full w-full items-start gap-3 rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-accent">
                        <span className="grid grid-cols-1 size-9 shrink-0 place-items-center rounded-md bg-tint text-accent-strong">
                          <Icon aria-hidden="true" size={18} />
                        </span>
                        <span>
                          <span className="block font-semibold text-black">{SECTION_LABELS[section].label}</span>
                          <span className="block text-[0.8125rem] text-black font-medium">{SECTION_LABELS[section].description}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {session.role === "tenant" ? (
                <Panel title="Your tenancy">
                  {myAgreement ? (
                    <p className="text-[0.9375rem] text-black">
                      You rent <strong className="font-semibold">{address(myAgreement.propertyId)}</strong> for {money(myAgreement.monthlyRent)} a month until {myAgreement.endDate}.
                    </p>
                  ) : (
                    <p className="text-black font-medium">No active agreement.</p>
                  )}
                  <p className="mt-2 text-[0.875rem] text-black font-medium">{openRequests.length} open maintenance {openRequests.length === 1 ? "request" : "requests"}.</p>
                </Panel>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Stat label={session.role === "owner" ? "Your properties" : "Properties"} value={scope.properties.length} />
                  <Stat label="Monthly rent under agreement" value={money(monthlyRent)} />
                  <Stat label="Open maintenance requests" value={openRequests.length} />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h4 className="text-subtitle">{SECTION_LABELS[currentView].label}</h4>
                <div className="w-full sm:w-64">
                  <TextField label="Search" value={query} onChange={setQuery} mono={false} placeholder="Type to filter" />
                </div>
              </div>

              {currentView === "properties" ? (
                <Table
                  caption="Properties"
                  rows={scope.properties.filter((p) => matches(p.address, p.city, p.type))}
                  columns={[
                    { header: "Address", cell: (p) => <span className="font-medium">{p.address}</span> },
                    { header: "City", cell: (p) => `${p.city}, ${p.state} ${p.zip}` },
                    { header: "Type", cell: (p) => label(p.type) },
                    { header: "Owner", cell: (p) => { const o = db.owners.find((x) => x.id === p.ownerId); return o ? fullName(o) : ""; } },
                    { header: "Status", cell: (p) => <Pill tone={p.isActive ? "accent" : "strong"}>{p.isActive ? "active" : "inactive"}</Pill> },
                  ]}
                />
              ) : null}

              {currentView === "tenants" ? (
                <Table
                  caption="Tenants"
                  rows={scope.tenants.filter((t) => matches(fullName(t), t.email))}
                  columns={[
                    { header: "Name", cell: (t) => <span className="font-medium">{fullName(t)}</span> },
                    { header: "Email", cell: (t) => t.email },
                    { header: "Phone", cell: (t) => t.phone },
                    { header: "Emergency contact", cell: (t) => t.emergencyContact },
                  ]}
                />
              ) : null}

              {currentView === "owners" ? (
                <Table
                  caption="Owners"
                  rows={scope.owners.filter((o) => matches(fullName(o), o.email))}
                  columns={[
                    { header: "Name", cell: (o) => <span className="font-medium">{fullName(o)}</span> },
                    { header: "Email", cell: (o) => o.email },
                    { header: "Payment info", cell: (o) => o.paymentInfo },
                    { header: "Properties", cell: (o) => db.properties.filter((p) => p.ownerId === o.id).length },
                  ]}
                />
              ) : null}

              {currentView === "employees" ? (
                <Table
                  caption="Employees"
                  rows={scope.employees.filter((e) => matches(fullName(e), e.role))}
                  columns={[
                    { header: "Name", cell: (e) => <span className="font-medium">{fullName(e)}</span> },
                    { header: "Role", cell: (e) => <Pill>{e.role}</Pill> },
                    { header: "Hired", cell: (e) => e.hireDate },
                    { header: "Email", cell: (e) => e.email },
                  ]}
                />
              ) : null}

              {currentView === "rental-agreements" ? (
                <Table
                  caption="Rental agreements"
                  rows={scope.agreements.filter((a) => matches(address(a.propertyId), tenantName(a.tenantId), a.status))}
                  columns={[
                    { header: "Property", cell: (a) => <span className="font-medium">{address(a.propertyId)}</span> },
                    { header: "Tenant", cell: (a) => tenantName(a.tenantId) },
                    { header: "Term", cell: (a) => `${a.startDate} to ${a.endDate ?? "open"}` },
                    { header: "Rent", cell: (a) => `${money(a.monthlyRent)} / month` },
                    { header: "Status", cell: (a) => <Pill tone={statusTone(a.status)}>{a.status}</Pill> },
                  ]}
                />
              ) : null}

              {currentView === "payments" ? (
                <PaymentsView db={db} scope={scope} session={session} staff={staff} matches={matches} address={address} tenantName={tenantName} onPay={(rentalId, amount, method) => { dispatch({ type: "pay", rentalId, amount, method }); say(`Recorded a payment of ${money(amount)}.`); }} />
              ) : null}

              {currentView === "maintenance-requests" ? (
                <MaintenanceView db={db} scope={scope} session={session} staff={staff} matches={matches} address={address} tenantName={tenantName} dispatch={dispatch} say={say} />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type Matcher = (...fields: (string | number)[]) => boolean;

function PaymentsView({
  scope,
  session,
  staff,
  matches,
  address,
  tenantName,
  onPay,
}: {
  db: Db;
  scope: ReturnType<typeof visible>;
  session: Session;
  staff: boolean;
  matches: Matcher;
  address: (id: number) => string;
  tenantName: (id: number) => string;
  onPay: (rentalId: number, amount: number, method: PaymentMethod) => void;
}) {
  const active = scope.agreements.filter((a) => a.status === "active");
  const [rentalId, setRentalId] = useState<number>(active[0]?.id ?? 0);
  const [method, setMethod] = useState<PaymentMethod>("credit_card");
  const chosen = active.find((a) => a.id === rentalId) ?? active[0];
  const canPay = session.role === "tenant" || staff;
  const agreementOf = (id: number) => scope.agreements.find((a) => a.id === id);

  return (
    <>
      {canPay && chosen ? (
        <form
          className="grid grid-cols-1 items-end gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-[1fr_auto_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            onPay(chosen.id, chosen.monthlyRent, method);
          }}
        >
          <div>
            <label htmlFor="pay-agreement" className="text-[0.8125rem] font-medium">
              {session.role === "tenant" ? "Pay rent for" : "Record a payment for"}
            </label>
            <select
              id="pay-agreement"
              value={chosen.id}
              onChange={(event) => setRentalId(Number(event.target.value))}
              className="mt-1 min-h-10 w-full rounded-lg border border-line-strong bg-bg px-3 text-[0.875rem]"
            >
              {active.map((a) => (
                <option key={a.id} value={a.id}>
                  {address(a.propertyId)} ({tenantName(a.tenantId)}), {money(a.monthlyRent)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pay-method" className="text-[0.8125rem] font-medium">
              Method
            </label>
            <select
              id="pay-method"
              value={method}
              onChange={(event) => setMethod(event.target.value as PaymentMethod)}
              className="mt-1 min-h-10 w-full rounded-lg border border-line-strong bg-bg px-3 text-[0.875rem]"
            >
              {(["credit_card", "bank_transfer", "cash", "check"] as PaymentMethod[]).map((m) => (
                <option key={m} value={m}>
                  {label(m)}
                </option>
              ))}
            </select>
          </div>
          <Btn type="submit" variant="primary">
            {session.role === "tenant" ? `Pay ${money(chosen.monthlyRent)}` : "Record payment"}
          </Btn>
        </form>
      ) : null}
      <Table
        caption="Payments"
        rows={[...scope.payments].sort((a, b) => b.id - a.id).filter((p) => { const a = agreementOf(p.rentalId); return matches(a ? address(a.propertyId) : "", p.method, p.paidAt); })}
        columns={[
          { header: "Date", cell: (p) => p.paidAt },
          { header: "Property", cell: (p) => { const a = agreementOf(p.rentalId); return a ? <span className="font-medium">{address(a.propertyId)}</span> : ""; } },
          { header: "Tenant", cell: (p) => { const a = agreementOf(p.rentalId); return a ? tenantName(a.tenantId) : ""; } },
          { header: "Method", cell: (p) => label(p.method) },
          { header: "Amount", cell: (p) => <span className="font-mono">{money(p.amount)}</span> },
        ]}
      />
    </>
  );
}

function MaintenanceView({
  db,
  scope,
  session,
  staff,
  matches,
  address,
  tenantName,
  dispatch,
  say,
}: {
  db: Db;
  scope: ReturnType<typeof visible>;
  session: Session;
  staff: boolean;
  matches: Matcher;
  address: (id: number) => string;
  tenantName: (id: number) => string;
  dispatch: (action: Parameters<typeof reducer>[1]) => void;
  say: (message: string) => void;
}) {
  const myProperties = scope.properties.filter((p) => scope.agreements.some((a) => a.propertyId === p.id && a.status === "active"));
  const propertyId = myProperties[0]?.id ?? 0;
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const isTenant = session.role === "tenant";

  const move = (id: number, status: MaintenanceStatus) => {
    dispatch({ type: "set-status", id, status });
    say(`Request ${id} is now ${label(status)}.`);
  };

  return (
    <>
      {isTenant ? (
        <form
          className="space-y-3 rounded-lg border border-line bg-surface p-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!description.trim() || !propertyId) return;
            dispatch({ type: "file-request", propertyId, tenantId: session.personId ?? 0, description, priority });
            say("Maintenance request filed. It starts as pending.");
            setDescription("");
          }}
        >
          <p className="font-semibold">File a maintenance request</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <TextField label="What needs attention?" value={description} onChange={setDescription} mono={false} placeholder="For example: bathroom fan is noisy" />
            <div>
              <label htmlFor="req-priority" className="text-[0.8125rem] font-medium">
                Priority
              </label>
              <select
                id="req-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as Priority)}
                className="mt-1 min-h-10 w-full rounded-lg border border-line-strong bg-bg px-3 text-[0.875rem]"
              >
                <option value="low">low</option>
                <option value="normal">normal</option>
                <option value="high">high</option>
              </select>
            </div>
          </div>
          <p className="text-[0.8125rem] text-black font-medium">For {propertyId ? address(propertyId) : "your property"}</p>
          <Btn type="submit" variant="primary" disabled={!description.trim()}>
            Submit request
          </Btn>
        </form>
      ) : null}
      <Table
        caption="Maintenance requests"
        rows={[...scope.requests].sort((a, b) => b.id - a.id).filter((r) => matches(r.description, address(r.propertyId), r.status))}
        columns={[
          { header: "Request", cell: (r) => <span className="font-medium text-black">{r.description}</span> },
          { header: "Property", cell: (r) => address(r.propertyId) },
          { header: "Reported by", cell: (r) => tenantName(r.tenantId) },
          { header: "Priority", cell: (r) => <Pill tone={r.priority === "high" ? "strong" : "plain"}>{r.priority}</Pill> },
          { header: "Status", cell: (r) => <Pill tone={statusTone(r.status)}>{label(r.status)}</Pill> },
          {
            header: "Actions",
            cell: (r) => {
              const own = isTenant && r.tenantId === session.personId;
              const options: MaintenanceStatus[] = staff ? ["in_progress", "completed", "cancelled"] : own ? ["cancelled"] : [];
              const usable = options.filter((o) => canMove(r.status, o));
              if (usable.length === 0) return <span className="text-black font-medium">none</span>;
              return (
                <span className="flex flex-wrap gap-1.5">
                  {usable.map((o) => (
                    <Btn key={o} className="min-h-8 px-2.5 text-[0.75rem]" onClick={() => move(r.id, o)}>
                      {o === "cancelled" ? "cancel" : label(o)}
                    </Btn>
                  ))}
                </span>
              );
            },
          },
        ]}
        empty={db.requests.length === 0 ? "No requests." : "No requests match."}
      />
    </>
  );
}
