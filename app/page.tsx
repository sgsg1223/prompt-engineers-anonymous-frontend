"use client";

import {
  AccordionGroup,
  AssistiveText,
  Body,
  Button,
  ErrorText,
  Grid,
  Heading,
  InlineNotification,
  GlobalNotification,
  Label,
  LoadingSpinner,
  Numbers,
  Skeleton,
  StatusBadge,
  Text,
  TextArea,
  TextInput,
} from "@dfds-frontend/navigator-components";
import { CheckinIconComponent } from "@dfds-frontend/navigator-icons/icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-semantic-global-background-light-grey text-semantic-global-text-default">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-semantic-global-lg px-semantic-global-lg py-semantic-global-lg">
        <GlobalNotification
          variant="info"
          emphasis="medium"
          text="Two shipments require review before 16:00 CET."
          primaryAction={{
            children: "Review now",
            onClick: () => alert("Review queue opened"),
          }}
          secondaryAction={{
            children: "Snooze",
            onClick: () => alert("Snoozed for 30 minutes"),
          }}
          dismissible
          onDismiss={() => alert("Notification dismissed")}
        />

        <InlineNotification
          variant="success"
          heading="Live tracking synced"
          message="AIS updates are flowing normally across all regions."
        />

        <Grid type="spacious" className="w-full">
          <section className="col-span-4 rounded-semantic-global-md bg-semantic-global-background-white p-semantic-global-md shadow-sm">
            <Body size="sm" weight="medium">
              Active shipments
            </Body>
            <Numbers size="lg">1,284</Numbers>
            <Text className="text-semantic-global-text-light">
              +6.4% this week
            </Text>
          </section>
          <section className="col-span-4 rounded-semantic-global-md bg-semantic-global-background-white p-semantic-global-md shadow-sm">
            <Body size="sm" weight="medium">
              Containers at risk
            </Body>
            <div className="flex items-center gap-semantic-global-2xs">
              <Numbers size="lg">27</Numbers>
              <StatusBadge status="warning" emphasis="high" label="Attention" />
            </div>
          </section>
          <section className="col-span-4 rounded-semantic-global-md bg-semantic-global-background-white p-semantic-global-md shadow-sm">
            <Body size="sm" weight="medium">
              Carbon intensity
            </Body>
            <Numbers size="lg">82%</Numbers>
            <Text className="text-semantic-global-text-light">
              Below target by 3%
            </Text>
          </section>
        </Grid>

        <section className="grid gap-semantic-global-lg lg:grid-cols-[2fr_1fr]">
          <div className="rounded-semantic-global-md bg-semantic-global-background-white p-semantic-global-lg shadow-sm">
            <div className="flex items-center justify-between">
              <Heading as="h2" size="md">
                Shipment approvals
              </Heading>
              <Button
                variant="secondary"
                onClick={() => alert("Exported report")}
              >
                Export list
              </Button>
            </div>
            <div className="mt-semantic-global-md grid gap-semantic-global-md">
              <div className="flex items-center justify-between rounded-semantic-global-sm border border-semantic-global-border-light p-semantic-global-sm">
                <div>
                  <Body weight="medium">Copenhagen → Rotterdam</Body>
                  <Text className="text-semantic-global-text-light">
                    DFDS-48392 · 12 pallets
                  </Text>
                </div>
                <StatusBadge status="info" label="Queued" />
              </div>
              <div className="flex items-center justify-between rounded-semantic-global-sm border border-semantic-global-border-light p-semantic-global-sm">
                <div>
                  <Body weight="medium">Oslo → Immingham</Body>
                  <Text className="text-semantic-global-text-light">
                    DFDS-48387 · 4 trailers
                  </Text>
                </div>
                <StatusBadge status="success" label="Approved" />
              </div>
            </div>
          </div>

          <div className="rounded-semantic-global-md bg-semantic-global-background-white p-semantic-global-lg shadow-sm">
            <Heading as="h3" size="sm">
              Activity feed
            </Heading>
            <div className="mt-semantic-global-md space-y-semantic-global-sm">
              <Skeleton type="text" />
              <Skeleton type="text" />
              <Skeleton type="rectangle" className="h-16" />
              <div className="flex items-center gap-semantic-global-sm">
                <LoadingSpinner size="md" />
                <Body size="sm">Syncing terminal status...</Body>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-semantic-global-md bg-semantic-global-background-white p-semantic-global-lg shadow-sm">
          <Heading as="h2" size="md">
            Create dispatch note
          </Heading>
          <div className="mt-semantic-global-md grid gap-semantic-global-md lg:grid-cols-2">
            <TextInput
              name="reference"
              label="Reference ID"
              assistiveText="Use the booking reference or customer order ID."
              placeholder="DFDS-00128"
            />
            <TextInput
              name="route"
              label="Route"
              errorText="Route is required before approval."
              placeholder="Copenhagen → Rotterdam"
            />
            <TextArea
              name="notes"
              label="Dispatch notes"
              assistiveText="Keep this under 180 characters."
              counter={180}
              placeholder="Add handling notes for the terminal team."
            />
            <div className="flex flex-col gap-semantic-global-xs">
              <Label htmlFor="quick-search">Quick search</Label>
              <input
                id="quick-search"
                className="w-full rounded-semantic-global-sm border border-semantic-global-border-light bg-semantic-global-background-white px-semantic-global-sm py-semantic-global-xs text-sm"
                placeholder="Search by vehicle or vessel"
              />
              <AssistiveText>
                Search runs across active and archived bookings.
              </AssistiveText>
              <ErrorText>Indexing delay: 2 minutes</ErrorText>
            </div>
          </div>
          <div className="mt-semantic-global-md flex items-center gap-semantic-global-sm">
            <Button onClick={() => alert("Draft saved")}>
              <CheckinIconComponent className="size-4" />
              Save draft
            </Button>
            <Button
              variant="ghostSecondary"
              onClick={() => alert("Changes discarded")}
            >
              Discard
            </Button>
          </div>
        </section>

        <section className="rounded-semantic-global-md bg-semantic-global-background-white p-semantic-global-lg shadow-sm">
          <Heading as="h2" size="md">
            Operations playbook
          </Heading>
          <Body size="sm" className="mt-semantic-global-2xs">
            Use the guidance below when prioritising hazardous cargo.
          </Body>
          <AccordionGroup
            type="multiple"
            heading="Priority rules"
            items={[
              {
                title: "Hazardous shipments",
                children: (
                  <Body size="sm">
                    Any hazardous cargo requires double validation and a senior
                    review before loading.
                  </Body>
                ),
              },
              {
                title: "Temperature controlled",
                children: (
                  <Body size="sm">
                    Confirm reefers have power allocation before releasing
                    boarding documents.
                  </Body>
                ),
              },
              {
                title: "Late gate-in",
                children: (
                  <Body size="sm">
                    Gate-ins within 2 hours of departure need a manual manifest
                    update.
                  </Body>
                ),
              },
            ]}
          />
        </section>
      </main>
    </div>
  );
}
