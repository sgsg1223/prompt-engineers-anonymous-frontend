// ============================================================
// Domain types derived from Rail Management System aggregates
// (see designs/system-design.md §4)
// ============================================================

// ---- Booking Management ----

export type BookingStatus = "Booked" | "Planned" | "Loaded" | "Cancelled";

export type InspectionStatus =
  | "Not Inspected"
  | "Inspection Passed"
  | "Inspection Failed";

export type CustomsStatus = boolean; // isCustomsCleared

export interface Address {
  name: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
}

export interface Customer {
  id: number;
  name: string;
}

export interface Consignee {
  name: string;
  address: Address;
}

export interface Cargo {
  numberOfPackages: string;
  packageType: string;
  goodsDescription: string;
  grossWeight: number;
  netWeight: number;
}

export interface HazardousGoods {
  unNumber: string;
  class: string;
  subClass: string | null;
  packingGroup: "I" | "II" | "III" | null;
  properShippingName: string;
  flashPoint: number | null;
  isLimitedQuantity: boolean;
  isMarinePollutant: boolean;
  isEnvironmentallyHazardous: boolean;
  netWeight: number;
  grossWeight: number;
  packageQuantity: number;
  packageType: string;
}

export interface RailBooking {
  railBookingId: string;
  unitType: string;
  unitNumber: string;
  iluCode: string;
  vehicleRegistrationNumber: string | null;
  isCraneable: boolean;
  isWaste: boolean;
  tareWeight: number;
  grossWeight: number;
  isCustomsCleared: boolean;
  inspectionStatus: InspectionStatus;
  bookingStatus: BookingStatus;
  cancellationReason: string | null;
  internalRemarks: string | null;
  sealNumber: string | null;
  externalReference1: string | null;
  externalReference2: string | null;
  requestedDepartureDateTime: string; // ISO 8601
  customer: Customer;
  consignee: Consignee | null;
  cargo: Cargo[];
  hazardous: HazardousGoods[];
}

// ---- Voyage Planning ----

export type VoyageStatus = "Open" | "Loading" | "Closed" | "Cancelled";
export type Direction = "Northbound" | "Southbound";
export type PlanningList = "Main" | "Spare";

export interface Terminal {
  name: string;
  unLoCode: string;
  uicCountryCode: number;
  uicStationCode: number;
  address: Address;
}

export interface PlannedBooking {
  railBookingId: string;
  planningList: PlanningList;
  plannedAt: string;
}

export interface LoadedUnit {
  railBookingId: string;
  loadingDateTime: string;
}

export interface LoadedEquipment {
  type: "ISU" | "R2L";
  id: string;
  grossWeight: number;
}

export interface Wagon {
  wagonNumber: number;
  wagonType: string; // e.g. "90'", "T3000", etc.
  positionOnTrain: number;
  tareWeight: number;
  maximumWagonPayload: number;
  actualWagonPayload: number;
  loadedUnits: LoadedUnit[];
  loadedEquipment: LoadedEquipment[];
}

export interface RailVoyage {
  railVoyageId: string;
  railVoyageCode: string;
  trainReference1: string | null;
  trainReference2: string | null;
  trainReference3: string | null;
  routeId: string;
  originTerminal: Terminal;
  destinationTerminal: Terminal;
  direction: Direction;
  sequenceNumber: number;
  carrier: string;
  voyageStatus: VoyageStatus;
  scheduledDepartureDateTime: string;
  actualDepartureDateTime: string | null;
  scheduledArrivalTime: string;
  actualArrivalTime: string | null;
  voyageBookingDeadline: string;
  planningDeadline: string;
  gateArrivalDeadline: string;
  loadingDeadline: string;
  nonCraneableAllowed: boolean;
  hazardousAllowed: boolean;
  wasteAllowed: boolean;
  maximumTrainGrossWeight: number;
  trainLength: number;
  capacity: number;
  actualPayload: number;
  maximumPayload: number;
  locomotive: { id: string; grossWeight: number };
  voyagePlanning: PlannedBooking[];
  wagonComposition: Wagon[];
}

export interface SlotAgreement {
  slotAgreementId: string;
  numberOfAgreedUnits: number;
  customer: Customer;
  routeId: string;
  confirmed: boolean;
  surrenderedSlots: number;
}

export interface CapacitySummary {
  maximumTrainGrossWeight: number;
  currentTrainGrossWeight: number;
  trainLength: number;
  totalCapacity: number;
  usedCapacity: number;
  remainingCapacity: number;
  actualPayload: number;
  maximumPayload: number;
  slotAgreements: SlotAgreementUsage[];
}

export interface SlotAgreementUsage {
  slotAgreementId: string;
  customerId: number;
  customerName: string;
  routeId: string;
  reservedSlots: number;
  usedSlots: number;
  remainingSlots: number;
}

export interface RailSchedule {
  railScheduleId: string;
  pol: string;
  pod: string;
  scheduledDepartureDateTime: string;
  scheduledArrivalDateTime: string;
  locomotiveId: string;
  nonCraneableAllowed: boolean;
  confirmed: boolean;
}

// ---- Wagon Loading ----

export interface InspectionResult {
  railBookingId: string;
  unitNumber: string;
  inspectionStatus: InspectionStatus;
  inspectedBy: string | null;
  inspectedAt: string | null;
  failureReason: string | null;
}

export interface LoadingPermission {
  voyageId: string;
  granted: boolean;
  grantedBy: string | null;
  grantedAt: string | null;
}

// ---- Spreadsheet Upload ----

export interface ParseError {
  row: number;
  column: string;
  message: string;
  value: unknown;
}

export interface SpreadsheetUploadResult {
  created: number;
  skipped: number;
  errors: ParseError[];
}

// ---- Ferry Bookings (read model) ----

export interface FerryBooking {
  ferryBookingId: string;
  unitNumber: string;
  iluCode: string;
  isHazardous: boolean;
  vessel: string;
  arrivalDateTime: string;
  customerName: string;
  customerNote: string | null;
  portOfDischarge: string;
  releaseNumber: string | null;
  mvsId: string | null;
}
