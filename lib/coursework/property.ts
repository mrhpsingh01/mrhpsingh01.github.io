/**
 * In-memory model for the property management demo (Database Management Systems).
 * It recreates the screens and flows of the Nuxt frontend I built. All people, addresses and amounts are invented.
 * The entities and enums follow the project's database schema.
 */

export type Role = "admin" | "employee" | "owner" | "tenant";
export type EmployeeRole = "manager" | "maintenance" | "accountant";
export type PropertyType = "apartment" | "house" | "condo" | "townhouse";
export type RentalStatus = "active" | "terminated" | "pending";
export type PaymentMethod = "credit_card" | "bank_transfer" | "cash" | "check";
export type MaintenanceStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type Priority = "low" | "normal" | "high";

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
export interface Tenant extends Person {
  emergencyContact: string;
}
export interface Owner extends Person {
  paymentInfo: string;
}
export interface Employee extends Person {
  role: EmployeeRole;
  hireDate: string;
}
export interface Property {
  id: number;
  ownerId: number;
  managerId: number;
  type: PropertyType;
  address: string;
  city: string;
  state: string;
  zip: string;
  isActive: boolean;
}
export interface Agreement {
  id: number;
  propertyId: number;
  tenantId: number;
  startDate: string;
  endDate: string | null;
  monthlyRent: number;
  status: RentalStatus;
}
export interface Payment {
  id: number;
  rentalId: number;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
}
export interface Request {
  id: number;
  propertyId: number;
  tenantId: number;
  description: string;
  status: MaintenanceStatus;
  priority: Priority;
  reportedAt: string;
  completedAt: string | null;
}

export interface Db {
  tenants: Tenant[];
  owners: Owner[];
  employees: Employee[];
  properties: Property[];
  agreements: Agreement[];
  payments: Payment[];
  requests: Request[];
  /** The "today" of the demo, so dates are stable. */
  today: string;
}

export interface Session {
  role: Role;
  /** Id in the tenants, owners or employees table. Admins have none. */
  personId: number | null;
  name: string;
}

export const SESSIONS: Session[] = [
  { role: "admin", personId: null, name: "Alex Admin" },
  { role: "employee", personId: 1, name: "Morgan Reyes" },
  { role: "owner", personId: 1, name: "Olivia Brandt" },
  { role: "tenant", personId: 1, name: "Theo Nakamura" },
];

