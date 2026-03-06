# Rail Management System — Domain Analysis & API Design

> Derived from Event Storming output. This document structures the bounded contexts, aggregates, commands, domain events (Kafka topics), Excel inputs, business rules, and proposed REST APIs.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Bounded Contexts](#2-bounded-contexts)
3. [Actors & External Systems](#3-actors--external-systems)
4. [Aggregates & Data Models](#4-aggregates--data-models)
5. [Commands, Events & Read Models by Context](#5-commands-events--read-models-by-context)
6. [Kafka Topics (Domain Events)](#6-kafka-topics-domain-events)
7. [Excel File Inputs](#7-excel-file-inputs)
8. [Business Rules & Invariants](#8-business-rules--invariants)
9. [Proposed APIs](#9-proposed-apis)
10. [Existing Integration Points](#10-existing-integration-points)
11. [Rail Routes](#11-rail-routes)

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Rail Management App (RMA)                      │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Booking Mgmt     │  │ Voyage       │  │ Wagon Loading         │ │
│  │                  │  │ Planning     │  │                       │ │
│  │ • railBookings   │  │ • Schedules  │  │ • Inspection          │ │
│  │ • Spreadsheet    │  │ • Voyages    │  │ • Physical Loading    │ │
│  │   Upload         │  │ • Capacity   │  │ • Actual Wagon        │ │
│  │ • Prioritisation │  │ • Slot Agr.  │  │   Payload             │ │
│  │ • Customs        │  │ • Wagon Comp │  │ • Close Voyage        │ │
│  └────────┬─────────┘  └──────┬───────┘  └───────────┬───────────┘ │
│           │                   │                       │             │
│           └───────────────────┼───────────────────────┘             │
│                               │                                     │
│                          Kafka Topics                               │
└───────────────────────────────┼─────────────────────────────────────┘
                                │
          ┌─────────────────────┼────────────────────────┐
          │                     │                        │
    ┌─────▼─────┐        ┌─────▼─────┐           ┌──────▼──────┐
    │   Phx     │        │  Simply   │           │  Billitz    │
    │(Invoicing)│        │(Bookings/ │           │(Customs     │
    │           │        │ Sinfomar/ │           │  Agent)     │
    │           │        │ Cargo     │           │             │
    │           │        │ Treni)    │           │             │
    └───────────┘        └───────────┘           └─────────────┘
```

The Rail Management system has **3 bounded contexts** handling the lifecycle of rail intermodal transport: from booking creation through voyage planning to physical wagon loading and departure.

---

## 2. Bounded Contexts

### 2.1 Booking Management

**Responsibility:** Lifecycle of `railBooking` entities — creation from spreadsheets/ferryBookings, prioritisation (Main/Spare list), customs status, cancellation.

**Key Concerns:**
- Creating railBookings from customer spreadsheets or ferryBookings
- Agreeing prioritisation (Main List vs Spare List) with Customer
- Tracking customs clearance status
- Recording cancellation reasons
- Syncing with Simply (simplyBooking creation)

### 2.2 Voyage Planning

**Responsibility:** Rail schedules, railVoyage lifecycle, capacity management, slot agreements, wagon compositions, and planning railBookings onto voyages.

**Key Concerns:**
- Annual schedule agreements with Suppliers
- Weekly voyage activation
- Capacity monitoring (weight limits, unit counts, restrictions)
- Slot Agreements with customers (reserved capacity)
- Wagon composition management (add/remove wagons, confirm with Supplier)
- Planning railBookings to Main List / Spare List of voyages
- Syncing with Phx and Simply for voyage data

### 2.3 Wagon Loading

**Responsibility:** Physical operations at the terminal — inspection, loading permission, wagon assignment, equipment loading, unloading mistakes, and closing/departing the voyage.

**Key Concerns:**
- Unit inspection (pass/fail — record in both Simply and RMA)
- Waiting for Supplier loading permission
- Assigning railBookings to specific wagons
- Loading equipment (ISU, R2L) that doesn't consume slots
- Unloading units loaded by mistake
- Confirming actual wagon composition (may differ from planned)
- Closing the railVoyage → triggers ferryBooking creation in Phx
- Spare List rollover to next railVoyage on close

---

## 3. Actors & External Systems

### 3.1 Actors

| Actor | Role | Bounded Contexts |
|---|---|---|
| **Customer Service** | Create/cancel bookings, manage prioritisation, customs updates, voyage management | Booking Mgmt, Voyage Planning |
| **Operations Team** | Physical loading/unloading, inspection, close voyage | Wagon Loading |
| **Intermodal Management Team (Hamburg)** | Annual schedule agreements, slot agreements | Voyage Planning |
| **Supplier** (e.g. Cargo Treni) | Provides wagon compositions, loading permission, voyage updates | Voyage Planning, Wagon Loading |
| **Slot Agreement Customer** | Reserves capacity, may surrender unused slots | Voyage Planning |
| **Customer** | Sends booking spreadsheets, may cancel bookings | Booking Mgmt |

### 3.2 External Systems

| System | Purpose | Integration |
|---|---|---|
| **Phx (Phoenix)** | Invoicing, ferryBooking creation, voyage visibility | REST API (ACL), bidirectional |
| **Simply** | Core booking system, integrates Sinfomar + Cargo Treni | REST API (ACL), bidirectional |
| **Billitz** | Third-party customs agent | Email (manual) |
| **Sinfomar** | Port management | Via Simply |
| **Cargo Treni** | Railway network | Via Simply |
| **Outlook** | Email for spreadsheets, supplier updates | Manual extraction |

---

## 4. Aggregates & Data Models

### 4.1 `railBooking` Aggregate

```json
{
  "railBooking": {
    "railBookingId": "string",
    "unitType": "string",
    "unitNumber": "string",
    "iluCode": "string",
    "vehicleRegistrationNumber": "string",
    "isCraneable": "boolean",
    "isWaste": "boolean",
    "tareWeight": "number",
    "grossWeight": "number",
    "isCustomsCleared": "boolean",
    "inspectionStatus": "enum: ['Not Inspected', 'Inspection Passed', 'Inspection Failed']",
    "bookingStatus": "enum: ['Booked', 'Planned', 'Loaded', 'Cancelled']",
    "cancellationReason": "string",
    "internalRemarks": "string",
    "sealNumber": "string",
    "externalReference1": "string",
    "externalReference2": "string",
    "requestedDepartureDateTime": "datetime",
    "customer": {
      "id": "integer",
      "name": "string"
    },
    "consignee": {
      "name": "string",
      "address": {
        "name": "string",
        "street": "string",
        "city": "string",
        "postcode": "string",
        "country": "string"
      }
    },
    "cargo": [
      {
        "numberOfPackages": "string",
        "packageType": "string",
        "goodsDescription": "string",
        "grossWeight": "number",
        "netWeight": "number"
      }
    ],
    "hazardous": [
      {
        "unNumber": "string",
        "class": "string",
        "subClass": "string",
        "packingGroup": "enum: ['I', 'II', 'III']",
        "properShippingName": "string",
        "flashPoint": "number",
        "technicalName": "string",
        "tertiaryClass": "string",
        "tankUN": "string",
        "isLimitedQuantity": "boolean",
        "isMarinePollutant": "boolean",
        "isEnvironmentallyHazardous": "boolean",
        "isExceptedQuantity": "boolean",
        "isResidue": "boolean",
        "tankProvision": "string",
        "stowageHandling": "string",
        "stowageCategory": "string",
        "segregation": "string",
        "netWeight": "number",
        "grossWeight": "number",
        "netExplosiveQuantity": "number",
        "packageQuantity": "integer",
        "packageType": "string"
      }
    ]
  }
}
```

**Editable fields (by RMA user):** `isCustomsCleared`, `inspectionStatus`, `loadingStatus`, `internalRemarks`
**All other fields:** Read-only in RMA

### 4.2 `railVoyage` Aggregate

```json
{
  "railVoyage": {
    "railVoyageId": "string",
    "railVoyageCode": "string",
    "trainReference1": "string",
    "trainReference2": "string",
    "trainReference3": "string",
    "routeId": "string",
    "originTerminal": {
      "name": "string",
      "unLoCode": "string",
      "uicCountryCode": "integer",
      "uicStationCode": "integer",
      "originTerminalAddress": {
        "name": "string",
        "street": "string",
        "city": "string",
        "postcode": "string",
        "country": "string"
      }
    },
    "destinationTerminal": {
      "name": "string",
      "unLoCode": "string",
      "uicCountryCode": "integer",
      "uicStationCode": "integer",
      "destinationTerminalAddress": {
        "name": "string",
        "street": "string",
        "city": "string",
        "postcode": "string",
        "country": "string"
      }
    },
    "direction": "enum: ['Northbound', 'Southbound']",
    "sequenceNumber": "integer",
    "carrier": "string",
    "voyageStatus": "enum: ['Open', 'Loading', 'Closed', 'Cancelled']",
    "scheduledDepartureDateTime": "datetime",
    "actualDepartureDateTime": "datetime",
    "scheduledArrivalTime": "datetime",
    "actualArrivalTime": "datetime",
    "voyageBookingDeadline": "datetime",
    "planningDeadline": "datetime",
    "gateArrivalDeadline": "datetime",
    "loadingDeadline": "datetime",
    "scheduledUnloadingStartTime": "datetime",
    "scheduledUnitCollectionTime": "datetime",
    "nonCraneableAllowed": "boolean",
    "hazardousAllowed": "boolean",
    "wasteAllowed": "boolean",
    "maximumTrainGrossWeight": "number",
    "trainLength": "number",
    "capacity": "number",
    "actualPayload": "number",
    "maximumPayload": "number",
    "locomotive": {
      "id": "string",
      "grossWeight": "string"
    },
    "voyagePlanning": [
      {
        "railBookingId": "string",
        "planningList": "enum: ['Main', 'Spare']",
        "plannedAt": "datetime"
      }
    ],
    "wagonComposition": [
      {
        "wagonNumber": "integer",
        "wagonType": "integer",
        "positionOnTrain": "integer",
        "tareWeight": "number",
        "maximumWagonPayload": "number",
        "actualWagonPayload": "number",
        "loadedUnits": [
          {
            "railBookingId": "string",
            "loadingDateTime": "datetime"
          }
        ],
        "loadedEquipment": [
          {
            "type": "string",
            "id": "string",
            "grossWeight": "string"
          }
        ]
      }
    ]
  }
}
```

**Phx-visible/editable fields:** `pol`, `pod`, `scheduledDepartureDateTime`, `actualDepartureDateTime`, `scheduledArrivalDateTime`, `actualArrivalDateTime`, `shipId` (= `locomotive.id`), `craneOptions` (= calculated from `nonCraneableAllowed`)

### 4.3 `slotAgreement` (Value Object / Entity)

```json
{
  "slotAgreement": {
    "slotAgreementId": "string",
    "numberOfAgreedUnits": "integer",
    "customer": {
      "id": "integer",
      "name": "string"
    },
    "routeId": "string",
    "reservedSlots": "integer",
    "surrenderedSlots": "integer"
  }
}
```

### 4.4 `railSchedule` (Entity)

```json
{
  "railSchedule": {
    "railScheduleId": "string",
    "pol": "string",
    "pod": "string",
    "scheduledDepartureDateTime": "datetime",
    "scheduledArrivalDateTime": "datetime",
    "locomotiveId": "string",
    "nonCraneableAllowed": "boolean"
  }
}
```

---

## 5. Commands, Events & Read Models by Context

### 5.1 Booking Management

#### Commands

| Command | Actor | Input Channel | Description |
|---|---|---|---|
| `Upload Bookings Spreadsheet` | Customer Service | Rail Mgmt App | Parse Excel → create railBookings |
| `Create railBooking` | Customer Service | Rail Mgmt App | Create from ferryBooking or manually |
| `Cancel railBooking` | Customer Service | Rail Mgmt App | Cancel + prompt for cancellationReason |
| `Record cancellationReason` | Customer Service | Rail Mgmt App | Persist reason for audit |
| `Update isCustomsCleared` | Customer Service | Rail Mgmt App | After observing customs update from Billitz |
| `Create simplyBooking` | System | Rail Mgmt App → Simply | Post booking to Simply via ACL |
| `Cancel simplyBooking` | Customer Service | Rail Mgmt App → Simply | Cancel in Simply |
| `Agree railBooking Prioritisation` | Customer Service | Email/Phone | Agree Main List vs Spare List |

#### Domain Events (→ Kafka Topics)

| Event | Trigger | Consumers |
|---|---|---|
| `bookingSpreadsheetUploaded` | Spreadsheet parsed | Booking Mgmt |
| `railBookingCreated` | railBooking saved | Voyage Planning, Simply ACL |
| `railBookingCancelled` | Booking cancelled | Voyage Planning, Simply ACL |
| `cancellationReasonRecorded` | Reason saved | Audit |
| `cancellationRequestReceived` | Customer requests cancel | Booking Mgmt |
| `railBookingPrioritisationAgreed` | Prioritisation confirmed | Voyage Planning |
| `railBookingCustomsUpdated` | Customs field changed | Wagon Loading |
| `railBookingCustomsUpdateFailed` | Update failed | Booking Mgmt (show error) |
| `simplyBookingCreated` | Simply confirms creation | Booking Mgmt (show confirmation) |
| `simplyBookingCreationFailed` | Simply rejects creation | Booking Mgmt (show error) |
| `simplyBookingCancelled` | Simply confirms cancel | Booking Mgmt |
| `spreadsheetManuallyExtractedFromEmail` | CS extracts from Outlook | Booking Mgmt |

#### Read Models

| View | Key Fields | Notes |
|---|---|---|
| **Unplanned Bookings List** | bookingStatus, unitNumber, unitType, iluCode, isCraneable, isHazardous, isWaste, grossWeight, isCustomsCleared, inspectionStatus, customer.name, internalRemarks | Sorted by requestedDepartureDate |
| **Cancelled Bookings** | All fields + cancellationReason | Still visible, status = 'Cancelled' |
| **ferryBookings for Rail** | Unit Number, ILU Code, Hazardous, Vessel, Arrival DateTime, Customer Name, Customer Note, POD | Searchable by Release Number, Unit Number, MVS ID |
| **Customs Status** | isCustomsCleared displayed as tick box | |

---

### 5.2 Voyage Planning

#### Commands

| Command | Actor | Input Channel | Description |
|---|---|---|---|
| `Create railSchedule` | Intermodal Mgmt | Rail Mgmt App | Annual schedule creation |
| `Confirm railSchedule` | Customer Service | Rail Mgmt App | Weekly activation |
| `Reduce railSchedule` | Customer Service | Email | Low demand or technical issue |
| `Create railVoyage` | System | Automatic | Triggered by schedule creation |
| `Update railVoyage` | Customer Service | Rail Mgmt App / Phx | Update dates, fields |
| `Cancel railVoyage` | Customer Service | Rail Mgmt App / Phx | Cancel + replan bookings |
| `Add railBooking to Main List` | Customer Service | Rail Mgmt App | Plan booking, check capacity + restrictions |
| `Add railBooking to Spare List` | Customer Service | Rail Mgmt App | Plan as backup |
| `Remove railBooking from Main List` | Customer Service | Rail Mgmt App | Unplan from main |
| `Remove railBooking from Spare List` | Customer Service | Rail Mgmt App | Unplan from spare |
| `Move railBooking to Main List` | Customer Service | Rail Mgmt App | Promote from spare |
| `Move railBooking to Spare List` | Customer Service | Rail Mgmt App | Demote from main |
| `Create Slot Agreement` | Customer Service | Rail Mgmt App | Reserve capacity for customer |
| `Confirm Slot Agreement` | Slot Agreement Customer | Email | Customer confirms |
| `Surrender Slot Agreement spaces` | Slot Agreement Customer | Email/Phone | Release unused slots |
| `Add Wagons to wagonComposition` | Customer Service | Rail Mgmt App | Add wagon details |
| `Remove Wagons from wagonComposition` | Customer Service | Rail Mgmt App | Remove damaged wagons |
| `Confirm planned wagonComposition` | Customer Service | Phone (Supplier) | Confirm with Supplier |
| `Create simplyRailVoyage` | System | Rail Mgmt App → Simply | Sync voyage to Simply |
| `Update simplyRailVoyage` | Customer Service | Rail Mgmt App → Simply | Sync updates |
| `Cancel simplyRailVoyage` | Customer Service | Rail Mgmt App → Simply | Cancel in Simply |

#### Domain Events (→ Kafka Topics)

| Event | Trigger | Consumers |
|---|---|---|
| `railScheduleAgreed` | Annual agreement | Voyage Planning |
| `railScheduleCreated` | Schedule persisted | Simply ACL, Phx ACL |
| `simplyRailScheduleCreated` | Simply confirms | Voyage Planning |
| `railScheduleConfirmed` | Weekly activation | Voyage Planning |
| `railScheduleChange` | Schedule modified | Phx ACL, Simply ACL |
| `railVoyageCreated` | Voyage auto-created from schedule | Phx ACL, Simply ACL |
| `railVoyageUpdated` | Voyage fields changed | Phx ACL, Simply ACL |
| `railvoyageCancelled` | Voyage cancelled in RMA | Phx ACL, Simply ACL, Booking Mgmt |
| `simplyRailVoyageCreated` | Simply confirms | Voyage Planning |
| `simplyRailVoyageUpdated` | Simply confirms update | Voyage Planning |
| `simplyRailvoyageCancelled` | Simply confirms cancel | Voyage Planning |
| `railVoyageUpdateReceived` | Supplier sends update | Voyage Planning |
| `railBookingAddedToMainList` | Booking planned to main | Booking Mgmt, Wagon Loading |
| `railBookingAddedToSpareList` | Booking planned to spare | Booking Mgmt |
| `railBookingRemovedFromMainList` | Booking unplanned from main | Booking Mgmt |
| `railBookingRemovedFromSpareList` | Booking unplanned from spare | Booking Mgmt |
| `railBookingPlanningRejectedDueToCapacity` | Capacity/weight exceeded | Voyage Planning (show error) |
| `railBookingPlanningRejectedDueToRestriction` | Restriction violated | Voyage Planning (show error) |
| `slotAgreementCreated` | Agreement persisted | Voyage Planning |
| `slotAgreementConfirmed` | Customer confirms | Voyage Planning |
| `slotAgreementSpacesSurrendered` | Customer releases slots | Voyage Planning |
| `mainListSlotsReserved` | Slots reserved for customer | Voyage Planning |
| `mainListSlotsUnreserved` | Slots released | Voyage Planning |
| `wagonsAddedToWagonComposition` | Wagons added | Wagon Loading |
| `wagonAddedToWagonComposition` | Single wagon added | Wagon Loading |
| `wagonRemovedFromWagonComposition` | Wagon removed | Wagon Loading |
| `plannedWagonCompositionConfirmedBySupplier` | Supplier confirms planned | Voyage Planning |

#### Read Models

| View | Key Fields | Notes |
|---|---|---|
| **Voyage List** | originTerminal.name, destinationTerminal.name, scheduledDepartureDateTime, voyageStatus | Identifiable by origin + destination + departure |
| **Voyage Detail** | All railVoyage fields (editable except railVoyageId) | |
| **Main List** | Planned railBookings with planningList='Main' | bookingStatus = 'Planned' |
| **Spare List** | Planned railBookings with planningList='Spare' | bookingStatus = 'Planned' |
| **Capacity Monitor** | maximumTrainGrossWeight, trainLength, capacity, actualPayload, maximumPayload, slot agreement usage | Show remaining capacity + unused slot agreement space |
| **Wagon Composition** | wagonNumber, wagonType, positionOnTrain, maximumWagonPayload | |
| **Phx Voyage View** | pol, pod, departure/arrival times, shipId, craneOptions | Limited fields visible |

---

### 5.3 Wagon Loading

#### Commands

| Command | Actor | Input Channel | Description |
|---|---|---|---|
| `Ask Supplier for Loading Permission` | Operations | Phone Call | Wait for approval before loading |
| `Confirm actual wagonComposition` | Operations | Phone (Supplier) | Actual wagons may differ from planned |
| `Record Unit Inspection Passed` | Operations | Rail Mgmt App | Unit not damaged, fit to travel |
| `Record Unit Inspection Failed` | Operations | Rail Mgmt App + Simply | Unit damaged, not fit — record in BOTH systems |
| `Assign railBooking to Wagon` | Operations | Rail Mgmt App | Load unit to wagon slot |
| `Assign Equipment to Wagon` | Operations | Rail Mgmt App | Load ISU/R2L (doesn't consume slot) |
| `Remove railBooking from Wagon` | Operations | Rail Mgmt App | Unload unit (mistake correction) |
| `Close railVoyage` | Operations | Rail Mgmt App | Departure — triggers ferryBooking creation |
| `Record simplyRailVoyage as Departed` | Operations | Simply | Record departure |
| `Move Spare List railBookings to next railVoyage` | System (Policy) | Automatic | On voyage close, auto-move spare to next same-route voyage |

#### Domain Events (→ Kafka Topics)

| Event | Trigger | Consumers |
|---|---|---|
| `loadingPermissionGranted` | Supplier approves | Wagon Loading |
| `actualWagonCompositionConfirmedBySupplier` | Supplier confirms actual | Wagon Loading |
| `railUnitInspectionPassed` | Unit passes inspection | Wagon Loading, Booking Mgmt |
| `railUnitInspectionFailed` | Unit fails inspection | Wagon Loading, Booking Mgmt, Simply ACL |
| `simplyBookingInspectionFailed` | Simply records failure | Booking Mgmt |
| `unitLoadedToWagon` | Unit loaded | Voyage Planning (capacity), Booking Mgmt |
| `unitUnloadedFromWagon` | Unit unloaded | Voyage Planning (capacity), Booking Mgmt |
| `equipmentLoadedToWagon` | Equipment loaded | Voyage Planning (weight only) |
| `railVoyageClosed` | Voyage closed | Phx ACL (create ferryBookings), Booking Mgmt |
| `simplyRailVoyageDeparted` | Simply records departed | Voyage Planning |
| `ferryBookingCreated` | Phx creates ferryBooking | Booking Mgmt |
| `ferryVoyageTallied` | Northbound ferry tallied | Booking Mgmt (ferryBookings visible in RMA) |
| `FerryVoyageVisibleInRail` / `PublishFerryVoyageToRail` | Ferry voyage published | Booking Mgmt |
| `observeCustomsUpdate` | CS manually checks customs | Booking Mgmt |
| `customsDataUpdatedByAgent` | Billitz updates customs | Booking Mgmt |

#### Read Models

| View | Key Fields | Notes |
|---|---|---|
| **Inspection Checklist** | unitNumber, inspectionStatus, inspection pass/fail | |
| **Wagon Load View** | Wagon slots with loaded units, empty slots, actual payload | |
| **Pending Units** | railBookings on Main List that are customs cleared + inspection passed but not yet loaded | |
| **Loading Status** | voyageStatus = 'Loading' once first unit loaded | |
| **Closed Voyage** | voyageStatus = 'Closed', no more changes allowed | |

---

## 6. Kafka Topics (Domain Events) — Complete Catalog

### 6.1 Booking Management Context

| # | Topic Name | Producer | Key Consumers |
|---|---|---|---|
| 1 | `rail.booking.spreadsheet-uploaded` | Booking Mgmt | Booking Mgmt (parser) |
| 2 | `rail.booking.created` | Booking Mgmt | Voyage Planning, Simply ACL |
| 3 | `rail.booking.cancelled` | Booking Mgmt | Voyage Planning, Simply ACL |
| 4 | `rail.booking.cancellation-reason-recorded` | Booking Mgmt | Audit |
| 5 | `rail.booking.cancellation-request-received` | Booking Mgmt | Booking Mgmt |
| 6 | `rail.booking.prioritisation-agreed` | Booking Mgmt | Voyage Planning |
| 7 | `rail.booking.customs-updated` | Booking Mgmt | Wagon Loading |
| 8 | `rail.booking.customs-update-failed` | Booking Mgmt | Booking Mgmt (error UI) |
| 9 | `rail.booking.replanning-requirements-agreed` | Booking Mgmt | Voyage Planning |
| 10 | `simply.booking.created` | Simply ACL | Booking Mgmt (confirmation) |
| 11 | `simply.booking.creation-failed` | Simply ACL | Booking Mgmt (error UI) |
| 12 | `simply.booking.cancelled` | Simply ACL | Booking Mgmt |
| 13 | `rail.booking.spreadsheet-extracted-from-email` | Booking Mgmt | Booking Mgmt |

### 6.2 Voyage Planning Context

| # | Topic Name | Producer | Key Consumers |
|---|---|---|---|
| 14 | `rail.schedule.agreed` | Voyage Planning | Voyage Planning |
| 15 | `rail.schedule.created` | Voyage Planning | Simply ACL, Phx ACL |
| 16 | `rail.schedule.confirmed` | Voyage Planning | Voyage Planning |
| 17 | `rail.schedule.changed` | Voyage Planning | Phx ACL, Simply ACL |
| 18 | `simply.rail-schedule.created` | Simply ACL | Voyage Planning |
| 19 | `rail.voyage.created` | Voyage Planning | Phx ACL, Simply ACL |
| 20 | `rail.voyage.updated` | Voyage Planning | Phx ACL, Simply ACL |
| 21 | `rail.voyage.cancelled` | Voyage Planning | Phx ACL, Simply ACL, Booking Mgmt |
| 22 | `rail.voyage.update-received` | Voyage Planning | Voyage Planning |
| 23 | `simply.rail-voyage.created` | Simply ACL | Voyage Planning |
| 24 | `simply.rail-voyage.updated` | Simply ACL | Voyage Planning |
| 25 | `simply.rail-voyage.cancelled` | Simply ACL | Voyage Planning |
| 26 | `rail.booking.added-to-main-list` | Voyage Planning | Booking Mgmt, Wagon Loading |
| 27 | `rail.booking.added-to-spare-list` | Voyage Planning | Booking Mgmt |
| 28 | `rail.booking.removed-from-main-list` | Voyage Planning | Booking Mgmt |
| 29 | `rail.booking.removed-from-spare-list` | Voyage Planning | Booking Mgmt |
| 30 | `rail.booking.planning-rejected-capacity` | Voyage Planning | Voyage Planning (error UI) |
| 31 | `rail.booking.planning-rejected-restriction` | Voyage Planning | Voyage Planning (error UI) |
| 32 | `rail.slot-agreement.created` | Voyage Planning | Voyage Planning |
| 33 | `rail.slot-agreement.confirmed` | Voyage Planning | Voyage Planning |
| 34 | `rail.slot-agreement.spaces-surrendered` | Voyage Planning | Voyage Planning |
| 35 | `rail.voyage.main-list-slots-reserved` | Voyage Planning | Voyage Planning |
| 36 | `rail.voyage.main-list-slots-unreserved` | Voyage Planning | Voyage Planning |
| 37 | `rail.voyage.wagon-added-to-composition` | Voyage Planning | Wagon Loading |
| 38 | `rail.voyage.wagon-removed-from-composition` | Voyage Planning | Wagon Loading |
| 39 | `rail.voyage.wagons-added-to-composition` | Voyage Planning | Wagon Loading |
| 40 | `rail.voyage.planned-wagon-composition-confirmed` | Voyage Planning | Wagon Loading |

### 6.3 Wagon Loading Context

| # | Topic Name | Producer | Key Consumers |
|---|---|---|---|
| 41 | `rail.loading.permission-granted` | Wagon Loading | Wagon Loading |
| 42 | `rail.loading.actual-wagon-composition-confirmed` | Wagon Loading | Voyage Planning |
| 43 | `rail.loading.unit-inspection-passed` | Wagon Loading | Booking Mgmt |
| 44 | `rail.loading.unit-inspection-failed` | Wagon Loading | Booking Mgmt, Simply ACL |
| 45 | `simply.booking.inspection-failed` | Simply ACL | Booking Mgmt |
| 46 | `rail.loading.unit-loaded-to-wagon` | Wagon Loading | Voyage Planning (capacity) |
| 47 | `rail.loading.unit-unloaded-from-wagon` | Wagon Loading | Voyage Planning (capacity) |
| 48 | `rail.loading.equipment-loaded-to-wagon` | Wagon Loading | Voyage Planning (weight) |
| 49 | `rail.voyage.closed` | Wagon Loading | Phx ACL, Booking Mgmt |
| 50 | `simply.rail-voyage.departed` | Simply ACL | Voyage Planning |
| 51 | `phx.ferry-booking.created` | Phx ACL | Booking Mgmt |
| 52 | `phx.ferry-voyage.tallied` | Phx ACL | Booking Mgmt |
| 53 | `phx.ferry-voyage.visible-in-rail` | Phx ACL | Booking Mgmt |
| 54 | `customs.data-updated-by-agent` | External (Billitz) | Booking Mgmt |
| 55 | `customs.observe-update` | Booking Mgmt | Booking Mgmt |

**Total: ~55 Kafka topics**

---

## 7. Excel File Inputs

### 7.1 Customer Booking Spreadsheet

**Source:** Customers email spreadsheets to Customer Service
**Extraction:** Customer Service manually extracts from Outlook email
**Upload:** Via Rail Management App

**Expected Fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `unitType` | string | ✅ | e.g. TRA, SWAP45, CON20, CON45 |
| `unitNumber` | string | ✅ | |
| `iluCode` | string | ✅ | |
| `vehicleRegistrationNumber` | string | ❌ | |
| `isCraneable` | boolean | ✅ | |
| `isWaste` | boolean | ✅ | |
| `tareWeight` | number | ✅ | tonnes |
| `grossWeight` | number | ✅ | tonnes |
| `requestedDepartureDateTime` | datetime | ✅ | |
| `customer.name` | string | ✅ | |
| `customer.id` | integer | ✅ | |
| `consignee.name` | string | ❌ | |
| `consignee.address.*` | string | ❌ | |
| `sealNumber` | string | ❌ | |
| `externalReference1` | string | ❌ | |
| `externalReference2` | string | ❌ | |
| `cargo[].goodsDescription` | string | ❌ | |
| `cargo[].grossWeight` | number | ❌ | |
| `hazardous[].unNumber` | string | ❌ | If hazardous |
| `hazardous[].class` | string | ❌ | If hazardous |

**Validation Rules:**
- Customers should use a consistent format but **mistakes are made during manual input**
- Error messages must be presented when spreadsheets can't be parsed
- Must handle formatting errors gracefully

### 7.2 DFDS TES Format Spreadsheet

**Source:** DFDS TES (a specific customer/department)
**Difference:** Uses a **different format** from other customer spreadsheets
**Processing:** Same upload endpoint but separate parser

**Key Difference:** The column mapping and/or sheet structure differs from the standard customer format. The system must detect or be told which format is being uploaded.

### 7.3 Processing Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Customer │────▶│ Email with   │────▶│ CS extracts      │────▶│ Upload to RMA   │
│          │     │ Spreadsheet  │     │ from Outlook     │     │ (parse & validate)│
└──────────┘     └──────────────┘     └──────────────────┘     └────────┬────────┘
                                                                        │
                                                              ┌─────────▼─────────┐
                                                              │ Validate format   │
                                                              │ (Standard vs TES) │
                                                              └─────────┬─────────┘
                                                                        │
                                                          ┌─────────────┼─────────────┐
                                                          │ Success     │ Failure     │
                                                          ▼             ▼             │
                                                   Create         Show error          │
                                                   railBookings   message to user     │
                                                          │                           │
                                                          ▼                           │
                                              bookingSpreadsheetUploaded              │
                                              (Kafka event)                           │
```

---

## 8. Business Rules & Invariants

### 8.1 Loading Rules

| # | Rule | Context |
|---|---|---|
| BR-1 | railBookings on Main List can only be loaded if they are **Customs Cleared** AND have **passed Inspection** | Wagon Loading |
| BR-2 | If a Main List booking is not Customs Cleared in time, it is **replaced** by a Spare List booking that IS Customs Cleared and has passed Inspection | Wagon Loading |
| BR-3 | If an unloaded booking is no longer traveling on this voyage, it is **removed from Main List** | Wagon Loading |
| BR-4 | Operations must wait for **Supplier approval** before starting Loading | Wagon Loading |
| BR-5 | Promoted (Spare → Main) bookings are loaded **as soon as possible** | Wagon Loading |
| BR-6 | Units loaded by mistake must be **unloaded before the Train departs** | Wagon Loading |
| BR-7 | Once Loading is completed and Train is departing, the railVoyage is **Closed** | Wagon Loading |

### 8.2 Inspection Rules

| # | Rule | Context |
|---|---|---|
| BR-8 | Units are **forbidden from travelling by Rail** if any damage is visible | Wagon Loading |
| BR-9 | Inspection failures must be recorded in **BOTH Simply and Rail Management App** (needed for Reporting in Simply + Ops in RMA) | Wagon Loading |
| BR-10 | Customer Service cancels the railBooking if it fails inspection | Booking Mgmt |

### 8.3 Wagon Type Restrictions

| # | Rule | Context |
|---|---|---|
| BR-11 | `unitType = "TRA"` **cannot** be loaded to wagons where `wagonType = "90'"` | Wagon Loading |
| BR-12 | `unitType = "SWAP45"` **cannot** be loaded to wagons where `wagonType = "T3000 without Middle Support"` | Wagon Loading |

### 8.4 Hazardous Restrictions

| # | Rule | Context |
|---|---|---|
| BR-13 | Class **1** is **NOT permitted** on any route | All |
| BR-14 | Class **2.1** (when `isLimitedQuantity = true`) is **NOT permitted** on any route | All |
| BR-15 | Class **6.2** is **NOT permitted** on any route | All |
| BR-16 | Class **7** is **NOT permitted** on any route | All |

### 8.5 Capacity & Weight Rules

| # | Rule | Context |
|---|---|---|
| BR-17 | `maximumTrainGrossWeight` = max weight for (sum of all wagon tareWeights + sum of all actualWagonPayloads) | Voyage Planning |
| BR-18 | `trainLength` = total length of all wagons (excluding locomotive) | Voyage Planning |
| BR-19 | `capacity` = number of units that can be loaded, varies by unitType (CON20 > CON45) | Voyage Planning |
| BR-20 | `actualWagonPayload` = grossWeight of all loaded Units + grossWeight of all loaded Equipment | Wagon Loading |
| BR-21 | `maximumWagonPayload` = max allowed for sum of units + equipment on a wagon | Wagon Loading |
| BR-22 | `railVoyage.actualPayload` = sum of actualWagonPayload for all wagons | Voyage Planning |
| BR-23 | `railVoyage.maximumPayload` = max allowed for sum of all actualWagonPayloads | Voyage Planning |

### 8.6 Equipment Rules

| # | Rule | Context |
|---|---|---|
| BR-24 | Equipment (ISU, R2L) contributes to `actualWagonPayload` via `grossWeight` | Wagon Loading |
| BR-25 | Equipment does **NOT** consume a slot — does not reduce remaining Capacity | Wagon Loading |
| BR-26 | ISU grossWeight = **4 tonnes** | Wagon Loading |
| BR-27 | R2L grossWeight = **4.3 tonnes** | Wagon Loading |

### 8.7 Slot Agreement Rules

| # | Rule | Context |
|---|---|---|
| BR-28 | Slot Agreement = Customer reserves specific number of slots on Main List for all Trains on a specific route | Voyage Planning |
| BR-29 | Reserved slot units (quantity and type) must be visible on Main List when considering remaining Capacity | Voyage Planning |
| BR-30 | If only remaining capacity is allocated to Slot Agreement customers who haven't used all reserved slots, those customers are contacted | Voyage Planning |

### 8.8 Planning Rules

| # | Rule | Context |
|---|---|---|
| BR-31 | Main List = **high priority** — Ops will load if inspection passed + customs cleared | Voyage Planning |
| BR-32 | Spare List = Ops **may** load if Main List doesn't fill voyage to capacity, or Slot Agreement customer surrenders slots | Voyage Planning |
| BR-33 | Customer Service can add a railBooking to a list once they know: `requestedDepartureDateTime`, agreed prioritisation, remaining capacity | Booking Mgmt |
| BR-34 | `railBooking.requestedDepartureDateTime` should equal `ferryBooking.scheduledArrivalDateTime` | Booking Mgmt |

### 8.9 Voyage Lifecycle Rules

| # | Rule | Context |
|---|---|---|
| BR-35 | Once railVoyage is Closed, **no railBookings can be added or removed** from Main List | Wagon Loading |
| BR-36 | Spare List bookings of a Closed railVoyage are **auto-moved** to Spare List of next railVoyage with same `routeId` | Wagon Loading |
| BR-37 | Departing the railVoyage triggers Simply to create **ferryBookings in Phx** for invoicing | Wagon Loading |
| BR-38 | Cancelled railVoyage bookings return to pool (no railVoyageId, bookingStatus = 'Booked') | Voyage Planning |
| BR-39 | railSchedule creation triggers railVoyages to be auto-created | Voyage Planning |
| BR-40 | simplyRailVoyages must be visible in Simply **before** railBookings are created in RMA | Voyage Planning |

### 8.10 Wagon Composition Rules

| # | Rule | Context |
|---|---|---|
| BR-41 | Actual wagons at terminal may differ from planned (technical issues) | Wagon Loading |
| BR-42 | New wagons may be added to replace damaged ones | Wagon Loading |
| BR-43 | Operations must confirm actual wagonComposition with Supplier when Train arrives | Wagon Loading |

---

## 9. Proposed APIs

### 9.1 Booking Management API

**Base path:** `/api/v1/bookings`

#### Rail Bookings

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/rail-bookings` | List all railBookings | Query: `?status=Booked&customerId=123&search=unitNumber` | `200`: `RailBooking[]` |
| `GET` | `/rail-bookings/:id` | Get single railBooking | — | `200`: `RailBooking` |
| `POST` | `/rail-bookings` | Create a single railBooking | `CreateRailBookingRequest` | `201`: `RailBooking` |
| `PATCH` | `/rail-bookings/:id` | Update editable fields | `{ isCustomsCleared?, inspectionStatus?, internalRemarks? }` | `200`: `RailBooking` |
| `DELETE` | `/rail-bookings/:id` | Cancel railBooking | Query: `?reason=string` | `200`: `{ cancelled: true }` |
| `POST` | `/rail-bookings/:id/cancellation-reason` | Record cancellation reason | `{ reason: string }` | `200` |

#### Spreadsheet Upload

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/rail-bookings/upload` | Upload booking spreadsheet | `multipart/form-data` (Excel file) | `200`: `{ created: number, errors: ParseError[] }` |
| `POST` | `/rail-bookings/upload/validate` | Validate spreadsheet without creating | `multipart/form-data` (Excel file) | `200`: `{ valid: boolean, errors: ParseError[] }` |

#### Customs

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `PATCH` | `/rail-bookings/:id/customs` | Update customs clearance status | `{ isCustomsCleared: boolean }` | `200`: `RailBooking` |

#### Ferry Bookings (Read Model)

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/ferry-bookings` | List ferryBookings visible in Rail | Query: `?search=unitNumber&vessel=X&pod=Y` | `200`: `FerryBooking[]` |
| `POST` | `/ferry-bookings/:id/create-rail-booking` | Create railBooking from ferryBooking | `{ requestedDepartureDateTime, prioritisation }` | `201`: `RailBooking` |

#### Simply Sync (Internal / ACL)

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/rail-bookings/:id/sync-simply` | Create simplyBooking for railBooking | — | `200`: `{ simplyBookingId }` |
| `DELETE` | `/rail-bookings/:id/sync-simply` | Cancel simplyBooking | — | `200` |

---

### 9.2 Voyage Planning API

**Base path:** `/api/v1/voyages`

#### Rail Schedules

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/schedules` | List all rail schedules | Query: `?routeId=X&year=2026` | `200`: `RailSchedule[]` |
| `POST` | `/schedules` | Create rail schedule | `CreateRailScheduleRequest` | `201`: `RailSchedule` |
| `PATCH` | `/schedules/:id` | Update schedule | `UpdateRailScheduleRequest` | `200`: `RailSchedule` |
| `POST` | `/schedules/:id/confirm` | Confirm/activate for the week | — | `200` |
| `POST` | `/schedules/:id/reduce` | Reduce schedule (low demand/technical) | `{ reason: string }` | `200` |

#### Rail Voyages

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/rail-voyages` | List all railVoyages | Query: `?status=Open&routeId=X&from=date&to=date` | `200`: `RailVoyage[]` |
| `GET` | `/rail-voyages/:id` | Get single railVoyage (full detail) | — | `200`: `RailVoyage` |
| `PATCH` | `/rail-voyages/:id` | Update railVoyage fields | `UpdateRailVoyageRequest` | `200`: `RailVoyage` |
| `POST` | `/rail-voyages/:id/cancel` | Cancel railVoyage | `{ cancellationReason: string }` | `200` |
| `POST` | `/rail-voyages/:id/activate` | Activate voyage for the week | — | `200` |

#### Voyage Planning (Main List / Spare List)

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/rail-voyages/:id/main-list` | Get Main List bookings | — | `200`: `PlannedBooking[]` |
| `GET` | `/rail-voyages/:id/spare-list` | Get Spare List bookings | — | `200`: `PlannedBooking[]` |
| `POST` | `/rail-voyages/:id/main-list` | Add railBooking to Main List | `{ railBookingId: string }` | `201` / `409` (capacity/restriction) |
| `POST` | `/rail-voyages/:id/spare-list` | Add railBooking to Spare List | `{ railBookingId: string }` | `201` / `409` |
| `DELETE` | `/rail-voyages/:id/main-list/:bookingId` | Remove from Main List | — | `200` |
| `DELETE` | `/rail-voyages/:id/spare-list/:bookingId` | Remove from Spare List | — | `200` |
| `POST` | `/rail-voyages/:id/main-list/:bookingId/promote` | Move from Spare → Main | — | `200` / `409` |
| `POST` | `/rail-voyages/:id/spare-list/:bookingId/demote` | Move from Main → Spare | — | `200` |

#### Capacity

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/rail-voyages/:id/capacity` | Get capacity summary | — | `200`: `CapacitySummary` |

```typescript
interface CapacitySummary {
  maximumTrainGrossWeight: number;
  currentTrainGrossWeight: number;
  trainLength: number;
  capacity: number;          // total unit slots
  usedCapacity: number;      // loaded + planned
  remainingCapacity: number;
  actualPayload: number;
  maximumPayload: number;
  slotAgreements: {
    customerId: number;
    customerName: string;
    reservedSlots: number;
    usedSlots: number;
    remainingSlots: number;
  }[];
}
```

#### Slot Agreements

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/slot-agreements` | List all slot agreements | Query: `?routeId=X&customerId=Y` | `200`: `SlotAgreement[]` |
| `POST` | `/slot-agreements` | Create slot agreement | `{ numberOfAgreedUnits, customerId, customerName, routeId }` | `201`: `SlotAgreement` |
| `POST` | `/slot-agreements/:id/confirm` | Customer confirms agreement | — | `200` |
| `POST` | `/slot-agreements/:id/surrender` | Customer surrenders unused slots | `{ slotsToSurrender: number }` | `200` |

#### Wagon Composition

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/rail-voyages/:id/wagon-composition` | Get wagon composition | — | `200`: `Wagon[]` |
| `POST` | `/rail-voyages/:id/wagon-composition` | Add wagon(s) | `{ wagons: AddWagonRequest[] }` | `201` |
| `DELETE` | `/rail-voyages/:id/wagon-composition/:wagonNumber` | Remove wagon | — | `200` |
| `POST` | `/rail-voyages/:id/wagon-composition/confirm-planned` | Confirm planned with Supplier | — | `200` |

---

### 9.3 Wagon Loading API

**Base path:** `/api/v1/loading`

#### Loading Permission

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/rail-voyages/:id/loading-permission` | Grant loading permission | `{ grantedBy: string, grantedAt: datetime }` | `200` |
| `GET` | `/rail-voyages/:id/loading-permission` | Check loading permission status | — | `200`: `{ granted: boolean, grantedAt? }` |

#### Actual Wagon Composition

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/rail-voyages/:id/actual-wagon-composition` | Confirm actual composition | `{ wagons: ActualWagon[] }` | `200` |
| `POST` | `/rail-voyages/:id/actual-wagon-composition/add-wagons` | Add replacement wagons | `{ wagons: AddWagonRequest[] }` | `200` |
| `DELETE` | `/rail-voyages/:id/actual-wagon-composition/:wagonNumber` | Remove wagon not on train | — | `200` |

#### Inspection

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/rail-voyages/:id/inspections` | List all units pending/completed inspection | — | `200`: `InspectionResult[]` |
| `POST` | `/rail-voyages/:id/inspections/:bookingId/pass` | Record inspection passed | `{ inspectedBy: string }` | `200` |
| `POST` | `/rail-voyages/:id/inspections/:bookingId/fail` | Record inspection failed | `{ inspectedBy: string, failureReason: string }` | `200` |

#### Wagon Assignment (Loading/Unloading)

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/rail-voyages/:id/wagons/:wagonNumber/load-unit` | Assign railBooking to wagon slot | `{ railBookingId: string }` | `200` / `409` (restriction/capacity) |
| `DELETE` | `/rail-voyages/:id/wagons/:wagonNumber/units/:bookingId` | Unload unit from wagon | — | `200` |
| `POST` | `/rail-voyages/:id/wagons/:wagonNumber/load-equipment` | Load equipment to wagon | `{ type: 'ISU' \| 'R2L', id: string }` | `200` |
| `DELETE` | `/rail-voyages/:id/wagons/:wagonNumber/equipment/:equipmentId` | Remove equipment | — | `200` |
| `POST` | `/rail-voyages/:id/wagons/:wagonNumber/swap-unit` | Swap unit between wagons | `{ railBookingId: string, targetWagonNumber: number }` | `200` |

#### Voyage Close & Departure

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/rail-voyages/:id/close` | Close railVoyage (triggers ferryBooking creation) | `{ closedBy: string }` | `200` |
| `POST` | `/rail-voyages/:id/depart` | Record departure in Simply | `{ actualDepartureDateTime: datetime }` | `200` |

---

### 9.4 ACL (Anti-Corruption Layer) APIs

These are internal APIs for system-to-system integration.

#### Phx ACL (Existing)

| Method | Endpoint | Description | Notes |
|---|---|---|---|
| `POST` | `/api/v{version}/PhoenixRailBookingAcl/ForwardBookings` | Forward bookings to Phx | **Already exists** |

#### Simply ACL (Existing)

| Method | Endpoint | Description | Notes |
|---|---|---|---|
| `POST` | `/api/v{version}/Bookings/status-update` | Booking status update | **Already exists** |

#### Proposed ACL Extensions

| Method | Endpoint | Description | Direction |
|---|---|---|---|
| `POST` | `/acl/simply/bookings` | Create simplyBooking | RMA → Simply |
| `DELETE` | `/acl/simply/bookings/:id` | Cancel simplyBooking | RMA → Simply |
| `POST` | `/acl/simply/rail-voyages` | Create simplyRailVoyage | RMA → Simply |
| `PATCH` | `/acl/simply/rail-voyages/:id` | Update simplyRailVoyage | RMA → Simply |
| `DELETE` | `/acl/simply/rail-voyages/:id` | Cancel simplyRailVoyage | RMA → Simply |
| `POST` | `/acl/simply/rail-voyages/:id/depart` | Record departure | RMA → Simply |
| `POST` | `/acl/simply/inspections/:bookingId/fail` | Record inspection failure | RMA → Simply |
| `POST` | `/acl/phx/ferry-bookings` | Create ferryBookings on voyage close | RMA → Phx |
| `GET` | `/acl/phx/ferry-bookings` | Get ferryBookings visible in Rail | Phx → RMA |
| `POST` | `/acl/phx/rail-voyages` | Sync railVoyage to Phx | RMA → Phx |
| `PATCH` | `/acl/phx/rail-voyages/:id` | Update railVoyage in Phx | RMA → Phx |
| `DELETE` | `/acl/phx/rail-voyages/:id` | Cancel railVoyage in Phx | RMA → Phx |

---

## 10. Existing Integration Points

### 10.1 Phx ↔ Rail API

| Endpoint | Direction | Purpose |
|---|---|---|
| `POST /api/v{version}/PhoenixRailBookingAcl/ForwardBookings` | Phx → Rail | Forward ferry bookings to Rail system |

### 10.2 Rail API ↔ Simply

| Endpoint | Direction | Purpose |
|---|---|---|
| `POST /api/v{version}/Bookings/status-update` | Rail → Simply | Update booking status in Simply |

### 10.3 Email-Based Integrations (Manual)

| From | To | Content | Frequency |
|---|---|---|---|
| Customer | Customer Service | Booking spreadsheets | Per shipment |
| Supplier | Customer Service | railVoyage updates (arrival/departure times) | Per voyage |
| Billitz (customs agent) | Customer Service | Customs status updates | Ongoing |
| Customer Service | Slot Agreement Customer | Unused slot inquiry | As needed |

---

## 11. Rail Routes

| Route | Direction |
|---|---|
| Trieste EMT ↔ Bettembourg | v.v. (vice versa) |
| Trieste SST ↔ Cologne | v.v. |
| Trieste SST ↔ Lambach - Wels | v.v. |
| Trieste PLT ↔ Bettembourg | v.v. |
| Sete ↔ Calais | v.v. |
| Trieste SST ↔ Duisburg MTD | v.v. |

---

## Appendix A: State Machines

### A.1 railBooking.bookingStatus

```
                    ┌──────────────────────────────────┐
                    │                                  │
                    ▼                                  │
              ┌──────────┐  Add to Main/Spare   ┌──────────┐
  Created ──▶ │  Booked  │ ───────────────────▶ │ Planned  │
              └──────────┘                      └──────────┘
                    │                                  │
                    │ Cancel                           │ Load to Wagon
                    ▼                                  ▼
              ┌──────────┐                      ┌──────────┐
              │Cancelled │ ◀──── Cancel ─────── │  Loaded  │
              └──────────┘                      └──────────┘
```

### A.2 railVoyage.voyageStatus

```
              ┌──────────┐  First unit loaded   ┌──────────┐
  Created ──▶ │   Open   │ ───────────────────▶ │ Loading  │
              └──────────┘                      └──────────┘
                    │                                  │
                    │ Cancel                           │ Close / Depart
                    ▼                                  ▼
              ┌──────────┐                      ┌──────────┐
              │Cancelled │                      │  Closed  │
              └──────────┘                      └──────────┘
```

### A.3 railBooking.inspectionStatus

```
              ┌───────────────┐
  Created ──▶ │ Not Inspected │
              └───────────────┘
                    │
              ┌─────┴──────┐
              ▼            ▼
     ┌─────────────┐  ┌─────────────────┐
     │  Inspection  │  │   Inspection    │
     │   Passed     │  │    Failed       │ ──▶ Cancel railBooking
     └─────────────┘  └─────────────────┘
```

---

## Appendix B: API Response Schemas (TypeScript)

```typescript
// === Booking Management ===

interface RailBooking {
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
  inspectionStatus: 'Not Inspected' | 'Inspection Passed' | 'Inspection Failed';
  bookingStatus: 'Booked' | 'Planned' | 'Loaded' | 'Cancelled';
  cancellationReason: string | null;
  internalRemarks: string | null;
  sealNumber: string | null;
  externalReference1: string | null;
  externalReference2: string | null;
  requestedDepartureDateTime: string; // ISO 8601
  customer: { id: number; name: string };
  consignee: {
    name: string;
    address: { name: string; street: string; city: string; postcode: string; country: string };
  } | null;
  cargo: Cargo[];
  hazardous: HazardousGoods[];
}

interface Cargo {
  numberOfPackages: string;
  packageType: string;
  goodsDescription: string;
  grossWeight: number;
  netWeight: number;
}

interface HazardousGoods {
  unNumber: string;
  class: string;
  subClass: string | null;
  packingGroup: 'I' | 'II' | 'III' | null;
  properShippingName: string;
  flashPoint: number | null;
  technicalName: string | null;
  tertiaryClass: string | null;
  tankUN: string | null;
  isLimitedQuantity: boolean;
  isMarinePollutant: boolean;
  isEnvironmentallyHazardous: boolean;
  isExceptedQuantity: boolean;
  isResidue: boolean;
  tankProvision: string | null;
  stowageHandling: string | null;
  stowageCategory: string | null;
  segregation: string | null;
  netWeight: number;
  grossWeight: number;
  netExplosiveQuantity: number | null;
  packageQuantity: number;
  packageType: string;
}

interface ParseError {
  row: number;
  column: string;
  message: string;
  value: unknown;
}

interface SpreadsheetUploadResult {
  created: number;
  skipped: number;
  errors: ParseError[];
}

// === Voyage Planning ===

interface RailVoyage {
  railVoyageId: string;
  railVoyageCode: string;
  trainReference1: string | null;
  trainReference2: string | null;
  trainReference3: string | null;
  routeId: string;
  originTerminal: Terminal;
  destinationTerminal: Terminal;
  direction: 'Northbound' | 'Southbound';
  sequenceNumber: number;
  carrier: string;
  voyageStatus: 'Open' | 'Loading' | 'Closed' | 'Cancelled';
  scheduledDepartureDateTime: string;
  actualDepartureDateTime: string | null;
  scheduledArrivalTime: string;
  actualArrivalTime: string | null;
  voyageBookingDeadline: string;
  planningDeadline: string;
  gateArrivalDeadline: string;
  loadingDeadline: string;
  scheduledUnloadingStartTime: string;
  scheduledUnitCollectionTime: string;
  nonCraneableAllowed: boolean;
  hazardousAllowed: boolean;
  wasteAllowed: boolean;
  maximumTrainGrossWeight: number;
  trainLength: number;
  capacity: number;
  actualPayload: number;
  maximumPayload: number;
  locomotive: { id: string; grossWeight: string };
  voyagePlanning: PlannedBooking[];
  wagonComposition: Wagon[];
}

interface Terminal {
  name: string;
  unLoCode: string;
  uicCountryCode: number;
  uicStationCode: number;
  address: { name: string; street: string; city: string; postcode: string; country: string };
}

interface PlannedBooking {
  railBookingId: string;
  planningList: 'Main' | 'Spare';
  plannedAt: string;
}

interface Wagon {
  wagonNumber: number;
  wagonType: number;
  positionOnTrain: number;
  tareWeight: number;
  maximumWagonPayload: number;
  actualWagonPayload: number;
  loadedUnits: { railBookingId: string; loadingDateTime: string }[];
  loadedEquipment: { type: 'ISU' | 'R2L'; id: string; grossWeight: string }[];
}

interface CapacitySummary {
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

interface SlotAgreementUsage {
  slotAgreementId: string;
  customerId: number;
  customerName: string;
  routeId: string;
  reservedSlots: number;
  usedSlots: number;
  remainingSlots: number;
}

interface SlotAgreement {
  slotAgreementId: string;
  numberOfAgreedUnits: number;
  customer: { id: number; name: string };
  routeId: string;
  confirmed: boolean;
  surrenderedSlots: number;
}

interface RailSchedule {
  railScheduleId: string;
  pol: string;
  pod: string;
  scheduledDepartureDateTime: string;
  scheduledArrivalDateTime: string;
  locomotiveId: string;
  nonCraneableAllowed: boolean;
  confirmed: boolean;
}

// === Wagon Loading ===

interface InspectionResult {
  railBookingId: string;
  unitNumber: string;
  inspectionStatus: 'Not Inspected' | 'Inspection Passed' | 'Inspection Failed';
  inspectedBy: string | null;
  inspectedAt: string | null;
  failureReason: string | null;
}

interface LoadingPermission {
  voyageId: string;
  granted: boolean;
  grantedBy: string | null;
  grantedAt: string | null;
}

interface LoadUnitRequest {
  railBookingId: string;
}

interface LoadEquipmentRequest {
  type: 'ISU' | 'R2L';
  id: string;
}

interface CloseVoyageResponse {
  voyageId: string;
  voyageStatus: 'Closed';
  closedAt: string;
  ferryBookingsCreated: number;
  spareListBookingsRolledOver: number;
}
```

---

## Appendix C: Event Flow Diagrams

### C.1 Booking Creation from Spreadsheet

```
Customer ──email──▶ CS ──extract──▶ Upload to RMA
                                         │
                                         ▼
                                   Parse & Validate
                                    │           │
                                 Success     Errors
                                    │           │
                                    ▼           ▼
                          bookingSpreadsheet   Show error
                          Uploaded (Kafka)      to user
                                    │
                                    ▼
                            railBookingCreated
                            (for each booking)
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                         Simply ACL   Voyage Planning
```

### C.2 Loading Flow

```
Train Arrives ──▶ Confirm actual wagonComposition
                          │
                          ▼
                  Ask Supplier for Loading Permission
                          │
                          ▼ (loadingPermissionGranted)
                  
                  Inspect Units (for each Main List booking)
                     │              │
                  Pass           Fail
                     │              │──▶ Record in Simply + RMA
                     │              │──▶ Cancel railBooking
                     │              │──▶ Promote from Spare List?
                     │
                     ▼
               Check Customs Cleared?
                  │            │
                Yes           No ──▶ Replace with Spare List booking
                  │
                  ▼
            Assign to Wagon (unitLoadedToWagon)
                  │
                  ▼ (all loaded)
            Close railVoyage
                  │
            ┌─────┴─────────────────────────┐
            ▼                               ▼
   ferryBookingCreated (Phx)    Spare List → next railVoyage
```

### C.3 Voyage Cancellation Flow

```
Customer Service ──▶ Cancel railVoyage
                          │
                    ┌─────┼──────────────────┐
                    ▼     ▼                  ▼
              RMA: status  Simply: cancel    Phx: remove
              = Cancelled  simplyRailVoyage  from Phx
                    │
                    ▼
              All railBookings:
              - railVoyageId = null
              - bookingStatus = 'Booked'
              - Require replanning with Customer
```