export function seed(): Db {
  return {
    today: "2025-04-21",
    tenants: [
      { id: 1, firstName: "Theo", lastName: "Nakamura", email: "theo.n@example.test", phone: "555-0101", emergencyContact: "Mika Nakamura" },
      { id: 2, firstName: "Priya", lastName: "Venkat", email: "priya.v@example.test", phone: "555-0102", emergencyContact: "Arun Venkat" },
      { id: 3, firstName: "Jonas", lastName: "Lindqvist", email: "jonas.l@example.test", phone: "555-0103", emergencyContact: "Sofia Lindqvist" },
      { id: 4, firstName: "Amara", lastName: "Okafor", email: "amara.o@example.test", phone: "555-0104", emergencyContact: "Chidi Okafor" },
      { id: 5, firstName: "Lucía", lastName: "Fernández", email: "lucia.f@example.test", phone: "555-0105", emergencyContact: "Mateo Fernández" },
    ],
    owners: [
      { id: 1, firstName: "Olivia", lastName: "Brandt", email: "olivia.b@example.test", phone: "555-0201", paymentInfo: "Bank transfer, account ending 4410" },
      { id: 2, firstName: "Samuel", lastName: "Hart", email: "samuel.h@example.test", phone: "555-0202", paymentInfo: "Check mailed monthly" },
    ],
    employees: [
      { id: 1, firstName: "Morgan", lastName: "Reyes", email: "morgan.r@example.test", phone: "555-0301", role: "manager", hireDate: "2022-03-14" },
      { id: 2, firstName: "Devon", lastName: "Price", email: "devon.p@example.test", phone: "555-0302", role: "maintenance", hireDate: "2023-08-01" },
      { id: 3, firstName: "Ingrid", lastName: "Solberg", email: "ingrid.s@example.test", phone: "555-0303", role: "accountant", hireDate: "2021-11-22" },
    ],
    properties: [
      { id: 1, ownerId: 1, managerId: 1, type: "apartment", address: "14 Alder Lane, Unit 2B", city: "Brookfield", state: "GA", zip: "30601", isActive: true },
      { id: 2, ownerId: 1, managerId: 1, type: "house", address: "88 Birchwood Drive", city: "Brookfield", state: "GA", zip: "30605", isActive: true },
      { id: 3, ownerId: 2, managerId: 1, type: "condo", address: "5 Harbor View, Unit 12", city: "Lakemont", state: "GA", zip: "30650", isActive: true },
      { id: 4, ownerId: 2, managerId: 1, type: "townhouse", address: "301 Willow Court", city: "Lakemont", state: "GA", zip: "30650", isActive: true },
      { id: 5, ownerId: 1, managerId: 1, type: "apartment", address: "22 Cedar Row, Unit 4A", city: "Brookfield", state: "GA", zip: "30601", isActive: false },
    ],
    agreements: [
      { id: 1, propertyId: 1, tenantId: 1, startDate: "2024-08-01", endDate: "2025-07-31", monthlyRent: 1450, status: "active" },
      { id: 2, propertyId: 2, tenantId: 2, startDate: "2024-02-01", endDate: "2025-01-31", monthlyRent: 2100, status: "terminated" },
      { id: 3, propertyId: 3, tenantId: 3, startDate: "2024-11-15", endDate: "2025-11-14", monthlyRent: 1725, status: "active" },
      { id: 4, propertyId: 4, tenantId: 4, startDate: "2025-05-01", endDate: "2026-04-30", monthlyRent: 1980, status: "pending" },
      { id: 5, propertyId: 2, tenantId: 5, startDate: "2025-02-01", endDate: "2026-01-31", monthlyRent: 2150, status: "active" },
    ],
    payments: [
      { id: 1, rentalId: 1, amount: 1450, method: "bank_transfer", paidAt: "2025-02-01" },
      { id: 2, rentalId: 1, amount: 1450, method: "bank_transfer", paidAt: "2025-03-01" },
      { id: 3, rentalId: 1, amount: 1450, method: "credit_card", paidAt: "2025-04-02" },
      { id: 4, rentalId: 3, amount: 1725, method: "check", paidAt: "2025-03-15" },
      { id: 5, rentalId: 3, amount: 1725, method: "check", paidAt: "2025-04-14" },
      { id: 6, rentalId: 5, amount: 2150, method: "cash", paidAt: "2025-03-03" },
      { id: 7, rentalId: 5, amount: 2150, method: "bank_transfer", paidAt: "2025-04-03" },
    ],
    requests: [
      { id: 1, propertyId: 1, tenantId: 1, description: "Kitchen faucet drips constantly", status: "pending", priority: "normal", reportedAt: "2025-04-18", completedAt: null },
      { id: 2, propertyId: 3, tenantId: 3, description: "Heating not working in the bedroom", status: "in_progress", priority: "high", reportedAt: "2025-04-15", completedAt: null },
      { id: 3, propertyId: 2, tenantId: 5, description: "Replace the hallway light fixture", status: "completed", priority: "low", reportedAt: "2025-03-20", completedAt: "2025-03-27" },
      { id: 4, propertyId: 1, tenantId: 1, description: "Loose handrail on the stairs", status: "cancelled", priority: "low", reportedAt: "2025-02-11", completedAt: null },
    ],
  };
}

/** Which sections each role sees on its dashboard, as defined in the frontend's role switch. */
export type Section = "tenants" | "employees" | "owners" | "properties" | "rental-agreements" | "payments" | "maintenance-requests";

export const SECTION_LABELS: Record<Section, { label: string; description: string }> = {
  tenants: { label: "Tenants", description: "Manage your tenants" },
  employees: { label: "Employees", description: "Manage your staff" },
  owners: { label: "Owners", description: "Manage property owners" },
  properties: { label: "Properties", description: "View and edit properties" },
  "rental-agreements": { label: "Agreements", description: "Manage rental agreements" },
  payments: { label: "Payments", description: "Track payments" },
  "maintenance-requests": { label: "Maintenance", description: "Handle maintenance requests" },
};

export function sectionsFor(role: Role): Section[] {
  switch (role) {
    case "admin":
    case "employee":
      return ["tenants", "employees", "owners", "properties", "rental-agreements", "payments", "maintenance-requests"];
    case "owner":
      return ["tenants", "properties", "rental-agreements", "payments", "maintenance-requests"];
    case "tenant":
      return ["properties", "rental-agreements", "payments", "maintenance-requests"];
  }
}

/** The demo's own scoping rule: owners see their portfolio, tenants see their own records, staff see everything. */
export function visible(db: Db, session: Session) {
  if (session.role === "admin" || session.role === "employee") return db;
  if (session.role === "owner") {
    const properties = db.properties.filter((p) => p.ownerId === session.personId);
    const propertyIds = new Set(properties.map((p) => p.id));
    const agreements = db.agreements.filter((a) => propertyIds.has(a.propertyId));
    const agreementIds = new Set(agreements.map((a) => a.id));
    const tenantIds = new Set(agreements.map((a) => a.tenantId));
    return {
      ...db,
      properties,
      agreements,
      payments: db.payments.filter((p) => agreementIds.has(p.rentalId)),
      requests: db.requests.filter((r) => propertyIds.has(r.propertyId)),
      tenants: db.tenants.filter((t) => tenantIds.has(t.id)),
      owners: db.owners.filter((o) => o.id === session.personId),
      employees: [] as Employee[],
    };
  }
  const agreements = db.agreements.filter((a) => a.tenantId === session.personId);
  const agreementIds = new Set(agreements.map((a) => a.id));
  const propertyIds = new Set(agreements.map((a) => a.propertyId));
  return {
    ...db,
    properties: db.properties.filter((p) => propertyIds.has(p.id)),
    agreements,
    payments: db.payments.filter((p) => agreementIds.has(p.rentalId)),
    requests: db.requests.filter((r) => r.tenantId === session.personId),
    tenants: db.tenants.filter((t) => t.id === session.personId),
    owners: [] as Owner[],
    employees: [] as Employee[],
  };
}

export type Action =
  | { type: "file-request"; propertyId: number; tenantId: number; description: string; priority: Priority }
  | { type: "set-status"; id: number; status: MaintenanceStatus }
  | { type: "pay"; rentalId: number; amount: number; method: PaymentMethod }
  | { type: "reset" };

const ALLOWED: Record<MaintenanceStatus, MaintenanceStatus[]> = {
  pending: ["in_progress", "cancelled", "completed"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function canMove(from: MaintenanceStatus, to: MaintenanceStatus): boolean {
  return ALLOWED[from].includes(to);
}

export function reducer(db: Db, action: Action): Db {
  switch (action.type) {
    case "reset":
      return seed();
    case "file-request": {
      const description = action.description.trim();
      if (!description) return db;
      const id = Math.max(0, ...db.requests.map((r) => r.id)) + 1;
      return {
        ...db,
        requests: [
          ...db.requests,
          { id, propertyId: action.propertyId, tenantId: action.tenantId, description, status: "pending", priority: action.priority, reportedAt: db.today, completedAt: null },
        ],
      };
    }
    case "set-status": {
      return {
        ...db,
        requests: db.requests.map((r) =>
          r.id === action.id && canMove(r.status, action.status)
            ? { ...r, status: action.status, completedAt: action.status === "completed" ? db.today : r.completedAt }
            : r,
        ),
      };
    }
    case "pay": {
      if (!(action.amount > 0)) return db;
      const id = Math.max(0, ...db.payments.map((p) => p.id)) + 1;
      return { ...db, payments: [...db.payments, { id, rentalId: action.rentalId, amount: action.amount, method: action.method, paidAt: db.today }] };
    }
  }
}

export function fullName(person: { firstName: string; lastName: string }): string {
  return `${person.firstName} ${person.lastName}`;
}

export function money(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function label(value: string): string {
  return value.replace(/_/g, " ");
}
